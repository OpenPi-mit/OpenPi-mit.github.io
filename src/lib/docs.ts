import fs from "fs";
import path from "path";

const docsDirectory = path.join(process.cwd(), "content/docs");

export type DocPage = {
  slug: string;
  title: string;
  content: string;
};

export function getAllDocSlugs() {
  if (!fs.existsSync(docsDirectory)) {
    return [];
  }

  return fs
    .readdirSync(docsDirectory)
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => fileName.replace(/\.md$/, ""));
}

export async function getDocData(slug: string): Promise<DocPage | null> {
  const fullPath = path.join(docsDirectory, `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const lines = fileContents.split("\n");
  const title = lines[0]?.replace(/^#\s*/, "").trim() || slug;
  const content = lines.slice(1).join("\n").trim();

  return {
    slug,
    title,
    content,
  };
}
