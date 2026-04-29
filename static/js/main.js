import { bannerList } from './banners.js';

// Background cache the other banners
async function preloadBannerImages() {
  if ('caches' in window) {
    try {
      const cache = await caches.open('banner-cache-v1');

      for (const url of bannerList) {
        const match = await cache.match(url);
        if (!match) {
          cache.add(url);
        }
      }
      return;
    } catch (err) {
      console.warn('Banner cache preload failed:', err);
    }
  }

  bannerList.forEach(url => {
    const img = new Image();
    img.src = url;
  });
}

window.addEventListener('load', () => {
  requestIdleCallback(preloadBannerImages);
});