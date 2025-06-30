# GitHub PR Preview

A browser extension that adds a quick preview button to GitHub Pull Request pages, making it easier to access deployment previews from various platforms.

## Features

- 🔍 Quick access to deployment previews directly from PR title
- 🎯 Supports multiple deployment platforms:
  - Netlify
  - Vercel
  - Cloudflare Pages
  - Zeabur
- 🎨 Native GitHub UI integration
- 📌 Works in both main title and sticky header
- 🚀 Lightweight and performant

## Screenshot

![Preview Button Demo](./screenshots/v1.png)

## Installation

### From Chrome Web Store

https://chromewebstore.google.com/detail/github-pr-preview/hbccekhbjloldkklgjmmbhonpodommmk

### From GitHub Release

1. Go to the [Releases](https://github.com/liruifengv/github-pr-preview/releases) page
2. Download the latest version:
   - For Chrome/Edge: `github-pr-preview-{version}-chrome.zip`
   - For Firefox: `github-pr-preview-{version}-firefox.zip`
3. Install in your browser:
   - Chrome/Edge:
     1. Open `chrome://extensions/`
     2. Enable "Developer mode"
     3. Click "Load unpacked"
     4. Select the extracted extension folder
   - Firefox:
     1. Open `about:debugging#/runtime/this-firefox`
     2. Click "Load Temporary Add-on"
     3. Select the downloaded ZIP file

### Manual Build

1. Clone this repository:
```bash
git clone https://github.com/liruifengv/github-pr-preview.git
```

2. Install dependencies:
```bash
pnpm install
```

3. Build the extension:
```bash
# For Chrome/Edge
pnpm build

# For Firefox
pnpm build:firefox
```

4. Load the extension in your browser (see instructions above)

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

## How it Works

The extension scans PR comments for deployment preview links from supported platforms. When a preview link is found, it adds a "Preview" button next to the PR title that opens the preview in a new tab.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see [LICENSE](./LICENSE) for details 
