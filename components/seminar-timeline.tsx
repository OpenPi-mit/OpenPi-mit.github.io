import { Calendar, Clock, MapPin, User } from "lucide-react"

const seminars = [
    {
        date: "March 3, 2025",
        time: "4:00 PM ET",
        speaker: "Tomaso Poggio",
        affiliation: "MIT, McGovern Institute",
        title: "Principles of Deep Learning",
        location: "McGovern Reading Room (46-5165)",
    },
    {
        date: "March 9, 2025",
        time: "4:00 PM ET",
        speaker: "Adam Marblestone",
        affiliation: "CEO, Convergent Research",
        title: "Unblocking Whole Brain Neuroscience and Neuro-AI",
        location: "McGovern Reading Room (46-5165)",
    },
    {
        date: "March 16, 2025",
        time: "4:00 PM ET",
        speaker: "Blaise Agüera y Arcas",
        affiliation: "Vice President and CTO of Technology & Society, Google",
        title: "Intelligence as Prediction: Cybernetics, LLMs, and Sociality",
        location: "Singleton Auditorium (46-3002)",
    },
    {
        date: "March 30, 2025",
        time: "4:00 PM ET",
        speaker: "Joe Bates",
        affiliation: "President, Singular Computing",
        title: "A Billion Core",
        location: "McGovern Reading Room (46-5165)",
    },
]

export function SeminarTimeline() {
    return (
        <div className="relative py-4">
            {/* Vertical line */}
            <div className="absolute left-[9px] top-4 bottom-4 w-[1px] bg-border" />

            <div className="space-y-12">
                {seminars.map((seminar, index) => (
                    <div key={index} className="relative group pl-10">
                        {/* Timeline dot */}
                        <div className="absolute left-0 top-1.5 w-[19px] h-[19px] rounded-full border border-border bg-background group-hover:border-foreground group-hover:scale-110 transition-all duration-300 z-10 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-foreground/20 group-hover:bg-foreground transition-colors duration-300" />
                        </div>

                        <div className="flex flex-col gap-2">
                            {/* Date and Time badge */}
                            <div className="flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                <span className="flex items-center gap-1.5 text-foreground bg-muted/50 px-2.5 py-1 rounded-full border border-border/50">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {seminar.date}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5" />
                                    {seminar.time}
                                </span>
                            </div>

                            {/* Title */}
                            <h3 className="text-xl font-semibold text-foreground group-hover:text-foreground/80 transition-colors mt-1">
                                {seminar.title}
                            </h3>

                            {/* Speaker Info */}
                            <div className="flex items-center gap-2 text-base text-muted-foreground">
                                <div className="flex items-center gap-2 font-medium text-foreground">
                                    <User className="w-4 h-4" />
                                    {seminar.speaker}
                                </div>
                                <span>•</span>
                                <span className="italic opacity-80">{seminar.affiliation}</span>
                            </div>

                            {/* Location */}
                            <div className="flex items-center gap-2 text-sm text-muted-foreground/80 mt-1">
                                <MapPin className="w-3.5 h-3.5" />
                                {seminar.location}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="pl-10 mt-10">
                <a href="https://calendar.google.com/calendar/embed?src=133119be73327f71c4508b0f3c18740ab10865a7869175ce7df567e66997f403%40group.calendar.google.com&ctz=America%2FNew_York" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-foreground hover:text-muted-foreground transition-colors inline-flex items-center gap-2">
                    View Full Schedule
                    <span aria-hidden="true">→</span>
                </a>
            </div>
        </div>
    )
}
