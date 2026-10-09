"use server";

import { currentUser } from "@/modules/auth/actions";
import { db } from "@/lib/db";
import { Templates } from "@prisma/client";
import { revalidatePath } from "next/cache";

interface CreatePlaygroundData {
  title: string;
  description?: string;
  template: Templates;
}

export const createPlayground = async ({
  title,
  description,
  template,
}: CreatePlaygroundData) => {
  const user = await currentUser();

  try {
    const playground = await db.playground.create({
      data: {
        title,
        description,
        template,
        userId: user?.id as string,
      },
    });

    return playground;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getAllPlaygroundForUser = async () => {
  const user = await currentUser();

  try {
    const playgrounds = await db.playground.findMany({
      where: {
        userId: user?.id as string,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: true,
        Starmark: {
          where: {
            userId: user?.id,
          },
          select: {
            isMarked: true,
          },
        },
      },
    });

    return playgrounds;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const deleteProjectById = async (id: string) => {
  await currentUser();

  try {
    await db.playground.delete({
      where: {
        id,
      },
    });

    revalidatePath("/dashboard");
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const editProjectById = async (
  id: string,
  data: { title: string; description: string },
) => {
  await currentUser();

  try {
    await db.playground.update({
      where: { id },
      data,
    });

    revalidatePath("/dashboard");
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const duplicateProjectById = async (id: string) => {
  await currentUser();

  try {
    const originalPlayground = await db.playground.findUnique({
      where: {
        id,
      },
    });

    if (!originalPlayground) {
      throw new Error("Playground not found");
    }

    const duplicatedPlayground = await db.playground.create({
      data: {
        title: `${originalPlayground.title} (Copy)`,
        description: originalPlayground.description,
        template: originalPlayground.template,
        userId: originalPlayground.userId,
      },
    });

    revalidatePath("/dashboard");
    return duplicatedPlayground;
  } catch (error) {
    console.log(error);
    return null;
  }
};
