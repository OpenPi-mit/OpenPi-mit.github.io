export interface BlogPost {
    slug: string;
    title: string;
    excerpt: string;
    date: string;
    author: string;
    content: string;
    category: "Blog" | "Interesting Bit" | "Research" | "Publication" | "News" | "Press";
    link?: string;
}

import { latexBlogs } from "./latexBlogs";

const manualBlogs: BlogPost[] = [];

// Merge manual blogs with LaTeX blogs
export const blogs: BlogPost[] = [...latexBlogs, ...manualBlogs];
