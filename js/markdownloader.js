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
    
    const markdownPath = `../pages/markdown/${page}.md`;

    try {
        const response = await fetch(markdownPath);
        if (!response.ok) throw new Error("Markdown file not found");
        const md = await response.text();
        contentElement.innerHTML = marked.parse(md);
        window.scrollTo(0, 0);
    } catch (err) {
        console.error(err);
        contentElement.innerHTML = "<p>Could not load content.</p>";
    }
}
