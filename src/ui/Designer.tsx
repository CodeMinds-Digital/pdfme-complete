import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import {
  cloneDeep,
  Template,
  DesignerProps,
  checkDesignerProps,
  checkTemplate,
  PDFME_VERSION,
} from '../common';
import { BaseUIClass } from './class';
import { DESTROYED_ERR_MSG } from './constants';
import DesignerComponent from './components/Designer/index';
import AppContextProvider from './components/AppContextProvider';

// Global registry to track React roots by DOM container
const rootRegistry = new WeakMap<HTMLElement, Root>();

// Helper function to get or create a root for a container
function getOrCreateRoot(container: HTMLElement): Root {
  let root = rootRegistry.get(container);
  if (!root) {
    // Ensure container is clean before creating root
    container.innerHTML = '';
    root = createRoot(container);
    rootRegistry.set(container, root);
  }
  return root;
}

// Helper function to destroy and remove a root from registry
function destroyRoot(container: HTMLElement): void {
  const root = rootRegistry.get(container);
  if (root) {
    root.unmount();
    rootRegistry.delete(container);
  }
}

// Global root manager to prevent duplicate roots
const globalRootManager = {
  roots: new WeakMap<HTMLElement, Root>(),

  getRoot(container: HTMLElement): Root | null {
    return this.roots.get(container) || null;
  },

  setRoot(container: HTMLElement, root: Root): void {
    this.roots.set(container, root);
  },

  deleteRoot(container: HTMLElement): void {
    this.roots.delete(container);
  },

  hasRoot(container: HTMLElement): boolean {
    return this.roots.has(container);
  }
};

class Designer extends BaseUIClass {
  private onSaveTemplateCallback?: (template: Template) => void;
  private onChangeTemplateCallback?: (template: Template) => void;
  private pageCursor: number = 0;

  constructor(props: DesignerProps) {
    super(props);
    checkDesignerProps(props);
  }

  public saveTemplate() {
    if (!this.domContainer) throw Error(DESTROYED_ERR_MSG);
    if (this.onSaveTemplateCallback) {
      this.onSaveTemplateCallback(this.template);
    }
  }

  public updateTemplate(template: Template) {
    checkTemplate(template);
    if (!this.domContainer) throw Error(DESTROYED_ERR_MSG);
    this.template = cloneDeep(template);
    if (this.onChangeTemplateCallback) {
      this.onChangeTemplateCallback(template);
    }
    this.render();
  }

  public onSaveTemplate(cb: (template: Template) => void) {
    this.onSaveTemplateCallback = cb;
  }

  public onChangeTemplate(cb: (template: Template) => void) {
    this.onChangeTemplateCallback = cb;
  }

  public getPageCursor() {
    return this.pageCursor;
  }

  protected render() {
    if (!this.domContainer) throw Error(DESTROYED_ERR_MSG);

    // Use the global root registry to get or create a root
    const root = getOrCreateRoot(this.domContainer);

    root.render(
      <AppContextProvider
        lang={this.getLang()}
        font={this.getFont()}
        plugins={this.getPluginsRegistry()}
        options={this.getOptions()}
      >
        <DesignerComponent
          template={this.template}
          onSaveTemplate={(template) => {
            this.template = template;
            this.template.pdfmeVersion = PDFME_VERSION;
            if (this.onSaveTemplateCallback) {
              this.onSaveTemplateCallback(template);
            }
          }}
          onChangeTemplate={(template) => {
            this.template = template;
            this.template.pdfmeVersion = PDFME_VERSION;
            if (this.onChangeTemplateCallback) {
              this.onChangeTemplateCallback(template);
            }
          }}
          onPageCursorChange={(newPageCursor: number) => {
            this.pageCursor = newPageCursor;
          }}
          size={this.size}
        />
      </AppContextProvider>
    );
  }

  public destroy() {
    if (this.domContainer) {
      destroyRoot(this.domContainer);
    }
    super.destroy();
  }
}

export default Designer;
