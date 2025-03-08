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

## Installation

### From Chrome Web Store

Coming soon...

### Manual Installation

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
pnpm build
```

4. Load the extension in Chrome:
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `.output/chrome-mv3` directory

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