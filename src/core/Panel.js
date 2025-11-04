// Panel class for managing individual panel instances
class Panel {
  constructor(type, data = {}, browserAPI = null) {
    this.type = type;
    this.data = data;
    this.browserAPI = browserAPI || (typeof browser !== 'undefined' ? browser : chrome);
    this.container = null;
    this.isVisible = false;
    this.config = this.getPanelConfig(type);
  }

  getPanelConfig(type) {
    const configs = {
      welcome: {
        htmlFile: 'src/panels/welcome/welcome.html',
        jsFile: 'src/panels/welcome/welcome.js',
        containerId: 'carbon-visualizer-welcome-panel',
        className: 'cv-panel--welcome'
      },
      results: {
        htmlFile: 'src/panels/results/results.html',
        jsFile: 'src/panels/results/results.js',
        containerId: 'carbon-visualizer-results-panel',
        className: 'cv-panel--results'
      },
    };

    return configs[type] || configs.welcome;
  }

  async initialize() {
    // Create container (or recreate if it was removed)
    this.container = document.createElement('div');
    this.container.id = this.config.containerId;
    this.container.className = `cv-panel ${this.config.className}`;

    // Reset visibility state
    this.isVisible = false;

    // Load and inject HTML (CSS is already bundled and loaded by ExtensionManager)
    await this.loadPanelHTML();

    // Load panel-specific JavaScript
    await this.loadPanelJS();

    // Load universal components
    await this.loadHeader();
  }

  async loadPanelHTML() {
    try {
      const htmlUrl = this.browserAPI.runtime.getURL(this.config.htmlFile);
      const response = await fetch(htmlUrl);
      const html = await response.text();

      // Parse and inject HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const panelContent = doc.querySelector('#carbon-visualizer-panel-content');

      if (panelContent) {
        this.container.innerHTML = panelContent.innerHTML;
      } else {
        this.container.innerHTML = html;
      }
    } catch (error) {
      this.container.innerHTML = this.getFallbackHTML();
    }
  }

  async loadPanelJS() {
    try {
      // Import and execute the panel module
      const jsUrl = this.browserAPI.runtime.getURL(this.config.jsFile);
      const module = await import(jsUrl);

      // Wait for DOM to be ready and elements to be available
      await this.waitForElements();

      // Call the initializePanel function if it exists
      if (typeof module.initializePanel === 'function') {
        // Pass the container element and close function as part of the data
        const panelData = {
          ...this.data,
          container: this.container,  // Pass the container so JS can query within it
          closePanel: () => this.hide()
        };
        module.initializePanel(this.type, panelData);
      } else if (typeof module.default === 'function') {
        const panelData = {
          ...this.data,
          container: this.container,
          closePanel: () => this.hide()
        };
        module.default(this.type, panelData);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async loadHeader() {
    try {
      // Import component module and insert onto the page
      const componentUrl = this.browserAPI.runtime.getURL('src/components/Header.js');
      const componentModule = await import(componentUrl);

      const header = componentModule.createHeader();
      const fallbackHeader = this.container.querySelector('header.cv-header');
      fallbackHeader.replaceWith(header);
    } catch (error) {
      console.error(error);
    }
  }

  async waitForElements() {
    // Wait a small amount for DOM to be ready
    await new Promise(resolve => setTimeout(resolve, 50));

    // Check if essential elements exist, if not wait a bit more
    const maxRetries = 10;
    let retries = 0;

    while (retries < maxRetries) {
      const analyzeBtn = this.container.querySelector('#analyze-page-btn');
      const backToWelcomeBtn = this.container.querySelector('#back-to-welcome-btn');

      if (analyzeBtn || backToWelcomeBtn) {
        return; // Element found, we're good to go
      }

      // Wait a bit more and try again
      await new Promise(resolve => setTimeout(resolve, 50));
      retries++;
    }
  }

  getFallbackHTML() {
    return `
      <header class="cv-header">
        <h1 class="cv-header__title">Carbon Visualizer - ${this.type}</h1>
      </header>
      <main class="cv-panel__content">
        <p>Panel content for ${this.type}</p>
        <p>Error loading panel files. Using fallback.</p>
      </main>
    `;
  }

  async show() {
    if (!this.container) {
      return;
    }

    // Append to DOM
    document.body.appendChild(this.container);

    // Start hidden for animation
    this.container.classList.remove('cv-panel--visible');

    // Force reflow
    this.container.offsetHeight;

    // Animate in
    requestAnimationFrame(() => {
      this.container.classList.add('cv-panel--visible');
    });

    this.isVisible = true;
  }

  hide() {
    return new Promise((resolve) => {
      if (!this.container) {
        resolve();
        return;
      }

      if (!this.isVisible) {
        resolve();
        return;
      }

      this.container.classList.remove('cv-panel--visible');

      // Set isVisible to false immediately so toggle logic works
      this.isVisible = false;

      // Remove after animation completes
      setTimeout(() => {
        if (this.container && this.container.parentNode) {
          this.container.remove();
        }
        resolve();
      }, 300);
    });
  }

  hideImmediate() {
    if (!this.container) return;

    if (this.container.parentNode) {
      this.container.remove();
    }
    this.isVisible = false;
  }

  updateData(newData) {
    this.data = { ...this.data, ...newData };
    // Trigger panel update if it has an update method
    if (this.container && typeof this.onUpdate === 'function') {
      this.onUpdate(this.data);
    }
  }
}

// Export the class for dynamic imports
export { Panel };
