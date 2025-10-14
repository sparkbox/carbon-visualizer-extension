// Welcome panel JavaScript

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
    analyzeBtn.textContent = 'Coming Soon!';
    
    setTimeout(() => {
      analyzeBtn.disabled = false;
      analyzeBtn.textContent = 'Analyze this website';
    }, 2000);
  });
}
