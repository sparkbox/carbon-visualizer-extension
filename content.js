// Content script for Carbon Visualizer extension
// Initializes the ExtensionManager and handles messages from the background script.

// Prevent multiple injections
if (window.carbonVisualizerContentScriptLoaded) {
  // Already loaded, skip
} else {
  window.carbonVisualizerContentScriptLoaded = true;
  
  // Detect browser API
  const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

  // Ensure ExtensionManager is only initialized once per page
  if (!window.carbonVisualizerManager) {
    // Dynamically import ExtensionManager and initialize
    import(browserAPI.runtime.getURL('src/core/ExtensionManager.js'))
      .then(({ ExtensionManager }) => {
        // Listen for messages from the background script (only if not already added)
        if (!window.carbonVisualizerMessageListener) {
          window.carbonVisualizerManager = new ExtensionManager(browserAPI);
          window.carbonVisualizerManager.initialize();
        };
      })
      .catch((error) => {
        console.error('Failed to load ExtensionManager', error);
      });
  }
}
