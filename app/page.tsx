import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { TeamSection } from "@/components/team-section"
import { BlogSection } from "@/components/blog-section"
import { PublicationsSection } from "@/components/publications-section"
import { Footer } from "@/components/footer"
import { ArrowRight, ArrowUpRight, Bot, Users, FlaskConical, BookOpen, Terminal, Cpu, GitBranch, FileText } from "lucide-react"
import { getAllPostSlugs, getPostData } from "@/lib/blogs"
import { blogs as staticBlogs } from "@/app/data/blogs"

/*
 * Capabilities data — hidden for now but kept for future reuse.
 * To re-enable, uncomment the Capabilities Section in the JSX below.
 */
// const capabilities = [
//   {
//     icon: Bot,
//     title: "Multi-Agent Pipeline",
//     description:
//       "22 specialist agents coordinated via LangGraph work together across literature review, theorem proving, experimentation, and paper writing.",
//   },
//   {
//     icon: Users,
//     title: "Human-on-the-Loop",
//     description:
//       "Designed to produce high-quality research with minimal steering. Go from hypothesis to written article in as few as 10 prompts.",
//   },
//   {
//     icon: FlaskConical,
//     title: "Theory & Experiments",
//     description:
//       "Parallel tracks for mathematical theorem proving with verification and computational experiment design with validation.",
//   },
//   {
//     icon: BookOpen,
//     title: "Literature-Grounded",
//     description:
//       "Automated literature review, citation management, and a persona council that critically evaluates research directions.",
//   },
// ]

const pipelineSteps = [
  {
    icon: BookOpen,
    title: "Literature Review",
    description: "Search and synthesize relevant papers from ArXiv and the web.",
  },
  {
    icon: GitBranch,
    title: "Hypothesis Evaluation",
    description: "A persona council of 3 critical reviewers debates and refines research directions.",
  },
  {
    icon: Cpu,
    title: "Theory & Experiments",
    description: "Parallel tracks: prove theorems rigorously and design/run computational experiments.",
  },
  {
    icon: FileText,
    title: "Paper Synthesis",
    description: "Synthesize results into a structured, publication-quality manuscript.",
  },
  {
    icon: Terminal,
    title: "Review & Proofread",
    description: "Automated proofreading, peer-review scoring, and quality validation gates.",
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
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-foreground leading-[1.1] text-balance mb-4">
            PoggioAI
          </h1>
          <p className="text-base md:text-lg text-muted-foreground italic mb-2">
            <span className="font-bold">P</span>roof-<span className="font-bold">O</span>riented <span className="font-bold">G</span>enerative <span className="font-bold">G</span>eneral <span className="font-bold">I</span>ntelligence <span className="font-bold">O</span>rchestration: <span className="font-bold">A</span>gentic <span className="font-bold">I</span>nvestigation
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            Built by the{" "}
            <a
              href="https://poggio-lab.mit.edu"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground transition-colors"
            >
              Poggio Lab team at MIT
            </a>
          </p>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-12 text-pretty">
            Try PoggioAI/MSc, a multi-agent AI system that turns research hypotheses into high-quality, literature-grounded, experiment-backed papers with minimal human steering.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#quickstart"
              className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="https://github.com/PoggioAI/PoggioAI_MSc/tree/MSc_Prod"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-foreground px-6 py-3 text-sm font-medium hover:text-muted-foreground transition-colors"
            >
              View on GitHub
              <ArrowUpRight className="w-4 h-4" />
            </a>
            <a
              href="https://discord.gg/qSb23gTD"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-foreground px-6 py-3 text-sm font-medium hover:text-muted-foreground transition-colors"
            >
              Join us on Discord
              <ArrowUpRight className="w-4 h-4" />
            </a>
            <a
              href="#publications"
              className="inline-flex items-center gap-2 text-foreground px-6 py-3 text-sm font-medium hover:text-muted-foreground transition-colors"
            >
              Read the Papers
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 px-6 bg-card">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-1 gap-16 items-center">
            <div>
              <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground mb-4">
                About the Project
              </p>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-6 text-balance">
                PoggioAI
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Current AI systems require on the order of 10<sup>2</sup> to 10<sup>3</sup> prompts to go from a research idea to a written paper. PoggioAI aims to reduce this to up to 10 human interactions.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                This is not about fully automating research or replacing human creativity. PoggioAI focuses on the rigorous establishment of ideas: matching theory with experiments, distinguishing correlation from causation, proposing parallel explanations and testing them. The human provides the idea; the system does the structured work of turning it into a solid manuscript.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://github.com/PoggioAI/PoggioAI_MSc/tree/MSc_Prod"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-muted-foreground transition-colors"
                >
                  GitHub Repository
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Getting Started Section */}
      <section id="quickstart" className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground mb-4">
              Getting Started
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-6 text-balance">
              5-Minute Quickstart to{" "}
              <span className="italic">MSc</span>
            </h2>
            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground mb-8">
              <span>Cost: ~$2&ndash;10</span>
              <span>Time: 15&ndash;40 min</span>
              <span>Requires: one API key</span>
            </div>
          </div>

          <div className="rounded-2xl bg-background border border-border p-6 md:p-8 overflow-x-auto">
            <pre className="text-sm text-foreground font-mono leading-relaxed whitespace-pre-wrap">
{`# 1. Bootstrap environment (one-time, ~5 min)
./scripts/bootstrap.sh researchlab minimal

conda activate researchlab

# 2. Set your API key (only one provider needed)
cp .env.example .env
echo "ANTHROPIC_API_KEY=your_key_here" >> .env

# 3. Validate setup without spending tokens
python launch_multiagent.py --task "test" --dry-run

# 4. Run the included quickstart example (~$3)
python launch_multiagent.py \\
  --task "$(cat examples/quickstart/task.txt)" \\
  --output-format markdown \\
  --no-counsel \\
  --no-log-to-files`}
            </pre>
          </div>

          <p className="text-sm text-muted-foreground mt-6">
            After the run, look in <code className="text-foreground">results/MSc_Student_&lt;timestamp&gt;/</code> for your generated paper and artifacts.
          </p>

          <div className="mt-8">
            <a
              href="https://github.com/PoggioAI/PoggioAI_MSc/tree/MSc_Prod"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-muted-foreground transition-colors"
            >
              Full documentation on GitHub
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-32 px-6 bg-card">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-16">
            <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground mb-4">
              How It Works
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-6 text-balance">
              From Hypothesis to Paper
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              PoggioAI orchestrates 22 specialist agents through a structured research pipeline. Each stage produces artifacts that feed into the next, with human checkpoints for steering.
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-6">
            {pipelineSteps.map((step, index) => (
              <div key={step.title} className="relative">
                <div className="p-6 rounded-2xl bg-background border border-border hover:border-foreground/20 transition-colors h-full">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-mono text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
                    <step.icon className="w-5 h-5 text-foreground" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
                {index < pipelineSteps.length - 1 && (
                  <div className="hidden md:flex absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-4 h-4 text-muted-foreground/40" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities Section — hidden for now, uncomment to re-enable
      <section id="capabilities" className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-20">
            <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground mb-4">
              Key Capabilities
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {capabilities.map((cap) => (
              <div
                key={cap.title}
                className="group p-8 rounded-2xl bg-card border border-border hover:border-foreground/20 transition-colors"
              >
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {cap.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {cap.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      */}

      <TeamSection />

      {/* Publications Section */}
      <PublicationsSection />

      {updatePosts.length > 0 && (
        <BlogSection
          posts={updatePosts}
          title="News & Updates"
          subtitle="Latest Updates"
          id="updates"
          viewAllLink="/blogsupdates?filter=Updates"
          viewAllText="View all updates"
        />
      )}

      {blogPosts.length > 0 && (
        <BlogSection
          posts={blogPosts}
          title="Latest Blog Posts"
          subtitle="From the Lab"
          id="blog"
          viewAllLink="/blogsupdates?filter=Blog"
        />
      )}

      <Footer />
    </main>
  )
}
