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
        window.carbonVisualizerManager = new ExtensionManager(browserAPI);
        window.carbonVisualizerManager.initialize();

      // Listen for messages from the background script (only if not already added)
      if (!window.carbonVisualizerMessageListener) {
        window.carbonVisualizerMessageListener = (message, sender, sendResponse) => {
          // Handle the message and send response
          window.carbonVisualizerManager.handleMessage(message, sender, sendResponse);
          sendResponse({ received: true }); // Send a response to close the channel
          return false; // Don't keep channel open
        };
        
        browserAPI.runtime.onMessage.addListener(window.carbonVisualizerMessageListener);
      }
      })
      .catch(() => {
        // Silently handle errors
      });
  }
}