import { DirectoryLister } from "./directoryLister.js";

const HEADING_IDS = [];

document.addEventListener("DOMContentLoaded", async () => {
    window.addEventListener("popstate", () => {
        loadMarkdownContent(window.location.pathname);
    });

    const location = window.location;
    await openExternalLinksInNewTab(location);
    initDarkMode();
    await loadMarkdownContent(location);
    initLazyImages();
    addInPageNavigation(location);
    navigateToInPageNavigation(location);
    updatePageTitleFromHeading();
    await addBreadCrumbs(location);
});

async function openExternalLinksInNewTab(location) {
    var content = document.getElementById("content");

    content.addEventListener("click", async (event) => {
        const link = event.target.closest("a");
        if (!link) return;

        event.preventDefault();
        if (link.id == "closeDetails") {
            link.parentElement.removeAttribute('open');
            link.parentElement.parentElement.removeAttribute('open');
            link.parentElement.parentElement.parentElement.removeAttribute('open');
            return;
        }

        const url = new URL(link.href);
        console.log("url");
        console.log(url);

        if (link.href.includes("guttespinat.no") == false && link.href.includes("localhost") == false && link.href.includes("127.0.0.1") == false && link.href.startsWith("javascript:") == false) {
            window.open(link.href, '_blank').focus();
        }
        else {
            window.location.assign(link.href);
            //   if (url.hash) {
            //       window.location = url;
            //       return;
            //   }
            //   event.preventDefault();
            //   await navigateTo(url.pathname);
        }
    });
}

async function navigateTo(path) {
    history.pushState({}, "", path);
    await loadMarkdownContent(location);
}

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
    else if (userUsesDarkMode && !darkModeDisabled) {
        button.click();
    }
    else if (userUsesDarkMode && darkModeNotEnabled) {
        button.click();
    }
    else if (!userUsesDarkMode && darkModeNotEnabled) {
        // Click twice to explicitly set darkmode=false
        button.click();
        button.click();
    }
}

async function loadMarkdownContent(location) {
    const contentElement = document.getElementById("markdown-content");
    if (!contentElement) return;

    console.log(location);

    const pathName = location.pathname;
    let page = pathName.startsWith("/") ? pathName.slice(1) : pathName;
    page = page.endsWith(".html") ? page.slice(0, -5) : page;
    page = page == "" ? "index" : page;
    page = page.split("/").at(-1)

    // console.log("page:");
    // console.log(page);

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
        contentElement.innerHTML = "<h1>404 Not found...</h1><p>Could not load markdown content. ¯\\_(ツ)_/¯</p><br><hr>" + err;
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
    const headings = Array.from(document.querySelectorAll(['h2', 'h3', 'h4', 'h5', 'h6'])).filter(hd => 
        ["details"].includes(hd.parentElement.localName) == false &&
        hd.parentElement.attributes.getNamedItem("popover") == null);

    // console.log(headings);

    headings.forEach(hd => {
        const value = "#" + hd.innerText.toLowerCase().replace(/[\W]/g, "")
        HEADING_IDS.push([value, hd]);

        const sup = document.createElement("sup");
        const anchor = document.createElement("a");

        anchor.href = value;
        anchor.innerText = "#";

        sup.appendChild(anchor);
        anchor.addEventListener("click", () => { scrollToItem(anchor); })
        hd.appendChild(sup);
    });
}

async function addBreadCrumbs(location) {
    const contentElement = document.getElementById("markdown-content");
    if (!contentElement) return;

    let relativeLocation = location.pathname;

    relativeLocation = relativeLocation.replace(/\..*$/, "").split("\/").filter(loc => loc != null && loc != "");
    relativeLocation = relativeLocation.length == 0 ? ['index'] : relativeLocation;

    console.log("Breadcrumb location");
    console.log(relativeLocation);

    var crumbs = document.createElement("div");
    crumbs.id = "breadcrumbs"

    for (let i = 0; i < relativeLocation.length; i++) {
        const loc = relativeLocation[i];
        var page = await DirectoryLister.fetchPagePath(loc);
        // console.log("page");
        // console.log(page);

        var absoluteLoc = page.url.replace("/static/markdown", "");
        console.log(absoluteLoc);

        var crumb = document.createElement("a");
        crumb.href = absoluteLoc.replace(".md", ".html");
        crumb.innerText = page.title;
        crumbs.appendChild(crumb);
    }

    contentElement.prepend(crumbs);
}

// If the page location includes a anchor-link to a section of the page, scroll to it
function navigateToInPageNavigation(location) {
    const pagePath = location.hash;
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

function scrollToItem(anchor) {
    const coords = anchor.getBoundingClientRect();
    const yAbs = coords.top + window.scrollY;

    window.scrollTo(0, yAbs);
}
