import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { SiteHeader } from "@/components/SiteHeader";
import { getAllDocSlugs, getDocData } from "@/lib/docs";
import { themeTokens } from "@/lib/theme";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllDocSlugs().map((slug) => ({ slug }));
}

function normalizeDocLink(href?: string) {
  if (!href) return href;
  if (href.startsWith("http://") || href.startsWith("https://")) return href;
  if (href.endsWith(".md")) {
    return `/docs/${href.replace(/\.md$/, "")}`;
  }
  return href;
}

export default async function DocPage({ params }: PageProps) {
  const { slug } = await params;
  const doc = await getDocData(slug);
  const token = themeTokens;

  if (!doc) {
    notFound();
  }

  return (
    <main className="relative h-screen w-screen overflow-hidden">
      <SiteHeader />

      <section className="relative z-10 h-full pt-24 md:pt-28">
        <div className="no-scrollbar mx-auto h-full w-full max-w-4xl overflow-y-scroll px-10 pb-20 md:px-16">
          <Link
            href="/docs"
            className="pointer-events-auto inline-block text-sm underline underline-offset-4 transition-opacity hover:opacity-80"
            style={{ color: token.textSecondary }}
          >
            Back to docs
          </Link>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight md:text-5xl" style={{ color: token.textPrimary }}>
            {doc.title}
          </h1>

          <article className="mt-10 max-w-none pb-10">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => (
                  <h1 className="mt-8 text-3xl font-semibold tracking-tight md:text-4xl" style={{ color: token.textPrimary }}>
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="mt-10 text-2xl font-semibold tracking-tight" style={{ color: token.textPrimary }}>
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="mt-8 text-xl font-semibold tracking-tight" style={{ color: token.textPrimary }}>
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="mt-4 text-base leading-relaxed md:text-lg" style={{ color: token.textSecondary }}>
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="mt-4 ml-6 list-disc space-y-1 marker:text-white/70" style={{ color: token.textSecondary }}>
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="mt-4 ml-6 list-decimal space-y-1 marker:text-white/70" style={{ color: token.textSecondary }}>
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="mt-1 text-base leading-relaxed md:text-lg" style={{ color: token.textSecondary }}>
                    {children}
                  </li>
                ),
                hr: () => <hr className="my-8 border-white/10" />,
                table: ({ children }) => (
                  <div className="mt-5 overflow-x-auto rounded-2xl border border-white/15 bg-black/35">
                    <table className="min-w-full border-collapse text-sm md:text-base">{children}</table>
                  </div>
                ),
                thead: ({ children }) => <thead className="bg-white/5">{children}</thead>,
                tbody: ({ children }) => <tbody>{children}</tbody>,
                tr: ({ children }) => <tr className="border-t border-white/10">{children}</tr>,
                th: ({ children }) => (
                  <th className="px-4 py-3 text-left font-semibold" style={{ color: token.textPrimary }}>
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="px-4 py-3 align-top leading-relaxed" style={{ color: token.textSecondary }}>
                    {children}
                  </td>
                ),
                a: ({ href, children }) => {
                  const resolvedHref = normalizeDocLink(href);
                  const isExternal = resolvedHref?.startsWith("http");
                  return (
                    <a
                      href={resolvedHref}
                      className="pointer-events-auto underline underline-offset-4 transition-opacity hover:opacity-80"
                      style={{ color: token.textPrimary }}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noreferrer" : undefined}
                    >
                      {children}
                    </a>
                  );
                },
                pre: ({ children }) => <>{children}</>,
                strong: ({ children }) => <strong style={{ color: token.textPrimary }}>{children}</strong>,
                code: ({ children, className }) => {
                  const match = /language-(\w+)/.exec(className || "");
                  if (match) {
                    const language = match[1];
                    return (
                      <SyntaxHighlighter
                        language={language}
                        style={oneDark}
                        customStyle={{
                          marginTop: "1.25rem",
                          marginBottom: 0,
                          borderRadius: "1rem",
                          border: "1px solid rgba(255,255,255,0.2)",
                          background: "rgba(0,0,0,0.6)",
                          boxShadow:
                            "inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(255,255,255,0.06), 0 16px 40px rgba(0,0,0,0.35)",
                          padding: "1rem",
                          fontSize: "13px",
                          lineHeight: 1.65,
                        }}
                        codeTagProps={{ style: { fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" } }}
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    );
                  }
                  return (
                    <code className="rounded bg-white/10 px-1.5 py-0.5 text-sm" style={{ color: token.textPrimary }}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {doc.content}
            </ReactMarkdown>
          </article>
        </div>
      </section>
    </main>
  );
}
