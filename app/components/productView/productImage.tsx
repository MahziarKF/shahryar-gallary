import React, { useEffect, useState } from "react";
import Image from "next/image";
import LoadingSpinner from "../loading/loadingSpinner";

interface ProductImageProps {
  productName: string;
}

const ProductImage: React.FC<ProductImageProps> = ({ productName }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(
          `/api/getProductImages?productName=${encodeURIComponent(productName)}`
        );
        const data = await response.json();
        console.log(`image : ${data.images}`);
        if (data?.images && data.images.length > 0) {
          setImageUrl(data.images[0]);
        } else {
          setImageUrl("/some");
        }
      } catch (error) {
        console.error("Error fetching image:", error);
        setImageUrl("/some");
      }
    };

    fetchImage();
  }, [productName]);

  return (
    <div className="relative w-full h-64 flex items-center justify-center">
      {isLoading && (
        <div className="absolute z-10">
          <LoadingSpinner size={48} />
        </div>
      )}
      <Image
        src={imageUrl || "/some"}
        alt={productName}
        layout="fill"
        objectFit="contain"
        className={`transition-opacity duration-300 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
};

export default ProductImage;
