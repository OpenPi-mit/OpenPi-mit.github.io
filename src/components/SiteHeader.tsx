"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { themeTokens } from "@/lib/theme";

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/people", label: "People" },
  { href: "/publications", label: "Publications" },
  { href: "/blogsupdates", label: "Blog & Updates" },
  { href: "/docs", label: "Docs" },
] as const;

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}

export function SiteHeader() {
  const token = themeTokens;
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Close drawer on navigation; external route change is the "event" here.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync menu with URL
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => {
      if (mq.matches) setMenuOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-20 border-b border-white/10 py-4">
      <div className="page-gutter-x relative z-[35] flex w-full items-center justify-between text-sm">
        <Link href="/" className="pointer-events-auto flex items-center gap-2">
          <div className="relative h-8 w-8 shrink-0">
            <Image
              src="/pai-logo.png"
              alt="pAI logo"
              fill
              sizes="32px"
              className="object-contain object-left brightness-0 invert"
              priority
            />
          </div>
          <span className="text-2xl font-semibold tracking-tight" style={{ color: token.textPrimary }}>
            pAI
          </span>
        </Link>

        <nav
          className="pointer-events-auto hidden items-center gap-6 text-xs md:flex md:text-sm"
          style={{ color: token.textSecondary }}
          aria-label="Main"
        >
          {NAV_LINKS.map(({ href, label }) => (
            <Link key={href} href={href} className="transition-opacity hover:opacity-70">
              {label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="pointer-events-auto -mr-1 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md border border-white/15 text-neutral-100 md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-site-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {menuOpen ? (
        <>
          <button
            type="button"
            className="pointer-events-auto fixed inset-0 z-[25] bg-black/80 md:hidden"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
          <div
            id="mobile-site-nav"
            className="pointer-events-auto relative z-[28] border-b border-white/10 bg-black pb-4 pt-1 md:hidden"
            style={{ boxShadow: "0 28px 56px rgba(0,0,0,0.65)" }}
          >
            <nav className="page-gutter-x flex flex-col" style={{ color: token.textSecondary }} aria-label="Main mobile">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="border-b border-white/[0.08] py-3.5 text-base leading-snug last:border-b-0 active:opacity-80"
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </>
      ) : null}
    </header>
  );
}
