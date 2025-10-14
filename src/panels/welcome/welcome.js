// Welcome panel JavaScript
import { extensionManager }  from "../../core/ExtensionManager.js";
import { makePageSpeedAPIRequest } from "../../core/PageSpeedService.js";

export function initializePanel(panelType, data) {
  // Get the container element
  const container = data.container;
  
  if (!container) {
    return;
  }
  
  // Get analyze button from within the container
  const analyzeBtn = container.querySelector('#analyze-page-btn');
  const analyzeErrorMessage = container.querySelector('#analyze-page-error');
  
  // Check if button exists before adding event listener
  if (!analyzeBtn) {
    return;
  }
  
  // Event listener for analyze button
  analyzeBtn.addEventListener('click', async () => {
    // For now, just show a simple message within the button.
    analyzeBtn.disabled = true;
    analyzeBtn.textContent = 'Test: Making request and logging to console...';
    if (analyzeErrorMessage) {
      analyzeErrorMessage.textContent = '';
    }

    // Make API request.
    const currentPageURL = window.location.toString();
    const pageSpeedResults = await makePageSpeedAPIRequest(currentPageURL, true);

    // Display error message in UI if there was an error or nothing was returned.
    if (!pageSpeedResults || Object.keys(pageSpeedResults).length === 0) {
      if (analyzeErrorMessage) {
        analyzeErrorMessage.textContent = 'Sorry! An error occurred when making the API request that tests the page. Please try again a little later. If this continues to happen, please let us know!';
      }

      // Reset button back to usable state.
      analyzeBtn.textContent = 'Analyze This Page';
      analyzeBtn.disabled = false;
    }

    // Open results panel.
    await extensionManager.openPanel('results');
  });
}
