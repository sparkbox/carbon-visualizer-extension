// Cross-browser background script support
// Note: Firefox MV3 uses background.scripts instead of service_worker

// Detect browser API
const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

// Handle extension icon click
const handleIconClick = async (tab) => {
  // Check if we're on a valid page (not chrome://, about:, file://)
  if (!tab.url || !tab.url.startsWith('http')) {
    return;
  }

  // Check if tab has a valid ID
  if (!tab.id) {
    return;
  }

  try {
    // Try to send a message first to see if content script is already loaded
    await browserAPI.tabs.sendMessage(tab.id, { action: 'togglePanel' });
    
  } catch (error) {
    // If message fails, content.js isn't loaded. Inject it, and execute the content script
    await browserAPI.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    });
    
    // Wait a moment for the script to initialize
    await new Promise(resolve => setTimeout(resolve, 150));

    // Send a message after injection
    await browserAPI.tabs.sendMessage(tab.id, { action: 'togglePanel' });

    console.error(`Error in handleIconClick: ${error.message}`);
  }
};

// Register the action listener (both browsers use 'action' in Manifest V3)
browserAPI.action.onClicked.addListener(handleIconClick);
