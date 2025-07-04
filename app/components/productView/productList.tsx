import ProductCard from "./productCard";
import { Product } from "@/app/types";
import LoadingSpinner from "../loading/loadingSpinner";

export default function ProductList({
  products,
  loading,
  bookmarkedProducts,
  onBookmarkToggle,
}: {
  products: Product[];
  loading: boolean;
  bookmarkedProducts: Product[];
  onBookmarkToggle: (product: Product) => void;
}) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <LoadingSpinner />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <p className="text-center text-gray-700 text-xl">هیچ محصولی پیدا نشد.</p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isBookmarked={bookmarkedProducts.some((p) => p.id === product.id)}
          onBookmarkToggle={() => onBookmarkToggle(product)}
        />
      ))}
    </div>
  );
}
