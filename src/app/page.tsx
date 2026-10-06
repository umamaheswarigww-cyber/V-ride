"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useHashRoute } from "@/hooks/use-hash-route";
import { Navbar } from "@/components/vride/Navbar";
import { Footer } from "@/components/vride/Footer";
import { AuthGate } from "@/components/vride/AuthGate";
import { LandingView } from "@/components/views/LandingView";
import { FindRideView } from "@/components/views/FindRideView";
import { OfferRideView } from "@/components/views/OfferRideView";
import { RideDetailsView } from "@/components/views/RideDetailsView";
import { ConfirmRideView } from "@/components/views/ConfirmRideView";
import { LiveRideView } from "@/components/views/LiveRideView";
import { ChatView } from "@/components/views/ChatView";
import { RideHistoryView } from "@/components/views/RideHistoryView";
import { DashboardView } from "@/components/views/DashboardView";
import { ProfileView } from "@/components/views/ProfileView";
import { HowItWorksView } from "@/components/views/HowItWorksView";
import { SafetyView } from "@/components/views/SafetyView";
import { AboutView } from "@/components/views/AboutView";

export default function Home() {
  const [route, navigate] = useHashRoute();

  return (
    <div className="flex min-h-screen flex-col bg-ink-50">
      <Navbar route={route} navigate={navigate} />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={route.name + ("id" in route ? route.id : "")}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <AuthGate route={route} navigate={navigate}>
              {(user) => (
                <>
                  {route.name === "home" && <LandingView navigate={navigate} />}
                  {route.name === "find" && <FindRideView navigate={navigate} />}
                  {route.name === "offer" && <OfferRideView navigate={navigate} />}
                  {route.name === "ride" && (
                    <RideDetailsView id={route.id} navigate={navigate} />
                  )}
                  {route.name === "confirm" && (
                    <ConfirmRideView rideId={route.id} navigate={navigate} />
                  )}
                  {route.name === "live" && (
                    <LiveRideView id={route.id} navigate={navigate} />
                  )}
                  {route.name === "chat" && (
                    <ChatView id={route.id} navigate={navigate} />
                  )}
                  {route.name === "history" && <RideHistoryView navigate={navigate} />}
                  {route.name === "dashboard" && <DashboardView navigate={navigate} />}
                  {route.name === "profile" && <ProfileView navigate={navigate} />}
                  {route.name === "how" && <HowItWorksView navigate={navigate} />}
                  {route.name === "safety" && <SafetyView navigate={navigate} />}
                  {route.name === "about" && <AboutView navigate={navigate} />}
                </>
              )}
            </AuthGate>
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer navigate={navigate} />
    </div>
  );
}
