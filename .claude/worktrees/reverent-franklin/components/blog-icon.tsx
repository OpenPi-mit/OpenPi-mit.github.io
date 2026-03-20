"use client"

import { useRef, useState, useEffect } from "react"
import { cn, getBasePath } from "@/lib/utils"

interface BlogIconProps {
    slug: string
    className?: string
}

export function BlogIcon({ slug, className }: BlogIconProps) {
    const [svgContent, setSvgContent] = useState<string | null>(null)
    const [error, setError] = useState(false)

    const containerRef = useRef<HTMLDivElement>(null)
    const animationsRef = useRef<Map<string, Animation>>(new Map())

    useEffect(() => {
        // Add cache buster to force reload
        fetch(`${getBasePath()}/blogsupdates/${slug}/icon?v=${Date.now()}`)
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch")
                return res.text()
            })
            .then((text) => setSvgContent(text))
            .catch((err) => {
                console.error("Failed to fetch icon", err)
                setError(true)
            })
    }, [slug])

    const handleMouseEnter = () => {
        if (!containerRef.current) return

        // Find all orbit groups
        // Use querySelectorAll to find all groups matching the pattern
        // The script generates classes like 'js-orbit-group-1', 'js-orbit-group-2'
        const groups = containerRef.current.querySelectorAll<SVGGElement>('[class*="js-orbit-group"]')

        if (groups.length === 0) return

        groups.forEach((group) => {
            // Extract index from class name if possible to determine speed
            // Pattern: js-orbit-group-N
            // If the script generated 'js-orbit-group' (fallback for single), treat as 1
            const match = group.getAttribute('class')?.match(/js-orbit-group-(\d+)/)
            const index = match ? parseInt(match[1]) : 1

            handleSingleGroup(group, index)
        })
    }

    const handleSingleGroup = (group: Element, index: number) => {
        // Base period 20s. Others are faster multiples.
        // T_slowest = 20s.
        // T_other = 20s / index.
        const BASE_DURATION = 20000
        const duration = BASE_DURATION / index

        // Identifier for map. Use a unique class or index
        // We can use the class name itself as key
        const id = Array.from(group.classList).find(c => c.startsWith('js-orbit-group')) || 'default'

        // Check existing animation for THIS group
        const existingAnim = animationsRef.current.get(id)

        if (!existingAnim) {
            const keyframes = [
                { transform: 'rotate(0deg)' },
                { transform: 'rotate(360deg)' }
            ]

            const anim = group.animate(keyframes, {
                duration: duration,
                iterations: Infinity
            })
            animationsRef.current.set(id, anim)
        } else {
            existingAnim.playbackRate = 1
            existingAnim.play()
        }
    }

    const handleMouseLeave = () => {
        if (!containerRef.current) return

        // Iterate over all active animations
        animationsRef.current.forEach((anim, id) => {
            // Find the group element again (or we could store it in map too, but map key is class string)
            // Or just assume anim.effect.target is the element
            // WAAPI Animation has effect.target
            const group = (anim.effect as KeyframeEffect)?.target as HTMLElement
            if (!group) return

            anim.pause()

            // Determine duration from animation effect timing
            // We need to know original duration to calc progress correctly
            const timing = anim.effect?.getTiming()
            const originalDuration = Number(timing?.duration) || 20000

            const currentTime = (anim.currentTime as number) || 0
            const progress = (currentTime % originalDuration) / originalDuration
            const currentAngle = progress * 360

            // Target based on shortest path to 0 or 360?
            // User requested: "elastic when hoving stops"
            // And implicitly "ends at init conditions". So target is 0 (or 360).
            const targetAngle = progress > 0.5 ? 360 : 0

            // Calculate distance
            const distance = Math.abs(targetAngle - currentAngle)

            // Speed up return
            // base speed: 360 deg in originalDuration
            // return speed: faster
            const fastTime = (distance / 360) * originalDuration / 2 // 2x speed return?

            const keyframes = [
                { transform: `rotate(${currentAngle}deg)` },
                { transform: `rotate(${targetAngle}deg)` }
            ]

            anim.cancel()

            const exitAnim = group.animate(keyframes, {
                duration: fastTime,
                fill: 'forwards',
                easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' // Elastic overshoot
            })

            // Update map
            animationsRef.current.set(id, exitAnim)

            exitAnim.onfinish = () => {
                exitAnim.cancel()
                // set transform to 0 explicitly to avoid jump if css doesn't hold?
                // actually cancel removes transform so it goes to 0 (default).
                animationsRef.current.delete(id)
            }
        })
    }


    if (error || !svgContent) {
        return (
            <div className={cn("w-full h-full bg-muted animate-pulse", className)} />
        )
    }

    return (
        <div
            ref={containerRef}
            className={cn(
                "w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:object-cover",
                className
            )}
            dangerouslySetInnerHTML={{ __html: svgContent }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        />
    )
}
