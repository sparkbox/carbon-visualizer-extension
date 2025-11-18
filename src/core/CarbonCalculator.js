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
  // this appears to be the same number as totalByteWeight:
  // const totalByteWeightSummed = pageSpeedResults.lighthouseResult.audits['network-requests'].details.items.reduce((total, item) => total + item.transferSize, 0);

  // OneByte model
  // https://developers.thegreenwebfoundation.org/co2js/models/#using-the-onebyte-model
  const perByte = new co2({ model: "1byte" });
  const emissionsOneByte = perByte.perByte(totalByteWeight);

  // Sustainable Web Design (SWD) model
  // https://developers.thegreenwebfoundation.org/co2js/models/#using-the-sustainable-web-design-model-default-v0110
  const swd = new co2({ model: "swd" });
  const emissionsSWD = swd.perVisit(totalByteWeight);

  return { emissionsOneByte, emissionsSWD };
}

// TODO: The code below is for testing purposes only.
// It should be removed once it's able to be integrated with https://sparkbox.atlassian.net/browse/BLDL-9
// tempdata.json should also be removed.
(async () => {
  const pageSpeedResults = (await import("./tempdata.json", { with: { type: "json" } })).default;
  const results = calculateEmissionsFromPageSpeedResults(pageSpeedResults)
  console.log("Emissions Calculation Results:", results);
})();

