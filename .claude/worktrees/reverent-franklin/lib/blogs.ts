import fs from 'fs';
import path from 'path';

const blogsDirectory = path.join(process.cwd(), 'content/blogs');

export function getAllPostSlugs() {
    if (!fs.existsSync(blogsDirectory)) {
        return [];
    }
    const fileNames = fs.readdirSync(blogsDirectory);
    return fileNames.filter(fileName => {
        const fullPath = path.join(blogsDirectory, fileName);
        return fs.statSync(fullPath).isDirectory();
    });
}

export async function getPostData(slug: string) {
    const fullPath = path.join(blogsDirectory, slug, 'blog.md');

    if (!fs.existsSync(fullPath)) {
        return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // New standard format:
    // Line 1: # Title
    // Line 2: Date: Month Day, Year
    // Line 3: By Author Name(s)
    // Line 4: (blank)
    // Line 5+: Content starts

    const lines = fileContents.split('\n');

    // Extract title from line 1 (remove leading # and whitespace)
    const title = lines[0]?.replace(/^#\s*/, '').trim() || 'Untitled';

    // Extract date from line 2 (format: "Date: Month Day, Year")
    const dateLine = lines[1]?.trim() || '';
    const dateMatch = dateLine.match(/^Date:\s*(.+)$/);
    const date = dateMatch ? dateMatch[1].trim() : new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    // Extract author from line 3 (format: "By Author Name(s)")
    const authorLine = lines[2]?.trim() || '';
    const authorMatch = authorLine.match(/^By\s+(.+)$/);
    const author = authorMatch ? authorMatch[1].trim() : 'Unknown Author';

    // Content starts after the metadata block (typically line 4 is blank, content starts at line 5)
    // Find the first non-empty line after the author line
    let contentStartIndex = 3;
    while (contentStartIndex < lines.length && lines[contentStartIndex].trim() === '') {
        contentStartIndex++;
    }

    const content = lines.slice(contentStartIndex).join('\n');

    // Generate excerpt (first 200 chars, removing markdown formatting)
    const excerpt = content.slice(0, 200).replace(/[#*]/g, '').trim() + '...';

    return {
        slug,
        title,
        author,
        date,
        excerpt,
        content,
        category: 'Blog' as const,
    };
}
