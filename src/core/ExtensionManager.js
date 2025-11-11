import { Panel } from './Panel.js';

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

  async loadCoreCSS() {
    if (document.getElementById('carbon-visualizer-core-css-bundle')) return;

    try {
      const files = [
        'src/styles/tokens/color.css',
        'src/styles/tokens/size.css',
        'src/styles/tokens/typography.css',
        'src/styles/themes/default.css',
        'src/styles/generic/typography.css',
        'src/styles/core.css'
      ];

      for (const file of files) {
        const cssUrl = this.browserAPI.runtime.getURL(file);
        const response = await fetch(cssUrl);
        const css = await response.text();

        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
      }

      // Add a marker to indicate core CSS bundle is loaded
      const marker = document.createElement('style');
      marker.id = 'carbon-visualizer-core-css-bundle';
      marker.textContent = '/* Core CSS bundle loaded */';
      document.head.appendChild(marker);
    } catch (error) {
      console.error(error);
    }
  }

  removeVisiblePanels() {
    const panels = document.querySelectorAll('.cv-panel.cv-panel--visible');
    if (!panels.length) return;

    panels.forEach((panel) => {
      panel.classList.remove('cv-panel--visible');
      setTimeout(() => {
        panel.remove();
      }, 300);
    });
  }

  async togglePanel(panelType) {
    try {
      const visiblePanels = document.querySelectorAll('.cv-panel.cv-panel--visible');

      if (visiblePanels.length) {
        this.removeVisiblePanels();
      } else {
        await this.openPanel(panelType);
      }
    } catch (error) {
      console.error('Error in togglePanel():', error);
    }
  }

  cleanupOrphanedPanels() {
    const orphanedPanels = document.querySelectorAll('.cv-panel');
    orphanedPanels.forEach((panel) => {
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
    this.removeVisiblePanels();

    let panel = this.panels.get(panelType);

    // Create a new panel if one does not already exist
    if (!panel) {
      panel = new Panel(panelType, data, this.browserAPI);
      this.panels.set(panelType, panel);
    }

    // Always reinitialize to ensure clean state
    await panel.initialize();
    await panel.show();
  }

  async closePanel(panelType) {
    const panel = this.panels.get(panelType);
    if (panel) {
      await panel.hide();
    }
  }

  closeAllPanels() {
    for (const [type, panel] of this.panels) {
      if (panel && panel.container) {
        panel.hideImmediate();
      }
    }

    // Clear the panels map and remove orphaned panels from DOM
    this.panels.clear();
    this.cleanupOrphanedPanels();
  }

  // TODO: Assessment workflow methods will be added later
  // async startAssessment() { ... }
  // async performAssessment(url) { ... }
  // async showResults(assessmentData) { ... }
}

export { ExtensionManager };

export const extensionManager = new ExtensionManager();
