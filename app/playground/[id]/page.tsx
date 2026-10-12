"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import TemplateFileTree from "@/modules/playground/components/template-file-tree";
import { useFileExplorer } from "@/modules/playground/hooks/use-file-explorer";
import { usePlayground } from "@/modules/playground/hooks/use-playground";
import { TemplateItem } from "@/modules/playground/lib/path-to-json";
import { useParams } from "next/navigation";

const PlaygroundPage = () => {
  const { id } = useParams<{ id: string }>();

  // Custom hooks
  const { playgroundData, templateData, isLoading, error, saveTemplateData } =
    usePlayground(id);
  const {
    activeFileId,
    closeAllFiles,
    openFile,
    closeFile,
    editorContent,
    updateFileContent,
    handleAddFile,
    handleAddFolder,
    handleDeleteFile,
    handleDeleteFolder,
    handleRenameFile,
    handleRenameFolder,
    openFiles,
    setTemplateData,
    setActiveFileId,
    setPlaygroundId,
    setOpenFiles,
  } = useFileExplorer();

  return (
    <TooltipProvider>
      <>
        {/* this is the coding sidebar you see in you ide with all the code files */}
        <TemplateFileTree data={templateData!} />

        {/* and this is the content */}
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
