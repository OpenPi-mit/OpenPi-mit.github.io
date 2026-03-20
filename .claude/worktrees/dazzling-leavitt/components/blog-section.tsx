import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { BlogIcon } from "./blog-icon"
import { PdfIcon } from "./pdf-icon"
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
  // Use maxresdefault for highest quality, fallback to hqdefault if not available
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

// Helper function to check if URL is a YouTube link
function isYouTubeLink(url: string): boolean {
  return url.includes('youtube.com') || url.includes('youtu.be');
}

// Helper function to check if URL is a PDF link
function isPdfLink(url: string): boolean {
  return url.toLowerCase().endsWith('.pdf');
}

interface BlogSectionProps {
  posts: BlogPost[];
  title?: string;
  subtitle?: string;
  id?: string;
  viewAllLink?: string;
  viewAllText?: string;
}

export function BlogSection({
  posts,
  title = "Blogposts and Updates",
  subtitle = "Latest Updates",
  id = "blog",
  viewAllLink = "/blogsupdates",
  viewAllText = "View all posts"
}: BlogSectionProps) {

  return (
    <section id={id} className="py-32 px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground mb-4">
              {subtitle}
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground text-balance">
              {title}
            </h2>
          </div>
          <Link
            href={viewAllLink}
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-muted-foreground transition-colors group"
          >
            {viewAllText}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => {
            let thumbnailUrl: string | null = null;
            let isExternal = false;

            if (post.link) {
              isExternal = true;
              if (isYouTubeLink(post.link)) {
                thumbnailUrl = getYouTubeThumbnail(post.link);
              } else if (isPdfLink(post.link)) {
                // Use static PDF icon
                thumbnailUrl = null;
              }
            }

            return (
              <Link
                key={post.slug}
                href={post.link ? post.link : `/blogsupdates/${post.slug}`}
                target={post.link ? "_blank" : undefined}
                rel={post.link ? "noopener noreferrer" : undefined}
                className={`group ${index === 2 ? 'hidden lg:block' : ''}`}
              >
                <article>
                  <div className="aspect-[16/10] rounded-xl bg-muted mb-5 overflow-hidden">
                    {isExternal ? (
                      thumbnailUrl ? (
                        // YouTube or other thumbnail
                        <img
                          src={thumbnailUrl}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        // Fallback for PDFs or other external links
                        <div className="w-full h-full bg-muted flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                          {isPdfLink(post.link || '') ? (
                            <PdfIcon className="w-full h-full" />
                          ) : (
                            <span className="text-4xl font-light text-muted-foreground/30">IB</span>
                          )}
                        </div>
                      )
                    ) : (
                      // Internal blog post - use blog icon
                      <BlogIcon
                        slug={post.slug}
                        className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {post.category}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {post.date}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-2 group-hover:text-muted-foreground transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
                </article>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  )
}
