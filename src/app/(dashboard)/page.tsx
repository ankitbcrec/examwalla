import { redirect } from "next/navigation";

// (dashboard)/page.tsx maps to "/" — redirect to /dashboard
export default function DashboardIndexPage() {
  redirect("/dashboard");
}
