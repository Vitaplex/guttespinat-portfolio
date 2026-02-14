import { footerList } from '../js/footers.js';

class FooterComponent extends HTMLElement {
    constructor() {
        super();
        this.isExpanded = false;
        this.lastScrollY = window.scrollY;
    }

    async connectedCallback() {
        try {
            const response = await fetch("/static/components/footer.html");
            if (!response.ok) throw new Error("Footer not found");

            const html = await response.text();
            this.innerHTML = html;

            const footer = this.querySelector("footer");
            const footerBg = this.querySelector("#footer-background");
            if (!footer || !footerBg) return;

            const randomFooter = footerList[Math.floor(Math.random() * footerList.length)];
            footerBg.style.backgroundImage = `url("${randomFooter}")`;

            footer.addEventListener("click", () => {
                this.toggleExpand();
            });

            document.addEventListener("keydown", e => {
                if (e.key === "Escape" && this.isExpanded) this.toggleExpand();
            });

            window.addEventListener("scroll", () => this.onScroll());
        }
        catch (err) {
            console.error("Footer load error:", err);
            this.innerHTML = `<div style="color: red;">Failed to load footer</div>`;
        }
    }

    onScroll() {
        const currentScrollY = window.scrollY;
        if (footer.classList.contains("expanded") && currentScrollY < this.lastScrollY) {
            footer.classList.toggle("expanded");
        }
        this.lastScrollY = currentScrollY;
    }

    toggleExpand(forceState) {
        this.isExpanded = forceState !== undefined ? forceState : !this.isExpanded;
        this.querySelector("footer").classList.toggle("expanded", this.isExpanded);
        
        if (this.isExpanded) {
            setTimeout(() => {
                window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: "smooth"
                });
            }, 800);
        }
    }
}

customElements.define("footer-component", FooterComponent);