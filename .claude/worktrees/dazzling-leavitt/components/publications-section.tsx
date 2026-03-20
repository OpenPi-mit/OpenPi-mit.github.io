import { ArrowUpRight } from "lucide-react"
import Link from "next/link"
import publicationsData from "@/app/data/publications.json"

const publications = publicationsData.slice(0, 5)

export function PublicationsSection() {
  return (
    <section id="publications" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground mb-4">
              Publications
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground text-balance">
              Recent work
            </h2>
          </div>
          <Link
            href="/publications"
            className="text-sm font-medium text-foreground hover:text-muted-foreground transition-colors inline-flex items-center gap-1"
          >
            View all publications
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="divide-y divide-border">
          {publications.map((pub, index) => (
            <Link
              key={index}
              href={pub.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group py-8 flex flex-col md:flex-row md:items-start gap-4 md:gap-8"
            >
              <div className="md:w-20 shrink-0">
                <span className="text-sm text-muted-foreground">{pub.year}</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-foreground group-hover:text-muted-foreground transition-colors mb-2 text-pretty">
                  {pub.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-1">{pub.authors}</p>
                <p className="text-sm font-medium text-foreground/70">{pub.venue}</p>
              </div>
              <ArrowUpRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
