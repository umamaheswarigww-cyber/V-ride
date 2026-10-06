"use client";

import { useEffect, useState } from "react";

export type Route =
  | { name: "home" }
  | { name: "find" }
  | { name: "offer" }
  | { name: "ride"; id: string }
  | { name: "confirm"; id: string }
  | { name: "live"; id: string }
  | { name: "chat"; id: string }
  | { name: "history" }
  | { name: "dashboard" }
  | { name: "profile" }
  | { name: "how" }
  | { name: "safety" }
  | { name: "about" };

function parseHash(hash: string): Route {
  const h = hash.replace(/^#/, "").replace(/^\//, "");
  if (!h || h === "home") return { name: "home" };
  if (h === "find") return { name: "find" };
  if (h === "offer") return { name: "offer" };
  if (h === "history") return { name: "history" };
  if (h === "dashboard") return { name: "dashboard" };
  if (h === "profile") return { name: "profile" };
  if (h === "how-it-works") return { name: "how" };
  if (h === "safety") return { name: "safety" };
  if (h === "about") return { name: "about" };
  const rideMatch = h.match(/^ride\/([a-zA-Z0-9_-]+)/);
  if (rideMatch) return { name: "ride", id: rideMatch[1] };
  const confirmMatch = h.match(/^confirm\/([a-zA-Z0-9_-]+)/);
  if (confirmMatch) return { name: "confirm", id: confirmMatch[1] };
  const liveMatch = h.match(/^live\/([a-zA-Z0-9_-]+)/);
  if (liveMatch) return { name: "live", id: liveMatch[1] };
  const chatMatch = h.match(/^chat\/([a-zA-Z0-9_-]+)/);
  if (chatMatch) return { name: "chat", id: chatMatch[1] };
  return { name: "home" };
}

export function routeToHash(route: Route): string {
  switch (route.name) {
    case "home":
      return "#home";
    case "find":
      return "#find";
    case "offer":
      return "#offer";
    case "ride":
      return `#ride/${route.id}`;
    case "confirm":
      return `#confirm/${route.id}`;
    case "live":
      return `#live/${route.id}`;
    case "chat":
      return `#chat/${route.id}`;
    case "history":
      return "#history";
    case "dashboard":
      return "#dashboard";
    case "profile":
      return "#profile";
    case "how":
      return "#how-it-works";
    case "safety":
      return "#safety";
    case "about":
      return "#about";
  }
}

export function useHashRoute(): [Route, (r: Route) => void] {
  const [route, setRoute] = useState<Route>({ name: "home" });

  useEffect(() => {
    const onHash = () => {
      setRoute(parseHash(window.location.hash));
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    };
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const navigate = (r: Route) => {
    const newHash = routeToHash(r);
    if (window.location.hash !== newHash) {
      window.location.hash = newHash;
    } else {
      setRoute(r);
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    }
  };

  return [route, navigate];
}
