import { useState, useEffect, useCallback } from "react";
import { TemplateFolder } from "../lib/path-to-json";
import { getPlaygroundById, saveUpdatedCode } from "../actions";
import { toast } from "@/components/ui/toast";

interface PlaygroundData {
  id: string;
  title?: string;
  [key: string]: any;
}

interface UsePlaygroundReturn {
  playgroundData: PlaygroundData | null;
  templateData: TemplateFolder | null;
  isLoading: boolean;
  error: string | null;
  loadPlayground: () => Promise<void>;
  saveTemplateData: (data: TemplateFolder) => Promise<void>;
}

export const usePlayground = (id: string): UsePlaygroundReturn => {
  const [playgroundData, setPlaygroundData] = useState<PlaygroundData | null>(
    null,
  );
  const [templateData, setTemplateData] = useState<TemplateFolder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPlayground = useCallback(async () => {
    if (!id) return;

    setIsLoading(true);
    setError(null);
    try {
      const data = await getPlaygroundById(id);

      setPlaygroundData(data);

      const rawContent = data?.templateFiles?.[0]?.content;

      if (typeof rawContent === "string") {
        const parsedContent = JSON.parse(rawContent);
        setTemplateData(parsedContent);
        toast.add({
          type: "success",
          title: "Playground data loaded successfully",
        });
        return;
      }

      const res = await fetch(`/api/template/${id}`);
      if (!res.ok) {
        toast.add({
          type: "error",
          title: "Failed to load playground data",
        });
        return;
      }

      const templateRes = await res.json();
      if (templateRes.templateJson && Array.isArray(templateRes.templateJson)) {
        setTemplateData({
          folderName: "Root",
          items: templateRes.templateJson,
        });
      } else {
        setTemplateData(
          templateRes.templateJson || {
            folderName: "Root",
            items: [],
          },
        );
      }

      toast.add({
        type: "success",
        title: "Playground loaded successfully",
      });
    } catch (error) {
      setError("Failed to load playground data");
      toast.add({
        type: "error",
        title: "Failed to load playground data",
      });
      console.error("Error loading playground:", error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const saveTemplateData = useCallback(
    async (data: TemplateFolder) => {
      try {
        await saveUpdatedCode(id, data);
        setTemplateData(data);

        toast.add({
          type: "success",
          title: "Changes saved successfully",
        });
      } catch (error) {
        console.log("Error saving changes: ", error);
        toast.add({
          type: "error",
          title: "Failed to save changes",
        });
        throw error;
      }
    },
    [id],
  );

  useEffect(() => {
    loadPlayground();
  }, [loadPlayground]);

  return {
    playgroundData,
    templateData,
    isLoading,
    error,
    loadPlayground,
    saveTemplateData,
  };
};
