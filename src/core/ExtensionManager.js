// Import Panel class
import { Panel } from './Panel.js';

// Core extension management class
class ExtensionManager {
  constructor(browserAPI = null) {
    this.browserAPI = browserAPI || (typeof browser !== 'undefined' ? browser : chrome);
    this.panels = new Map();
    this.initialized = false;
    this.isToggling = false;
    this.lastToggleTime = 0;
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
    const now = Date.now();

    if (now - this.lastToggleTime < 500) {
      return;
    }

    if (this.isToggling) {
      return;
    }

    this.isToggling = true;
    this.lastToggleTime = now;

    try {
      const existingPanelInDOM = this.panels.get('.cv-panel--welcome');

      if (existingPanelInDOM) {
        existingPanelInDOM.classList.remove('cv-panel--visible');
        // exit animation completes and then remove panel from DOM
        setTimeout(() => {
          existingPanelInDOM.remove();
        }, 300);
      } else {
        await this.openPanel(panelType);
      }
    } finally {

      setTimeout(() => {
        this.isToggling = false;
      }, 100);
    }
  }

  cleanupOrphanedPanels() {
    // Remove any orphaned panels from DOM
    const orphanedPanels = this.panels.get('.cv-panel');
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
    this.panels.clear();

    // Also remove any orphaned panels from DOM
    const existingPanels = this.panels.get('.cv-panel');
    existingPanels.forEach(panel => {
      panel.remove();
    });
  }

  // TODO: Assessment workflow methods will be added later
  // async startAssessment() { ... }
  // async performAssessment(url) { ... }
  // async showResults(assessmentData) { ... }
}

// Export the class for dynamic imports
export { ExtensionManager };
