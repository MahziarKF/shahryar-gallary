import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const productName = searchParams.get("productName");

  if (!productName) {
    return NextResponse.json({ images: [] });
  }

  try {
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const files = await fs.readdir(uploadDir);

    const safeProductName = productName
      .trim()
      .replace(/\s+/g, "-")
      .toLowerCase();
    const matchedFiles = files.filter((file) =>
      file.startsWith(safeProductName)
    );

    const imageUrls = matchedFiles.map((file) => `/uploads/${file}`);

    return NextResponse.json({ images: imageUrls });
  } catch (error) {
    console.error("Error reading upload directory:", error);
    return NextResponse.json({ images: [] });
  }
}
