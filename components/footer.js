import { footerList } from '/js/footers.js';

class FooterComponent extends HTMLElement {
    constructor() {
        super();
    }
    
    async connectedCallback() {
        try {
            const response = await fetch("/components/footer.html");
            if (!response.ok) throw new Error("Footer not found");

            const html = await response.text();
            this.innerHTML = html;

            const navbar = this.querySelector("#footer-background");
            if (!navbar) return;


            const randomFooter = footerList[Math.floor(Math.random() * footerList.length)];
            navbar.style.backgroundImage = `url("${randomFooter}")`;
            updateBackgroundBlur();
        }
        catch (err) {
            console.error("Footer load error:", err);
            this.innerHTML = `<div style="color: red;">Failed to load footer</div>`;
        }
    }
}

customElements.define("footer-component", FooterComponent);