import { ReactNode } from "react";

import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from "@/modules/dashboard/components/dashboard-sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full overflow-x-hidden">
        <DashboardSidebar initialPlaygroundData={[]} />
        <main className="flex flex-1 items-center justify-center">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
