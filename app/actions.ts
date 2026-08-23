"use server";

import { prisma } from "@/app/lib/prisma";
import { User } from "@prisma/client";
import { signIn, signOut, auth } from "auth";
import { revalidatePath } from "next/cache";
import getCurrentUser from "./lib/auth-user";

export type FormState = {
  message: string;
  type: "success" | "error";
};

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

  if (!session) {
    return {
      message: "Não autorizado.",
      type: "error",
    };
  }

  const dataForm = {
    id: formData.get("id") as string,
    name: formData.get("name") as string,
    backgroundUrl: (formData.get("backgroundUrl") as string) || "",
    imageUrl: (formData.get("imageUrl") as string) || "",
    title: formData.get("title") as string,
    bio: formData.get("bio") as string,
    location: formData.get("location") as string,
  };

  if (session.user.id !== dataForm.id) {
    return {
      message: "Não autorizado.",
      type: "error",
    };
  }

  if (dataForm.name.length < 4) {
    return {
      message: "O nome deve conter no mínimo 4 caracteres.",
      type: "error",
    };
  }

  if (dataForm.bio.length <= 5) {
    return {
      message: "A bio deve conter no mínimo 5 caracteres.",
      type: "error",
    };
  }

  if (dataForm.location.length <= 4) {
    return {
      message: "A localização deve conter no mínimo 4 caracteres.",
      type: "error",
    };
  }

  const original = await prisma.user.findUnique({
    where: {
      id: dataForm.id,
    },
  });

  if (!original) {
    return {
      message: "Usuário não encontrado.",
      type: "error",
    };
  }

  const hasBackground = dataForm.backgroundUrl.length > 0;
  const hasImage = dataForm.imageUrl.length > 0;

  const hasChanges =
    dataForm.name !== original.name ||
    dataForm.title !== original.title ||
    dataForm.bio !== original.bio ||
    dataForm.location !== original.location ||
    hasBackground ||
    hasImage;

  if (!hasChanges) {
    return {
      message: "Nenhuma alteração foi realizada.",
      type: "error",
    };
  }

  const dataToUpdate = {
    name: dataForm.name,
    title: dataForm.title,
    bio: dataForm.bio,
    location: dataForm.location,

    ...(hasBackground && {
      background: dataForm.backgroundUrl,
    }),

    ...(hasImage && {
      image: dataForm.imageUrl,
    }),
  };

  await prisma.user.update({
    where: {
      id: dataForm.id,
    },
    data: dataToUpdate,
  });
  revalidatePath("/");
  return {
    message: "Perfil atualizado com sucesso.",
    type: "success",
  };
}

export async function newPost(
  formState: FormState,
  formData: FormData,
): Promise<FormState> {
  const session = await auth();
  if (!session) return { message: "Não autorizado.", type: "error" };

  const userId = formData.get("id") as string;
  const visibleId = formData.get("visibleId") as string;
  const caption = formData.get("caption") as string;
  const imageUrl = formData.get("imageUrl") as string;

  if (session.user.id !== userId)
    return { message: "Não autorizado.", type: "error" };

  if (!caption || caption.length < 5) {
    return {
      message: "Legenda deve conter no mínimo 5 caracteres.",
      type: "error",
    };
  }

  const newData = {
    userId,
    caption,
    visibleId,
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

export async function getUserPosts(userId: string) {
  const logged = await getCurrentUser();
  if (logged === null) {
    throw new Error("Não autorizado!");
  }
  if (logged.id != userId) {
    throw new Error("Não autorizado!");
  }
  return await prisma.post.findMany({
    where: { userId },
    include: {
      user: true,
      likes: true,
      comments: {
        include: { user: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function deletePost(postId: string) {
  const logged = await getCurrentUser();
  if (logged === null) {
    return null;
  }

  await prisma.post.delete({
    where: { id: postId },
  });
  revalidatePath("/");
}
export async function deleteComment(commentId: string) {
  const logged = await getCurrentUser();
  if (logged === null) {
    return null;
  }
  await prisma.comment.delete({
    where: { id: commentId },
  });
  revalidatePath("/");
}
export async function getAllPosts() {
  return await prisma.post.findMany({
    include: {
      user: true,
      likes: true,
      comments: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function likePost(postId: string): Promise<FormState> {
  const logged = await getCurrentUser();
  if (!logged) {
    throw new Error("Não autorizado!");
  }
  const loggedId = logged?.id;

  const trueLike = await prisma.like.findFirst({
    where: {
      postId,
      userId: loggedId,
    },
  });

  if (trueLike) {
    await prisma.like.delete({
      where: {
        id: trueLike.id,
      },
    });
  } else {
    await prisma.like.create({
      data: {
        postId,
        userId: loggedId,
      },
    });
  }

  revalidatePath("/");
  if (trueLike) {
    return { message: "Você Descurtiu este post", type: "success" };
  } else {
    return { message: "Você curtiu este post", type: "success" };
  }
}

export async function addComment(postId: string, content: string) {
  const logged = await getCurrentUser();

  if (logged === null) {
    throw new Error("Não autorizado!");
  }
  if (content.trim().length <= 5) {
    return null;
  }

  const userId = logged?.id;

  await prisma.comment.create({
    data: {
      postId,
      userId,
      content,
    },
  });

  revalidatePath("/");
}
