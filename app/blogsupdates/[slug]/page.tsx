import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, User, ExternalLink } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeRaw from 'rehype-raw'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css' // Import KaTeX CSS
import { getPostData, getAllPostSlugs } from "@/lib/blogs"
import { BlogIcon } from "@/components/blog-icon"

export async function generateStaticParams() {
    const slugs = getAllPostSlugs();
    return slugs.map((slug) => ({
        slug,
    }))
}

export default async function BlogPost(context: { params: Promise<{ slug: string }> }) {
    const { slug } = await context.params;
    const post = await getPostData(slug);

    if (!post) {
        notFound()
    }

    return (
        <main className="min-h-screen bg-background">
            <Navigation />

            <section className="pt-32 pb-16 px-6">
                <div className="max-w-3xl mx-auto">
                    <Link
                        href="/blogsupdates"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-12"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Blog
                    </Link>

                    <header className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                                {post.category}
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-8 text-balance">
                            {post.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-sm text-muted-foreground border-b border-border pb-8">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {post.date}
                            </div>
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                {post.author}
                            </div>
                        </div>
                    </header>

                    {/* Hero Image - blog.svg */}
                    <div className="mb-12 rounded-2xl overflow-hidden bg-muted">
                        <div className="w-full aspect-[21/9] overflow-hidden">
                            <BlogIcon
                                slug={slug}
                                className="w-full h-full"
                            />
                        </div>
                    </div>

                    <article className="prose prose-neutral dark:prose-invert max-w-none">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkMath]}
                            rehypePlugins={[rehypeRaw, rehypeKatex]}
                            components={{
                                img: ({ node, ...props }) => {
                                    // Rewrite image src to point to our route handler if it's a local asset
                                    let src = props.src;
                                    if (typeof src === 'string' && src && !src.startsWith('http')) {
                                        // If it's a relative path like "assets/image_0.png", map it to /blog-assets/[slug]/assets/image_0.png
                                        const cleanSrc = src.replace(/^\.\//, ''); // remove leading ./
                                        const basePath = '';
                                        src = `${basePath}/blog-assets/${slug}/${cleanSrc}`;
                                    }
                                    return (
                                        <div className="my-8">
                                            <img
                                                {...props}
                                                src={src as string}
                                                className="rounded-lg border border-border w-full h-auto"
                                            />
                                        </div>
                                    );
                                },
                                // Style other elements if needed
                                h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mt-12 mb-6" {...props} />,
                                h2: ({ node, ...props }) => <h2 className="text-xl font-semibold mt-10 mb-5" {...props} />,
                                a: ({ node, ...props }) => <a className="text-primary hover:underline" {...props} />,
                                // Ensure math is rendered block-level if needed (though katex handles this usually)
                                div: ({ node, className, ...props }) => {
                                    // Sometimes math is wrapped in divs by rehype-katex
                                    if (className?.includes('math-display')) {
                                        return <div className="overflow-x-auto my-6" {...props} />
                                    }
                                    return <div className={className} {...props} />
                                },
                                ul: ({ node, ...props }) => <ul className="list-disc pl-6 my-4 space-y-2" {...props} />,
                                ol: ({ node, ...props }) => <ol className="list-decimal pl-6 my-4 space-y-2" {...props} />,
                                li: ({ node, ...props }) => <li className="text-foreground" {...props} />,
                                pre: ({ node, ...props }) => <pre className="bg-muted rounded-lg p-4 my-6 overflow-x-auto text-sm font-mono whitespace-pre" {...props} />,
                                code: ({ node, ...props }) => <code className="font-mono text-sm" {...props} />,
                            }}
                        >
                            {post.content
                                // Normalize LaTeX delimiters for remark-math
                                // Replace \[ ... \] with $$ ... $$
                                .replace(/\\\[([\s\S]*?)\\\]/g, '$$$$$1$$$$')
                                // Replace \( ... \) with $ ... $
                                .replace(/\\\(([\s\S]*?)\\\)/g, '$$$1$$')
                            }
                        </ReactMarkdown>
                    </article>
                </div>
            </section>

            <Footer />
        </main>
    )
}
