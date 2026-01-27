// Results panel JavaScript
import { extensionManager } from "../../core/ExtensionManager.js";

export function initializePanel(panelType, data) {
  // Get the container element
  const container = data?.container;
  if (!container) {
    return;
  }

  // Add click event listener to back to welcome button.
  const backToWelcomeBtn = container.querySelector('#back-to-welcome-btn');
  if (backToWelcomeBtn) {
    backToWelcomeBtn.addEventListener('click', async () => {
      await extensionManager.openPanel('welcome');
    });
  }

  // Display results data.
  const results = data?.pageSpeedResults;
  if (!results) {
    console.warn("Missing page speed results needed to display in results panel.");
    return;
  }

  /**
   * Display page speed results data within results panel.
   */
  const displayPageWeight = (() => {
    // Page Weight: Unused CSS
    const pageWeightUnusedCSS = container.querySelector("#cv-results__unused-css");
    const wastedBytes = results?.lighthouseResult?.audits?.["unused-css-rules"]?.details?.overallSavingsBytes;
    if (pageWeightUnusedCSS && wastedBytes) {
      pageWeightUnusedCSS.textContent = `${bytesToKB(wastedBytes)} KB of unused CSS rules`;
    }
  })();
}

/**
 * Convert bytes to KB.
 */
function bytesToKB(bytes, decimals = 2) {
  return Number((bytes / 1024).toFixed(decimals));
}