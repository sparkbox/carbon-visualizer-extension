import { co2 } from "@tgwf/co2";

/**
 * Calculates the carbon emissions for a web page based on the results from Google's PageSpeed Insights (Lighthouse).
 *
 * @param {Object} pageSpeedResults - The PageSpeed Insights (Lighthouse) result object.
 * @returns {Object} An object containing:
 *   @property {number} emissionsOneByte - Estimated emissions CO2e (in grams) from the OneByte model.
 *   @property {number} emissionsSWD - Estimated emissions CO2e (in grams) from the Sustainable Web Design model.
 * TODO: This function currently returns emissions for both the OneByte and SWD models. Not sure which one we ultimately want to use.
 */
export const calculateEmissionsFromPageSpeedResults = (pageSpeedResults) => {
  const totalByteWeight = pageSpeedResults.lighthouseResult.audits['total-byte-weight'].numericValue;

  // Sustainable Web Design (SWD) model
  // https://developers.thegreenwebfoundation.org/co2js/models/#using-the-sustainable-web-design-model-default-v0110
  const swd = new co2({ model: "swd", version: 4 });
  const emissionsPerByte = swd.perByte(totalByteWeight);

  return { bytesTransferred: totalByteWeight, totalCO2: emissionsPerByte };
}

/**
 * Calculates the carbon emissions for a web page based on the results from Google's PageSpeed Insights (Lighthouse).
 *
 * @param {Object} pageSpeedResults - The PageSpeed Insights (Lighthouse) result object.
 * @returns {Object} An object containing:
 *   @property {number} percentScore - Score regarding JS duplication. 100% means no duplication for some reason.
 *   @property {number} needsAttention - Whether there is anything to address with JS duplication.
 */
export const duplicatedJavaScriptResults = (pageSpeedResults) => {
  const { score } = pageSpeedResults.lighthouseResult.audits['duplicated-javascript-insight'];

  const percentScore = score * 100;
  const needsAttention = score !== 1;

  return { percentScore, needsAttention };
}
