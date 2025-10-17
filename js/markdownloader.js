document.addEventListener("DOMContentLoaded", () => {
    const pageFromHash = window.location.hash.replace("#", "") || "index";
    loadMarkdownContent(pageFromHash);

    document.body.addEventListener("click", (e) => {
        const link = e.target.closest("a");
        if (!link) return;
        const href = link.getAttribute("href");
        if (!href || href.startsWith("http")) return;

        e.preventDefault();
        const page = href.replace(".html", "");
        window.location.hash = page; // navigate
    });

    window.addEventListener("hashchange", () => {
        const page = window.location.hash.replace("#", "") || "index";
        loadMarkdownContent(page);
    });
});

async function loadMarkdownContent(page) {
    const contentElement = document.getElementById("markdown-content");
    if (!contentElement) return;

    page = page.trim().replace(".md", "").trimStart("#");
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
