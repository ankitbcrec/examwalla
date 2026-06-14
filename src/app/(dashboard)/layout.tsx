"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import TopNav from "@/components/layout/TopNav";
import { TooltipProvider } from "@/components/ui/tooltip";
import { createClient } from "@/lib/supabase";

interface UserProfile {
  name: string;
  email: string;
  avatar_url: string;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const supabase = createClient();

    // Load current session user
    const loadUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        router.replace("/login");
        return;
      }
      setUser({
        name:
          authUser.user_metadata?.full_name ||
          authUser.email?.split("@")[0] ||
          "Student",
        email: authUser.email ?? "",
        avatar_url: authUser.user_metadata?.avatar_url ?? "",
      });
    };

    loadUser();

    // Listen for auth state changes (e.g. token refresh, signout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_OUT" || !session) {
          router.replace("/login");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/login");
  };

  return (
    <TooltipProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar user={user ?? undefined} onLogout={handleLogout} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopNav user={user ?? undefined} onLogout={handleLogout} />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </TooltipProvider>
  );
}
