// Service class to interact with the /directorylisting API 
// Used by the markdownloader for fetching what page to render
// Uses localStorage to cache the listing up to X minutes,
// to avoid making HTTP calls to /directorylisting API for every page opened 
export class DirectoryLister {

    // localStorage item to get
    static directoryListingName = "directorylisting";

    // Api URL
    static apiPath = "/api/directorylisting";

    // Cache lifetime (minutes)
    static timespanMinutes = 1;

    static async fetchPagePath(page) {
        let directoryInstant = await this.fetchDirectoryListing();
        return this.getQueriedItem(directoryInstant.directory, page);
    }

    static async fetchDirectoryListing() {
        const now = Date.now();

        let directoryListingName = this.getDirectoryListingIfExists();

        if (directoryListingName && now < directoryListingName.timestamp + this.timespanMinutes * 60000) {
            return directoryListingName;
        }

        console.log("DirectoryListing stale, rebuilding...")

        const response = await fetch(this.apiPath);
        if (!response.ok) throw new Error("Error while fetching directoryListingName tree");
        const content = await response.json();

        let directoryInstant = JSON.stringify(
            {
                "timestamp": Date.now().toString(),
                "directory": content
            });

        localStorage.setItem(this.directoryListingName, directoryInstant)
        return this.getDirectoryListingIfExists();
    }

    static getDirectoryListingIfExists() {
        const currentDirectoryListing = localStorage.getItem(this.directoryListingName)
        return JSON.parse(currentDirectoryListing);
    }

    static getQueriedItem(directory, page) {
        if (!directory) return;
        if (directory.type === "file" && (directory.name === page || directory.name === page + ".md"))
            return directory;

        for (const value in directory.children) {
            if (!Object.hasOwn(directory.children, value)) continue;
            const element = directory.children[value];
            const result = this.getQueriedItem(element, page)
            if (result) return result;
        }
    }
}