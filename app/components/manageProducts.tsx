import { useState } from "react";
import Dropdown from "./dropDown";
import ProductCardList from "./ProductCardList";
import CategoryCardList from "./CategoryCardList";
import { Product } from "../types";
import {
  CategoryForm,
  DiscountForm,
  ProductForm,
} from "./productComponents/manageProductComponents";
import ProductCard from "./productView/productCard";
import { ArrowLeft } from "lucide-react";
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
    image: null as File | null, // Allow File objects
    category_id: "",
  });

  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState<Category[]>(categorys);
  const [products, setProducts] = useState<Product[]>(productsFromProps);
  const [message, setMessage] = useState("");
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [discountData, setDiscountData] = useState({
    product_id: "",
    discount: "",
  });
  const handleDiscountChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setDiscountData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  const handleAddDiscount = async () => {
    const discountValue = Number(discountData.discount);
    if (discountValue < 1 || discountValue > 100) {
      setMessage("تخفیف باید بین 1 تا 100 باشد.");
      return;
    }
    if (!discountData.product_id || !discountData.discount) {
      setMessage("محصول و مقدار تخفیف الزامی هستند.");
      return;
    }

    try {
      const res = await fetch("/api/addDiscount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(discountData),
      });

      const response = await res.json();

      if (res.status === 409) {
        setMessage(response.message); // Use the response message from backend
        return; // ✅ Stop execution here to prevent showing the success message
      }

      if (!res.ok) throw new Error("Failed to add discount");

      setMessage("تخفیف با موفقیت اعمال شد.");
      // Optionally reset form
      setDiscountData({ product_id: "", discount: "" });
    } catch (error) {
      console.log("Error adding discount:", error);
      setMessage("خطا در افزودن تخفیف.");
    }
  };

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

    let imageUrl = "";

    if (formData.image) {
      const imageData = new FormData();
      imageData.append("file", formData.image);
      imageData.append("productName", formData.name); // ✅ Add this line
      try {
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: imageData,
        });

        const uploadResult = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadResult.message);

        imageUrl = uploadResult.filePath;
      } catch (error) {
        console.error("Error uploading image:", error);
        setMessage("خطا در بارگذاری تصویر.");
        return;
      }
    }

    // Prepare product data including image path
    const productData = { ...formData, image: imageUrl };

    try {
      const req = await fetch("/api/createProduct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
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
        image: null,
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
      setCurrentMode("Product");
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
  const onProductClick = (id: number) => {
    const clickedProduct = products.find((p: Product) => p.id === id);
    if (clickedProduct) setCurrentProduct(clickedProduct);
    setCurrentMode("ProductView");
  };
  return (
    <div className="p-4 bg-white rounded-xl shadow-md w-full max-w-2xl mx-auto">
      <div className="w-full flex justify-between items-center">
        <h2 className="text-xl font-semibold mb-4">
          {currentMode === "Product"
            ? "محصولات"
            : currentMode === "Category"
            ? "دسته بندی ها"
            : currentMode === "Discount"
            ? "تخفیف"
            : "مشاهده محصول"}
        </h2>

        {currentMode === "ProductView" ? (
          <button
            onClick={() => setCurrentMode("Product")}
            className="flex items-center text-black hover:text-gray-700"
          >
            <ArrowLeft className="w-4 h-4 mr-1" strokeWidth={1.25} />
            بازگشت
          </button>
        ) : (
          <Dropdown
            title={
              currentMode === "Product"
                ? "محصولات"
                : currentMode === "Category"
                ? "دسته بندی ها"
                : "تخفیف"
            }
            items={[
              { id: "Product", title: "محصولات" },
              { id: "Category", title: "دسته بندی ها" },
              { id: "Discount", title: "تخفیف" },
            ]}
            onSelect={(id: string) => {
              setCurrentMode(id);
              setMessage("");
            }}
          />
        )}
      </div>

      {currentMode === "Product" ? (
        <>
          {/* Product Form */}
          <ProductForm
            formData={formData}
            handleAddProduct={handleAddProduct}
            handleInputChange={handleInputChange}
            categories={categories}
            handleImageChange={handleImageChange}
          />

          <ProductCardList
            onProductClick={onProductClick}
            products={products}
            handleDeleteProduct={handleDeleteProduct}
          />
        </>
      ) : currentMode === "Category" ? (
        <>
          {/* Category Form */}
          <CategoryForm
            categoryName={categoryName}
            handleAddCategory={handleAddCategory}
            setCategoryName={setCategoryName}
          />
          <CategoryCardList
            categories={categories ?? []}
            handleDeleteCategory={handleDeleteCategory}
          />
        </>
      ) : currentMode === "Discount" ? (
        <>
          <DiscountForm
            products={products}
            handleDiscountChage={handleDiscountChange}
            handleAddDiscount={handleAddDiscount}
            discount={discountData.discount}
            selectedProduct={discountData.product_id}
          />
        </>
      ) : (
        <>
          {currentProduct && (
            <ProductCard
              product={currentProduct}
              handleDeleteProduct={handleDeleteProduct}
            />
          )}
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
