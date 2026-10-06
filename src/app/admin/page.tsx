"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  CarFront,
  CheckCircle2,
  Leaf,
  Loader2,
  LogOut,
  Search,
  ShieldCheck,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatINR } from "@/lib/format";
import { Badge } from "@/components/vride/Badge";
import { EmptyState } from "@/components/vride/EmptyState";

type Customer = {
  id: string;
  googleId?: string | null;
  email: string;
  name: string | null;
  picture: string | null;
  isVitApStudent: boolean;
  emailVerified: boolean;
  role: string;
  firstLoginAt: string;
  lastLoginAt: string;
  loginCount: number;
  totalRides: number;
  completedRides: number;
  cancelledRides: number;
  moneySaved: number;
  co2SavedKg: number;
  rating: number;
  ridesJoined: number;
  ridesOffered: number;
};

type Stats = {
  totalCustomers: number;
  vitapStudents: number;
  otherUsers: number;
  totalRides: number;
  activeRides: number;
  completedRides: number;
};

const FILTERS = [
  { label: "All users", value: "all" },
  { label: "VIT-AP students", value: "vitap" },
  { label: "Non-VIT-AP users", value: "non_vitap" },
  { label: "Recently active", value: "recent" },
  { label: "Most rides", value: "most_rides" },
];

const SORTS = [
  { label: "Latest login", value: "last_login" },
  { label: "Oldest login", value: "oldest_login" },
  { label: "Most rides", value: "most_rides" },
  { label: "Name A–Z", value: "name" },
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalCustomers: 0,
    vitapStudents: 0,
    otherUsers: 0,
    totalRides: 0,
    activeRides: 0,
    completedRides: 0,
  });
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("last_login");

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const url = new URL("/api/admin/customers", window.location.origin);
      url.searchParams.set("q", query);
      url.searchParams.set("filter", filter);
      url.searchParams.set("sort", sort);
      const resp = await fetch(url, { cache: "no-store" });
      if (resp.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await resp.json();
      setCustomers(data.customers ?? []);
      // Compute stats from current customer set (more responsive than another round-trip)
      const all = data.customers ?? [];
      setStats({
        totalCustomers: data.total ?? all.length,
        vitapStudents: all.filter((c: Customer) => c.isVitApStudent).length,
        otherUsers: (data.total ?? all.length) - all.filter((c: Customer) => c.isVitApStudent).length,
        totalRides: all.reduce((s: number, c: Customer) => s + (c.totalRides || 0), 0),
        activeRides: all.filter((c: Customer) => (c.totalRides || 0) > 0).length,
        completedRides: all.reduce((s: number, c: Customer) => s + (c.completedRides || 0), 0),
      });
    } catch (err) {
      toast({
        title: "Failed to load customers",
        description: err instanceof Error ? err.message : "Network error",
      });
    } finally {
      setLoading(false);
    }
  }, [query, filter, sort, router, toast]);

  useEffect(() => {
    const id = window.setTimeout(refresh, 300);
    return () => window.clearTimeout(id);
  }, [refresh]);

  const handleLogout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    toast({ title: "Logged out", description: "Admin session ended." });
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-ink-50">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-ink-200/70 bg-white/80 backdrop-blur-xl">
        <div className="container-page flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-ink-900 text-lime">
              <CarFront className="h-5 w-5" />
            </span>
            <div>
              <div className="text-sm font-bold text-ink-900">V-Ride Admin</div>
              <div className="text-[10px] uppercase tracking-wider text-ink-500">Customer Management</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={refresh}
              className="vride-btn-ghost text-xs h-9"
              disabled={loading}
            >
              {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Refresh"}
            </button>
            <button onClick={handleLogout} className="vride-btn-brand text-xs h-9">
              <LogOut className="h-3.5 w-3.5" /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container-page py-8 sm:py-10">
        {/* Stats cards */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          <StatCard icon={Users} label="Total Customers" value={`${stats.totalCustomers}`} tone="ink" />
          <StatCard icon={ShieldCheck} label="VIT-AP Students" value={`${stats.vitapStudents}`} tone="green" />
          <StatCard icon={Users} label="Other Users" value={`${stats.otherUsers}`} tone="amber" />
          <StatCard icon={CarFront} label="Total Rides" value={`${stats.totalRides}`} tone="brand" />
          <StatCard icon={CarFront} label="Active Rides" value={`${stats.activeRides}`} tone="lime" />
          <StatCard icon={CheckCircle2} label="Completed Rides" value={`${stats.completedRides}`} tone="green" />
        </motion.div>

        {/* Customer list */}
        <div className="mt-8 vride-card overflow-hidden">
          <div className="border-b border-ink-100 bg-ink-50/40 px-5 py-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-base font-bold text-ink-900">Customers</h2>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-400" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search name/email…"
                    className="h-9 w-full rounded-xl border border-ink-200 bg-white pl-9 pr-3 text-xs outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10 sm:w-48"
                  />
                </div>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="h-9 rounded-xl border border-ink-200 bg-white px-2 text-xs outline-none focus:border-brand-400"
                >
                  {FILTERS.map((f) => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </select>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="h-9 rounded-xl border border-ink-200 bg-white px-2 text-xs outline-none focus:border-brand-400"
                >
                  {SORTS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="p-5">
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-2xl border border-ink-100 bg-ink-50/40 p-3">
                    <div className="h-10 w-10 rounded-xl bg-ink-200/60 animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-1/3 rounded bg-ink-200/60 animate-pulse" />
                      <div className="h-2 w-1/2 rounded bg-ink-100 animate-pulse" />
                    </div>
                    <div className="h-7 w-16 rounded-lg bg-ink-200/60 animate-pulse" />
                  </div>
                ))}
              </div>
            ) : customers.length === 0 ? (
              <EmptyState
                title="No customers yet"
                description="When students log in via Google, they'll appear here."
                actions={
                  <button onClick={refresh} className="vride-btn-ghost text-xs h-9">
                    Refresh
                  </button>
                }
              />
            ) : (
              <ul className="space-y-2">
                <AnimatePresence>
                  {customers.map((c, i) => (
                    <motion.li
                      key={c.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <Link
                        href={`/admin/customer/${c.id}`}
                        className="flex flex-wrap items-center gap-3 rounded-2xl border border-ink-200 bg-white p-3 transition-colors hover:border-ink-300 hover:bg-ink-50/40"
                      >
                        {c.picture ? (
                          <img src={c.picture} alt={c.name ?? c.email} className="h-10 w-10 rounded-xl object-cover ring-2 ring-white" />
                        ) : (
                          <span className="grid h-10 w-10 place-items-center rounded-xl bg-ink-900 text-[10px] font-bold text-lime">
                            {(c.name ?? c.email).slice(0, 2).toUpperCase()}
                          </span>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 text-sm font-semibold text-ink-900">
                            <span className="truncate">{c.name ?? "Anonymous"}</span>
                            {c.isVitApStudent && (
                              <Badge tone="green">
                                <ShieldCheck className="h-3 w-3" /> VIT-AP Student
                              </Badge>
                            )}
                          </div>
                          <div className="truncate text-xs text-ink-500">{c.email}</div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-ink-500">
                          <span className="rounded-full bg-ink-100 px-2 py-0.5">Rides: {c.totalRides ?? 0}</span>
                          <span className="rounded-full bg-ink-100 px-2 py-0.5">Logins: {c.loginCount}</span>
                          <span className="rounded-full bg-ink-100 px-2 py-0.5">
                            {new Date(c.lastLoginAt).toLocaleDateString()}
                          </span>
                        </div>
                      </Link>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}
          </div>
        </div>

        <button
          onClick={() => router.push("/")}
          className="mt-6 inline-flex items-center gap-2 text-xs font-medium text-ink-500 hover:text-ink-900"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to V-Ride
        </button>
      </main>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  tone: "ink" | "green" | "amber" | "brand" | "lime";
}) {
  const tones = {
    ink: "bg-ink-900 text-white",
    green: "bg-emerald-500 text-white",
    amber: "bg-amber-500 text-white",
    brand: "bg-brand-500 text-white",
    lime: "bg-lime text-ink-900",
  };
  return (
    <div className={`relative overflow-hidden rounded-2xl p-4 ${tones[tone]}`}>
      <Icon className="absolute right-2 top-2 h-4 w-4 opacity-30" />
      <div className="text-2xl font-extrabold">{value}</div>
      <div className="text-[10px] uppercase tracking-wider opacity-80">{label}</div>
    </div>
  );
}
