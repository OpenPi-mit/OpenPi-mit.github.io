"use client"

import { cn } from "@/lib/utils"

interface PdfIconProps {
    className?: string
}

export function PdfIcon({ className }: PdfIconProps) {
    return (
        <div className={cn("relative w-full h-full bg-muted flex items-center justify-center overflow-hidden group", className)}>
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-20">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-muted-foreground/30" />
                    </pattern>
                    <rect width="100" height="100" fill="url(#grid)" />
                </svg>
            </div>

            {/* Main Icon Group */}
            <div className="relative z-10 flex flex-col items-center transform transition-transform duration-500 group-hover:scale-110">
                {/* Document Shape */}
                <div className="relative w-16 h-20 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 shadow-xl">
                    {/* Corner Fold */}
                    <div className="absolute top-0 right-0 w-6 h-6 bg-white/10 rounded-bl-lg border-b border-l border-white/10" />

                    {/* Text Lines */}
                    <div className="absolute top-8 left-3 right-3 space-y-2">
                        <div className="h-1 w-3/4 bg-white/20 rounded-full" />
                        <div className="h-1 w-full bg-white/20 rounded-full" />
                        <div className="h-1 w-5/6 bg-white/20 rounded-full" />
                    </div>

                    {/* PDF Label Tag */}
                    <div className="absolute -bottom-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg transform rotate-[-5deg]">
                        PDF
                    </div>
                </div>
            </div>

            {/* Decorative Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 pointer-events-none" />
        </div>
    )
}
