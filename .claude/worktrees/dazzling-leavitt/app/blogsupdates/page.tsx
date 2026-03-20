import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { blogs as staticBlogs } from "@/app/data/blogs"
import { getAllPostSlugs, getPostData } from "@/lib/blogs"
import { BlogList } from "@/components/blog-list"

export default async function BlogPage() {
  // Fetch dynamic blogs from markdown files
  const slugs = getAllPostSlugs();
  const dynamicPosts = await Promise.all(
    slugs.map(slug => getPostData(slug))
  );

  // Combine and normalize posts
  const allPosts = [
    // Dynamic posts (Markdown)
    ...dynamicPosts
      .filter((p): p is NonNullable<typeof p> => p !== null)
      .map(p => ({
        ...p,
        link: undefined, // ensure no link for internal blogs
        isExternal: false
      })),
    // Static posts (Tidbits / Interesting Bits)
    ...staticBlogs
      .filter(b => b.category === 'Interesting Bit')
      .map(b => ({
        ...b,
        isExternal: true
      }))
  ].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-16">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
              Blog & Updates
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Research insights, news, and interesting bits from the Poggio Lab.
            </p>
          </div>

          <BlogList posts={allPosts} />
        </div>
      </section>

      <Footer />
    </main>
  )
}
