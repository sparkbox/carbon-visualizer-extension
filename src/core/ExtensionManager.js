// Import Panel class
import { Panel } from './Panel.js';

// Core extension management class
class ExtensionManager {
  constructor(browserAPI = null) {
    this.browserAPI = browserAPI || (typeof browser !== 'undefined' ? browser : chrome);
    this.panels = new Map();
    this.initialized = false;

    // TODO: Set the other panel types in the panels map
    this.panels.set('welcome', new Panel('welcome', {}, this.browserAPI));
  }

  async initialize() {
    if (this.initialized) {
      return;
    }

    // Handle the message and send response
    if (!this.messageListenerAdded) {
      this.messageListenerAdded = true;
      this.browserAPI.runtime.onMessage.addListener((message, sender, sendResponse) => {
        this.handleMessage(message, sender, sendResponse);
        sendResponse({ received: true }); // Send a response to close the channel
        return false; // Don't keep channel open
      });
    }

    await this.loadCoreCSS();

    this.cleanupOrphanedPanels();

    this.initialized = true;
  }

  async handleMessage(message, sender, sendResponse) {
    try {
      switch (message.action) {
        case 'togglePanel':
          await this.togglePanel(message.panelType || 'welcome');
          break;
        case 'closePanel':
          this.closePanel(message.panelType || 'welcome');
          break;
        case 'openPanel':
          await this.openPanel(message.panelType || 'welcome', message.data);
          break;
        default:

          break;
      }
    } catch (error) {
      console.error(error);
    }
  }


  async togglePanel(panelType) {
    try {
      const panel = this.panels.get(panelType);

      if (panel && panel.isVisible) {
        // Panel is visible -> close it
        this.closePanel(panelType);
      } else {
        // Panel doesn't exist or is hidden -> open it
        await this.openPanel(panelType);
      }
    }
    catch (error) {
      console.error('Error in togglePanel():', error);
    }
  }

  cleanupOrphanedPanels() {
    // Remove any orphaned panels from DOM that aren't tracked in our map
    const orphanedPanels = document.querySelectorAll('.cv-panel');
    orphanedPanels.forEach(panel => {
      panel.remove();
    });

    // Reset all panel states
    for (const [type, panel] of this.panels) {
      if (panel) {
        panel.isVisible = false;
      }
    }
  }

  async openPanel(panelType, data = {}) {
    let panel = this.panels.get(panelType);

    // Always create a fresh panel to avoid state issues
    if (!panel) {
      panel = new Panel(panelType, data, this.browserAPI);
      this.panels.set(panelType, panel);
    }

    // Always reinitialize to ensure clean state
    await panel.initialize();

    // Show the panel
    await panel.show();
  }

  closePanel(panelType) {
    const panel = this.panels.get(panelType);
    if (panel) {
      panel.hide();
      // Don't delete from map - keep for reuse
    }
  }

  closeAllPanels() {
    // Hide all tracked panels immediately
    for (const [type, panel] of this.panels) {
      if (panel && panel.container) {
        panel.hideImmediate();
      }
    }

    // Clear the panels map
    this.panels.clear();

    // Also remove any orphaned panels from DOM
    this.cleanupOrphanedPanels();
  }

  // TODO: Assessment workflow methods will be added later
  // async startAssessment() { ... }
  // async performAssessment(url) { ... }
  // async showResults(assessmentData) { ... }
}

// Export the class for dynamic imports
export { ExtensionManager };
