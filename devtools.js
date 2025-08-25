// This file creates a new tab in the browser's developer tools

if (typeof chrome !== 'undefined' && chrome.devtools) {
  chrome.devtools.panels.create(
    "Carbon Visualizer", // Panel title
    "icons/icon16.png", // Panel icon
    "panel.html", // Panel HTML file
    function(panel) {
      if (chrome.runtime.lastError) {
        console.error('Error creating panel:', chrome.runtime.lastError);
      } else {
        console.log("Carbon Visualizer DevTools panel created successfully!");
        console.log('Panel object:', panel);
      }
    }
  );
} else {
  console.error('Chrome DevTools API not available');
  console.log('chrome object:', typeof chrome);
  console.log('chrome.devtools:', chrome?.devtools);
}
