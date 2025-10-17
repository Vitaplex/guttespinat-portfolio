document.addEventListener('DOMContentLoaded', async () => {
    await Promise.all([
        initDarkMode(),
    ]);
});

async function initDarkMode() {
    const htmlElement = document.documentElement;
    const switchElement = document.getElementById("darkModeSwitch");
    if (!switchElement) return; // skip if switch isn't on this page

    const currentTheme = localStorage.getItem("bsTheme") || "dark";
    htmlElement.setAttribute("data-bs-theme", currentTheme);
    switchElement.checked = currentTheme === "dark";

    switchElement.addEventListener("change", () => {
        const newTheme = switchElement.checked ? "dark" : "light";
        htmlElement.setAttribute("data-bs-theme", newTheme);
        localStorage.setItem("bsTheme", newTheme);
    });

}

