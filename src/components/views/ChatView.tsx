"use client";

import type { Route } from "@/hooks/use-hash-route";
import { ChatPanel } from "@/components/vride/ChatPanel";

export function ChatView({
  id,
  navigate,
}: {
  id: string;
  navigate: (r: Route) => void;
}) {
  return <ChatPanel rideId={id} navigate={navigate} />;
}
