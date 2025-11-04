// Results panel JavaScript
import { extensionManager } from "../../core/ExtensionManager.js";

export function initializePanel(panelType, data) {
  // Get the container element
  const container = data.container;
  
  if (!container) {
    return;
  }
  
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
