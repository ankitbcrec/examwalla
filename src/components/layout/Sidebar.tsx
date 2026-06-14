"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Bookmark,
  BookOpen,
  TrendingUp,
  Settings,
  LogOut,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tests", label: "Mock Tests", icon: FileText },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/bookmarks", label: "Bookmarks", icon: Bookmark },
  { href: "/study-material", label: "Study Material", icon: BookOpen },
  { href: "/performance", label: "Performance", icon: TrendingUp },
  { href: "/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  user?: { name: string; email: string; avatar_url?: string };
  onLogout?: () => void;
}

export default function Sidebar({ user, onLogout }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 256 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="relative flex h-screen flex-col bg-sidebar border-r border-sidebar-border overflow-hidden shrink-0"
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-sidebar-border">
        <Link href="/dashboard" className="flex items-center gap-3 min-w-0">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl gradient-primary shrink-0">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <motion.span
            animate={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : "auto" }}
            transition={{ duration: 0.2 }}
            className="font-bold text-lg text-sidebar-foreground overflow-hidden whitespace-nowrap"
          >
            ExamWalla
          </motion.span>
        </Link>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto shrink-0 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          // The Link itself is the interactive element — never wrap it in a trigger that also renders a button
          const linkEl = (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                  : "text-sidebar-foreground/70"
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <motion.span
                animate={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : "auto" }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden whitespace-nowrap"
              >
                {item.label}
              </motion.span>
            </Link>
          );

          if (collapsed) {
            // Wrap in a span so TooltipTrigger (which renders as a button) does not
            // end up as an ancestor of the <a> tag. We use a non-interactive wrapper div
            // and let TooltipTrigger render its own button separately.
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger
                  // render as a plain div so there's no button wrapping the <a>
                  render={<div />}
                  className={cn(
                    "block w-full rounded-xl",
                    isActive ? "bg-sidebar-primary" : ""
                  )}
                >
                  {linkEl}
                </TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            );
          }

          return linkEl;
        })}
      </nav>

      {/* User Profile Card */}
      <div className="border-t border-sidebar-border p-3">
        <div
          className={cn(
            "flex items-center gap-3 rounded-xl p-2 hover:bg-sidebar-accent transition-colors",
            collapsed && "justify-center"
          )}
        >
          <Avatar className="w-9 h-9 shrink-0 border-2 border-sidebar-primary/30">
            <AvatarImage src={user?.avatar_url} />
            <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-sm font-semibold">
              {user?.name?.[0]?.toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>

          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-sidebar-foreground truncate">
                {user?.name ?? "Student"}
              </p>
              <p className="text-xs text-sidebar-foreground/50 truncate">
                {user?.email ?? "student@example.com"}
              </p>
            </div>
          )}

          {!collapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onLogout}
              className="shrink-0 w-8 h-8 text-sidebar-foreground/50 hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
