import { Product, Category } from "@/app/types";
import { useState } from "react";
import { Plus } from "lucide-react";

interface ProductFormProps {
  formData: {
    name: string;
    description: string;
    price: string;
    stock: number;
    category_id: string;
  };
  handleInputChange: any;
  handleAddProduct: any;
  handleImageChange: any;
  categories: Category[];
}

export function ProductForm({
  formData,
  handleInputChange,
  handleAddProduct,
  handleImageChange,
  categories,
}: ProductFormProps) {
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFileName(file.name);
      setPreviewImage(URL.createObjectURL(file));
      handleImageChange(e);
    }
  };

  return (
    <div className="w-full p-4 bg-white rounded shadow">
      <input
        name="name"
        placeholder="نام محصول"
        value={formData.name}
        onChange={handleInputChange}
        className="block mb-2 p-2 border rounded w-full"
      />
      <textarea
        name="description"
        placeholder="توضیحات"
        value={formData.description}
        onChange={handleInputChange}
        className="block mb-2 p-2 border rounded w-full"
      />
      <input
        name="price"
        placeholder="قیمت"
        value={formData.price}
        onChange={handleInputChange}
        className="block mb-2 p-2 border rounded w-full"
      />
      <input
        name="stock"
        type="number"
        min={0}
        placeholder="موجودی"
        value={formData.stock}
        onChange={handleInputChange}
        className="block mb-2 p-2 border rounded w-full"
      />
      <select
        name="category_id"
        value={formData.category_id}
        onChange={handleInputChange}
        className="block mb-4 p-2 border rounded w-full"
      >
        <option value="">دسته‌بندی را انتخاب کنید</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      {/* File Upload with Image Preview */}
      <div className="mb-4">
        <input
          id="file-upload"
          type="file"
          name="image"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <label
          htmlFor="file-upload"
          className="flex items-center justify-center w-32 h-32 bg-gray-200 hover:bg-gray-300 text-gray-500 rounded-lg cursor-pointer transition-colors overflow-hidden"
        >
          {previewImage ? (
            <img
              src={previewImage}
              alt="Preview"
              className="object-cover w-full h-full"
            />
          ) : (
            <Plus size={40} />
          )}
        </label>
        {selectedFileName && (
          <p className="mt-2 text-sm text-gray-600">
            فایل انتخاب شده: {selectedFileName}
          </p>
        )}
      </div>

      <button
        onClick={handleAddProduct}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
      >
        افزودن محصول
      </button>
    </div>
  );
}

export function CategoryForm({
  categoryName,
  setCategoryName,
  handleAddCategory,
}: {
  categoryName: string;
  setCategoryName: any;
  handleAddCategory: any;
}) {
  return (
    <>
      <input
        name="category"
        placeholder="نام دسته بندی"
        value={categoryName}
        onChange={(e) => setCategoryName(e.target.value)}
        className="block mb-2 p-2 border rounded w-full"
      />
      <button
        onClick={handleAddCategory}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        افزودن دسته بندی
      </button>
    </>
  );
}

export function DiscountForm({
  products,
  handleDiscountChage,
  handleAddDiscount,
  discount,
  selectedProduct,
}: {
  products: Product[];
  handleDiscountChage: any;
  handleAddDiscount: any;
  discount: string;
  selectedProduct: string;
}) {
  return (
    <>
      <input
        name="discount"
        type="number"
        min={1}
        max={100}
        placeholder="مقدار تخفیف (1-100)"
        value={discount}
        onChange={handleDiscountChage}
        className="block mb-2 p-2 border rounded w-full"
      />

      <select
        name="product_id"
        value={selectedProduct}
        onChange={handleDiscountChage}
        className="block mb-2 p-2 border rounded w-full"
      >
        <option value="">محصول را انتخاب کنید</option>
        {products.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
      <button
        onClick={handleAddDiscount}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        افزودن تخفیف
      </button>
    </>
  );
}
