import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, ArrowUpRight, Download, FileText } from "lucide-react"
import { Footer } from "@/components/footer"
import { Navigation } from "@/components/navigation"

const siteUrl = "https://poggioai.github.io"
const landingPath = "/papers/poggioai-msc-v0/"
const pdfPath = "/papers/poggioai-msc-v0.pdf"
const landingUrl = `${siteUrl}${landingPath}`
const pdfUrl = `${siteUrl}${pdfPath}`
const githubUrl = "https://github.com/PoggioAI/PoggioAI_MSc/tree/MSc_Prod"

const title = "PoggioAI/MSc: ML Theory Research with Humans on the Loop"
const authors = [
  "Mahmoud Abdelmoneum",
  "Pierfrancesco Beneventano",
  "Tomaso Poggio",
]
const description =
  "Technical report for PoggioAI/MSc, an open-source modular multi-agent system for academic research workflows with a current emphasis on machine learning theory."
const abstract =
  "We present PoggioAI/MSc, an open-source, customizable, modular multi-agent system for academic research workflows. Our goal is not autonomous scientific ideation, nor fully automated research. It is narrower and more practical: to reduce by orders of magnitude the human steering required to turn a specified hypothesis into a literature-grounded, mathematically established, experimentally supported, submission-oriented manuscript draft. PoggioAI/MSc is built with a current emphasis on machine learning theory and adjacent quantitative fields."

export const metadata: Metadata = {
  title: `${title} | PoggioAI`,
  description,
  alternates: {
    canonical: landingUrl,
  },
  openGraph: {
    title,
    description,
    type: "article",
    url: landingUrl,
    siteName: "PoggioAI",
  },
  authors: authors.map((name) => ({ name })),
  other: {
    citation_title: title,
    citation_author: authors,
    citation_publication_date: "2026/03/21",
    citation_online_date: "2026/03/25",
    citation_language: "en",
    citation_abstract_html_url: landingUrl,
    citation_pdf_url: pdfUrl,
    citation_fulltext_html_url: landingUrl,
    citation_keywords: [
      "PoggioAI",
      "machine learning theory",
      "multi-agent systems",
      "academic research workflows",
      "technical report",
    ],
    "dc.title": title,
    "dc.creator": authors,
    "dc.date": "2026-03-21",
    "dc.description": abstract,
    "dc.identifier": landingUrl,
    "dc.type": "Text",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ScholarlyArticle",
  headline: title,
  name: title,
  description,
  abstract,
  url: landingUrl,
  datePublished: "2026-03-21",
  dateModified: "2026-03-25",
  inLanguage: "en",
  author: authors.map((name) => ({
    "@type": "Person",
    name,
  })),
  publisher: {
    "@type": "Organization",
    name: "PoggioAI",
    url: siteUrl,
  },
  isAccessibleForFree: true,
  encoding: {
    "@type": "MediaObject",
    encodingFormat: "application/pdf",
    contentUrl: pdfUrl,
  },
  sameAs: githubUrl,
}

export default function PoggioAIMScPaperPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="px-6 pb-20 pt-32">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/publications"
            className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to publications
          </Link>

          <div className="rounded-3xl border border-border bg-card/60 p-8 md:p-10">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
              Technical Report
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground text-balance md:text-5xl">
              {title}
            </h1>

            <div className="mt-6 space-y-2 text-sm text-muted-foreground">
              <p>{authors.join(", ")}</p>
              <p>Massachusetts Institute of Technology; Perseus Labs</p>
              <p>First posted March 21, 2026. Current version March 25, 2026.</p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={pdfPath}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
              >
                <Download className="h-4 w-4" />
                Open PDF
              </a>
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                Code on GitHub
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
            <article className="rounded-3xl border border-border bg-background p-8">
              <div className="mb-6 flex items-center gap-2 text-foreground">
                <FileText className="h-5 w-5" />
                <h2 className="text-xl font-semibold tracking-tight">Abstract</h2>
              </div>
              <p className="text-base leading-8 text-muted-foreground">{abstract}</p>

              <h3 className="mt-10 text-lg font-semibold tracking-tight text-foreground">
                Why this page exists
              </h3>
              <p className="mt-4 text-base leading-8 text-muted-foreground">
                This page is the stable landing page for the report. It provides
                title, author, abstract, version, and PDF metadata in a format
                that is easier for search engines and academic indexers to crawl
                than a raw PDF alone.
              </p>
            </article>

            <aside className="space-y-6">
              <div className="rounded-3xl border border-border bg-card/40 p-6">
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                  Links
                </h2>
                <div className="mt-4 space-y-3 text-sm">
                  <a
                    href={pdfPath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-2xl border border-border px-4 py-3 text-foreground transition-colors hover:bg-muted"
                  >
                    <span>PDF report</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-2xl border border-border px-4 py-3 text-foreground transition-colors hover:bg-muted"
                  >
                    <span>GitHub repository</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              </div>

              <div className="rounded-3xl border border-border bg-card/40 p-6">
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                  Citation
                </h2>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  Abdelmoneum, M., Beneventano, P., and Poggio, T.
                  {" "}
                  <span className="italic">{title}</span>. Technical Report,
                  Massachusetts Institute of Technology, 2026.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
