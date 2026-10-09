import { ReactNode } from "react";

import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from "@/modules/dashboard/components/dashboard-sidebar";
import { getAllPlaygroundForUser } from "@/modules/dashboard/actions";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const playgroundData = await getAllPlaygroundForUser();

  // Store icon names (strings) instead of the components themselves
  const technologyIconMap: Record<string, string> = {
    REACT: "Atom",
    NEXTJS: "Globe",
    EXPRESS: "Server",
    NUXTJS: "Layers",
    VUE: "Eye",
    HONO: "Flame",
    ANGULAR: "Triangle",
    SVELTE: "Sparkles",
  };

  const formattedPlaygroundData =
    playgroundData?.map((item) => ({
      id: item.id,
      name: item.title,
      starred: item.Starmark?.[0]?.isMarked || false,
      // Pass the icon name as a string
      icon: technologyIconMap[item.template] || "Code2", // Default to "Code2" if template not found
    })) || [];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full overflow-x-hidden">
        <DashboardSidebar initialPlaygroundData={formattedPlaygroundData} />
        <main className="flex flex-1 items-center justify-center">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
