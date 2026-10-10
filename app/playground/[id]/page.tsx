"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { usePlayground } from "@/modules/playground/hooks/use-playground";
import { useParams } from "next/navigation";

const PlaygroundPage = () => {
  const { id } = useParams<{ id: string }>();

  // Custom hooks
  const { playgroundData, templateData, isLoading, error, saveTemplateData } =
    usePlayground(id);

  
  return (
    <TooltipProvider>
      <>
        {/* TODO: template file tree */}

        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />

            <div className="flex flex-1 items-center gap-2">
              <div className="flex flex-col flex-1">
                <h1 className="text-sm font-medium">
                  {playgroundData?.title || "Code Playground"}
                </h1>
                {/* <p className="text-xs text-muted-foreground">
                  {openFiles.length} file(s) open
                  {hasUnsavedChanges && " • Unsaved changes"}
                </p> */}
              </div>
            </div>
          </header>
        </SidebarInset>
      </>
    </TooltipProvider>
  );
};

export default PlaygroundPage;
