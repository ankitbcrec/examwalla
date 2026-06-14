"use client";

import Sidebar from "@/components/layout/Sidebar";
import TopNav from "@/components/layout/TopNav";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";

const mockUser = {
  name: "Ankit Sharma",
  email: "ankit@example.com",
  avatar_url: "",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <TooltipProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar user={mockUser} onLogout={handleLogout} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopNav user={mockUser} onLogout={handleLogout} />
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
