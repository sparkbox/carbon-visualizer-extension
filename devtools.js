chrome.devtools.panels.create(
  "Carbon Visualizer", // Panel title
  "./icons/icon48.png", // Path to panel's icon (you'll need to add this to your extension)
  "./Panel.html", // Path to panel's HTML content (you'll need to create this file)
  function (panel) {
    // Optional callback after panel is created
    console.log("Panel created successfully");
  },
);

// chrome.devtools.panels.elements.createSidebarPane(
//   "Carbon Visualizer",
//   function (sidebar) {
//     sidebar.setPage("Sidebar.html");
//     sidebar.setHeight("8ex");
//   },
// );

// chrome.devtools.inspectedWindow.eval(`console.log('wow');`);

// console.log("inspect the extension");
