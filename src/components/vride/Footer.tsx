"use client";

import Link from "next/link";
import { CarFront, Github, Heart, Instagram, Linkedin, Lock, ShieldCheck, Twitter } from "lucide-react";
import type { Route } from "@/hooks/use-hash-route";

type Props = { navigate: (r: Route) => void };

const FOOTER_LINKS: { title: string; links: { label: string; route: Route }[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Find Ride", route: { name: "find" } },
      { label: "Offer Ride", route: { name: "offer" } },
      { label: "Dashboard", route: { name: "dashboard" } },
      { label: "How It Works", route: { name: "how" } },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", route: { name: "about" } },
      { label: "Safety", route: { name: "safety" } },
      { label: "Careers", route: { name: "about" } },
      { label: "Contact", route: { name: "about" } },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Student Guide", route: { name: "how" } },
      { label: "Trust & Safety", route: { name: "safety" } },
      { label: "Help Center", route: { name: "about" } },
      { label: "Privacy", route: { name: "about" } },
    ],
  },
];

export function Footer({ navigate }: Props) {
  return (
    <footer className="relative overflow-hidden bg-ink-950 text-white mt-24">
      <div className="absolute inset-0 grid-bg-dark opacity-50" />
      <div className="absolute -top-32 left-1/2 h-64 w-[80%] -translate-x-1/2 rounded-full bg-brand-500/20 blur-3xl" />

      <div className="container-page relative py-16">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <button
              onClick={() => navigate({ name: "home" })}
              className="flex items-center gap-2.5"
            >
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 ring-1 ring-white/15">
                <CarFront className="h-5 w-5 text-lime" />
              </span>
              <span className="font-bold text-lg">
                V<span className="text-brand-400">-</span>Ride
              </span>
            </button>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-300">
              Making student travel smarter and cheaper. Share a ride to VIT-AP, split the
              fare, build community.
            </p>
            <p className="mt-4 text-xs font-medium text-ink-400">
              <span className="gradient-text-dark">"Ride together. Pay less."</span>
            </p>

            <div className="mt-6 flex items-center gap-3">
              {[Twitter, Instagram, Linkedin, Github].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="grid h-9 w-9 place-items-center rounded-xl bg-white/5 text-ink-300 ring-1 ring-white/10 transition-all hover:bg-white/10 hover:text-white"
                  aria-label="Social link"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-7">
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              {FOOTER_LINKS.map((group) => (
                <div key={group.title}>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-400">
                    {group.title}
                  </div>
                  <ul className="mt-3 space-y-2">
                    {group.links.map((link, i) => (
                      <li key={`${group.title}-${i}`}>
                        <button
                          onClick={() => navigate(link.route)}
                          className="text-sm text-ink-300 transition-colors hover:text-white text-left"
                        >
                          {link.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Admin access — discreet but always visible at the bottom of every page */}
        <div className="mt-10 flex flex-col items-start justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 text-xs text-ink-300">
            <ShieldCheck className="h-4 w-4 text-lime" />
            <span>
              <strong className="text-white">Admin access:</strong> Restricted area for V-Ride administrators. Server-side protected.
            </span>
          </div>
          <Link
            href="/admin/login"
            className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-1.5 text-xs font-semibold text-white ring-1 ring-white/15 transition-all hover:bg-white/15"
          >
            <Lock className="h-3.5 w-3.5" /> Admin Login
          </Link>
        </div>

        <div className="mt-6 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-ink-400">
            © {new Date().getFullYear()} V-Ride. Built for the VIT-AP community. Prototype
            for pitch demo.
          </p>
          <p className="inline-flex items-center gap-1.5 text-xs text-ink-300">
            Made for VIT-AP students
            <Heart className="h-3.5 w-3.5 fill-coral text-coral" />
          </p>
        </div>
      </div>
    </footer>
  );
}
