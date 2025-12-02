/**
 * @file Functions for interacting with the Google PageSpeed Insights API. 
 */

/**
 * Proxy URL that will make the actual Page Speed request and return data.
 * The requests are made securely from a serverless function, to keep the API key private.
 */
const PAGE_SPEED_API_URL = "https://carbon-calculator-proxy.netlify.app/.netlify/functions/page-speed";

/**
 * Make Google PageSpeed Insights API request and return data.
 * 
 * @param {string} urlToMeasure - URL to measure the performance of.
 * @param {bool} logDebug - Whether to log results of request to the console for debugging.
 * @returns {Promise<JSON>|Promise<null>} @see https://developers.google.com/speed/docs/insights/v5/reference/pagespeedapi/runpagespeed#response
 */
export const makePageSpeedAPIRequest = async (urlToMeasure, logDebug = false) => {
    // Proxy URL using serverless function that will return data.
    const proxyRequestUrl = `${PAGE_SPEED_API_URL}?url=${encodeURIComponent(urlToMeasure)}`;

    // Debug: log intro to console.
    if (logDebug) {
        console.log(`~~~~~~ DEBUG: Google PageSpeed Results`);
        console.log(`URL to be measured: "${urlToMeasure}"`);
        console.log(`Making request to: "${proxyRequestUrl}"`);
    }

    // Make request.
    try {
        const response = await fetch(proxyRequestUrl);
        if (!response.ok) {
            throw new Error(`Fetch error encountered. Response status: ${response.status}`);
        }

        const result = await response.json();

        // Debug: log results to console.
        if (logDebug) {
            console.log(`Results JSON response:`, result);
        }
        return result;
    } catch (error) {
        console.error("Error with Page Speed API request:", error.message);
        return null;
    }
};
