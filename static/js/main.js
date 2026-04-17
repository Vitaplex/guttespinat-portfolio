import { bannerList } from './banners.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Update blur
  window.addEventListener('resize', updateBackgroundBlur);
});


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


export function updateBackgroundBlur() {
  const banner = document.getElementById('banner-background');
  if (!banner) return;

  const screenWidth = window.innerWidth;

  if (screenWidth <= 1920) {
    banner.style.filter = 'blur(0px)';
  } else {
    const maxBlurAmount = 3;
    const blur = Math.min((screenWidth - 1920) / 300, maxBlurAmount);
    banner.style.filter = `blur(${blur}px)`;
  }
}

