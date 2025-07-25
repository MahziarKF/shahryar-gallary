import { Category, Product } from "@/app/types";
import { getProductImages } from "@/lib/image";
import { useEffect, useState } from "react";
import ProductImage from "./productImage";

export default function ProductCard({
  product,
  onProductClick,
  handleDeleteProduct,
}: {
  product: Product;
  onProductClick?: (id: number) => void;
  handleDeleteProduct: (id: number) => void;
}) {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(
          `/api/getProductImages?productName=${encodeURIComponent(
            product.name
          )}`
        );
        const data = await response.json();
        setImages(data.images);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };
    fetchImages();
  }, [product.name]);
  console.log(product);
  return (
    <>
      <div
        onClick={(e) => {
          if (onProductClick) onProductClick(product.id);
        }}
        key={product.id}
        className="bg-white shadow p-4 rounded flex flex-col justify-between"
      >
        {/* Product Image */}
        {/* {images.length > 0 ? (
          <img
            src={images[0]}
            alt={product.name}
            className="w-full h-48 object-cover rounded mb-4"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500 mb-4 rounded">
            بدون تصویر
          </div>
        )} */}
        <ProductImage productName={product.name} />
        {/* Product Info */}
        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-2">
          {product.description || "بدون توضیحات"}
        </p>

        <div className="mb-2 text-sm text-gray-700">
          قیمت: {product.price} تومان
        </div>

        <div className="mb-2 text-sm text-gray-700">
          موجودی: {product.stock}
        </div>

        {/* Categories */}
        {product.categories ? (
          <>
            <p>دسته بندی ها :{product.categories?.map((c: any) => c.name)}</p>
          </>
        ) : (
          "بدون دسته بندی"
        )}

        {/* Discount */}
        {product.discount && product.discount.length > 0 && (
          <div className="mb-2 text-sm text-green-700">
            تخفیف: {product.discount.discount_percent}٪
          </div>
        )}

        <button
          onClick={() => handleDeleteProduct(product.id)}
          className="w-full bg-red-600 text-white rounded py-2 px-4 hover:bg-red-700 transition mt-4"
        >
          حذف
        </button>
      </div>
    </>
  );
}
