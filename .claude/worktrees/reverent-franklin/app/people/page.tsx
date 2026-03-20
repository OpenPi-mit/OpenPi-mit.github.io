import { Navigation } from "@/components/navigation"
import { getBasePath } from "@/lib/utils"
import { Footer } from "@/components/footer"
import { peopleData } from "../data/people"

const toId = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export default function PeoplePage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-6xl mx-auto px-6 py-24 pt-32">
        <div className="mb-20">
          <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground mb-4">
            People
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground mb-6 text-balance">
            Who We Are
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            The researchers behind PoggioAI.
          </p>
        </div>

        {peopleData.map((section) => (
          <section key={section.title} className="mb-24" id={toId(section.title)}>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground mb-10 border-b border-border/50 pb-4">
              {section.title}
            </h2>

            {section.type === 'grid' ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {section.members.map((member, i) => {
                  const card = (
                    <>
                      <div className="aspect-square rounded-2xl bg-muted mb-5 overflow-hidden">
                        {member.image ? (
                          <img
                            src={`${getBasePath()}${member.image}`}
                            alt={member.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-muted to-border flex items-center justify-center">
                            <span className="text-3xl font-light text-muted-foreground/50 select-none">
                              {member.name.split(' ').map(n => n.replace(/[().]/g, '')).filter(Boolean).map(n => n[0]).slice(0, 2).join('')}
                            </span>
                          </div>
                        )}
                      </div>
                      <h3 className="text-base font-semibold text-foreground mb-1">
                        {member.name}
                      </h3>
                      {member.role && (
                        <p className="text-sm text-muted-foreground">
                          {member.role}
                        </p>
                      )}
                      {member.affiliation && (
                        <p className="text-sm text-muted-foreground">
                          {member.affiliation}
                        </p>
                      )}
                      {member.bio && (
                        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                          {member.bio}
                        </p>
                      )}
                    </>
                  )

                  return member.link ? (
                    <a key={`${member.name}-${i}`} href={member.link} target="_blank" rel="noopener noreferrer" className="group cursor-pointer">
                      {card}
                    </a>
                  ) : (
                    <div key={`${member.name}-${i}`} className="group">
                      {card}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
                {section.members.map((member, i) => (
                  <div
                    key={`${member.name}-${i}`}
                    className="flex flex-col py-2"
                  >
                    <h3 className="text-sm font-semibold text-foreground">
                      {member.name}
                    </h3>
                    {member.affiliation && (
                      <p className="text-sm text-muted-foreground">
                        {member.affiliation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}

      </div>
      <Footer />
    </main>
  )
}
