import fs from "fs";
import path from "path";

const blogsDirectory = path.join(process.cwd(), "content/blogs");

export type BlogPost = {
  slug: string;
  title: string;
  author: string;
  date: string;
  excerpt: string;
  content: string;
};

export function getAllPostSlugs() {
  if (!fs.existsSync(blogsDirectory)) {
    return [];
  }
  const fileNames = fs.readdirSync(blogsDirectory);
  return fileNames.filter((fileName) => {
    const fullPath = path.join(blogsDirectory, fileName);
    return fs.statSync(fullPath).isDirectory();
  });
}

export async function getPostData(slug: string): Promise<BlogPost | null> {
  const fullPath = path.join(blogsDirectory, slug, "blog.md");

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const lines = fileContents.split("\n");

  const title = lines[0]?.replace(/^#\s*/, "").trim() || "Untitled";
  const dateLine = lines[1]?.trim() || "";
  const dateMatch = dateLine.match(/^Date:\s*(.+)$/);
  const date = dateMatch
    ? dateMatch[1].trim()
    : new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

  const authorLine = lines[2]?.trim() || "";
  const authorMatch = authorLine.match(/^By\s+(.+)$/);
  const author = authorMatch ? authorMatch[1].trim() : "Unknown Author";

  let contentStartIndex = 3;
  while (contentStartIndex < lines.length && lines[contentStartIndex].trim() === "") {
    contentStartIndex += 1;
  }

  const content = lines.slice(contentStartIndex).join("\n");

  const plainTextContent = content
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/^\s*[-+]\s+/gm, "")
    .replace(/[*_`~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const excerpt =
    plainTextContent.length > 200
      ? `${plainTextContent.slice(0, 200).trim()}...`
      : plainTextContent;

  return {
    slug,
    title,
    author,
    date,
    excerpt,
    content,
  };
}
