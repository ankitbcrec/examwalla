"use client";

import { Bell, Moon, Sun, Search } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useState } from "react";

interface TopNavProps {
  user?: { name: string; email: string; avatar_url?: string };
  title?: string;
  onLogout?: () => void;
}

const notifications = [
  { id: 1, text: "Your NISM Series XV score is ready!", time: "2m ago", unread: true },
  { id: 2, text: "New mock test added: AWS SAA-C03", time: "1h ago", unread: true },
  { id: 3, text: "You've completed 5 tests this week!", time: "3h ago", unread: false },
];

export default function TopNav({ user, title, onLogout }: TopNavProps) {
  const { theme, setTheme } = useTheme();
  const [notifOpen, setNotifOpen] = useState(false);
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-sm flex items-center px-6 gap-4 sticky top-0 z-40">
      {title && (
        <h1 className="text-xl font-bold text-foreground hidden md:block">{title}</h1>
      )}

      <div className="flex-1" />

      {/* Search hint */}
      <Button
        variant="outline"
        className="hidden md:flex items-center gap-2 text-muted-foreground h-9 px-4 rounded-xl border-border/60"
      >
        <Search className="w-4 h-4" />
        <span className="text-sm">Search exams...</span>
        <kbd className="ml-2 text-xs bg-muted px-1.5 py-0.5 rounded border border-border">⌘K</kbd>
      </Button>

      {/* Notifications — trigger IS the button, no nested Button inside */}
      <DropdownMenu open={notifOpen} onOpenChange={setNotifOpen}>
        <DropdownMenuTrigger
          className="relative inline-flex items-center justify-center w-9 h-9 rounded-xl hover:bg-accent transition-colors focus:outline-none"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center pointer-events-none"
            >
              {unreadCount}
            </motion.span>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80 rounded-2xl p-2">
          <DropdownMenuLabel className="flex items-center justify-between px-2 py-1.5">
            <span>Notifications</span>
            <Badge variant="secondary" className="text-xs">{unreadCount} new</Badge>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {notifications.map((n) => (
            <DropdownMenuItem
              key={n.id}
              className={`flex flex-col items-start gap-1 px-3 py-2.5 rounded-xl cursor-pointer relative ${
                n.unread ? "bg-primary/5" : ""
              }`}
            >
              <span className="text-sm font-medium leading-tight">{n.text}</span>
              <span className="text-xs text-muted-foreground">{n.time}</span>
              {n.unread && (
                <span className="w-1.5 h-1.5 rounded-full bg-primary absolute right-3 top-3" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Theme toggle — plain Button, not inside a trigger */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="rounded-xl hover:bg-accent"
      >
        <Sun className="w-5 h-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute w-5 h-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </Button>

      {/* User menu — trigger IS the avatar button, no nested Button inside */}
      <DropdownMenu>
        <DropdownMenuTrigger
          className="relative h-9 w-9 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Avatar className="h-9 w-9 border-2 border-primary/20">
            <AvatarImage src={user?.avatar_url} />
            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-bold">
              {user?.name?.[0]?.toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2">
          <DropdownMenuLabel className="px-2 py-1.5">
            <p className="font-semibold">{user?.name ?? "Student"}</p>
            <p className="text-xs text-muted-foreground font-normal">{user?.email}</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="rounded-xl cursor-pointer">Profile</DropdownMenuItem>
          <DropdownMenuItem className="rounded-xl cursor-pointer">Settings</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={onLogout}
            className="rounded-xl cursor-pointer text-destructive focus:text-destructive"
          >
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
