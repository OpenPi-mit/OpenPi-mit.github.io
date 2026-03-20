
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BLOG_DIR = path.join(process.cwd(), "content/blogs");
const OUT_DIR = path.join(process.cwd(), "generated/blogs");
const PUBLIC_ASSETS_DIR = path.join(process.cwd(), "public/blog-assets");

console.log("Building blogs...");
console.log(`Source: ${BLOG_DIR}`);
console.log(`Output: ${OUT_DIR}`);

if (!fs.existsSync(BLOG_DIR)) {
    console.log("No content/blogs directory found. Skipping blog build.");
    process.exit(0);
}

fs.mkdirSync(OUT_DIR, { recursive: true });

const blogs = fs.readdirSync(BLOG_DIR);
const metadata = [];

function extractLatexMetadata(texContent) {
    const titleMatch = texContent.match(/\\title\{([^}]+)\}/);
    const authorMatch = texContent.match(/\\author\{([^}]+)\}/);
    const dateMatch = texContent.match(/\\date\{([^}]+)\}/);

    return {
        title: titleMatch ? titleMatch[1] : "Untitled",
        author: authorMatch ? authorMatch[1] : "Unknown",
        date: dateMatch ? dateMatch[1] : new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
}

// Extract TikZ figures from LaTeX
function extractTikzFigures(texContent) {
    const figures = [];
    const tikzRegex = /\\begin\{tikzpicture\}[\s\S]*?\\end\{tikzpicture\}/g;
    let match;
    let figureId = 0;

    while ((match = tikzRegex.exec(texContent)) !== null) {
        figures.push({
            id: `fig-${figureId++}`,
            code: match[0]
        });
    }

    return figures;
}

// Compile a TikZ figure to SVG using latex -> dvi -> svg pipeline
function compileTikzToSvg(tikzCode, outputPath) {
    const tempDir = path.join(OUT_DIR, 'temp-tikz');
    fs.mkdirSync(tempDir, { recursive: true });

    const baseName = path.basename(outputPath, '.svg');
    const texFile = path.join(tempDir, `${baseName}.tex`);
    const dviFile = path.join(tempDir, `${baseName}.dvi`);

    const standaloneContent = `\\documentclass[tikz,border=2pt]{standalone}
\\usepackage{amsmath,amssymb}
\\usepackage{tikz}
\\usetikzlibrary{positioning, arrows.meta, calc, shapes.geometric}

\\begin{document}
${tikzCode}
\\end{document}`;

    try {
        fs.writeFileSync(texFile, standaloneContent);

        // Compile with latex (not pdflatex) to get DVI
        execSync(`latex -interaction=nonstopmode -output-directory="${tempDir}" "${texFile}"`,
            { stdio: 'pipe' });

        // Check if DVI was created
        if (!fs.existsSync(dviFile)) {
            return false;
        }

        // Convert DVI to SVG
        execSync(`dvisvgm --exact --output="${outputPath}" "${dviFile}"`,
            { stdio: 'pipe' });

        return true;
    } catch (error) {
        return false;
    }
}

for (const slug of blogs) {
    const blogPath = path.join(BLOG_DIR, slug);
    if (!fs.statSync(blogPath).isDirectory()) continue;

    // Copy assets to public directory
    const assetsDir = path.join(blogPath, "assets");
    if (fs.existsSync(assetsDir)) {
        const destDir = path.join(PUBLIC_ASSETS_DIR, slug, "assets");
        fs.mkdirSync(destDir, { recursive: true });

        // Recursive copy
        // fs.cpSync requires Node.js 16.7.0+
        fs.cpSync(assetsDir, destDir, { recursive: true });
        console.log(`    ✓ Copied assets for ${slug}`);
    }

    const texFile = path.join(blogPath, "main.tex");
    if (!fs.existsSync(texFile)) {
        console.warn(`Skipping ${slug}: main.tex not found.`);
        continue;
    }

    const outFile = path.join(OUT_DIR, `${slug}.html`);
    console.log(`Converting ${slug}...`);

    try {
        // Read LaTeX file to extract metadata
        const texContent = fs.readFileSync(texFile, 'utf-8');
        const meta = extractLatexMetadata(texContent);

        // Extract and process TikZ figures
        const tikzFigures = extractTikzFigures(texContent);
        const processedFigures = [];

        if (tikzFigures.length > 0) {
            console.log(`  Processing ${tikzFigures.length} TikZ figure(s)...`);

            const svgDir = path.join(OUT_DIR, 'tikz', slug);
            fs.mkdirSync(svgDir, { recursive: true });

            for (const fig of tikzFigures) {
                const svgPath = path.join(svgDir, `${fig.id}.svg`);
                const success = compileTikzToSvg(fig.code, svgPath);
                if (success) {
                    processedFigures.push(fig);
                    console.log(`    ✓ Compiled ${fig.id}`);
                }
            }
        }

        // Generate excerpt - improved cleaning
        const abstractMatch = texContent.match(/\\begin\{abstract\}([\s\S]*?)\\end\{abstract\}/);
        let excerpt = abstractMatch ? abstractMatch[1].trim() : "";
        if (!excerpt) {
            // Try to find first paragraph after \maketitle
            const contentMatch = texContent.match(/\\maketitle[\s\S]*?\\section/);
            if (contentMatch) {
                excerpt = contentMatch[0].replace(/\\maketitle/, '').replace(/\\section/, '').trim();
            }
        }

        // Clean LaTeX commands more thoroughly
        excerpt = excerpt
            .replace(/\\begin\{[^}]+\}/g, '') // Remove \begin{...}
            .replace(/\\end\{[^}]+\}/g, '')   // Remove \end{...}
            .replace(/\\[a-zA-Z]+(\[[^\]]*\])?(\{[^}]*\})?/g, ' ') // Remove all commands  
            .replace(/\{|\}/g, '')  // Remove remaining braces
            .replace(/\s+/g, ' ')   // Normalize whitespace
            .trim()
            .substring(0, 200);

        if (!excerpt || excerpt.length < 20) {
            excerpt = "Click to read more...";
        }

        metadata.push({
            slug,
            title: meta.title,
            author: meta.author,
            date: meta.date,
            excerpt: excerpt
        });

        // Convert to HTML
        try {
            execSync(`pandoc "${texFile}" -s -o "${outFile}" --mathjax --from=latex`, { stdio: 'inherit' });

            // Post-process HTML to insert SVG images into empty figures
            if (processedFigures.length > 0) {
                let html = fs.readFileSync(outFile, 'utf-8');
                let figureCount = 0;

                // Replace each empty figure (pattern: <figure...>\n\n<figcaption>)
                html = html.replace(/(<figure[^>]*>)\s*\n\s*\n\s*(<figcaption>)/g, (match, p1, p2) => {
                    if (figureCount < processedFigures.length) {
                        const fig = processedFigures[figureCount];
                        figureCount++;
                        const svgPath = `/generated/blogs/tikz/${slug}/${fig.id}.svg`;
                        return `${p1}\n<img src="${svgPath}" alt="TikZ Diagram" style="max-width: 100%; height: auto; display: block; margin: 0 auto;" />\n${p2}`;
                    }
                    return match;
                });

                fs.writeFileSync(outFile, html);
                console.log(`    ✓ Embedded ${figureCount} SVG(s) in HTML`);
            }
        } catch (pandocError) {
            console.warn(`  Warning: Pandoc conversion failed for ${slug}`);
        }
    } catch (error) {
        console.error(`Failed to convert ${slug}:`, error.message);
    }
}

// Clean up temp directory
const tempTikzDir = path.join(OUT_DIR, 'temp-tikz');
if (fs.existsSync(tempTikzDir)) {
    fs.rmSync(tempTikzDir, { recursive: true, force: true });
}

// Write metadata as TypeScript file that can be imported
const tsContent = `// Auto-generated by buildBlogs.js - DO NOT EDIT MANUALLY
import type { BlogPost } from "@/app/data/blogs";

export const latexBlogs: BlogPost[] = ${JSON.stringify(metadata.map(m => ({
    ...m,
    content: "",
    category: "Blog"
})), null, 2)};
`;

const metadataFile = path.join(process.cwd(), 'app/data/latexBlogs.ts');
fs.writeFileSync(metadataFile, tsContent);

console.log(`Blog build complete. Generated ${metadata.length} blogs.`);
