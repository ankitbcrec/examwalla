"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { User, Bell, Moon, Shield, Trash2 } from "lucide-react";
import { useTheme } from "next-themes";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    email: true,
    results: true,
    reminders: false,
    tips: true,
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground mb-1">Settings</h1>
        <p className="text-muted-foreground text-sm">Manage your account and preferences</p>
      </motion.div>

      {/* Profile */}
      <Card className="rounded-2xl border-border/60">
        <CardHeader className="pb-3 pt-5 px-6">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6 space-y-5">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 border-2 border-primary/20">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">A</AvatarFallback>
            </Avatar>
            <div>
              <Button variant="outline" size="sm" className="rounded-xl text-xs mb-1">Change Photo</Button>
              <p className="text-xs text-muted-foreground">JPG or PNG, max 2MB</p>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-1.5">
              <Label className="text-xs font-semibold">Full Name</Label>
              <Input defaultValue="Ankit Sharma" className="rounded-xl" />
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs font-semibold">Email</Label>
              <Input defaultValue="ankit@example.com" className="rounded-xl" disabled />
            </div>
          </div>
          <Button className="rounded-xl gradient-primary border-0 text-white font-semibold">Save Changes</Button>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="rounded-2xl border-border/60">
        <CardHeader className="pb-3 pt-5 px-6">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6 space-y-4">
          {[
            { key: "email" as const, label: "Email notifications", desc: "Receive results and updates via email" },
            { key: "results" as const, label: "Test results", desc: "Notify when AI analysis is ready" },
            { key: "reminders" as const, label: "Study reminders", desc: "Daily reminder to practice" },
            { key: "tips" as const, label: "AI study tips", desc: "Weekly personalized improvement tips" },
          ].map((item, i) => (
            <div key={item.key}>
              {i > 0 && <Separator className="mb-4" />}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <Switch
                  checked={notifications[item.key]}
                  onCheckedChange={(v) => setNotifications((n) => ({ ...n, [item.key]: v }))}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card className="rounded-2xl border-border/60">
        <CardHeader className="pb-3 pt-5 px-6">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Moon className="w-4 h-4 text-primary" />
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <div className="grid grid-cols-3 gap-3">
            {(["light", "dark", "system"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`p-3 rounded-2xl border-2 text-sm font-semibold capitalize transition-all ${
                  theme === t
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border/60 text-muted-foreground hover:border-primary/30"
                }`}
              >
                {t === "light" ? "☀️" : t === "dark" ? "🌙" : "💻"} {t}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Danger zone */}
      <Card className="rounded-2xl border-red-200 dark:border-red-900">
        <CardHeader className="pb-3 pt-5 px-6">
          <CardTitle className="text-sm font-bold flex items-center gap-2 text-red-600 dark:text-red-400">
            <Shield className="w-4 h-4" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <p className="text-xs text-muted-foreground mb-4">Once you delete your account, there is no going back. All your data will be permanently erased.</p>
          <Button
            variant="outline"
            className="border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
