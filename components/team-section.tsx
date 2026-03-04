import Link from "next/link"
import { ArrowRight, User, Users } from "lucide-react"
import { peopleData } from "../app/data/people"

import { getBasePath } from "@/lib/utils"

const excludedSections = [
  "Former Postdoctoral Associates & PhD Students",
  "Former Masters Students & Visitors"
]

const filteredPeopleData = peopleData.filter(section => !excludedSections.includes(section.title))

export function TeamSection() {
  return (
    <section id="people" className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16 border-b border-border pb-8">
          <div className="max-w-2xl">

            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
              Researchers
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our students and visiting researchers have expertise in physics, computer science, cognitive psychology, and complexity theory.
            </p>
          </div>
          <Link
            href="/people"
            className="group inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors shrink-0"
          >
            View past members
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-8 gap-y-12">
          {filteredPeopleData.flatMap(section => section.members).map((member, i) => (
            <div key={`${member.name}-${i}`} className="group flex flex-col items-center text-center">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full mb-4 overflow-hidden ring-4 ring-background group-hover:ring-primary/20 transition-all duration-300 shadow-md group-hover:shadow-lg">
                {member.image ? (
                  <img
                    src={`${getBasePath()}${member.image}`}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-secondary to-muted flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <span className="text-2xl font-light text-muted-foreground/40 select-none group-hover:text-primary/40 transition-colors">
                      {member.name.split(' ').map(n => n.replace(/[().]/g, '')).filter(Boolean).map(n => n[0]).slice(0, 2).join('')}
                    </span>
                  </div>
                )}
              </div>
              <h3 className="text-base font-semibold text-foreground leading-tight px-2 group-hover:text-primary transition-colors">
                {member.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {member.role || "Researcher"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
