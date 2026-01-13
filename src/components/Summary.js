export const createSummary = (data = {}) => {
  const {
    co2PerVisit = '0g',
    comparison = 'No data yet',
    globalAverage = '0g'
  } = data;

  const summary = document.createElement("div");
  summary.classList.add("cv-summary");

  summary.innerHTML = `
    <div class="cv-summary__grid">
      <div class="cv-summary__totals cv-summary__totals--userSite">
          <div class="cv-summary__totals--content heading-xl">
            ${co2PerVisit} CO₂
          </div>
          <div class="cv-summary__totals--content body-md">
            per page visit
          </div>
      </div>
      <div class="cv-summary__totals cv-summary__totals--comparison">
        <div class="cv-summary__totals--content heading-md">
          ${comparison}
        </div>
        <div class="cv-summary__totals--content body-sm">
          Global average: <span class="inject-span">${globalAverage}</span> CO<sub>2</sub>
        </div>
      </div>
    </div>
  `;

  return summary;
}
