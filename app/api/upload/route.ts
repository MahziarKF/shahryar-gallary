import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const file = formData.get("file") as File;
  const productName = formData.get("productName") as string;

  if (!file || !productName) {
    return NextResponse.json(
      { message: "File and product name are required" },
      { status: 400 }
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Extract the file extension
  const fileExt = path.extname(file.name);

  // Clean the product name for safe file naming
  const safeProductName = productName.trim().replace(/\s+/g, "-").toLowerCase();

  // Optional: add a timestamp to prevent filename conflicts
  const timestamp = Date.now();

  // Build the final filename
  const filename = `${safeProductName}-${timestamp}${fileExt}`;

  const uploadPath = path.join(process.cwd(), "public", "uploads", filename);

  try {
    await fs.writeFile(uploadPath, buffer);

    return NextResponse.json({
      message: "File uploaded successfully",
      filePath: `/uploads/${filename}`,
    });
  } catch (error) {
    console.error("Error saving file:", error);
    return NextResponse.json({ message: "Error saving file" }, { status: 500 });
  }
}
