"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

export default function NavBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = useMemo(
    () => [
      { href: "/", label: "Home" },
      { href: "/about", label: "About" },
      { href: "/student", label: "My Applications" },
      
    ],
    []
  );

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-50">
      <div className="mx-auto max-w-6xl px-4 py-3">
        <nav className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] backdrop-blur">
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[var(--brand)] via-[var(--brand-2)] to-[var(--brand-light)] opacity-80" />

          <div className="flex items-center justify-between px-4 py-3 sm:px-5">
            <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
              <img
                src="/logo.png"
                alt="codeK logo"
                className="h-8 w-auto hidden sm:block"
                onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
              />
           
              
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`rounded-xl px-3 py-2 text-sm transition-colors ${
                    isActive(l.href)
                      ? "bg-[rgba(31,74,168,0.12)] text-[var(--foreground)]"
                      : "text-[var(--muted)] hover:bg-[rgba(15,31,61,0.08)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
              <Link
                href="/"
                className="ml-2 inline-flex items-center rounded-xl bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:brightness-110 transition"
              >
                Browse Tracks
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[rgba(255,255,255,0.35)] text-[var(--foreground)] hover:bg-[rgba(255,255,255,0.6)] transition"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {open ? (
                  <path
                    d="M6 6L18 18M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                ) : (
                  <path
                    d="M4 7H20M4 12H20M4 17H20"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                )}
              </svg>
            </button>
          </div>

          {open && (
            <div className="md:hidden border-t border-[var(--border)] px-4 pb-4">
              <div className="grid gap-2 pt-3">
                {links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={`rounded-xl px-3 py-2 text-sm transition-colors ${
                      isActive(l.href)
                        ? "bg-[rgba(31,74,168,0.12)] text-[var(--foreground)]"
                        : "text-[var(--muted)] hover:bg-[rgba(15,31,61,0.08)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    {l.label}
                  </Link>
                ))}
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="mt-1 inline-flex items-center justify-center rounded-xl bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white hover:brightness-110 transition"
                >
                  Browse Tracks
                </Link>
              </div>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

