"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  CarFront,
  History,
  LogOut,
  Menu,
  ShieldCheck,
  User,
  X,
} from "lucide-react";
import type { Route } from "@/hooks/use-hash-route";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type Props = {
  route: Route;
  navigate: (r: Route) => void;
};

const NAV_LINKS: { route: Route; label: string; icon?: React.ComponentType<{ className?: string }> }[] = [
  { route: { name: "home" }, label: "Home" },
  { route: { name: "find" }, label: "Find Ride" },
  { route: { name: "offer" }, label: "Offer Ride" },
  { route: { name: "history" }, label: "My Rides", icon: History },
  { route: { name: "how" }, label: "How It Works" },
  { route: { name: "profile" }, label: "Profile", icon: User },
];

export function Navbar({ route, navigate }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, loading, refresh } = useCurrentUser();
  const { toast } = useToast();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (r: Route) => {
    setMobileOpen(false);
    navigate(r);
  };

  const handleLogout = async () => {
    try {
      const csrfResp = await fetch("/api/auth/csrf");
      const { csrfToken } = await csrfResp.json();
      const body = new URLSearchParams();
      body.set("csrfToken", csrfToken);
      body.set("callbackUrl", "/login");
      await fetch("/api/auth/signout", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
    } catch {
      // ignore
    }
    toast({ title: "Logged out successfully", description: "See you soon!" });
    await refresh();
    window.location.href = "/login";
  };

  const isActive = (r: Route) => {
    if (r.name !== route.name) return false;
    if ("id" in r || "id" in route) return false;
    return true;
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-ink-200/70 bg-white/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="container-page flex h-16 items-center justify-between sm:h-18">
        <button onClick={() => go({ name: "home" })} className="flex items-center gap-2.5">
          <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-ink-900 text-lime shadow-sm">
            <CarFront className="h-5 w-5" />
            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-brand-500 ring-2 ring-white" />
          </span>
          <span className="font-bold text-lg tracking-tight text-ink-900">
            V<span className="text-brand-600">-</span>Ride
          </span>
        </button>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <button
              key={link.label}
              onClick={() => go(link.route)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                isActive(link.route)
                  ? "bg-ink-900 text-white shadow-sm"
                  : "text-ink-600 hover:text-ink-900 hover:bg-ink-100",
              )}
            >
              {link.icon && <link.icon className="h-3.5 w-3.5" />}
              {link.label}
            </button>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {loading ? null : user ? (
            <>
              {user.isVitApStudent && (
                <span className="hidden lg:inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-brand-700 ring-1 ring-emerald-100">
                  <ShieldCheck className="h-3 w-3" /> VIT-AP Verified
                </span>
              )}
              <button
                onClick={() => go({ name: "profile" })}
                className="inline-flex items-center gap-2 rounded-xl border border-ink-200 bg-white px-2.5 py-1.5 text-xs hover:bg-ink-50"
              >
                {user.picture ? (
                  <img src={user.picture} alt={user.name ?? "User"} className="h-6 w-6 rounded-lg object-cover" />
                ) : (
                  <span className="grid h-6 w-6 place-items-center rounded-lg bg-ink-900 text-[10px] font-bold text-lime">
                    {(user.name ?? user.email).slice(0, 2).toUpperCase()}
                  </span>
                )}
                <span className="font-semibold text-ink-900 max-w-[100px] truncate">
                  {user.name ?? user.email.split("@")[0]}
                </span>
              </button>
              <button onClick={handleLogout} className="vride-btn-ghost text-xs h-9 px-3">
                <LogOut className="h-3.5 w-3.5" /> Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="vride-btn-brand text-xs h-9 px-4">
              Login
            </Link>
          )}
        </div>

        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="md:hidden grid h-10 w-10 place-items-center rounded-xl border border-ink-200 bg-white text-ink-700"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden"
          >
            <div className="container-page pb-4">
              <div className="overflow-hidden rounded-3xl border border-ink-200 bg-white shadow-lg">
                <nav className="flex flex-col p-2">
                  {NAV_LINKS.map((link) => (
                    <button
                      key={link.label}
                      onClick={() => go(link.route)}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium transition-colors text-left",
                        isActive(link.route)
                          ? "bg-ink-900 text-white"
                          : "text-ink-700 hover:bg-ink-100",
                      )}
                    >
                      {link.icon && <link.icon className="h-4 w-4" />}
                      {link.label}
                    </button>
                  ))}
                  <div className="grid grid-cols-2 gap-2 p-2 pt-3">
                    {!user && (
                      <Link href="/login" className="vride-btn-brand text-xs h-9 col-span-2">
                        Login
                      </Link>
                    )}
                    {user && (
                      <button onClick={handleLogout} className="vride-btn-ghost text-xs h-9 col-span-2">
                        <LogOut className="h-3.5 w-3.5" /> Logout
                      </button>
                    )}
                  </div>
                </nav>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile bottom navigation */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-ink-200 bg-white/95 backdrop-blur-xl">
        <div className="grid grid-cols-5 gap-1 px-2 py-1.5">
          {[
            { route: { name: "home" } as Route, label: "Home", icon: CarFront },
            { route: { name: "find" } as Route, label: "Find", icon: CarFront },
            { route: { name: "history" } as Route, label: "Rides", icon: History },
            { route: { name: "profile" } as Route, label: "Profile", icon: User },
            { route: { name: "offer" } as Route, label: "Offer", icon: CarFront },
          ].map((item) => {
            const Icon = item.icon;
            const active = isActive(item.route);
            return (
              <button
                key={item.label}
                onClick={() => go(item.route)}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 rounded-xl py-1.5 text-[10px] font-medium transition-colors",
                  active ? "text-brand-700" : "text-ink-500",
                )}
              >
                <Icon className={cn("h-4 w-4", active && "text-brand-700")} />
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
