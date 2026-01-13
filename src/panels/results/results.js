// Results panel JavaScript
import { extensionManager } from "../../core/ExtensionManager.js";

export async function initializePanel(panelType, data) {
  // Get the container element
  const container = data.container;
  
  if (!container) {
    return;
  }

  // Load Summary component
  await loadSummary(container, data);
  
  // Get back to welcome button from within the container
  const backToWelcomeBtn = container.querySelector('#back-to-welcome-btn');
  
  // Check if button exists before adding event listener
  if (!backToWelcomeBtn) {
    return;
  }
  
  // Event listener for back to welcome button
  backToWelcomeBtn.addEventListener('click', async () => {
    await extensionManager.openPanel('welcome');
  });
}

async function loadSummary(container, data) {
  try {
    const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

    // Import component module and insert onto the page
    const componentUrl = browserAPI.runtime.getURL('src/components/Summary.js');
    const componentModule = await import(componentUrl);

    const summary = componentModule.createSummary(data);
    const fallbackSummary = container.querySelector('.cv-summary');
    if (fallbackSummary) {
      fallbackSummary.replaceWith(summary);
    } else {
      // Or append to a specific location
      const content = container.querySelector('.cv-panel__content');
      content?.prepend(summary);
    }
  } catch (error) {
    console.error(`An error occurred while loading your Summary: ${error}`)
  }
}
