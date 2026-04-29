>> **Page status**: Under construction ⚠  
This page is still being written!
# Dissecting guttespinat.no

[Go back](#back)

![](/static/media/images/fw_hr05.jpg)

## The "Stack"
The guttespinat website consists of a Python-based webserver, serving a html file with markdown content being dynamically rendered in run-time as a page is loaded or a local link is clicked. This is common SPA (Single Page Applicaiton)-behavior.
There are 4 main components: 
1. **Python** - web server
2. **HTML** - base "frame"
3. **Markdown** - writing the page content.
4. **JavaScript** - Loading of markdown, darkmode, lazy loading etc.

The only frameworks used is [marked.js](https://marked.js.org/) for rendering the markdown and bootstrap.cs for quality of life stuff.  
When a HTML-file is opened in the browser, JavaScript code runs to fetch the Markdown page. More on that further down.  
The "base" HTML-file looks like this, no text, no nothing, just a frame being populated with corresponding markdown file content.
```html
<body>
    <navbar-component></navbar-component>
    <main class="container pt-3">
        <div id="content" class="row">
            <div class="mx-auto" id="markdown-content"></div>
        </div>
    </main>
    <footer-component></footer-component>
</body>
```

## The CSS
The markdown elements are being transformed and rendered as HTML. This means hyperlinks, which in markdown normally look like `[Link](http://website.com)` gets transformed into HTML (`<a href="http://website.com">Link</a>`). Since it's HTML, CSS styling applies to it aswell.  

One of the funky things that happen with the CSS; you might have seen different colored blockquotes around the website, maybe even this page contains it.
To achieve the different colors, nested blockquotes are used in conjunction with CSS to hide the "parent"-blockquotes, and give the topmost one a different color, based on the `:has()` relational selector.  

Since pages are written in Markdown, and Markdown supports nested blockquotes, making different colored blockquotes is very simple. I Markdown, blockquotes are rendered from the **less-than** symbol (`>`), followed by some text
> base level blockquote  

>> second layer blockquote  

>>> third layer

>>>> fourth layer!!  

In Markdown, it looks like this:

`> base level blockquote`  
`>> second layer blockquote`  
`>>> third layer`  
`>>>> fourth layer!!`  

Then, from the CSS perspective - base `blockquote` has a color, then `blockquote:has(blockquote)` hides the base, then `blockquote blockquote` is the next layer, and the next color. Simplified, the css looks like this:

```css
blockquote {
  background-color: var(--gspn-primary-light);
}

blockquote:has(blockquote) {
  background-color: unset;
}

blockquote blockquote {
  background-color: var(--gspn-blockquote-bg-2);
}

/* ..........
Repeat this for how many "layers/colors" of blockquote you want*/
```

## Loading Content
Pages are written in Markdown, then loaded dynamically based on the name of the HTML file.  
As the HTML file is loaded, JavaScript fetches the appropriate Markdown-file from a cached **DirectoryListing**
This is usually quite fast, although an animation is playing as the page is loading. If you reload this page very fast, you might be able to spot it.  
Pictures inside `<details>`-elements are also lazy loaded, since the main homepage of guttespinat.no contains alot! of pictures!


## The Directory Listing
The **DirectoryListing** is a JSON object with all the paths of all the files in the `markdown`-folder in the solution source. The listing is fetched from the  `/api/directorylisting` -endpoint ([See it here](/api/directorylisting)).  
This is then cached in the browsers **LocalStorage**. There is a `DirectoryLister`-class which handles all the updating and fetching of the entire listing aswell as fetching a single item.

> Before this, pages used to be loaded dynamically, but without the code having any context of where the file was. Everything was assumed to be under the `/markdown`-folder, with zero hierarchy (For example: `index.md` was assumed to be under `markdown/index.md`) making the initial folder structure very messy!

