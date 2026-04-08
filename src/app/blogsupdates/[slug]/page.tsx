import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SiteHeader } from "@/components/SiteHeader";
import { getAllPostSlugs, getPostData } from "@/lib/blogs";
import { themeTokens } from "@/lib/theme";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostData(slug);
  const token = themeTokens;

  if (!post) {
    notFound();
  }

  return (
    <main className="relative h-screen w-screen overflow-hidden">
      <SiteHeader />

      <section className="relative z-10 h-full pt-24 md:pt-28">
        <div className="no-scrollbar mx-auto h-full w-full max-w-4xl overflow-y-scroll px-10 pb-20 md:px-16">
          <Link
            href="/blogsupdates"
            className="pointer-events-auto inline-block text-sm underline underline-offset-4 transition-opacity hover:opacity-80"
            style={{ color: token.textSecondary }}
          >
            Back to updates
          </Link>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight md:text-5xl" style={{ color: token.textPrimary }}>
            {post.title}
          </h1>
          <p className="mt-3 text-sm md:text-base" style={{ color: token.textSecondary }}>
            {post.date} / {post.author}
          </p>

          <article className="mt-10 max-w-none pb-10">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h2: ({ children }) => (
                  <h2 className="mt-10 text-2xl font-semibold tracking-tight" style={{ color: token.textPrimary }}>
                    {children}
                  </h2>
                ),
                p: ({ children }) => (
                  <p className="mt-4 text-base leading-relaxed md:text-lg" style={{ color: token.textSecondary }}>
                    {children}
                  </p>
                ),
                li: ({ children }) => (
                  <li className="mt-1 text-base leading-relaxed md:text-lg" style={{ color: token.textSecondary }}>
                    {children}
                  </li>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    className="pointer-events-auto underline underline-offset-4 transition-opacity hover:opacity-80"
                    style={{ color: token.textPrimary }}
                    target={href?.startsWith("http") ? "_blank" : undefined}
                    rel={href?.startsWith("http") ? "noreferrer" : undefined}
                  >
                    {children}
                  </a>
                ),
                strong: ({ children }) => <strong style={{ color: token.textPrimary }}>{children}</strong>,
              }}
            >
              {post.content}
            </ReactMarkdown>
          </article>
        </div>
      </section>
    </main>
  );
}
