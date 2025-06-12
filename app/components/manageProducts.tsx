import { useState } from "react";
import Dropdown from "./dropDown";
import ProductCardList from "./ProductCardList";
import CategoryCardList from "./CategoryCardList";
import { Product } from "../types";

type Category = {
  id: number;
  name: string;
};

export default function ManageProducts({
  productsFromProps,
  categorys,
}: {
  productsFromProps: Product[];
  categorys: Category[];
}) {
  const [currentMode, setCurrentMode] = useState("Product");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: 0,
    category_id: "",
  });
  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState<Category[]>(categorys);
  const [products, setProducts] = useState<Product[]>(productsFromProps);
  const [message, setMessage] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "stock" ? parseInt(value) : value,
    }));
  };

  const handleAddProduct = async () => {
    if (!formData.name || !formData.price) {
      setMessage("نام و قیمت الزامی هستند.");
      return;
    }

    try {
      const req = await fetch("/api/createProduct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await req.json();
      if (!req.ok) throw new Error("Failed to create product");

      setProducts((prev) => [...prev, result.product]);
      setMessage("محصول با موفقیت اضافه شد.");
      setFormData({
        name: "",
        description: "",
        price: "",
        stock: 0,
        category_id: "",
      });
    } catch (error) {
      console.log("Error creating product:", error);
      setMessage("خطا در افزودن محصول.");
    }
  };
  const handleDeleteProduct = async (id: number) => {
    try {
      const res = await fetch("/api/removeProduct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const response = await res.json();
      setMessage(response.message);

      if (!res.ok) return;

      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.log(`Error while removing product with id ${id}:`, error);
    }
  };

  const handleAddCategory = async () => {
    if (!categoryName.trim()) {
      setMessage("نام دسته بندی الزامی است.");
      return;
    }

    try {
      const req = await fetch("/api/createCategory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: categoryName }),
      });

      if (req.status === 409) {
        setMessage("این دسته بندی وجود دارد");
        return;
      }

      if (req.status !== 201) throw new Error("Failed to create category");

      const newCategory: Category = await req.json();
      setCategories((prev) => [...prev, newCategory]);
      setMessage("دسته بندی با موفقیت اضافه شد.");
      setCategoryName("");
    } catch (error) {
      console.log("Error creating category:", error);
      setMessage("خطا در افزودن دسته بندی.");
    }
  };
  const handleDeleteCategory = async (id: number) => {
    try {
      const res = await fetch("/api/removeCategory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const response = await res.json();
      setMessage(response.message);

      if (!res.ok) return;

      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.log(`Error while removing category with id ${id}:`, error);
    }
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-md w-full max-w-2xl mx-auto">
      <div className="w-full flex justify-between items-center">
        <h2 className="text-xl font-semibold mb-4">
          {currentMode === "Product" ? "افزودن محصول جدید" : "دسته بندی ها"}
        </h2>
        <Dropdown
          title={currentMode === "Product" ? "محصولات" : "دسته بندی ها"}
          items={[
            { id: "Product", title: "محصولات" },
            { id: "Category", title: "دسته بندی ها" },
          ]}
          onSelect={(id: string) => {
            setCurrentMode(id);
            setMessage("");
          }}
        />
      </div>

      {currentMode === "Product" ? (
        <>
          {/* Product Form */}
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
            className="block mb-2 p-2 border rounded w-full"
          >
            <option value="">دسته‌بندی را انتخاب کنید</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleAddProduct}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            افزودن محصول
          </button>
          <ProductCardList
            products={products}
            handleDeleteProduct={handleDeleteProduct}
          />
        </>
      ) : (
        <>
          {/* Category Form */}
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
          <CategoryCardList
            categories={categories}
            handleDeleteCategory={handleDeleteCategory}
          />
        </>
      )}

      {message && (
        <div className="mt-3 text-sm p-2 rounded bg-blue-100 text-blue-800">
          {message}
        </div>
      )}
    </div>
  );
}
