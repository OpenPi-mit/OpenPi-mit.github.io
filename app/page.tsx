import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { TeamSection } from "@/components/team-section"
import { BlogSection } from "@/components/blog-section"
import { PublicationsSection } from "@/components/publications-section"
import { Footer } from "@/components/footer"
import { SeminarTimeline } from "@/components/seminar-timeline"
import { ArrowRight, ArrowUpRight, Brain, Network, Sparkles, Eye, ExternalLink, CalendarPlus } from "lucide-react"
import { getBasePath } from "@/lib/utils"
import { getAllPostSlugs, getPostData } from "@/lib/blogs"
import { blogs as staticBlogs } from "@/app/data/blogs"

const researchAreas = [
  {
    icon: Brain,
    title: "Statistical learning theory and limits of learnability",
    description:
      "Foundational research into the mathematical principles of learning and the theoretical boundaries of predictive models.",
  },
  {
    icon: Network,
    title: "Generalization and optimization in high-dimensional models",
    description:
      "Analyzing how complex neural networks generalize and the optimization dynamics in high-dimensional parameter spaces.",
  },
  {
    icon: Sparkles,
    title: "Deep learning and alternative training paradigms",
    description:
      "Exploring novel architectures and training methods that move beyond standard approaches to improve efficiency and robustness.",
  },
  {
    icon: Eye,
    title: "Learning principles shaped by biological constraints",
    description:
      "Investigating how biological systems process information to derive principles for human-like machine intelligence.",
  },
]



export default async function Home() {
  // Fetch dynamic blogs from markdown files
  const slugs = getAllPostSlugs();
  const dynamicPosts = await Promise.all(
    slugs.map(slug => getPostData(slug))
  );

  const blogPosts = dynamicPosts
    .filter((p): p is NonNullable<typeof p> => p !== null)
    .map(p => ({
      ...p,
      link: undefined,
      isExternal: false
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  const updatePosts = staticBlogs
    .filter(b => b.category === 'Interesting Bit')
    .map(b => ({
      ...b,
      isExternal: true
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 pt-16">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground mb-6">
            Massachusetts Institute of Technology
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-foreground leading-[1.1] text-balance mb-8">
            Poggio Lab
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-12 text-pretty">
            At the Center for Biological and Computational Learning (CBCL), we study the theory of learning under physical, computational, and biological constraints. Using a multidisciplinary approach, we investigate when and how learning is possible to better understand the brain and to build better machines.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/blogsupdates"
              className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Blogs and Updates
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="#publications"
              className="inline-flex items-center gap-2 text-foreground px-6 py-3 text-sm font-medium hover:text-muted-foreground transition-colors"
            >
              View Publications
            </Link>
          </div>
        </div>
      </section>

      <BlogSection
        posts={blogPosts}
        title="Latest Blog Posts"
        subtitle="From the Lab"
        id="blog"
        viewAllLink="/blogsupdates?filter=Blog"
      />

      {/* About Section */}
      <section id="about" className="py-32 px-6 bg-card">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-1 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground mb-4">
                Principal Investigator
              </p>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-6 text-balance">
                Tomaso Poggio
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Tomaso A. Poggio is a founder of computational neuroscience. He pioneered models of visual perception, bridged neuroscience and machine learning, and helped establish regularization theory and learning theory in vision. His work now focuses on the mathematics of deep learning and visual recognition.

                He has founded, advised, or invested in multiple technology companies, including DeepMind and Mobileye, and mentored leaders such as Christof Koch, Amnon Shashua, and Demis Hassabis. Poggio is the Eugene McDermott Professor at MIT and former co-director of the Center for Brains, Minds, and Machines. As of 2024, he stands as the largest individual recipient of NSF AI funding over a 14-year period, responsible for over a quarter of all such funding awarded to MIT.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://scholar.google.com/citations?hl=en&user=WgAGy7wAAAAJ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-muted-foreground transition-colors"
                >
                  Google Scholar
                  <ArrowUpRight className="w-4 h-4" />
                </a>
                <a
                  href="mailto:tp@mit.edu"
                  className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-muted-foreground transition-colors"
                >
                  tp@csail.mit.edu
                  <ArrowUpRight className="w-4 h-4" />
                </a>
                <a
                  href={`${getBasePath()}/assets/HistoryNeuroscienceAutobioTomasoPoggio%20(1).pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-muted-foreground transition-colors"
                >
                  Autobiography
                  <ArrowUpRight className="w-4 h-4" />
                </a>
                <a
                  href={`${getBasePath()}/assets/PoggioCV-2020Draft.pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-muted-foreground transition-colors"
                >
                  CV
                  <ArrowUpRight className="w-4 h-4" />
                </a>

              </div>
            </div>
            {/* <div className="order-1 lg:order-2">
              <div className="aspect-[4/5] rounded-2xl bg-muted overflow-hidden max-w-md mx-auto lg:max-w-none">
                <img
                  src="/people/poggio-240x300.jpg"
                  alt="Tomaso Poggio"
                  className="w-full h-full object-cover"
                />
              </div>
            </div> */}
          </div>
        </div>
      </section>

      {/* Research Section */}
      <section id="research" className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-20">
            <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground mb-4">
              Research Focus
            </p>
            {/* <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-6 text-balance">
              Pushing the boundaries of what we know about intelligence
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our interdisciplinary approach combines experimental neuroscience,
              computational modeling, and machine learning.
            </p> */}
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {researchAreas.map((area) => (
              <div
                key={area.title}
                className="group p-8 rounded-2xl bg-card border border-border hover:border-foreground/20 transition-colors"
              >
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {area.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {area.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TeamSection />

      {/* Publications Section */}
      <PublicationsSection />
      <section id="seminar" className="py-32 px-6 bg-card">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground mb-4">
                New Seminar Series
              </p>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-6 text-balance">
                AI: Foundations -- for Academia (and Startups)
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                The landscape of AI research is shifting. Many problems that once defined academia are now dominated by scale, data, and incumbent advantage. Yet the most important questions remain open. What are the fundamental principles of intelligence, and how can they guide systems that learn efficiently, generalize robustly, and create real societal and economic value?
                This seminar argues that academia remains the place to identify and test principles of intelligence. Startups remain the place to turn those principles into systems that matter.
                We convene the MIT-area community to identify foundational principles that are shared by biological and artificial intelligence, and translate them into deployable, venture-scale technologies.
                We will connect empirical evidence from cognitive development, systems neuroscience, and modern AI systems with formal structure in learning and reasoning, including sample efficiency, sparse compositionality, invariances, memory, optimization dynamics, and generalization.
                By the end of the series, we will have identified and tested key conjectures about intelligence and built new collaborations between labs and startups.

              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://calendar.google.com/calendar/embed?src=133119be73327f71c4508b0f3c18740ab10865a7869175ce7df567e66997f403%40group.calendar.google.com&ctz=America%2FNew_York"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-muted-foreground transition-colors"
                >
                  <CalendarPlus className="w-4 h-4" />
                  Add to Google Calendar
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>
            <div>
              <SeminarTimeline />
            </div>
          </div>
        </div>
      </section>


      <BlogSection
        posts={updatePosts}
        title="News & Updates"
        subtitle="Latest Updates"
        id="updates"
        viewAllLink="/blogsupdates?filter=Updates"
        viewAllText="View all updates"
      />


      <Footer />
    </main>
  )
}
