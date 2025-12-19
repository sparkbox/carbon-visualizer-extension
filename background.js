// Cross-browser background script support
// Note: Firefox MV3 uses background.scripts instead of service_worker

// Detect browser API
const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

// Check if content script is loaded by trying to send a message
const isContentScriptLoaded = async (tabId) => {
  try {
    await browserAPI.tabs.sendMessage(tabId, { action: 'ping' });
    return true;
  } catch {
    return false;
  }
};

// Send a message with retries (for after injection)
const sendMessageWithRetry = async (tabId, message, maxRetries = 10) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await new Promise(resolve => setTimeout(resolve, 100 * (i + 1))); // 100ms, 200ms, 300ms...
      await browserAPI.tabs.sendMessage(tabId, message);
      return; // Success!
    } catch (error) {
      if (i === maxRetries - 1) {
        console.error('Failed to communicate with content script:', error.message);
        throw error;
      }
      // Continue to next retry
    }
  }
};

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

  // Check if content script is already loaded
  const isLoaded = await isContentScriptLoaded(tab.id);

  if (isLoaded) {
    // Content script already there, send message
    await browserAPI.tabs.sendMessage(tab.id, { action: 'togglePanel' });
  } else {
    // Content script not loaded yet - inject it first
    await browserAPI.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    });

    // Wait for content script to initialize, then send message
    await sendMessageWithRetry(tab.id, { action: 'togglePanel' });
  }
};

// Register the action listener (both browsers use 'action' in Manifest V3)
browserAPI.action.onClicked.addListener(handleIconClick);
