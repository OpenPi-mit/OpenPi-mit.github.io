#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Extract TikZ figures from LaTeX content
 * Returns array of {id, code} objects
 */
function extractTikzFigures(texContent) {
    const figures = [];
    const tikzRegex = /\\begin\{tikzpicture\}([\s\S]*?)\\end\{tikzpicture\}/g;
    let match;
    let figureId = 0;

    while ((match = tikzRegex.exec(texContent)) !== null) {
        figures.push({
            id: `tikz-fig-${figureId++}`,
            code: match[0]  // Include the begin/end tags
        });
    }

    return figures;
}

/**
 * Create standalone LaTeX file for a TikZ figure
 */
function createStandaloneTikz(tikzCode, packages) {
    return `\\documentclass[tikz,border=2pt]{standalone}
\\usepackage{amsmath,amssymb}
\\usepackage{tikz}
\\usetikzlibrary{positioning, arrows.meta, calc, shapes.geometric}
${packages}

\\begin{document}
${tikzCode}
\\end{document}`;
}

/**
 * Compile TikZ to SVG
 */
function compileTikzToSvg(tikzCode, outputPath, packages = '') {
    const tempDir = path.join(process.cwd(), 'generated/temp-tikz');
    fs.mkdirSync(tempDir, { recursive: true });

    const baseName = path.basename(outputPath, '.svg');
    const texFile = path.join(tempDir, `${baseName}.tex`);
    const pdfFile = path.join(tempDir, `${baseName}.pdf`);

    try {
        // Write standalone LaTeX file
        const standaloneContent = createStandaloneTikz(tikzCode, packages);
        fs.writeFileSync(texFile, standaloneContent);

        // Compile to PDF
        execSync(`pdflatex -interaction=nonstopmode -output-directory="${tempDir}" "${texFile}"`,
            { stdio: 'pipe' });

        // Convert PDF to SVG using pdf2svg or dvisvgm
        try {
            execSync(`pdf2svg "${pdfFile}" "${outputPath}"`, { stdio: 'pipe' });
        } catch (e) {
            // Fallback to dvisvgm if pdf2svg not available
            execSync(`dvisvgm --pdf --exact --output="${outputPath}" "${pdfFile}"`, { stdio: 'pipe' });
        }

        return true;
    } catch (error) {
        console.error(`  Failed to compile TikZ: ${error.message}`);
        return false;
    }
}

/**
 * Process a blog and extract/compile TikZ figures
 */
export function processTikzForBlog(slug, texContent, blogDir) {
    const tikzFigures = extractTikzFigures(texContent);

    if (tikzFigures.length === 0) {
        return { figures: [], htmlContent: texContent };
    }

    console.log(`  Found ${tikzFigures.length} TikZ figure(s)`);

    const svgDir = path.join(process.cwd(), 'generated/blogs/tikz', slug);
    fs.mkdirSync(svgDir, { recursive: true });

    const processedFigures = [];
    let modifiedContent = texContent;

    for (const fig of tikzFigures) {
        const svgPath = path.join(svgDir, `${fig.id}.svg`);
        const success = compileTikzToSvg(fig.code, svgPath);

        if (success) {
            processedFigures.push({
                id: fig.id,
                svgPath: svgPath,
                relativePath: `/generated/blogs/tikz/${slug}/${fig.id}.svg`
            });

            // Replace TikZ code with a marker for later HTML injection
            const marker = `%%TIKZ_PLACEHOLDER_${fig.id}%%`;
            modifiedContent = modifiedContent.replace(fig.code, marker);
        }
    }

    return { figures: processedFigures, modifiedContent };
}
