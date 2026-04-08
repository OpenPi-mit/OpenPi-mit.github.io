import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { getAllPostSlugs, getPostData } from "@/lib/blogs";
import { themeTokens } from "@/lib/theme";

export default async function BlogUpdatesPage() {
  const token = themeTokens;
  const slugs = getAllPostSlugs();
  const posts = (await Promise.all(slugs.map((slug) => getPostData(slug))))
    .filter((post): post is NonNullable<typeof post> => post !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <main className="relative h-screen w-screen overflow-hidden">
      <SiteHeader />

      <section className="relative z-10 h-full pt-24 md:pt-28">
        <div className="no-scrollbar mx-auto h-full w-full max-w-6xl overflow-y-scroll px-10 pb-20 md:px-16">
          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-5xl" style={{ color: token.textPrimary }}>
            Blog &amp; Updates
          </h1>
          <p className="mt-4 max-w-3xl text-base md:text-lg" style={{ color: token.textSecondary }}>
            Research insights, project notes, and updates from pAI.
          </p>

          <div className="mt-10 space-y-16 pb-10">
            {posts.map((post) => (
              <article key={post.slug} className="max-w-4xl border-l border-white/10 pl-5">
                <h2 className="text-xl font-medium leading-snug md:text-2xl" style={{ color: token.textPrimary }}>
                  <Link href={`/blogsupdates/${post.slug}`} className="pointer-events-auto transition-opacity hover:opacity-80">
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-2 text-sm md:text-base" style={{ color: token.textSecondary }}>
                  {post.date} / {post.author}
                </p>
                <p className="mt-3 text-sm leading-relaxed md:text-base" style={{ color: token.textSecondary }}>
                  {post.excerpt}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
