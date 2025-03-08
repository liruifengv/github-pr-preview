import { defineContentScript } from 'wxt/sandbox';

// 预览平台配置
const PREVIEW_PLATFORMS = {
  NETLIFY: {
    domain: 'netlify.app',
    name: 'Netlify'
  },
  VERCEL: {
    domain: 'vercel.app',
    name: 'Vercel'
  },
  CLOUDFLARE: {
    domain: 'pages.dev',
    name: 'Cloudflare'
  },
  ZEABUR: {
    domain: 'zeabur.app',
    name: 'Zeabur'
  }
} as const;

// 预览相关的关键词
const PREVIEW_KEYWORDS = [
  'deploy preview',
  'preview deployment',
  'preview'
] as const;

export default defineContentScript({
  matches: ['https://github.com/*'],
  async main() {
    // 只在 PR 页面执行
    if (!window.location.pathname.includes('/pull/')) {
      return;
    }

    // 检查是否已经添加了预览按钮
    const existingPreviewButton = document.querySelector('[data-testid="preview-button"]');
    if (existingPreviewButton) {
      return;
    }

    // 查找预览链接
    const comments = document.querySelectorAll('.comment-body');
    const previewLinks: Array<{ url: string; platform: keyof typeof PREVIEW_PLATFORMS }> = [];
    
    comments.forEach((comment) => {
      const text = comment.textContent?.toLowerCase() || '';
      const links = comment.querySelectorAll('a');
      
      links.forEach((link) => {
        const href = link.href.toLowerCase();
        const hasPreviewKeyword = PREVIEW_KEYWORDS.some(keyword => text.includes(keyword));
        
        if (hasPreviewKeyword) {
          for (const [platform, config] of Object.entries(PREVIEW_PLATFORMS)) {
            if (href.includes(config.domain)) {
              previewLinks.push({ 
                url: link.href,
                platform: platform as keyof typeof PREVIEW_PLATFORMS
              });
              break;
            }
          }
        }
      });
    });

    if (previewLinks.length === 0) {
      return;
    }

    // 创建预览按钮的函数
    const createPreviewButton = () => {
      const previewButton = document.createElement('button');
      previewButton.className = 'btn-primary btn-sm rounded-2';
      previewButton.dataset.testid = 'preview-button';
      
      const firstPreview = previewLinks[0];
      const platform = PREVIEW_PLATFORMS[firstPreview.platform];
      
      previewButton.textContent = 'Preview';
      previewButton.style.marginLeft = '8px';
      previewButton.title = `Open ${platform.name} Preview`;

      previewButton.addEventListener('click', () => {
        window.open(firstPreview.url, '_blank');
      });

      return previewButton;
    };

    // 添加按钮到主标题和 sticky 标题
    const titleElement = document.querySelector('.gh-header-title');
    const stickyElement = document.querySelector('.sticky-content');
    
    if (titleElement) {
      titleElement.appendChild(createPreviewButton());
    }
    
    if (stickyElement) {
      // 创建一个 flex 容器来包装原有内容和按钮
      const flexContainer = document.createElement('div');
      flexContainer.style.display = 'flex';
      flexContainer.style.alignItems = 'center';
      flexContainer.style.gap = '8px';
      
      // 移动原有内容到 flex 容器中
      while (stickyElement.firstChild) {
        flexContainer.appendChild(stickyElement.firstChild);
      }
      
      // 添加预览按钮
      flexContainer.appendChild(createPreviewButton());
      
      // 将 flex 容器添加到 sticky-content 中
      stickyElement.appendChild(flexContainer);
    }
  },
});
