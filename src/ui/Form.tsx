import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { PreviewProps } from '../common';
import { PreviewUI } from './class';
import { DESTROYED_ERR_MSG } from './constants';
import AppContextProvider from './components/AppContextProvider';
import Preview from './components/Preview';

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

class Form extends PreviewUI {
  private onChangeInputCallback?: (arg: { index: number; value: string; name: string }) => void;

  constructor(props: PreviewProps) {
    super(props);
  }

  public onChangeInput(cb: (arg: { index: number; value: string; name: string }) => void) {
    this.onChangeInputCallback = cb;
  }

  public setInputs(inputs: { [key: string]: string }[]): void {
    const previousInputs = this.getInputs();

    super.setInputs(inputs);

    const changedInputs: Array<{ index: number; name: string; value: string }> = [];

    inputs.forEach((input, index) => {
      const prevInput = previousInputs[index] || {};

      const allKeys = new Set([...Object.keys(input), ...Object.keys(prevInput)]);

      allKeys.forEach((name) => {
        const newValue = input[name];
        const oldValue = prevInput[name];

        if (newValue !== oldValue) {
          changedInputs.push({ index, name, value: newValue });
        }
      });
    });

    changedInputs.forEach((input) => {
      if (this.onChangeInputCallback) {
        this.onChangeInputCallback(input);
      }
    });
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
        <Preview
          template={this.template}
          size={this.size}
          inputs={this.inputs}
          onChangeInput={(arg: { index: number; value: string; name: string }) => {
            const { index, value, name } = arg;
            if (this.onChangeInputCallback) {
              this.onChangeInputCallback({ index, value, name });
            }
            if (this.inputs && this.inputs[index]) {
              if (this.inputs[index][name] !== value) {
                this.inputs[index][name] = value;
                this.render();
              }
            }
          }}
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

export default Form;
