import path from "path";
import fs from "fs/promises";

export async function deleteProductImages(productName: string) {
  if (!productName) {
    throw new Error("Product name is required");
  }

  // Clean the product name to match the saved file names
  const safeProductName = productName.trim().replace(/\s+/g, "-").toLowerCase();
  const uploadDir = path.join(process.cwd(), "public", "uploads");

  try {
    // Read all files in the uploads directory
    const files = await fs.readdir(uploadDir);
    // Find files that start with the product name
    const matchedFiles = files.filter((file) =>
      file.startsWith(safeProductName)
    );

    if (matchedFiles.length === 0) {
      console.log("No files found for product:", productName);
      return;
    }

    // Delete each matched file
    for (const file of matchedFiles) {
      const filePath = path.join(uploadDir, file);
      await fs.unlink(filePath);
      console.log(`Deleted file: ${filePath}`);
    }

    console.log(`All files for product "${productName}" have been deleted.`);
  } catch (error) {
    console.error("Error deleting files:", error);
    throw new Error("Error deleting files.");
  }
}
export async function getProductImages(productName: string): Promise<string[]> {
  try {
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const files = await fs.readdir(uploadDir);

    // Normalize the product name to match naming pattern
    const safeProductName = productName
      .trim()
      .replace(/\s+/g, "-")
      .toLowerCase();

    // Filter files that start with the product name
    const matchedFiles = files.filter((file) =>
      file.startsWith(safeProductName)
    );

    // Return relative URLs to the public folder
    return matchedFiles.map((file) => `/uploads/${file}`);
  } catch (error) {
    console.error("Error reading upload directory:", error);
    return []; // Return empty array if an error occurs
  }
}
