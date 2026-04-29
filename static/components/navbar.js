import { bannerList } from '../js/banners.js';
import { logoList } from '../js/logos.js';

class NavbarComponent extends HTMLElement {
    constructor() {
        super();
    }

    async connectedCallback() {
        try {
            const response = await fetch("/static/components/navbar.html");
            if (!response.ok) throw new Error("Navbar not found");

            const html = await response.text();
            this.innerHTML = html;

            this.setNavbarAndLogo();
            this.addLogoDebugging();
            updateBackgroundBlur();
        }
        catch (err) {
            console.error("Navbar load error:", err);
            this.innerHTML = `<div style="color: red;">Failed to load navbar</div>`;
        }
    }

    setNavbarAndLogo() {
        const navbar = this.querySelector("#banner-background");
        const logo = this.querySelector("#logo");

        if (!navbar || !logo) return;

        const randomLogo = logoList[Math.floor(Math.random() * logoList.length)];
        logo.src = randomLogo;

        const randomBanner = bannerList[Math.floor(Math.random() * bannerList.length)];
        navbar.style.backgroundImage = `url("${randomBanner}")`;
    }

    addLogoDebugging() {
        this.addEventListener("wheel", (e) => {
            if (!e.shiftKey) return;

            const navbar = this.querySelector("#banner-background");
            const currentBanner = navbar.style.backgroundImage;
            const bannerNumber = currentBanner.replace(/.*?(\d+).*$/,"$1");
            
            const positiveScrolling = e.deltaY > 0;

            const annerNumber = positiveScrolling ? (+bannerNumber + 1) : (+bannerNumber - 1);

            const nextBannerNumber = annerNumber.toString().padStart(2,"0");
            const bannerExist = bannerList.filter(logo => logo.includes(nextBannerNumber)).length != 0;
            
            if(bannerExist)
            {
                const newBanner = currentBanner.replace(bannerNumber, nextBannerNumber);
                navbar.style.backgroundImage = newBanner;
                console.log("Current ba nner: " + newBanner);
            }
        }, true);
    }
}


customElements.define("navbar-component", NavbarComponent);

document.addEventListener('DOMContentLoaded', async () => {
    // Update blur
    window.addEventListener('resize', updateBackgroundBlur);
});

function updateBackgroundBlur() {
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

