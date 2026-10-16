import { TemplateFile, TemplateFolder } from "./path-to-json";

/**
 * Finds the file path in the folder structure
 * @param file The template file to find
 * @param folder The root folder to search in
 * @param pathSoFar The path accumulated so far
 * @returns The file path or null if not found
 */
export function findFilePath(
  file: TemplateFile,
  folder: TemplateFolder,
  pathSoFar: string[] = [],
): string | null {
  for (const item of folder.items) {
    if ("folderName" in item) {
      const res = findFilePath(file, item, [...pathSoFar, item.folderName]);
      if (res) return res;
    } else {
      if (
        item.filename === file.filename &&
        item.fileExtension === file.fileExtension
      ) {
        return [
          ...pathSoFar,
          item.filename + (item.fileExtension ? "." + item.fileExtension : ""),
        ].join("/");
      }
    }
  }
  return null;
}

// this is necessary because we can have same filenames in different folders
// and we need a way to uniquely identify each file
/**
 * Generates a unique file ID based on file location in folder structure
 * @param file The template file
 * @param rootFolder The root template folder containing all files
 * @returns A unique file identifier including full path
 */
export const generateFileId = (
  file: TemplateFile,
  rootFolder: TemplateFolder,
): string => {
  return findFilePath(file, rootFolder) ?? "";
};
