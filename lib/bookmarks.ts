import prisma from "@/lib/prisma";

export default async function getUserBookmarks(username: string) {
  try {
    const user = await prisma.user.findFirst({ where: { username } });
    if (!user) {
      return;
    }
    const userBookmarks = await prisma.bookmarkedProduct.findMany({
      where: { userId: Number(user.id) },
    });
    return userBookmarks;
  } catch (error) {
    console.log(`error while fetching user bookmarks : ${error}`);
  }
}
