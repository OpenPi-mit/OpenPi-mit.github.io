"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ArrowRight, ExternalLink, Youtube, FileText } from "lucide-react"
import { BlogIcon } from "@/components/blog-icon"
import { PdfIcon } from "@/components/pdf-icon"
import { BlogPost } from "@/app/data/blogs"

// Helper function to extract YouTube video ID from URL
function getYouTubeVideoId(url: string): string | null {
    const patterns = [
        /(?:youtube\.com\/watch\?v=)([^&]+)/,
        /(?:youtu\.be\/)([^?]+)/,
        /(?:youtube\.com\/embed\/)([^?]+)/,
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    return null;
}

// Helper function to get YouTube thumbnail URL
function getYouTubeThumbnail(url: string): string | null {
    const videoId = getYouTubeVideoId(url);
    if (!videoId) return null;
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

// Helper function to determine link type
function getLinkType(link: string | undefined): 'youtube' | 'pdf' | 'other' | 'none' {
    if (!link) return 'none';
    if (link.includes('youtube.com') || link.includes('youtu.be')) return 'youtube';
    if (link.endsWith('.pdf')) return 'pdf';
    return 'other';
}

interface ExtendedBlogPost extends BlogPost {
    isExternal?: boolean;
}

interface BlogListProps {
    posts: ExtendedBlogPost[];
}

function BlogListContent({ posts }: BlogListProps) {
    const searchParams = useSearchParams()
    const initialFilter = searchParams.get('filter')
    const [filter, setFilter] = useState<string>('All')

    useEffect(() => {
        if (initialFilter) {
            if (initialFilter === 'Blog' || initialFilter === 'Updates') {
                setFilter(initialFilter)
            } else {
                setFilter('All')
            }
        }
    }, [initialFilter])

    const filteredPosts = posts.filter(post => {
        if (filter === 'All') return true;
        if (filter === 'Blog') return post.category === 'Blog' || (!post.isExternal && !post.category);
        if (filter === 'Updates') return post.category !== 'Blog' && (post.isExternal || post.category === 'Interesting Bit');
        return true;
    });

    return (
        <div>
            <div className="flex gap-4 mb-12 border-b border-border pb-1">
                {['All', 'Blog', 'Updates'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`pb-4 text-sm font-medium transition-colors relative ${filter === f
                            ? "text-foreground"
                            : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        {f}
                        {filter === f && (
                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />
                        )}
                    </button>
                ))}
            </div>

            <div className="space-y-12">
                {filteredPosts.map((post) => {
                    const linkType = getLinkType(post.link);
                    const isExternal = post.isExternal || post.link;

                    return (
                        <article key={post.slug} className="group">
                            {isExternal ? (
                                // External Link / Tidbit
                                <a href={post.link} target="_blank" rel="noopener noreferrer" className="block">
                                    <div className="flex flex-col md:flex-row gap-6 items-start">
                                        {/* Preview Icon */}
                                        <div className="flex-shrink-0 w-full md:w-48 h-48 md:h-32 rounded-xl bg-muted overflow-hidden">
                                            {linkType === 'youtube' && getYouTubeThumbnail(post.link || '') ? (
                                                <img
                                                    src={getYouTubeThumbnail(post.link || '') || ''}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : linkType === 'pdf' && post.link ? (
                                                <div className="w-full h-full">
                                                    <PdfIcon className="w-full h-full" />
                                                </div>
                                            ) : linkType === 'youtube' ? (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Youtube className="w-16 h-16 text-red-500" strokeWidth={1.5} />
                                                </div>
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <ExternalLink className="w-16 h-16 text-muted-foreground" strokeWidth={1.5} />
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-secondary proportionate-nums text-secondary-foreground text-xs font-medium border border-border">
                                                    {post.category || 'Update'}
                                                </span>
                                                <span className="text-sm text-muted-foreground">
                                                    {post.date}
                                                </span>
                                            </div>
                                            <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-muted-foreground transition-colors text-balance flex items-center gap-2">
                                                {post.title}
                                                <ExternalLink className="w-5 h-5 opacity-50" />
                                            </h3>
                                            <p className="text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                                                {post.excerpt}
                                            </p>
                                            <div className="inline-flex items-center gap-2 text-sm font-medium text-foreground underline decoration-dotted underline-offset-4 group-hover:text-muted-foreground transition-colors">
                                                View source
                                                <ArrowRight className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            ) : (
                                // Internal Blog Post
                                <Link href={`/blogsupdates/${post.slug}`} className="block">
                                    <div className="flex flex-col md:flex-row gap-6 items-start">
                                        {/* Blog Icon */}
                                        <div className="flex-shrink-0 w-full md:w-48 h-48 md:h-32 rounded-xl bg-muted overflow-hidden">
                                            <BlogIcon
                                                slug={post.slug}
                                                className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>

                                        {/* Blog Content */}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                                                    Blog
                                                </span>
                                                <span className="text-sm text-muted-foreground">
                                                    {post.date}
                                                </span>
                                            </div>
                                            <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-muted-foreground transition-colors text-balance">
                                                {post.title}
                                            </h3>
                                            <p className="text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                                                {post.excerpt}
                                            </p>
                                            <div className="inline-flex items-center gap-2 text-sm font-medium text-foreground underline decoration-dotted underline-offset-4 group-hover:text-muted-foreground transition-colors">
                                                Read article
                                                <ArrowRight className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            )}
                        </article>
                    );
                })}
            </div>
        </div>
    )
}

export function BlogList(props: BlogListProps) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <BlogListContent {...props} />
        </Suspense>
    )
}
