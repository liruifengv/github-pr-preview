import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: 'chrome',
  manifest: {
    name: 'GitHub PR Preview',
    description: 'Quick access to deployment previews in GitHub Pull Requests',
    permissions: [],
    host_permissions: ['https://github.com/*'],
  },
  outDir: "dist",
  modules: ['@wxt-dev/auto-icons'],
  autoIcons: {
    // 禁用开发环境下的灰度模式
    grayscaleOnDevelopment: false
  }
});
