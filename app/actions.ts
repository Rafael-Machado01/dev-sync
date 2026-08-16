"use server";

import { prisma } from "@/app/lib/prisma";
import { User } from "@prisma/client";
import { signIn, signOut, auth } from "auth";
import { promises as fs } from "fs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type FormState = {
  message: string;
  type: "success" | "error";
};
import path from "path";

export async function getUserByEmail(
  email: string | null,
): Promise<User | null> {
  if (!email) {
    return null;
  }
  const user = await prisma.user.findUnique({
    where: { email: email },
  });
  return user;
}

export async function signInWithProvider(
  provider: "google" | "github",
): Promise<void> {
  await signIn(provider);
}

export async function logout() {
  await signOut();
}

export async function updateUserProfile(
  formState: FormState,
  formData: FormData,
): Promise<FormState> {
  const session = await auth();
  if (!session) return { message: "Não autorizado.", type: "error" };

  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const backgroundFile = formData.get("background") as File;
  const imageFile = formData.get("image") as File;
  const title = formData.get("title") as string;
  const bio = formData.get("bio") as string;
  const location = formData.get("location") as string;

  if (session.user.id !== id)
    return { message: "Não autorizado.", type: "error" };
  if (name.length < 4) {
    return {
      message: "O nome deve conter no mínimo 4 Caracteres ",
      type: "error",
    };
  } else if (bio.length <= 5) {
    return {
      message: "A bio deve conter no mínimo 5 Caracteres ",
      type: "error",
    };
  } else if (location.length <= 4) {
    return {
      message: "A Localização deve conter no mínimo 4 Caracteres ",
      type: "error",
    };
  }
  let backgroundUrl;
  let imageUrl;

  if (backgroundFile && backgroundFile.size != 0) {
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, backgroundFile.name);
    const arrayBuffer = await backgroundFile.arrayBuffer();

    await fs.writeFile(filePath, Buffer.from(arrayBuffer));
    backgroundUrl = `/uploads/${backgroundFile.name}`;
  }

  if (imageFile && imageFile.size != 0) {
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, imageFile.name);
    const arrayBuffer = await imageFile.arrayBuffer();

    await fs.writeFile(filePath, Buffer.from(arrayBuffer));
    imageUrl = `/uploads/${imageFile.name}`;
  }

  const dataToUpdate = {
    ...(backgroundUrl && { background: backgroundUrl }),
    ...(imageUrl && { image: imageUrl }),
    name,
    title,
    bio,
    location,
  };

  await prisma.user.update({
    where: { id },
    data: dataToUpdate,
  });

  revalidatePath("/");

  return { message: "Perfil Atualizado com sucesso.", type: "success" };
}
export async function newPost(
  formState: FormState,
  formData: FormData,
): Promise<FormState> {
  const session = await auth();
  if (!session) return { message: "Não autorizado.", type: "error" };

  const userId = formData.get("id") as string;
  const caption = formData.get("caption") as string;
  const imageFile = formData.get("image") as File;

  if (session.user.id !== userId)
    return { message: "Não autorizado.", type: "error" };

  if (!caption) {
    return { message: "Legenda é obrigátorio", type: "error" };
  }

  let imageUrl;
  if (imageFile && imageFile.size != 0) {
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, imageFile.name);
    const arrayBuffer = await imageFile.arrayBuffer();

    await fs.writeFile(filePath, Buffer.from(arrayBuffer));
    imageUrl = `/uploads/${imageFile.name}`;
  }

  const newData = {
    userId,
    caption,
    ...(imageUrl && { imageUrl: imageUrl }),
  };
  await prisma.post.create({
    data: newData,
  });
  revalidatePath("/");
  return {
    message: "Publicado com sucesso!",
    type: "success",
  };
}
