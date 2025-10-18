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

            const navbar = this.querySelector("#navbar");
            if (!navbar) return;

            const backgrounds = [
                "/media/banner/banner01.jpg",
                "/media/banner/banner02.jpg",
                "/media/banner/banner03.jpg",
                "/media/banner/banner04.jpg",
            ];

            const randomBanner = backgrounds[Math.floor(Math.random() * backgrounds.length)];
            navbar.style.backgroundImage = `url("${randomBanner}")`;

            if (window.bootstrap === undefined) {
                const script = document.createElement("script");
                script.src = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js";
                document.body.appendChild(script);
            }
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