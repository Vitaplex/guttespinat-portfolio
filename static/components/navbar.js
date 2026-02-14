import { bannerList } from '../js/banners.js';
import { logoList } from '../js/logos.js';
import { updateBackgroundBlur } from '../js/main.js';

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

            const navbar = this.querySelector("#banner-background");
            const logo = this.querySelector("#logo");

            if (!navbar || !logo) return;

            const randomLogo = logoList[Math.floor(Math.random() * logoList.length)];
            logo.src = randomLogo;

            const randomBanner = bannerList[Math.floor(Math.random() * bannerList.length)];
            navbar.style.backgroundImage = `url("${randomBanner}")`;
            updateBackgroundBlur();
        }
        catch (err) {
            console.error("Navbar load error:", err);
            this.innerHTML = `<div style="color: red;">Failed to load navbar</div>`;
        }
    }
}

customElements.define("navbar-component", NavbarComponent);