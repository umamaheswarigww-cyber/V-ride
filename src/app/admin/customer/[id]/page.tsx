"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Leaf,
  Loader2,
  ShieldCheck,
  Star,
  Wallet,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatINR } from "@/lib/format";
import { Badge } from "@/components/vride/Badge";

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
  createdAt: string;
};

export default function AdminCustomerDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    if (!params?.id) return;
    (async () => {
      setLoading(true);
      try {
        const resp = await fetch(`/api/admin/customer/${params.id}`, { cache: "no-store" });
        if (resp.status === 401) {
          router.push("/admin/login");
          return;
        }
        if (!resp.ok) {
          throw new Error("Customer not found");
        }
        const data = await resp.json();
        setCustomer(data);
      } catch (err) {
        toast({
          title: "Failed to load customer",
          description: err instanceof Error ? err.message : "Network error",
        });
        router.push("/admin");
      } finally {
        setLoading(false);
      }
    })();
  }, [params?.id, router, toast]);

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-ink-50">
        <Loader2 className="h-6 w-6 animate-spin text-ink-400" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen grid place-items-center bg-ink-50 text-ink-500">
        Customer not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink-50">
      <header className="sticky top-0 z-40 border-b border-ink-200/70 bg-white/80 backdrop-blur-xl">
        <div className="container-page flex h-16 items-center justify-between">
          <button
            onClick={() => router.push("/admin")}
            className="inline-flex items-center gap-2 text-sm font-medium text-ink-700 hover:text-ink-900"
          >
            <ArrowLeft className="h-4 w-4" /> Back to admin
          </button>
          <button onClick={() => router.push("/admin")} className="vride-btn-ghost text-xs h-9">
            All customers
          </button>
        </div>
      </header>

      <main className="container-page py-8 sm:py-10 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="vride-card overflow-hidden shadow-lg"
        >
          <div className="relative h-28 bg-gradient-to-br from-brand-600 to-brand-700">
            <div className="absolute inset-0 grid-bg-dark opacity-40" />
          </div>
          <div className="px-5 pb-6 sm:px-7">
            <div className="-mt-12 flex items-end justify-between">
              {customer.picture ? (
                <img
                  src={customer.picture}
                  alt={customer.name ?? "Customer"}
                  className="h-24 w-24 rounded-3xl object-cover ring-4 ring-white shadow-lg"
                />
              ) : (
                <span className="grid h-24 w-24 place-items-center rounded-3xl bg-ink-900 text-2xl font-bold text-lime ring-4 ring-white">
                  {(customer.name ?? customer.email).slice(0, 2).toUpperCase()}
                </span>
              )}
              {customer.isVitApStudent ? (
                <Badge tone="green">
                  <ShieldCheck className="h-3 w-3" /> VIT-AP Student
                </Badge>
              ) : (
                <Badge tone="gray">Non-VIT-AP</Badge>
              )}
            </div>

            <h1 className="mt-4 text-2xl font-extrabold text-ink-900">
              {customer.name ?? "Anonymous user"}
            </h1>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-ink-500">
              <span>{customer.email}</span>
              <span>•</span>
              <span>{customer.role === "driver" ? "Driver" : "Student Customer"}</span>
              {customer.emailVerified && (
                <>
                  <span>•</span>
                  <Badge tone="blue">
                    <CheckCircle2 className="h-3 w-3" /> Google verified
                  </Badge>
                </>
              )}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatTile icon={Wallet} label="Total rides" value={`${customer.totalRides}`} />
              <StatTile icon={CheckCircle2} label="Completed" value={`${customer.completedRides}`} />
              <StatTile icon={Star} label="Rating" value={`${customer.rating}`} />
              <StatTile icon={Leaf} label="CO₂ saved" value={`${customer.co2SavedKg}kg`} />
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-gradient-to-br from-brand-600 to-brand-700 p-4 text-white">
                <div className="text-[11px] uppercase tracking-wider text-brand-50">Estimated savings</div>
                <div className="mt-1 text-2xl font-extrabold">{formatINR(customer.moneySaved)}</div>
              </div>
              <div className="rounded-2xl bg-ink-950 p-4 text-white">
                <div className="text-[11px] uppercase tracking-wider text-lime">Login count</div>
                <div className="mt-1 text-2xl font-extrabold">{customer.loginCount}</div>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-ink-200 bg-white p-4">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">Activity</div>
                <ul className="mt-3 space-y-2 text-sm text-ink-700">
                  <li className="flex justify-between"><span>Rides joined</span><span className="font-bold text-ink-900">{customer.ridesJoined}</span></li>
                  <li className="flex justify-between"><span>Rides offered</span><span className="font-bold text-ink-900">{customer.ridesOffered}</span></li>
                  <li className="flex justify-between"><span>Completed</span><span className="font-bold text-emerald-600">{customer.completedRides}</span></li>
                  <li className="flex justify-between"><span>Cancelled</span><span className="font-bold text-coral">{customer.cancelledRides}</span></li>
                </ul>
              </div>
              <div className="rounded-2xl border border-ink-200 bg-white p-4">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">Login history</div>
                <ul className="mt-3 space-y-2 text-sm text-ink-700">
                  <li className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-ink-400" /> First login
                    </span>
                    <span className="font-semibold text-ink-900">
                      {new Date(customer.firstLoginAt).toLocaleString()}
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-ink-400" /> Last login
                    </span>
                    <span className="font-semibold text-ink-900">
                      {new Date(customer.lastLoginAt).toLocaleString()}
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Account created</span>
                    <span className="font-semibold text-ink-900">
                      {new Date(customer.createdAt).toLocaleDateString()}
                    </span>
                  </li>
                  {customer.googleId && (
                    <li className="flex items-center justify-between">
                      <span>Google ID</span>
                      <span className="font-mono text-[11px] text-ink-500">
                        {customer.googleId.slice(0, 12)}…
                      </span>
                    </li>
                  )}
                </ul>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-2xl bg-ink-50/40 p-3 text-xs text-ink-500">
              <span>Account status</span>
              <Badge tone="green">Active</Badge>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-ink-50/40 p-3 text-center">
      <Icon className="mx-auto h-4 w-4 text-brand-600" />
      <div className="mt-1 text-lg font-bold text-ink-900">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-ink-400">{label}</div>
    </div>
  );
}
