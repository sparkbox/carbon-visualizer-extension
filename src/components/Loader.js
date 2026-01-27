export const createLoader = () => {
  const container = document.createElement('div');
  container.classList.add('cv-loader');

  const label = document.createElement('label');
  label.classList.add('cv-loader__label');
  label.innerHTML = "Calculation in progress...";
  label.setAttribute('for', 'cv-progress');

  const loader = document.createElement('progress');
  loader.classList.add('cv-loader__progress');
  loader.setAttribute('id', 'cv-progress');

  container.append(label, loader);

  return container;
}
