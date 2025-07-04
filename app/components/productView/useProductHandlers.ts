"use client";

import { useEffect, useState } from "react";
import { Category, Product, Discount, User } from "@/app/types";

interface UseProductHandlersProps {
  products: Product[];
  discounts: Discount[];
  bookMarks: { userId: number; productId: number }[];
  user: User | null;
}

export const useProductHandlers = ({
  products,
  discounts,
  bookMarks,
  user,
}: UseProductHandlersProps) => {
  const [search, setSearch] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filter, setFilter] = useState("none");
  const [loading, setLoading] = useState(false);
  const [currentMode, setCurrentMode] = useState<
    "default" | "bookmarks" | "allProducts"
  >("default");

  // Set filter based on search or selected category
  useEffect(() => {
    if (search.trim()) {
      setFilter("search");
    } else if (selectedCategory) {
      setFilter("category");
    } else {
      setFilter("none");
    }
  }, [search, selectedCategory]);

  // Initialize bookmarked products
  const bookmarkedProductsInitial: Product[] = products.filter((product) =>
    bookMarks.some((b) => b.productId === product.id)
  );
  const [bookmarkedProducts, setBookmarkedProducts] = useState<Product[]>(
    bookmarkedProductsInitial
  );

  // Handle category selection
  const handleCategoryClick = (categoryName: string) => {
    setLoading(true);
    setSearch("");
    setSearchValue("");
    setSelectedCategory((prev) =>
      prev === categoryName ? null : categoryName
    );
    setFilter("category");
    setTimeout(() => setLoading(false), 300);
  };

  // Search submit
  const handleSearch = () => {
    if (!searchValue.trim()) return;
    setLoading(true);
    setSearch(searchValue);
    setSelectedCategory(null);
    setTimeout(() => setLoading(false), 300);
  };

  // Clear filters
  const handleClear = () => {
    setLoading(true);
    setSearch("");
    setSearchValue("");
    setSelectedCategory(null);
    setTimeout(() => setLoading(false), 300);
  };

  // Bookmark Add
  const addBookmark = async (productName: string) => {
    if (!user) return;
    try {
      const res = await fetch(`/api/addBookmark`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName, username: user.username }),
      });

      const data = await res.json();
      const addedProduct = products.find((p) => p.name === productName);
      if (addedProduct) {
        setBookmarkedProducts((prev) => [...prev, addedProduct]);
      }
    } catch (err) {
      console.error("Bookmark add error:", err);
    }
  };

  // Bookmark Remove
  const removeBookmark = async (productName: string) => {
    if (!user) return;
    try {
      const res = await fetch(`/api/removeBookmark`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName, username: user.username }),
      });

      const data = await res.json();
      setBookmarkedProducts((prev) =>
        prev.filter((p) => p.id !== data.removedBookmark.productId)
      );
    } catch (err) {
      console.error("Bookmark remove error:", err);
    }
  };

  // Filtered Products
  const filteredProducts =
    filter === "search"
      ? products.filter((p) =>
          p.name.toLowerCase().includes(search.toLowerCase())
        )
      : filter === "category"
      ? products.filter((p) =>
          p.categories?.some(
            (cat: any) => cat.category?.name === selectedCategory
          )
        )
      : products;

  // Special / Discounted Products
  const discountedProducts = products.filter((product) =>
    discounts.some((discount) => discount.product_id === product.id)
  );

  const specialProducts =
    filter === "none"
      ? discountedProducts.slice(0, 3)
      : discountedProducts
          .filter((p) => !filteredProducts.some((fp) => fp.id === p.id))
          .slice(0, 3);

  return {
    search,
    searchValue,
    setSearchValue,
    selectedCategory,
    currentMode,
    setCurrentMode,
    loading,
    handleCategoryClick,
    handleSearch,
    handleClear,
    filteredProducts,
    bookmarkedProducts,
    addBookmark,
    removeBookmark,
    specialProducts,
  };
};
