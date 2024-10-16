import React from "react";   // Import React
import ReactDOM from "react-dom/client"; // Import ReactDOM
import Inject from "./Inject";   // Ensure this path is correct

export default defineContentScript({
  matches: ['*://*.linkedin.com/*'],
  cssInjectionMode: 'ui',
  async main(ctx) {
    console.log("WORKING");
    console.log('Hello content 2.');

    function waitForElement(selector: string): Promise<HTMLElement | null> {
      return new Promise((resolve) => {
        const interval = setInterval(() => {
          const element = document.querySelector(selector) as HTMLElement | null;
          if (element) {
            clearInterval(interval);
            resolve(element);
          }
        }, 100);
      });
    }

    const anchorElement = await waitForElement('div[role="textbox"]');
    if (!anchorElement) {
      console.error('Anchor element not found.');
      return;
    }
    const ui = await createShadowRootUi(ctx, {
      name: 'generator-ui',
      position: 'inline',
      anchor: anchorElement,
      append: "after",
      onMount: (container) => {
        const root = ReactDOM.createRoot(container);
        root.render(<Inject />);
        return root;
      },
      onRemove: (root) => {
        root?.unmount();
      },
    });
    anchorElement.addEventListener('focus', () => {
      ui.mount();
    });
    

    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const uiElement = document.querySelector('generator-ui');
    
      if (anchorElement !== target && !anchorElement.contains(target) && uiElement && !uiElement.contains(target)) {
        ui.remove();
      }
    });    
  },
});
