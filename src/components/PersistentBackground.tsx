"use client";

import { usePathname } from "next/navigation";
import { ParticleCloudScene } from "@/components/ParticleCloudScene";
import { themeTokens } from "@/lib/theme";

export function PersistentBackground() {
  const pathname = usePathname();
  const organicCursor = pathname === "/";

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      style={{ backgroundColor: themeTokens.background }}
      aria-hidden="true"
    >
      <ParticleCloudScene organicCursor={organicCursor} />
    </div>
  );
}
