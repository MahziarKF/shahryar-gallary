// components/ImageUpload.tsx
"use client";

import { useState } from "react";

interface ImageUploadProps {
  onImageUpload: (url: string) => void;
}

export default function ImageUpload({ onImageUpload }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    // Example: Upload to your API route that pushes to S3 / Cloudinary
    const res = await fetch("/api/uploadImage", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const { imageUrl } = await res.json();
      onImageUpload(imageUrl);
      setPreview(imageUrl);
    } else {
      console.error("Upload failed");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="w-32 h-32 object-cover rounded"
        />
      )}
    </div>
  );
}
