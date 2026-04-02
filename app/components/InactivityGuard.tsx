
"use client";
import { useEffect } from "react";
import { signOut, useSession } from "next-auth/react";

const INACTIVITY_LIMIT = 30 * 60 * 1000; // 30 minutes in ms

export default function InactivityGuard() {
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) return;

    let timer: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        signOut({ callbackUrl: "/" });
      }, INACTIVITY_LIMIT);
    };

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((e) => window.addEventListener(e, resetTimer));
    resetTimer();

    return () => {
      clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, resetTimer));
    };
  }, [session]);

  return null;
}