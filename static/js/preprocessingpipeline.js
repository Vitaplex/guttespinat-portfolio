import { DirectoryLister } from "./directoryLister.js";

const HEADING_IDS = [];

document.addEventListener("DOMContentLoaded", async () => {
    const location = window.location.href;
    initDarkMode();
    await loadMarkdownContent(location);
    initLazyImages();
    updatePageTitleFromHeading();
    addInPageNavigation(location);
    await addBreadCrumbs(location);
    navigateToInPageNavigation(location);
});

async function initDarkMode() {
    var button = document.createElement("button");
    button.id = "darkmode-button";
    button.innerText = "💡";
    
    button.addEventListener("click", () => {
        const dark = document.documentElement.classList.toggle("dark");
        document.cookie = dark
        ? "darkmode=true; max-age=31536000; path=/;"
        : "darkmode=false; max-age=31536000; path=/;";
        
        if (dark) {
            button.innerText = "🌙";
        }
        else {
            button.innerText = "💡";
        }
    });
    
    document.body.appendChild(button);
    
    const darkModeEnabled = document.cookie.includes(`darkmode=true`);
    const darkModeDisabled = document.cookie.includes(`darkmode=false`);

    // First load behavior, neither true nor false (likely empty string: "")
    const darkModeNotEnabled = !darkModeEnabled && !darkModeDisabled;
    const userUsesDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (darkModeEnabled) {
        button.click();
    }
    else if(userUsesDarkMode && !darkModeDisabled) {
        button.click();
    }
    else if(userUsesDarkMode && darkModeNotEnabled) {
        button.click();
    }
    else if(!userUsesDarkMode && darkModeNotEnabled) {
        // Click twice to explicitly set darkmode=false
        button.click();
        button.click();
    }
}

async function loadMarkdownContent(location) {
    const contentElement = document.getElementById("markdown-content");
    if (!contentElement) return;

    let page = location.split("/").at(-1);
    page = page.trim().trimStart("#").replace(".md", "").replace("/", "").replace(".html", "");
    page = page.split("#").at(0);
    page = page == "" ? "index" : page;


    try {
        contentElement.innerHTML = "<center><div class=\"markdownloading\"><br><sup>Markdownloading...</sup></div></center>";
        // Get the path from directorylisting API
        const directoryListing = await DirectoryLister.fetchPagePath(page);

        const response = await fetch(directoryListing.url);
        if (!response.ok) throw new Error("Markdown file not found");
        const md = await response.text();
        contentElement.innerHTML = marked.parse(md);

        const lastModified = response.headers.get("Last-Modified");

        if (lastModified) {
            const date = new Date(lastModified);
            const formatted = date.toLocaleString();

            const info = document.createElement("p");
            info.classList.add("last-modified");
            info.textContent = `Last updated: ${formatted}`;
            contentElement.appendChild(info);
        }
    } catch (err) {
        console.error(err);
        contentElement.innerHTML = "<h1>404 Not found...</h1><p>Could not load markdown content. ¯\\_(ツ)_/¯</p>";
    }
}

function initLazyImages(root = document) {

    const containersToLazyLoad = root.querySelectorAll("details, div[popover]");

    containersToLazyLoad.forEach(container => {
        container.querySelectorAll("img[src]").forEach(img => {
            if (img.closest("summary")) return;

            img.dataset.src = img.src;
            img.removeAttribute("src");
        });
    });

    document.querySelectorAll("details").forEach(details => {
        if (details.dataset.lazyInit) return;
        details.dataset.lazyInit = "true";

        details.addEventListener("toggle", () => {
            if (!details.open) return;

            details.querySelectorAll("img[data-src]").forEach(img => {
                img.src = img.dataset.src;
                img.loading = "lazy";
                img.removeAttribute("data-src");
            });
        });
    });

    document.querySelectorAll("div[popover]").forEach(popover => {
        if (popover.dataset.lazyInit) return;
        popover.dataset.lazyInit = "true";

        popover.addEventListener("beforetoggle", e => {
            if (e.newState !== "open") return;

            popover.querySelectorAll("img[data-src]").forEach(img => {
                img.src = img.dataset.src;
                img.loading = "lazy";
                img.removeAttribute("data-src");
            });
        });
    });
}


function addInPageNavigation() {
    const headings = Array.from(document.querySelectorAll(['h2','h3','h4','h5','h6'])).filter(hd => ["blockquote","details"].includes(hd.parentElement.localName) == false);
    // console.log(headings);
    headings.forEach(hd => {
        const value = "#"+ hd.innerText.toLowerCase().replace(/[\W]/g,"")
        HEADING_IDS.push([value, hd]);

        const sup = document.createElement("sup");
        const anchor = document.createElement("a");
        
        anchor.href = value;
        anchor.innerText = "#";
        
        sup.appendChild(anchor);
        anchor.addEventListener("click", () => {scrollToItem(anchor);})
        hd.appendChild(sup);
    });
}

async function addBreadCrumbs(location){
    const contentElement = document.getElementById("markdown-content");
    if (!contentElement) return;

    // Get the path after root domain (inmind/)
    let relativeLocation = location.split("guttespinat.no/").at(1).split("#");
    
    relativeLocation = relativeLocation.at(0).replace(/\..*$/,"").split("\/").filter(loc => loc != null && loc != "");
    relativeLocation = relativeLocation.length == 0 ? ['index'] : relativeLocation;

    console.log(relativeLocation);

    relativeLocation.forEach(async loc => {
        var crumb = document.createElement("a");
        var page = await DirectoryLister.fetchPagePath(loc);

        contentElement.insertBefore(crumb);
    });
}

// If the page location includes a anchor-link to a section of the page, scroll to 
function navigateToInPageNavigation(location) {
    const pagePath = location.split("#").at(1);
    if (!pagePath) return;

    const heading = HEADING_IDS.find(id => id.at(0) == pagePath || id.at(0) == `#${pagePath}`).at(1);
    scrollToItem(heading);
}

function updatePageTitleFromHeading() {
    const firstHeading = document.querySelector('h1');
    if (firstHeading && firstHeading.textContent.trim() !== '') {
        document.title = firstHeading.textContent.trim() + " | Guttespinat.no";
    }
}

function scrollToItem(anchor){
    const coords = anchor.getBoundingClientRect();
    const yAbs = coords.top + window.scrollY;

    window.scrollTo(0, yAbs);
}
