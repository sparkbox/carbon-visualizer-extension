// Cross-browser background script support
// Note: Firefox MV3 uses background.scripts instead of service_worker

// Detect browser API
const browserAPI = typeof browser !== 'undefined' ? browser : chrome;
const isFirefox = typeof browser !== 'undefined';

// Track last click time to prevent rapid clicks
let lastClickTime = 0;

// Handle extension icon click
const handleIconClick = async (tab) => {
  const now = Date.now();
  
  // Debounce rapid clicks (ignore clicks within 800ms)
  if (now - lastClickTime < 800) {
    return;
  }
  
  lastClickTime = now;
  
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
  } catch (firstError) {
    // If message fails, content script is not loaded - inject it
    try {
      await browserAPI.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
      });
      
      // Wait a moment for the script to initialize
      await new Promise(resolve => setTimeout(resolve, 150));
      
      // Send message after injection
      await browserAPI.tabs.sendMessage(tab.id, { action: 'togglePanel' })
        .catch(() => {
          // Silently handle errors
        });
      
    } catch (injectError) {
      // Silently handle injection errors
    }
  }
};

// Register the action listener (both browsers use 'action' in Manifest V3)
browserAPI.action.onClicked.addListener(handleIconClick);