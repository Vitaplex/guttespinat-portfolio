import { bannerList } from '/js/banners.js';

document.addEventListener('DOMContentLoaded', async () => {
    // await Promise.all([
    //     initDarkMode(),
    // ]);

    // Make it so that external links are automatically opened in a new tab
    var content = document.getElementById("content");

    content.addEventListener("click", (event) => {
        const link = event.target.closest("a");
        if (!link) return;

        event.preventDefault();

        if (link.href.includes("guttespinat.no") == false && link.href.includes("localhost") == false) {
            window.open(link.href, '_blank').focus();
        }
        else {
            window.location.assign(link.href);
        }
    });

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

    if (screenWidth <= 2560) {
        banner.style.filter = 'blur(0px)';
    } else {
        const blur = Math.min((screenWidth - 2560) / 300, 10);
        banner.style.filter = `blur(${blur}px)`;
    }
}

// async function initDarkMode() {
//     const htmlElement = document.documentElement;
//     const switchElement = document.getElementById("darkModeSwitch");
//     if (!switchElement) return; // skip if switch isn't on this page

//     const currentTheme = localStorage.getItem("bsTheme") || "dark";
//     htmlElement.setAttribute("data-bs-theme", currentTheme);
//     switchElement.checked = currentTheme === "dark";

//     switchElement.addEventListener("change", () => {
//         const newTheme = switchElement.checked ? "dark" : "light";
//         htmlElement.setAttribute("data-bs-theme", newTheme);
//         localStorage.setItem("bsTheme", newTheme);
//     });

// }

