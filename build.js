// // build.js
// import fs from "fs";
// import path from "path";
// import { marked } from "marked";

// const template = fs.readFileSync("template.html", "utf8");
// const srcDir = "./pages";
// const distDir = "./dist";

// if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });

// // Copy static assets
// for (const dir of ["css", "js", "media", "components"]) {
//   if (fs.existsSync(dir)) {
//     fs.cpSync(dir, path.join(distDir, dir), { recursive: true });
//   }
// }

// for (const file of fs.readdirSync(srcDir)) {
//   if (!file.endsWith(".md")) continue;

//   const markdown = fs.readFileSync(path.join(srcDir, file), "utf8");
//   const htmlContent = marked.parse(markdown);
//   const page = template.replace("{{content}}", htmlContent);
//   const outputFile = path.join(distDir, file.replace(".md", ".html"));

//   fs.writeFileSync(outputFile, page);
//   console.log(`✅ Built: ${outputFile}`);
// }
