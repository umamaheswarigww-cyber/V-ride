import { cn } from "@/lib/utils";

const TONES: Record<string, string> = {
  blue: "bg-brand-50 text-brand-700 ring-1 ring-brand-100",
  green: "bg-emerald-50 text-brand-700 ring-1 ring-emerald-100",
  amber: "bg-amber-50 text-amber-700 ring-1 ring-amber-100",
  gray: "bg-ink-100 text-ink-700 ring-1 ring-ink-200",
  lime: "bg-lime/15 text-ink-800 ring-1 ring-lime/30",
  coral: "bg-coral/10 text-coral ring-1 ring-coral/30",
};

export function Badge({
  tone = "gray",
  className,
  children,
}: {
  tone?: keyof typeof TONES;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span className={cn("chip", TONES[tone], className)}>{children}</span>
  );
}
