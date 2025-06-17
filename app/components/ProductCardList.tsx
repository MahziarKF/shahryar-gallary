// components/ProductCardList.tsx
import { Product } from "../types";
import ProductCard from "./productView/productCard";

export default function ProductCardList({
  products,
  handleDeleteProduct,
  onProductClick,
}: {
  products: Product[];
  handleDeleteProduct: (id: number) => void;
  onProductClick: (id: number) => void;
}) {
  console.log(products);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mt-6">
      {products.map((product) => (
        <ProductCard
          key={product.name}
          product={product}
          onProductClick={onProductClick}
          handleDeleteProduct={handleDeleteProduct}
        />
      ))}
    </div>
  );
}
