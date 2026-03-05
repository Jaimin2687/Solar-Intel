/**
 * ─────────────────────────────────────────────────────────
 * Solar Intel — Top Header Bar
 * ─────────────────────────────────────────────────────────
 * User profile, search placeholder, and real-time clock.
 * Integrated with NextAuth session.
 */

"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { NotificationPanel } from "@/components/ui/notification-panel";
import { useLang } from "@/lib/i18n/context";
import {
  Search,
  LogIn,
  ChevronDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

export function Header() {
  const { data: session } = useSession();
  const { t } = useLang();
  const [currentTime, setCurrentTime] = useState<string>("");

  // Live clock — updates every minute
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 60_000);
    return () => clearInterval(interval);
  }, []);

  // User initials for avatar fallback
  const initials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "SI";

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn(
        "sticky top-0 z-30 flex h-16 items-center justify-between",
        "border-b border-border/50 bg-surface-1/80 backdrop-blur-md px-6"
      )}
    >
      {/* ── Left: Page title + time ── */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">
            {t("header.title")}
          </h1>
          <p className="text-xs text-muted-foreground">
            {t("header.subtitle")}
          </p>
        </div>
        {currentTime && (
          <Badge
            variant="secondary"
            className="ml-2 font-mono text-[10px] text-muted-foreground"
          >
            {currentTime} UTC
          </Badge>
        )}
      </div>

      {/* ── Right: Actions + Language + Profile ── */}
      <div className="flex items-center gap-3">
        {/* Language Switcher */}
        <LanguageSwitcher />

        {/* Search (decorative) */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-muted-foreground hover:text-foreground"
        >
          <Search className="h-4 w-4" />
        </Button>

        {/* Notifications */}
        <NotificationPanel />

        {/* Separator */}
        <div className="h-6 w-px bg-border/50" />

        {/* User Profile */}
        {session?.user ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => signOut()}
            className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-muted/50"
          >
            <Avatar className="h-7 w-7">
              <AvatarImage src={session.user.image ?? ""} alt={session.user.name ?? ""} />
              <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden flex-col items-start md:flex">
              <span className="text-xs font-medium text-foreground">
                {session.user.name ?? "Operator"}
              </span>
              <span className="text-[10px] text-muted-foreground">
                Admin
              </span>
            </div>
            <ChevronDown className="hidden h-3 w-3 text-muted-foreground md:block" />
          </motion.button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => signIn("google")}
            className="gap-2 text-xs"
          >
            <LogIn className="h-3.5 w-3.5" />
            {t("header.signIn")}
          </Button>
        )}
      </div>
    </motion.header>
  );
}
