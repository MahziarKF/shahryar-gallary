// components/ProductCardList.tsx
import { Product } from "../types";

export default function ProductCardList({
  products,
  handleDeleteProduct,
}: {
  products: Product[];
  handleDeleteProduct: (id: number) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="flex justify-between items-center bg-gray-100 p-3 rounded"
        >
          <span>{product.name}</span>
          <button
            onClick={() => handleDeleteProduct(product.id)}
            className="w-full bg-red-600 text-white rounded py-1 px-3 hover:bg-red-700 transition max-w-[120px] text-sm text-center"
          >
            حذف
          </button>
        </div>
      ))}
    </div>
  );
}
