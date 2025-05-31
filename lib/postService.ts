// lib/postService.ts
import { prisma } from "./prisma";

export async function updatePost(id: string) {
  try {
    const updatedPost = await prisma.example.update({
      where: { id: id },
      data: { isGay: true },
    });
    return updatedPost;
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
}
