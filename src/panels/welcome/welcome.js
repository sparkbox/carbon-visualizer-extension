// Welcome panel JavaScript
import { makePageSpeedAPIRequest } from "../../core/PageSpeedService.js";

export function initializePanel(panelType, data) {
  // Get the container element
  const container = data.container;
  
  if (!container) {
    return;
  }
  
  // Get analyze button from within the container
  const analyzeBtn = container.querySelector('#analyze-page-btn');
  
  // Check if button exists before adding event listener
  if (!analyzeBtn) {
    return;
  }
  
  // Event listener for analyze button
  analyzeBtn.addEventListener('click', () => {
    // For now, just show a simple message
    analyzeBtn.disabled = true;
    analyzeBtn.textContent = 'Test: logging to console...';

    // Make API request.
    const currentPageURL = window.location.toString();
    const pageSpeedResults = makePageSpeedAPIRequest(currentPageURL, true);
    
    setTimeout(() => {
      analyzeBtn.disabled = false;
      analyzeBtn.textContent = 'Analyze This Page';
    }, 2000);
  });
}
