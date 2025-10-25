document.addEventListener("DOMContentLoaded", () => {
    const location = window.location.href;
    loadMarkdownContent(location);
});

async function loadMarkdownContent(page) {
    
    const contentElement = document.getElementById("markdown-content");
    if (!contentElement) return;
    
    page = page.split("/").at(-1);
    page = page == "" ? "index" : page;
    page = page.trim().trimStart("#").replace(".md", "").replace("/", "").replace(".html", "");
    
    const markdownPath = `/markdown/${page}.md`;

    try {
        const response = await fetch(markdownPath);
        if (!response.ok) throw new Error("Markdown file not found");
        const md = await response.text();
        contentElement.innerHTML = marked.parse(md);
        window.scrollTo(0, 0);
        updatePageTitleFromHeading();
    } catch (err) {
        console.error(err);
        contentElement.innerHTML = "<h1>404 Not found ¯\_(ツ)_/¯</h1><p>Could not load content.</p>";
        mermaid.init(undefined, container.querySelectorAll('.mermaid'));

    }
}

function updatePageTitleFromHeading() {
    const firstHeading = document.querySelector('h1');
    if (firstHeading && firstHeading.textContent.trim() !== '') {
        document.title = firstHeading.textContent.trim() + " | Guttespinat.no";
    }
}
