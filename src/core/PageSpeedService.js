/**
 * @file Functions for interacting with the Google PageSpeed Insights API. 
 */

/**
 * Make Google PageSpeed Insights API request and return data.
 * The requests are made securely from a serverless function, to keep the API key private.
 * 
 * @param {string} urlToMeasure - URL to measure the performance of.
 * @param {bool} logDebug - Whether to log results of request to the console for debugging.
 * @returns {JSON} @see https://developers.google.com/speed/docs/insights/v5/reference/pagespeedapi/runpagespeed#response
 */
export const makePageSpeedAPIRequest = async (urlToMeasure, logDebug = false) => {
    // Proxy URL using serverless function that will return data.
    const proxyRequestUrl = ``;

    if (logDebug) {
        console.log(`~~~~~~ Google PageSpeed Results for: "${urlToMeasure}" ~~~~~~`);
        console.log(`Making request to "${proxyRequestUrl}" ...`);
    }
};

