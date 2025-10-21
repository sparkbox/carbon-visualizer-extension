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

  async loadCoreCSS() {
    if (document.getElementById('carbon-visualizer-core-css')) return;

    try {
      const cssUrl = this.browserAPI.runtime.getURL('src/styles/core.css');
      const response = await fetch(cssUrl);
      const css = await response.text();
      
      const style = document.createElement('style');
      style.id = 'carbon-visualizer-core-css';
      style.textContent = css;
      document.head.appendChild(style);
    } catch (error) {
      console.error(error);
    }
  }

  async togglePanel(panelType) {
    try {
      const existingPanelInDOM = this.panels.get(panelType);
      
      if (existingPanelInDOM && existingPanelInDOM.isVisible) {
        // Panel exists and is visible -> hide it
        await existingPanelInDOM.hide();
      } else if (existingPanelInDOM && !existingPanelInDOM.isVisible) {
        // Panel exists but hidden -> ensure it's initialized and show it
        if (!existingPanelInDOM.container || !existingPanelInDOM.container.parentNode) {
          // Re-initialize if container is missing or not in DOM
          await existingPanelInDOM.initialize();
        }
        await existingPanelInDOM.show();
      } else {
        // Panel doesn't exist -> create and open it
        await this.openPanel(panelType);
      }
    }
    catch (error) {
      console.error('Error in togglePanel():', error);
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
