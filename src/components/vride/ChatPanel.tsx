"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check, Send } from "lucide-react";
import type { Route } from "@/hooks/use-hash-route";
import { useVRideStore } from "@/lib/store";
import { getStudentById, QUICK_REPLIES } from "@/lib/mock";
import type { ChatMessage } from "@/lib/types";

export function ChatPanel({
  rideId,
  navigate,
}: {
  rideId: string;
  navigate: (r: Route) => void;
}) {
  const ride = useVRideStore((s) => [...s.offered, ...s.pool].find((r) => r.id === rideId));
  const messages = useVRideStore((s) => s.chats[rideId] ?? []);
  const sendMessage = useVRideStore((s) => s.sendMessage);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  // Simulate an auto-reply from organizer when I send a message
  const handleSend = (text: string) => {
    if (!text.trim()) return;
    sendMessage(rideId, text.trim());
    setInput("");
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      const reply: ChatMessage = {
        id: `auto-${Date.now()}`,
        rideId,
        senderId: ride?.organizerId ?? "stu-1",
        text: pickReply(text.trim()),
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        status: "delivered",
      };
      useVRideStore.setState((s) => ({
        ...s,
        chats: {
          ...s.chats,
          [rideId]: [...(s.chats[rideId] ?? []), reply],
        },
      }));
    }, 1400);
  };

  if (!ride) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="text-2xl font-bold">Chat not found</h1>
      </div>
    );
  }

  const organizer = getStudentById(ride.organizerId);

  return (
    <div className="container-page py-6 sm:py-10 max-w-3xl">
      <div className="vride-card overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-ink-100 bg-ink-950 px-5 py-3 text-white">
          <button
            onClick={() => navigate({ name: "ride", id: rideId })}
            className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 hover:bg-white/15"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {organizer && (
              <img
                src={organizer.avatar}
                alt={organizer.name}
                className="h-10 w-10 rounded-xl object-cover ring-2 ring-white/10"
              />
            )}
            <div className="min-w-0">
              <div className="text-sm font-semibold truncate">{ride.from} → {ride.to}</div>
              <div className="flex items-center gap-1.5 text-[11px] text-ink-300">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
                {organizer?.name ?? ride.organizer} • online
              </div>
            </div>
          </div>
          <div className="text-[11px] text-ink-300 hidden sm:block">
            {ride.time} • {ride.date}
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="h-[55vh] min-h-[320px] overflow-y-auto bg-ink-50/40 p-4 sm:p-5 space-y-3">
          {messages.length === 0 && (
            <div className="rounded-2xl border border-dashed border-ink-200 bg-white p-4 text-center text-sm text-ink-500">
              No messages yet — break the ice 👋
            </div>
          )}
          <AnimatePresence initial={false}>
            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} />
            ))}
          </AnimatePresence>
          {typing && (
            <div className="flex items-center gap-2 text-xs text-ink-500">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 0.8, delay: i * 0.15, repeat: Infinity }}
                    className="h-1.5 w-1.5 rounded-full bg-ink-400"
                  />
                ))}
              </div>
              <span>{organizer?.name ?? "Organizer"} is typing…</span>
            </div>
          )}
        </div>

        {/* Quick replies */}
        <div className="border-t border-ink-100 bg-white px-4 pt-3">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {QUICK_REPLIES.map((q) => (
              <button
                key={q}
                onClick={() => handleSend(q)}
                className="chip shrink-0 bg-brand-50 text-brand-700 ring-1 ring-brand-100 hover:bg-brand-100"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="flex items-center gap-2 border-t border-ink-100 bg-white p-3"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message…"
            className="flex-1 rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-500 text-white transition-all hover:bg-brand-600 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isMe = message.senderId === "me";
  const sender = getStudentById(message.senderId);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isMe ? "justify-end" : "justify-start"}`}
    >
      <div className={`flex items-end gap-2 max-w-[85%] sm:max-w-[70%] ${isMe ? "flex-row-reverse" : ""}`}>
        {!isMe && sender && (
          <img
            src={sender.avatar}
            alt={sender.name}
            className="h-7 w-7 rounded-full object-cover ring-2 ring-white"
          />
        )}
        <div>
          <div
            className={`rounded-2xl px-3.5 py-2 text-sm ${
              isMe
                ? "bg-brand-500 text-white"
                : "bg-white border border-ink-200 text-ink-900"
            }`}
          >
            {message.text}
          </div>
          <div
            className={`mt-0.5 flex items-center gap-1 text-[10px] text-ink-400 ${
              isMe ? "justify-end" : "justify-start"
            }`}
          >
            <span>{isMe ? "You" : sender?.name}</span>
            <span>•</span>
            <span>{message.timestamp}</span>
            {isMe && message.status === "delivered" && <Check className="h-2.5 w-2.5" />}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function pickReply(text: string): string {
  const t = text.toLowerCase();
  if (t.includes("where") || t.includes("meet")) {
    return "Meet me at the main pickup point — I'll be there 5 min early.";
  }
  if (t.includes("late") || t.includes("running")) {
    return "No worries, take your time. We can wait up to 5 min.";
  }
  if (t.includes("5 min") || t.includes("on my way")) {
    return "Great, see you soon! 🚗";
  }
  if (t.includes("pickup")) {
    return "Pickup point is near the main gate. Look for a silver car.";
  }
  return "Sounds good! See you at the pickup.";
}
