/**
 * ─────────────────────────────────────────────────────────
 * Solar Intel — Top Header Bar
 * ─────────────────────────────────────────────────────────
 * User profile, search placeholder, and real-time clock.
 * Integrated with NextAuth session.
 */

"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
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
  LogOut,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState, useRef } from "react";

export function Header() {
  const { data: session } = useSession();
  const { t } = useLang();
  const [currentTime, setCurrentTime] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  // Close menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
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
          <div className="relative" ref={menuRef}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setMenuOpen((o) => !o)}
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
                <span className="text-[10px] text-muted-foreground">Admin</span>
              </div>
              <ChevronDown className={cn(
                "hidden h-3 w-3 text-muted-foreground md:block transition-transform duration-200",
                menuOpen && "rotate-180"
              )} />
            </motion.button>

            {/* Dropdown menu */}
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-border/50 bg-surface-1 shadow-xl z-50 overflow-hidden"
                >
                  {/* User info */}
                  <div className="px-4 py-3 border-b border-border/40">
                    <p className="text-xs font-semibold text-foreground truncate">
                      {session.user.name ?? "Operator"}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                      {session.user.email ?? ""}
                    </p>
                  </div>

                  {/* Menu items */}
                  <div className="p-1.5 space-y-0.5">
                    <button
                      onClick={() => { setMenuOpen(false); }}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
                    >
                      <User className="h-3.5 w-3.5" />
                      Profile &amp; Settings
                    </button>

                    <button
                      onClick={() => signOut({ callbackUrl: "/auth/signin" })}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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
