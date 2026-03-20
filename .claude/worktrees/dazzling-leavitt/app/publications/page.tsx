import { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import rawPublications from "@/app/data/publications.json"

export const metadata: Metadata = {
    title: "Publications | Poggio Lab",
    description: "Recent publications and research from the Poggio Lab.",
}


import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

// Ensure unique publications and sort by year
const publications = rawPublications.filter((pub, index, self) =>
    index === self.findIndex((t) => (
        t.title === pub.title
    ))
).sort((a, b) => {
    // Sort by year desc, then title asc
    if (b.year !== a.year) {
        return parseInt(b.year || "0") - parseInt(a.year || "0");
    }
    return a.title.localeCompare(b.title);
});


export default function PublicationsPage() {
    // Group by year
    const publicationsByYear = publications.reduce((acc, pub) => {
        const year = pub.year || "Unknown"
        if (!acc[year]) {
            acc[year] = []
        }
        acc[year].push(pub)
        return acc
    }, {} as Record<string, typeof publications>)

    const sortedYears = Object.keys(publicationsByYear).sort((a, b) => {
        if (a === "Unknown") return 1;
        if (b === "Unknown") return -1;
        return parseInt(b) - parseInt(a);
    });

    return (
        <main className="min-h-screen flex flex-col">
            <Navigation />
            <div className="flex-1 container py-32 mx-auto px-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold tracking-tight mb-8">Publications</h1>

                    <div className="space-y-16">
                        {sortedYears.map((year) => (
                            <div key={year}>
                                <h2 className="text-2xl font-semibold mb-6 sticky top-16 bg-background/95 backdrop-blur py-2 z-10 border-b">
                                    {year}
                                </h2>
                                <div className="space-y-8">
                                    {publicationsByYear[year].map((pub, index) => (
                                        <article key={index} className="group relative pl-4 border-l-2 border-transparent hover:border-primary transition-colors">
                                            <h3 className="text-lg font-medium leading-tight mb-2">
                                                <Link href={pub.link} target="_blank" rel="noopener noreferrer" className="hover:underline decoration-primary underline-offset-4">
                                                    {pub.title}
                                                </Link>
                                            </h3>
                                            <div className="text-muted-foreground text-sm space-y-1">
                                                <p>{pub.authors}</p>
                                                <p className="italic">{pub.venue}</p>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    )
}
