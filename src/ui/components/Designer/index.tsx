import React, { useRef, useState, useContext, useCallback, useEffect, useMemo } from 'react';
import {
  cloneDeep,
  ZOOM,
  Template,
  Schema,
  SchemaForUI,
  ChangeSchemas,
  DesignerProps,
  Size,
  isBlankPdf,
  px2mm,
  Signer,
} from '../../../common';
import { DndContext } from '@dnd-kit/core';
import UnifiedSidebar from './UnifiedSidebar';
import Canvas from './Canvas/index';
import SignerSelector from './SignerSelector';
import { RULER_HEIGHT, UNIFIED_SIDEBAR_WIDTH } from '../../constants';
import { I18nContext, OptionsContext, PluginsRegistry } from '../../contexts';
import {
  schemasList2template,
  uuid,
  round,
  template2SchemasList,
  getPagesScrollTopByIndex,
  changeSchemas as _changeSchemas,
  useMaxZoom,
} from '../../helper';
import { useUIPreProcessor, useScrollPageCursor, useInitEvents } from '../../hooks';
import Root from '../Root';
import ErrorScreen from '../ErrorScreen';
import CtlBar from '../CtlBar';

/**
 * When the canvas scales there is a displacement of the starting position of the dragged schema.
 * It moves left or right from the top-left corner of the drag icon depending on the scale.
 * This function calculates the adjustment needed to compensate for this displacement.
 */
const scaleDragPosAdjustment = (adjustment: number, scale: number): number => {
  if (scale > 1) return adjustment * (scale - 1);
  if (scale < 1) return adjustment * -(1 - scale);
  return 0;
};

const TemplateEditor = ({
  template,
  size,
  onSaveTemplate,
  onChangeTemplate,
  onPageCursorChange,
}: Omit<DesignerProps, 'domContainer'> & {
  size: Size;
  onSaveTemplate: (t: Template) => void;
  onChangeTemplate: (t: Template) => void;
} & {
  onChangeTemplate: (t: Template) => void;
  onPageCursorChange: (newPageCursor: number) => void;
}) => {
  const past = useRef<SchemaForUI[][]>([]);
  const future = useRef<SchemaForUI[][]>([]);
  const canvasRef = useRef<HTMLDivElement>(null);
  const paperRefs = useRef<HTMLDivElement[]>([]);

  const i18n = useContext(I18nContext);
  const pluginsRegistry = useContext(PluginsRegistry);
  const options = useContext(OptionsContext);
  const maxZoom = useMaxZoom();

  const [hoveringSchemaId, setHoveringSchemaId] = useState<string | null>(null);
  const [activeElements, setActiveElements] = useState<HTMLElement[]>([]);
  const [schemasList, setSchemasList] = useState<SchemaForUI[][]>([[]] as SchemaForUI[][]);
  const [pageCursor, setPageCursor] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(options.zoomLevel ?? 1);
  const [prevTemplate, setPrevTemplate] = useState<Template | null>(null);

  // Multi-signature state (always enabled)
  const [signers, setSigners] = useState<Signer[]>(template.signers ?? []);
  const [currentSignerId, setCurrentSignerId] = useState<string | null>(
    template.signers && template.signers.length > 0 ? template.signers[0].id : null
  );

  const { backgrounds, pageSizes, scale, error, refresh } = useUIPreProcessor({
    template,
    size,
    zoomLevel,
    maxZoom,
  });

  const onEdit = (targets: HTMLElement[]) => {
    setActiveElements(targets);
    setHoveringSchemaId(null);
  };

  const onEditEnd = () => {
    setActiveElements([]);
    setHoveringSchemaId(null);
  };

  // Update component state only when _options_ changes
  // Ignore exhaustive useEffect dependency warnings here
  useEffect(() => {
    if (typeof options.zoomLevel === 'number' && options.zoomLevel !== zoomLevel) {
      setZoomLevel(options.zoomLevel);
    }
    // eslint-disable-next-line
  }, [options]);

  const scrollPageCursorControl = useScrollPageCursor({
    ref: canvasRef,
    pageSizes,
    scale,
    pageCursor,
    onChangePageCursor: (p) => {
      setPageCursor(p);
      onPageCursorChange(p);
      onEditEnd();
    },
  });

  const commitSchemas = useCallback(
    (newSchemas: SchemaForUI[]) => {
      future.current = [];
      past.current.push(cloneDeep(schemasList[pageCursor]));
      const _schemasList = cloneDeep(schemasList);
      _schemasList[pageCursor] = newSchemas;
      setSchemasList(_schemasList);

      // Create updated template with multi-signature data (always enabled)
      const updatedTemplate = schemasList2template(_schemasList, template.basePdf);
      updatedTemplate.multiSignature = true;
      updatedTemplate.signers = signers;

      onChangeTemplate(updatedTemplate);
    },
    [template, schemasList, pageCursor, onChangeTemplate, signers],
  );

  const removeSchemas = useCallback(
    (ids: string[]) => {
      commitSchemas(schemasList[pageCursor].filter((schema) => !ids.includes(schema.id)));
      onEditEnd();
    },
    [schemasList, pageCursor, commitSchemas],
  );

  const changeSchemas: ChangeSchemas = useCallback(
    (objs) => {
      _changeSchemas({
        objs,
        schemas: schemasList[pageCursor],
        basePdf: template.basePdf,
        pluginsRegistry,
        pageSize: (pageSizes[pageCursor] as unknown as { width: number; height: number }) ?? {
          width: 0,
          height: 0,
        },
        commitSchemas,
      });
    },
    [commitSchemas, pageCursor, schemasList, pluginsRegistry, pageSizes, template.basePdf],
  );

  useInitEvents({
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
  });

  const updateTemplate = useCallback(async (newTemplate: Template) => {
    const sl = await template2SchemasList(newTemplate);
    setSchemasList(sl);
    onEditEnd();
    setPageCursor(0);
    if (canvasRef.current?.scroll) {
      // Disable scroll event handling during programmatic scrolling
      scrollPageCursorControl.setScrollingProgrammatically(true);
      canvasRef.current.scroll({ top: 0, behavior: 'smooth' });

      // Re-enable scroll event handling after animation completes
      setTimeout(() => {
        scrollPageCursorControl.setScrollingProgrammatically(false);
      }, 500); // Longer delay for smooth scroll animation
    }
  }, [scrollPageCursorControl]);

  const addSchema = (defaultSchema: Schema) => {
    const [paddingTop, paddingRight, paddingBottom, paddingLeft] = isBlankPdf(template.basePdf)
      ? template.basePdf.padding
      : [0, 0, 0, 0];
    const pageSize: Size =
      (pageSizes[pageCursor] as unknown as Size) ?? ({ width: 0, height: 0 } as Size);

    const newSchemaName = (prefix: string) => {
      let index = schemasList.reduce((acc, page) => acc + page.length, 1);
      let newName = prefix + index;
      while (schemasList.some((page) => page.find((s) => s.name === newName))) {
        index++;
        newName = prefix + index;
      }
      return newName;
    };
    const ensureMiddleValue = (min: number, value: number, max: number) =>
      Math.min(Math.max(min, value), max);

    const s = {
      id: uuid(),
      ...defaultSchema,
      name: newSchemaName(i18n('field')),
      position: {
        x: ensureMiddleValue(
          paddingLeft,
          defaultSchema.position.x,
          pageSize.width - paddingRight - defaultSchema.width,
        ),
        y: ensureMiddleValue(
          paddingTop,
          defaultSchema.position.y,
          pageSize.height - paddingBottom - defaultSchema.height,
        ),
      },
      required: defaultSchema.readOnly
        ? false
        : options.requiredByDefault || defaultSchema.required || false,
      // Always assign to current signer (multi-signature always enabled)
      signerId: currentSignerId || undefined,
    } as SchemaForUI;

    if (defaultSchema.position.y === 0) {
      const paper = paperRefs.current[pageCursor];
      const rectTop = paper ? paper.getBoundingClientRect().top : 0;
      s.position.y = rectTop > 0 ? paddingTop : pageSizes[pageCursor].height / 2;
    }

    commitSchemas(schemasList[pageCursor].concat(s));
    setTimeout(() => onEdit([document.getElementById(s.id)!]));
  };

  const onSortEnd = (sortedSchemas: SchemaForUI[]) => {
    commitSchemas(sortedSchemas);
  };

  // Initialize default signer if none exist (multi-signature always enabled)
  const initializeDefaultSigner = useCallback(() => {
    if (signers.length === 0) {
      const defaultSigner: Signer = {
        id: 'signer_1',
        name: 'Signer 1',
        email: '',
        role: '',
        color: '#1890ff',
      };
      setSigners([defaultSigner]);
      setCurrentSignerId(defaultSigner.id);
    }
  }, [signers.length]);

  React.useEffect(() => {
    initializeDefaultSigner();
  }, [initializeDefaultSigner]);

  const handleSignersUpdate = useCallback((updatedSigners: Signer[]) => {
    const previousSigners = signers;
    setSigners(updatedSigners);

    // Find deleted signers
    const deletedSignerIds = previousSigners
      .filter(prevSigner => !updatedSigners.find(newSigner => newSigner.id === prevSigner.id))
      .map(signer => signer.id);

    // If signers were deleted, remove their schemas
    if (deletedSignerIds.length > 0) {
      const updatedSchemasList = schemasList.map(pageSchemas =>
        pageSchemas.filter(schema => {
          // Remove schemas that belong to deleted signers
          return !schema.signerId || !deletedSignerIds.includes(schema.signerId);
        })
      );
      setSchemasList(updatedSchemasList);

      // Commit the changes to trigger template update for current page
      if (updatedSchemasList[pageCursor]) {
        commitSchemas(updatedSchemasList[pageCursor]);
      }
    }
  }, [signers, schemasList, pageCursor, commitSchemas]);

  const handleSignerChange = useCallback((signerId: string | null) => {
    setCurrentSignerId(signerId);
  }, []);

  const onChangeHoveringSchemaId = (id: string | null) => {
    setHoveringSchemaId(id);
  };

  const updatePage = async (sl: SchemaForUI[][], newPageCursor: number) => {
    setPageCursor(newPageCursor);
    const newTemplate = schemasList2template(sl, template.basePdf);
    onChangeTemplate(newTemplate);
    await updateTemplate(newTemplate);
    void refresh(newTemplate);

    // Use setTimeout to update scroll position after render
    setTimeout(() => {
      if (canvasRef.current) {
        // Disable scroll event handling during programmatic scrolling
        scrollPageCursorControl.setScrollingProgrammatically(true);
        canvasRef.current.scrollTop = getPagesScrollTopByIndex(pageSizes, newPageCursor, scale);

        // Re-enable scroll event handling after a short delay
        setTimeout(() => {
          scrollPageCursorControl.setScrollingProgrammatically(false);
        }, 100);
      }
    }, 0);
  };

  const handleRemovePage = () => {
    if (pageCursor === 0) return;
    if (!window.confirm(i18n('removePageConfirm'))) return;

    const _schemasList = cloneDeep(schemasList);
    _schemasList.splice(pageCursor, 1);
    void updatePage(_schemasList, pageCursor - 1);
  };

  const handleAddPageAfter = () => {
    const _schemasList = cloneDeep(schemasList);
    _schemasList.splice(pageCursor + 1, 0, []);
    void updatePage(_schemasList, pageCursor + 1);
  };

  if (prevTemplate !== template) {
    setPrevTemplate(template);
    void updateTemplate(template);
  }

  const canvasWidth = size.width;
  const sizeExcSidebars = {
    width: canvasWidth - UNIFIED_SIDEBAR_WIDTH,
    height: size.height,
  };

  if (error) {
    // Pass the error directly to ErrorScreen
    return <ErrorScreen size={size} error={error} />;
  }
  const pageManipulation = isBlankPdf(template.basePdf)
    ? { addPageAfter: handleAddPageAfter, removePage: handleRemovePage }
    : {};

  return (
    <Root size={size} scale={scale}>
      <DndContext
        onDragEnd={(event) => {
          // Triggered after a schema is dragged & dropped from the left sidebar.
          if (!event.active) return;
          const active = event.active;
          const pageRect = paperRefs.current[pageCursor].getBoundingClientRect();

          const dragStartLeft = active.rect.current.initial?.left || 0;
          const dragStartTop = active.rect.current.initial?.top || 0;

          const canvasLeftOffsetFromPageCorner =
            pageRect.left - dragStartLeft + scaleDragPosAdjustment(20, scale);
          const canvasTopOffsetFromPageCorner = pageRect.top - dragStartTop;

          const moveY = (event.delta.y - canvasTopOffsetFromPageCorner) / scale;
          const moveX = (event.delta.x - canvasLeftOffsetFromPageCorner) / scale;

          const position = {
            x: round(px2mm(Math.max(0, moveX)), 2),
            y: round(px2mm(Math.max(0, moveY)), 2),
          };

          addSchema({ ...(active.data.current as Schema), position });
        }}
        onDragStart={onEditEnd}
      >


        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'row'
          }}
        >
          {/* PDF Preview Area - 70% width */}
          <div
            style={{
              width: '70%',
              height: '100%',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <CtlBar
              size={{ width: size.width * 0.7, height: size.height }}
              pageCursor={pageCursor}
              pageNum={schemasList.length}
              setPageCursor={(p) => {
                if (!canvasRef.current) return;
                // Disable scroll event handling during programmatic scrolling
                scrollPageCursorControl.setScrollingProgrammatically(true);

                // Update scroll position and state
                canvasRef.current.scrollTop = getPagesScrollTopByIndex(pageSizes, p, scale);
                setPageCursor(p);
                onEditEnd();

                // Re-enable scroll event handling after a short delay
                setTimeout(() => {
                  scrollPageCursorControl.setScrollingProgrammatically(false);
                }, 100);
              }}
              zoomLevel={zoomLevel}
              setZoomLevel={setZoomLevel}
              {...pageManipulation}
            />

            <Canvas
              ref={canvasRef}
              paperRefs={paperRefs}
              basePdf={template.basePdf}
              hoveringSchemaId={hoveringSchemaId}
              onChangeHoveringSchemaId={onChangeHoveringSchemaId}
              height={size.height - RULER_HEIGHT * ZOOM}
              pageCursor={pageCursor}
              scale={scale}
              size={{ width: size.width * 0.7, height: size.height }}
              pageSizes={pageSizes}
              backgrounds={backgrounds}
              activeElements={activeElements}
              schemasList={schemasList}
              changeSchemas={changeSchemas}
              removeSchemas={removeSchemas}
              sidebarOpen={true}
              onEdit={onEdit}
            />
          </div>

          {/* Unified Sidebar - 30% width */}
          <div
            style={{
              width: '30%',
              height: '100%',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Signer Selector */}
            <SignerSelector
              signers={signers}
              currentSignerId={currentSignerId}
              onSignerChange={handleSignerChange}
              onSignersUpdate={handleSignersUpdate}
            />

            <UnifiedSidebar
              hoveringSchemaId={hoveringSchemaId}
              onChangeHoveringSchemaId={onChangeHoveringSchemaId}
              height={canvasRef.current ? canvasRef.current.clientHeight - 60 : 0} // Subtract SignerSelector height
              size={size}
              pageSize={(pageSizes[pageCursor] as unknown as Size) ?? ({ width: 0, height: 0 } as Size)}
              activeElements={activeElements}
              schemasList={schemasList}
              schemas={schemasList[pageCursor] ?? []}
              changeSchemas={changeSchemas}
              onSortEnd={onSortEnd}
              onEdit={(id: string) => {
                const editingElem = document.getElementById(id);
                if (editingElem) {
                  onEdit([editingElem]);
                }
              }}
              onEditEnd={onEditEnd}
              deselectSchema={onEditEnd}
              scale={scale}
              basePdf={template.basePdf}
              // Pass multi-signature data for filtering (always enabled)
              currentSignerId={currentSignerId}
              multiSignatureEnabled={true}
            />
          </div>
        </div>
      </DndContext>
    </Root>
  );
};

export default TemplateEditor;
