"use client";

import type { Route } from "@/hooks/use-hash-route";
import { LiveRideTracker } from "@/components/vride/LiveRideTracker";

export function LiveRideView({
  id,
  navigate,
}: {
  id: string;
  navigate: (r: Route) => void;
}) {
  return <LiveRideTracker rideId={id} navigate={navigate} />;
}
