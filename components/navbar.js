class NavbarComponent extends HTMLElement {
    constructor() {
        super();
    }

    async connectedCallback() {
        try {
            const response = await fetch("/components/navbar.html");
            if (!response.ok) throw new Error("Navbar not found");

            const html = await response.text();
            this.innerHTML = html;

            const navbar = this.querySelector("#banner-logo");
            if (!navbar) return;

            const backgrounds = [
                "/media/banner/banner01.jpg",
                "/media/banner/banner02.jpg",
                "/media/banner/banner03.jpg",
                "/media/banner/banner04.jpg",
                "/media/banner/banner05.jpg",
            ];

            const randomBanner = backgrounds[Math.floor(Math.random() * backgrounds.length)];
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


async function setRandomBackground() {
}