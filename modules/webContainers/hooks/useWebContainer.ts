import { useState, useEffect, useCallback } from "react";
import { WebContainer } from "@webcontainer/api";
import { TemplateFolder } from "@/modules/playground/types";

interface UseWebContainerProps {
  templateData: TemplateFolder;
}

interface UseWebContainerReturn {
  serverUrl: string | null;
  isLoading: boolean;
  error: string | null;
  instance: WebContainer | null;
  writeFileSync: (path: string, content: string) => Promise<void>;
  destroy: () => void; // Added destroy function
}

// Module-level singletons to prevent multiple boot calls
let webcontainerInstance: WebContainer | null = null;
let bootPromise: Promise<WebContainer> | null = null;

export const getWebContainer = async (): Promise<WebContainer> => {
  if (webcontainerInstance) {
    return webcontainerInstance;
  }
  if (!bootPromise) {
    bootPromise = WebContainer.boot()
      .then((instance) => {
        webcontainerInstance = instance;
        return instance;
      })
      .catch((err) => {
        bootPromise = null;
        webcontainerInstance = null;
        throw err;
      });
  }
  return bootPromise;
};

export const useWebContainer = ({
  templateData,
}: UseWebContainerProps): UseWebContainerReturn => {
  const [serverUrl, setServerUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(!webcontainerInstance);
  const [error, setError] = useState<string | null>(null);
  const [instance, setInstance] = useState<WebContainer | null>(
    webcontainerInstance,
  );

  useEffect(() => {
    let mounted = true;

    async function initializeWebContainer() {
      try {
        const container = await getWebContainer();

        if (!mounted) return;

        setInstance(container);
        setIsLoading(false);

        container.on("server-ready", (port: number, url: string) => {
          if (mounted) {
            setServerUrl(url);
          }
        });
      } catch (err) {
        console.error("Failed to initialize WebContainer:", err);
        if (mounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to initialize WebContainer",
          );
          setIsLoading(false);
        }
      }
    }

    initializeWebContainer();

    return () => {
      mounted = false;
      // WebContainer should persist across component re-mounts / StrictMode
    };
  }, []);

  const writeFileSync = useCallback(
    async (path: string, content: string): Promise<void> => {
      const activeInstance = instance || webcontainerInstance;
      if (!activeInstance) {
        throw new Error("WebContainer instance not available");
      }

      try {
        const pathParts = path.split("/");
        const folderPath = pathParts.slice(0, -1).join("/");

        if (folderPath) {
          await activeInstance.fs.mkdir(folderPath, { recursive: true });
        }

        await activeInstance.fs.writeFile(path, content);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to write file";
        console.error(`Failed to write file at ${path}:`, err);
        throw new Error(`Failed to write file at ${path}: ${errorMessage}`);
      }
    },
    [instance],
  );

  // Added destroy function
  const destroy = useCallback(() => {
    if (webcontainerInstance) {
      webcontainerInstance.teardown();
      webcontainerInstance = null;
      bootPromise = null;
    }
    setInstance(null);
    setServerUrl(null);
  }, []);

  return { serverUrl, isLoading, error, instance, writeFileSync, destroy };
};
