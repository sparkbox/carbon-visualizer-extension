# Carbon Visualizer Browser Extension

A production-ready browser extension that will assess web page carbon emissions using Lighthouse and CO2.js APIs. The extension provides a clean, accessible side panel interface with smooth animations.

## Features

- **Modern Architecture**: Modular ES6 class-based design with clean separation of concerns
- **Cross-Browser Support**: Works seamlessly on Chrome and Firefox (Manifest V3)
- **Smooth Animations**: Professional slide-in/out panel with CSS transitions
- **Robust Toggle System**: Debounced clicks with concurrency protection
- **Accessible Design**: WCAG-compliant interface with proper focus management
- **Production Ready**: Clean code with no debug output and comprehensive error handling

## Current Status

✅ **Core Extension Complete**:
- ✅ Production-ready extension architecture
- ✅ Cross-browser compatibility (Chrome & Firefox)
- ✅ Smooth animated side panel
- ✅ Reliable toggle functionality
- ✅ Modular panel system ready for expansion
- ✅ Professional UI with responsive design
- 🔄 Lighthouse API integration (ready for implementation)
- 🔄 CO2.js API integration (ready for implementation)

## Installation for Development

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd carbon-visualizer-extension
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Build the Extension

```bash
npm run build
```

This will create browser-specific builds in the `build/` directory.

### 4. Load Extension

#### For Chrome (Development)
1. Build the extension: `npm run build`
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked"
5. Select the `build/chrome/` folder

#### For Firefox (Development)
1. Build the extension: `npm run build`
2. Open Firefox and navigate to `about:debugging`
3. Click "This Firefox" tab
4. Click "Load Temporary Add-on"
5. Select the `manifest.json` file from `build/firefox/` folder

### 5. Test the Extension

1. Navigate to any website (e.g., `https://example.com`)
2. Click the Carbon Visualizer extension icon in your toolbar
3. The welcome panel should slide in smoothly from the left
4. Click the extension icon again to close the panel
5. Click "Analyze This Page" button to see the placeholder functionality

## Building for Distribution

### Build for Both Browsers
```bash
npm run build
```

This creates:
- `build/chrome/` - Chrome extension files
- `build/firefox/` - Firefox extension files
- `build/carbon-visualizer-chrome.zip` - Chrome package
- `build/carbon-visualizer-firefox.zip` - Firefox package

## Project Structure

```
carbon-visualizer-extension/
├── manifest.json              # Unified manifest for both browsers (Manifest V3)
├── background.js              # Cross-browser background script with debouncing
├── content.js                 # Content script loader with duplicate prevention
├── build.js                   # Build script for both browsers
├── src/                       # Source code directory
│   ├── core/                  # Core extension classes
│   │   ├── ExtensionManager.js # Main extension manager with toggle logic
│   │   └── Panel.js           # Base panel class with animation support
│   ├── styles/                # Core styles
│   │   └── core.css           # Panel container and animation styles
│   └── panels/                # Individual panel implementations
│       └── welcome/           # Welcome panel
│           ├── welcome.html   # Welcome panel HTML structure
│           ├── welcome.css    # Welcome panel specific styles
│           └── welcome.js     # Welcome panel logic
├── icons/                     # Extension icons
│   ├── icon.svg              # Source SVG icon
│   ├── icon16.png            # 16x16 icon
│   ├── icon48.png            # 48x48 icon
│   └── icon128.png           # 128x128 icon
├── build/                     # Generated build files
│   ├── chrome/               # Chrome-specific build
│   ├── firefox/              # Firefox-specific build
│   ├── carbon-visualizer-chrome.zip   # Chrome package
│   └── carbon-visualizer-firefox.zip  # Firefox package
├── package.json               # Project configuration
└── README.md                  # This file
```

## Architecture Highlights

### **Modular Design**
- **ExtensionManager**: Central coordinator handling panel lifecycle and message routing
- **Panel**: Base class for all panel types with consistent loading and animation
- **Modular Panels**: Each panel (welcome, loading, results) has its own HTML/CSS/JS files

### **Robust Toggle System**
- **Debouncing**: Prevents rapid clicks (500ms ExtensionManager, 800ms background)
- **Concurrency Control**: Prevents multiple simultaneous toggle operations
- **State Management**: DOM-based detection with cleanup-first approach
- **Error Handling**: Graceful fallbacks with silent error handling

### **Cross-Browser Compatibility**
- **Unified Manifest**: Single Manifest V3 file for both Chrome and Firefox
- **Browser API Detection**: Automatic detection of `chrome` vs `browser` APIs
- **Dynamic Imports**: ES6 modules with CSP compliance
- **Build System**: Automated packaging for both browsers

## Next Steps

### Phase 1: Assessment Implementation
- [ ] Create loading panel for assessment progress
- [ ] Create results panel for displaying metrics
- [ ] Integrate Lighthouse API via serverless function
- [ ] Integrate CO2.js calculations
- [ ] Implement assessment workflow in ExtensionManager

### Phase 2: Enhanced Features
- [ ] Add detailed performance breakdowns
- [ ] Include carbon reduction recommendations
- [ ] Add historical tracking and comparisons
- [ ] Implement export functionality

### Phase 3: Advanced Features
- [ ] Add batch analysis for multiple pages
- [ ] Include industry benchmarks
- [ ] Add customizable scoring algorithms
- [ ] Implement team collaboration features

## API Integration (Future)

### Serverless Function Approach
The extension will use serverless functions (Vercel/Netlify) to handle API calls:
- **Lighthouse API**: Performance metrics via PageSpeed Insights API
- **CO2.js**: Carbon calculations using The Green Web Foundation's library
- **Benefits**: No API keys in client code, better security, rate limiting control

## Development

### Making Changes
1. Edit the relevant files:
   - `src/core/ExtensionManager.js` - Main extension logic and panel coordination
   - `src/core/Panel.js` - Base panel functionality and animations
   - `src/panels/welcome/` - Welcome panel HTML, CSS, and JavaScript
   - `src/styles/core.css` - Core panel styles and animations
   - `background.js` - Background script and message handling
   - `content.js` - Content script initialization
2. Run `npm run build` to rebuild the extension
3. Go to `chrome://extensions/` or `about:debugging` in Firefox
4. Click the refresh icon on your extension
5. Reload the web page you're testing on

### Adding New Panels
1. Create a new directory in `src/panels/` (e.g., `src/panels/results/`)
2. Add `results.html`, `results.css`, and `results.js` files
3. Update the `getPanelConfig()` method in `src/core/Panel.js`
4. Add panel logic to `src/core/ExtensionManager.js`

### Debugging
- **Production**: No console output (clean and professional)
- **Development**: Temporarily add console.log statements for debugging
- Use Chrome DevTools to inspect the extension and panel DOM
- Check the Extensions tab to view background script status

## Browser Compatibility

- ✅ Chrome (Manifest V3)
- ✅ Firefox (Manifest V3 - supported since Firefox 109)
- ✅ Edge (Manifest V3)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Resources

- [Chrome Extension Development Guide](https://developer.chrome.com/docs/extensions/)
- [Lighthouse API Documentation](https://developers.google.com/speed/docs/insights/v5/get-started)
- [CO2.js Documentation](https://developers.thegreenwebfoundation.org/co2js/overview/)
- [WAVE Accessibility Tool](https://wave.webaim.org/) (inspiration for UI design)

## Support

If you encounter any issues or have questions:
1. Check the browser console for error messages
2. Verify the extension is properly loaded in `chrome://extensions/`
3. Ensure you're testing on a valid HTTP/HTTPS website
4. Check that all required permissions are granted