import path from "path";
import fs from "fs/promises";
import { NextRequest } from "next/server";

import { db } from "@/lib/db";
import {
  readTemplateStructureFromJson,
  saveTemplateStructureToJson,
} from "@/modules/playground/lib/path-to-json";
import { templatePaths } from "@/lib/template";

// Helper function to ensure valid JSON
function validateJsonStructure(data: unknown): boolean {
  try {
    JSON.parse(JSON.stringify(data)); // Ensures it's serializable
    return true;
  } catch (error) {
    console.error("Invalid JSON structure:", error);
    return false;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!id) {
    return Response.json(
      {
        error: "Missing playground id",
      },
      { status: 400 },
    );
  }

  const playground = await db.playground.findUnique({
    where: {
      id,
    },
  });
  if (!playground) {
    return Response.json(
      {
        error: "Playground not found",
      },
      { status: 404 },
    );
  }

  const templateKey = playground.template as keyof typeof templatePaths;
  const templatePath = templatePaths[templateKey];
  if (!templatePath) {
    return Response.json(
      {
        error: "Template not found",
      },
      { status: 404 },
    );
  }

  try {
    const inputPath = path.join(process.cwd(), templatePath);
    const outputPath = path.join(process.cwd(), `output/${templateKey}.json`);

    await saveTemplateStructureToJson(inputPath, outputPath);

    const result = await readTemplateStructureFromJson(outputPath);

    // validate the JSON structure before saving
    if (!validateJsonStructure(result.items)) {
      return Response.json(
        {
          error: "Invalid JSON structure",
        },
        { status: 400 },
      );
    }

    await fs.unlink(outputPath);
    return Response.json(
      { success: true, templateJson: result },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching template data", error);
    return Response.json(
      { success: false, error: "Error fetching template data" },
      { status: 500 },
    );
  }
}
