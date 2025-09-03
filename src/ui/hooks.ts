import { RefObject, useRef, useState, useCallback, useEffect } from 'react';
import {
  cloneDeep,
  ZOOM,
  Template,
  Size,
  getB64BasePdf,
  b64toUint8Array,
  SchemaForUI,
  ChangeSchemas,
  isBlankPdf,
} from '../common';
import { pdf2img, pdf2size } from '../converter/index.browser';

import {
  schemasList2template,
  uuid,
  getUniqueSchemaName,
  moveCommandToChangeSchemasArg,
  arrayBufferToBase64,
  initShortCuts,
  destroyShortCuts,
} from './helper';
import { RULER_HEIGHT } from './constants';

export const usePrevious = <T>(value: T) => {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
};

const getScale = (n: number, paper: number) =>
  Math.floor((n / paper > 1 ? 1 : n / paper) * 100) / 100;

type UIPreProcessorProps = { template: Template; size: Size; zoomLevel: number; maxZoom: number };

export const useUIPreProcessor = ({ template, size, zoomLevel, maxZoom }: UIPreProcessorProps) => {
  const [backgrounds, setBackgrounds] = useState<string[]>([]);
  const [pageSizes, setPageSizes] = useState<Size[]>([]);
  const [scale, setScale] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  const init = async (prop: { template: Template; size: Size }) => {
    const {
      template: { basePdf, schemas },
      size,
    } = prop;

    let paperWidth: number;
    let paperHeight: number;
    let _backgrounds: string[];
    let _pageSizes: { width: number; height: number }[];

    if (isBlankPdf(basePdf)) {
      const { width, height } = basePdf;
      paperWidth = width * ZOOM;
      paperHeight = height * ZOOM;
      _backgrounds = schemas.map(
        () =>
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdj+P///38ACfsD/QVDRcoAAAAASUVORK5CYII=',
      );
      _pageSizes = schemas.map(() => ({ width, height }));
    } else {
      const _basePdf = await getB64BasePdf(basePdf);

      const uint8Array = b64toUint8Array(_basePdf);
      // Create a new ArrayBuffer copy to avoid detachment issues
      const pdfArrayBuffer = new ArrayBuffer(uint8Array.byteLength);
      new Uint8Array(pdfArrayBuffer).set(uint8Array);

      const [_pages, imgBuffers] = await Promise.all([
        pdf2size(pdfArrayBuffer),
        pdf2img(pdfArrayBuffer.slice(), { scale: maxZoom }),
      ]);
      // Normalize returned page sizes to required type
      _pageSizes = _pages.map((p: any) => ({
        width: Number(p?.width ?? 0),
        height: Number(p?.height ?? 0),
      }));
      paperWidth = _pageSizes[0].width * ZOOM;
      paperHeight = _pageSizes[0].height * ZOOM;
      _backgrounds = imgBuffers.map(arrayBufferToBase64);
    }

    const _scale = Math.min(
      getScale(size.width, paperWidth),
      getScale(size.height - RULER_HEIGHT, paperHeight),
    );

    return {
      backgrounds: _backgrounds,
      pageSizes: _pageSizes,
      scale: _scale,
    };
  };

  useEffect(() => {
    init({ template, size })
      .then(({ pageSizes, scale, backgrounds }) => {
        setPageSizes(pageSizes);
        setScale(scale);
        setBackgrounds(backgrounds);
      })
      .catch((err: Error) => {
        setError(err);
        console.error('[@pdfme/ui]', err);
      });
  }, [template, size]);

  return {
    backgrounds,
    pageSizes,
    scale: scale * zoomLevel,
    error,
    refresh: (template: Template) =>
      init({ template, size }).then(({ pageSizes, scale, backgrounds }) => {
        setPageSizes(pageSizes);
        setScale(scale);
        setBackgrounds(backgrounds);
      }),
  };
};

type ScrollPageCursorProps = {
  ref: RefObject<HTMLDivElement>;
  pageSizes: Size[];
  scale: number;
  pageCursor: number;
  onChangePageCursor: (page: number) => void;
};

export const useScrollPageCursor = ({
  ref,
  pageSizes,
  scale,
  pageCursor,
  onChangePageCursor,
}: ScrollPageCursorProps) => {
  // Use a ref to track if we're programmatically scrolling to prevent race conditions
  const isScrollingProgrammatically = useRef(false);

  const onScroll = useCallback(() => {
    if (!pageSizes[0] || !ref.current || isScrollingProgrammatically.current) {
      return;
    }

    const container = ref.current;
    const scroll = container.scrollTop;
    const viewportHeight = container.clientHeight;
    const viewportTop = scroll;
    const viewportBottom = scroll + viewportHeight;


    // Calculate visible area and percentage for each page
    const pageVisibilityData: Array<{
      pageIndex: number;
      visibleHeight: number;
      visiblePercentage: number;
      pageTop: number;
      pageBottom: number;
    }> = [];

    let cumulativeTop = 0;

    pageSizes.forEach((pageSize, pageIndex) => {
      // Calculate the actual rendered height of this page (including ruler and scaling)
      // This should match the calculation in getPagesScrollTopByIndex helper function
      const pageHeight = (pageSize.height * ZOOM + RULER_HEIGHT) * scale;
      const pageTop = cumulativeTop;
      const pageBottom = cumulativeTop + pageHeight;

      // Calculate the intersection between the viewport and this page
      const intersectionTop = Math.max(viewportTop, pageTop);
      const intersectionBottom = Math.min(viewportBottom, pageBottom);

      // Calculate visible area (height in this case since width is constant)
      const visibleHeight = Math.max(0, intersectionBottom - intersectionTop);
      const visiblePercentage = pageHeight > 0 ? visibleHeight / pageHeight : 0;

      pageVisibilityData.push({
        pageIndex,
        visibleHeight,
        visiblePercentage,
        pageTop,
        pageBottom,
      });

      // Update cumulative position for next page
      cumulativeTop = pageBottom;
    });

    // Find the page with the most visible area
    let _pageCursor = pageCursor;
    let maxVisibleArea = 0;
    let bestPage = null;

    for (const page of pageVisibilityData) {
      if (page.visibleHeight > maxVisibleArea) {
        maxVisibleArea = page.visibleHeight;
        bestPage = page;
      }
    }

    // Enhanced logic: switch to the page with the most visible area
    // Use a lower threshold for better responsiveness, with hysteresis to prevent rapid switching
    if (bestPage) {
      const threshold = bestPage.pageIndex === pageCursor ? 0.3 : 0.4; // Hysteresis: easier to stay on current page
      if (bestPage.visiblePercentage >= threshold) {
        _pageCursor = bestPage.pageIndex;
      }
    }

    // Store last scroll position for direction detection
    (ref.current as any).lastScrollTop = scroll;

    if (_pageCursor !== pageCursor) {
      onChangePageCursor(_pageCursor);
    }
  }, [onChangePageCursor, pageSizes, ref, scale]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      element.removeEventListener('scroll', onScroll);
    };
  }, [ref, onScroll]);

  // Expose a method to temporarily disable scroll handling during programmatic scrolling
  return {
    setScrollingProgrammatically: (value: boolean) => {
      isScrollingProgrammatically.current = value;
    }
  };
};

export const useMountStatus = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsMounted(true), 500);
    return () => clearTimeout(timeout);
  }, []);

  return isMounted;
};

interface UseInitEventsParams {
  pageCursor: number;
  pageSizes: Size[];
  activeElements: HTMLElement[];
  template: Template;
  schemasList: SchemaForUI[][];
  changeSchemas: ChangeSchemas;
  commitSchemas: (newSchemas: SchemaForUI[]) => void;
  removeSchemas: (ids: string[]) => void;
  onSaveTemplate: (t: Template) => void;
  past: React.MutableRefObject<SchemaForUI[][]>;
  future: React.MutableRefObject<SchemaForUI[][]>;
  setSchemasList: React.Dispatch<React.SetStateAction<SchemaForUI[][]>>;
  onEdit: (targets: HTMLElement[]) => void;
  onEditEnd: () => void;
}

export const useInitEvents = ({
  pageCursor,
  pageSizes,
  activeElements,
  template,
  schemasList,
  changeSchemas,
  commitSchemas,
  removeSchemas,
  onSaveTemplate,
  past,
  future,
  setSchemasList,
  onEdit,
  onEditEnd,
}: UseInitEventsParams) => {
  const copiedSchemas = useRef<SchemaForUI[] | null>(null);

  const initEvents = useCallback(() => {
    const getActiveSchemas = () => {
      const ids = activeElements.map((ae) => ae.id);

      return schemasList[pageCursor].filter((s) => ids.includes(s.id));
    };
    const timeTravel = (mode: 'undo' | 'redo') => {
      const isUndo = mode === 'undo';
      const stack = isUndo ? past : future;
      if (stack.current.length <= 0) return;
      (isUndo ? future : past).current.push(cloneDeep(schemasList[pageCursor]));
      const s = cloneDeep(schemasList);
      s[pageCursor] = stack.current.pop()!;
      setSchemasList(s);
    };
    initShortCuts({
      move: (command, isShift) => {
        const pageSize = pageSizes[pageCursor];
        const activeSchemas = getActiveSchemas();
        const arg = moveCommandToChangeSchemasArg({ command, activeSchemas, pageSize, isShift });
        changeSchemas(arg);
      },

      copy: () => {
        const activeSchemas = getActiveSchemas();
        if (activeSchemas.length === 0) return;
        copiedSchemas.current = activeSchemas;
      },
      paste: () => {
        if (!copiedSchemas.current || copiedSchemas.current.length === 0) return;
        const schema = schemasList[pageCursor];
        const stackUniqueSchemaNames: string[] = [];
        const pasteSchemas = copiedSchemas.current.map((cs) => {
          const id = uuid();
          const name = getUniqueSchemaName({
            copiedSchemaName: cs.name,
            schema,
            stackUniqueSchemaNames,
          });
          const { height, width, position: p } = cs;
          const ps = pageSizes[pageCursor];
          const position = {
            x: p.x + 10 > ps.width - width ? ps.width - width : p.x + 10,
            y: p.y + 10 > ps.height - height ? ps.height - height : p.y + 10,
          };

          return Object.assign(cloneDeep(cs), { id, name, position });
        });
        commitSchemas(schemasList[pageCursor].concat(pasteSchemas));
        onEdit(pasteSchemas.map((s) => document.getElementById(s.id)!));
        copiedSchemas.current = pasteSchemas;
      },
      redo: () => timeTravel('redo'),
      undo: () => timeTravel('undo'),
      save: () =>
        onSaveTemplate && onSaveTemplate(schemasList2template(schemasList, template.basePdf)),
      remove: () => removeSchemas(getActiveSchemas().map((s) => s.id)),
      esc: onEditEnd,
      selectAll: () => onEdit(schemasList[pageCursor].map((s) => document.getElementById(s.id)!)),
    });
  }, [
    template,
    activeElements,
    pageCursor,
    pageSizes,
    changeSchemas,
    commitSchemas,
    schemasList,
    onSaveTemplate,
    removeSchemas,
    past,
    future,
    setSchemasList,
    copiedSchemas,
    onEdit,
    onEditEnd,
  ]);

  const destroyEvents = useCallback(() => {
    destroyShortCuts();
  }, []);

  useEffect(() => {
    initEvents();

    return destroyEvents;
  }, [initEvents, destroyEvents]);
};
