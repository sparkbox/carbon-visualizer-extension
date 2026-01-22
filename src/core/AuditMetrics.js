/**
 * @file Functions for extracting and processing Lighthouse audit metrics.
 */

/**
 * Extracts unused JavaScript metrics from PageSpeed Insights results.
 *
 * @param {Object} pageSpeedResults - The PageSpeed Insights (Lighthouse) result object.
 * @returns {Object|null} An object containing:
 *   @property {number} score - Audit score from 0-1 (0 = failing, 1 = passing).
 *   @property {number} overallSavingsBytes - Total bytes of unused JavaScript.
 *   @property {number} overallSavingsMs - Estimated time savings in milliseconds.
 *   @property {Array} items - Array of scripts with unused code (url, totalBytes, wastedBytes, wastedPercent).
 */
export const getUnusedJavaScriptMetrics = (pageSpeedResults) => {
  const audit = pageSpeedResults?.lighthouseResult?.audits?.['unused-javascript'];

  if (!audit) {
    console.error('unused-javascript audit not found in PageSpeed results');
    return null;
  }

  return {
    score: audit.score,
    overallSavingsBytes: audit.details?.overallSavingsBytes ?? 0,
    overallSavingsMs: audit.details?.overallSavingsMs ?? 0,
    items: audit.details?.items ?? [],
  };
};
