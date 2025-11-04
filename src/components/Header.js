const HEADER_LOGO = `
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Leaf */}
    <path
      d="M16 4C20 4 24 7 26 12C24 18 20 22 16 24C12 22 8 18 6 12C8 7 12 4 16 4Z"
      fill="rgb(34, 197, 94)"
      className="drop-shadow-sm"
    />
    {/* Leaf vein */}
    <path
      d="M16 6L16 22"
      stroke="rgb(21, 128, 61)"
      strokeWidth="1"
      className="opacity-60"
    />
    {/* Small bar chart at bottom */}
    <g transform="translate(10, 25)">
      <rect x="0" y="2" width="2" height="4" fill="rgb(34, 197, 94)" />
      <rect x="3" y="0" width="2" height="6" fill="rgb(234, 179, 8)" />
      <rect x="6" y="1" width="2" height="5" fill="rgb(239, 68, 68)" />
      <rect x="9" y="3" width="2" height="3" fill="rgb(34, 197, 94)" />
    </g>
  </svg>
`;

export const createHeader = () => {
  const header = document.createElement("header");
  header.classList.add("cv-header");

  header.innerHTML = HEADER_LOGO;
  const logo = header.querySelector("svg");
  logo.classList.add("cv-header__logo");

  const title = document.createElement("h1");
  title.classList.add("cv-header__title");
  title.innerText = "Carbon Visualizer";
  header.append(title);

  return header;
}
