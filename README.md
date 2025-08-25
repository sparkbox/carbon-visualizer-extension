# Carbon Visualizer Extension

A browser extension that assesses web page carbon emissions using the Lighthouse API and CO2.js API.

## **Project Structure**
```
carbon-visualizer-extension/
├── manifest.json              # Chrome/Edge manifest (Manifest V3)
├── manifest-firefox.json      # Firefox manifest (Manifest V2)
├── devtools.html              # DevTools page entry point
├── devtools.js                # Creates the DevTools tab
├── panel.html                 # Panel UI (already implemented)
├── panel.js                   # Panel logic
├── icons/                     # Extension icons
│   ├── icon16.png            # Toolbar icon
│   ├── icon48.png            # Extension management
│   └── icon128.png           # Web Store icon
└── README.md                  # This file
```

##  **Getting Started**

### **1. Load the Extension**

#### **Chrome/Edge:**
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (top right toggle)
3. Click "Load unpacked"
4. Select this project folder

#### **Firefox:**
1. Open Firefox and go to `about:debugging`
2. Click "This Firefox" tab
3. Click "Load Temporary Add-on"
4. Select `manifest-firefox.json`

### **2. Test the Extension**
1. Open any website
2. Right-click → "Inspect" (opens DevTools)
3. Look for **"Carbon Visualizer"** tab
4. Click the tab to see your panel

### **Technical References**
- [Chrome DevTools Extensions](https://developer.chrome.com/docs/extensions/mv3/devtools/)
- [Firefox DevTools Extensions](https://extensionworkshop.com/documentation/develop/developer-tools/)
- [Cross-browser Extension Development](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Porting_a_Google_Chrome_extension)
