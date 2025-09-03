import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { PreviewProps } from '../common';
import { PreviewUI } from './class';
import { DESTROYED_ERR_MSG } from './constants';
import Preview from './components/Preview';
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

class Viewer extends PreviewUI {

  constructor(props: PreviewProps) {
    super(props);
    console.warn(
      '[@pdfme/ui] Viewer component is deprecated and will be removed in a future version.',
    );
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
        <Preview template={this.template} size={this.size} inputs={this.inputs} />
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

export default Viewer;
