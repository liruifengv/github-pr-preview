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
  },
  SURGE: {
    domain: 'surge.sh',
    name: 'Surge'
  },
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
    let observer: MutationObserver | null = null;

    // 主要执行函数
    const addPreviewButton = () => {
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
      const allPlatformLinks: Array<{ url: string; platform: keyof typeof PREVIEW_PLATFORMS }> = [];
      
      comments.forEach((comment) => {
        const text = comment.textContent?.toLowerCase() || '';
        const links = comment.querySelectorAll('a');
        
        links.forEach((link) => {
          const href = link.href.toLowerCase();
          const hasPreviewKeyword = PREVIEW_KEYWORDS.some(keyword => text.includes(keyword));
          
          // 检查链接是否包含预览平台域名
          for (const [platform, config] of Object.entries(PREVIEW_PLATFORMS)) {
            if (href.includes(config.domain)) {
              const linkData = { 
                url: link.href,
                platform: platform as keyof typeof PREVIEW_PLATFORMS
              };
              
              // 优先添加有关键词的链接
              if (hasPreviewKeyword) {
                previewLinks.push(linkData);
              } else {
                // 记录所有平台链接作为备选
                allPlatformLinks.push(linkData);
              }
              break;
            }
          }
        });
      });
      
      // 如果没有找到带关键词的预览链接，则使用备选链接
      if (previewLinks.length === 0 && allPlatformLinks.length > 0) {
        previewLinks.push(...allPlatformLinks);
      }

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
    };

    // 等待目标元素出现
    const waitForElements = (timeout = 5000) => {
      return new Promise<boolean>((resolve) => {
        const startTime = Date.now();
        
        const check = () => {
          const titleElement = document.querySelector('.gh-header-title');
          const isPRPage = window.location.pathname.includes('/pull/');
          
          if (titleElement && isPRPage) {
            resolve(true);
          } else if (Date.now() - startTime > timeout) {
            resolve(false);
          } else {
            setTimeout(check, 100);
          }
        };
        check();
      });
    };

    // 清理现有的预览按钮
    const cleanupExistingButtons = () => {
      const existingButtons = document.querySelectorAll('[data-testid="preview-button"]');
      existingButtons.forEach(button => button.remove());
    };

    // 处理页面变化的主函数
    const handlePageChange = async () => {
      // 清理现有按钮
      debugger;
      cleanupExistingButtons();
      
      // 如果不是PR页面，直接返回
      if (!window.location.pathname.includes('/pull/')) {
        return;
      }

      // 等待页面元素加载
      const elementsReady = await waitForElements();
      if (!elementsReady) {
        return;
      }

      // 等待评论内容加载，多次尝试
      let attempts = 0;
      const maxAttempts = 10;
      
      const tryAddButton = () => {
        const comments = document.querySelectorAll('.comment-body');
        
        if (comments.length > 0 || attempts >= maxAttempts) {
          // 延迟执行，确保内容完全渲染
          setTimeout(addPreviewButton, 300);
        } else {
          attempts++;
          setTimeout(tryAddButton, 500);
        }
      };

      tryAddButton();
    };

    // 创建 MutationObserver 来监听动态内容变化
    const observeContentChanges = () => {
      if (observer) {
        observer.disconnect();
      }

      observer = new MutationObserver((mutations) => {
        let shouldCheck = false;
        
        mutations.forEach((mutation) => {
          // 检查是否有新的评论内容添加或页面结构变化
          if (mutation.type === 'childList') {
            const addedNodes = Array.from(mutation.addedNodes);
            if (addedNodes.some(node => {
              if (node.nodeType !== Node.ELEMENT_NODE) return false;
              const element = node as Element;
              
              // 检查是否是评论相关的内容
              return element.querySelector?.('.comment-body') ||
                     element.classList?.contains('comment-body') ||
                     element.querySelector?.('.gh-header-title') ||
                     element.classList?.contains('gh-header-title');
            })) {
              shouldCheck = true;
            }
          }
        });
        
        if (shouldCheck) {
          // 延迟执行，确保所有相关内容都加载完成
          setTimeout(addPreviewButton, 800);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    };

    // 初始化
    try {
      // 监听内容变化
      observeContentChanges();
      
      // 处理当前页面
      await handlePageChange();
      
    } catch (error) {
      console.error('Preview button initialization failed:', error);
    }
  },
});
