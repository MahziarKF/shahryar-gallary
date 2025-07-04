"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "./productComponents/button";
import { Input } from "./productComponents/input";
import { Card, CardContent } from "./productComponents/card";
import { Category, Product, Discount, User } from "../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faPhone,
  faShoppingCart,
  faArrowLeft,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import HeroBanner from "./productView/heroBanner";
import SpecialProducts from "./productView/specialProducts";
import ProductImage from "./productView/productImage";
import LoadingSpinner from "./loading/loadingSpinner";
import Dropdown from "./dropDown";
import AllProducts from "./productView/allProducts";

interface propTypes {
  products: Product[];
  categories: Category[];
  discounts: Discount[];
  user: User | null;
  bookMarks: { userId: number; productId: number }[];
}

export default function ProductsPage({
  products,
  categories,
  discounts,
  bookMarks,
  user,
}: propTypes) {
  const [search, setSearch] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filter, setFilter] = useState("none");
  const [loading, setLoading] = useState(false);
  const [displayedProducts, setDisplayedProducts] =
    useState<Product[]>(products);
  const [page, setPage] = useState(1);
  const [currentMode, setCurrentMode] = useState("allProducts");
  const limit = 6;
  // Update filter state based on search or category
  useEffect(() => {
    if (search.trim() !== "") {
      setFilter("search");
    } else if (selectedCategory) {
      setFilter("category");
    } else {
      setFilter("none");
    }
  }, [search, selectedCategory]);

  const handleCategoryClick = (categoryName: string) => {
    setLoading(true);
    setSearch("");
    setSearchValue("");
    setSelectedCategory((prev) =>
      prev === categoryName ? null : categoryName
    );
    setFilter("category");
  };

  const handleSearch = () => {
    if (!searchValue.trim()) return;
    setLoading(true);
    setSearch(searchValue);
    setSelectedCategory(null);
    setTimeout(() => setLoading(false), 500);
  };

  const handleClear = () => {
    setLoading(true);
    setSearch("");
    setSearchValue("");
    setSelectedCategory(null);
    setTimeout(() => setLoading(false), 500);
  };

  // Filtered products based on search or category
  // const bookmarkedProducts = products.filter((p: Product) =>
  //   products.some((p: Product) => p.id)
  // );
  // const bookmarkedProducts: Product[] = [];
  const bookmarkedProductsInitial: Product[] = [];
  // console.log(`lengths : p : ${products.length} bp : ${bookMarks.length}`);
  for (let i = 0; i < products.length; i++) {
    for (let x = 0; x < bookMarks.length; x++) {
      if (products[i].id == bookMarks[x].productId)
        bookmarkedProductsInitial.push(products[i]);
    }
  }
  // console.log(bookmarkedProductsInitial);
  // Select discounted/special products
  const discountedProducts = products.filter((product) =>
    discounts.some((discount) => discount.product_id === product.id)
  );
  const [bookmarkedProducts, setBookmarkedProducts] = useState<Product[]>(
    bookmarkedProductsInitial
  );
  // Special products NOT included in filtered products
  const specialProducts =
    filter === "none"
      ? discountedProducts.slice(0, 3)
      : discountedProducts
          .filter(
            (product) => !filteredProducts.some((fp) => fp.id === product.id)
          )
          .slice(0, 3);
  const addBookmark = async (productName: string) => {
    try {
      if (!user) return;

      const request = await fetch(`/api/addBookmark`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName, username: user.username }),
      });

      const res = await request.json();
      const addedProduct = products.find((p) => p.name === productName);
      if (addedProduct) {
        setBookmarkedProducts((prev) => [...prev, addedProduct]);
      }
    } catch (error) {
      console.log(`error while adding bookmark : ${error}`);
    }
  };

  useEffect(() => {
    // console.log(`bookmarked products : ${bookmarkedProducts}`);
  }, [bookmarkedProducts]);
  const removeBookmark = async (productName: string) => {
    try {
      if (!user) return;

      const request = await fetch(`/api/removeBookmark`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName, username: user.username }),
      });

      const res = await request.json();
      setBookmarkedProducts((prev) =>
        prev.filter((p) => p.id !== res.removedBookmark.productId)
      );
    } catch (error) {
      console.log(`error while removing bookmark : ${error}`);
    }
  };
  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  // Handlers for pagination buttons
  const handleNextPage = () => {
    setPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };
  useEffect(() => {
    // On first mount, initialize displayed products
    setDisplayedProducts(products);
  }, [products]);

  const fetchProducts = async (pageNumber: number) => {
    setLoading(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ limit, page: pageNumber }),
      });
      const data = await res.json();
      setDisplayedProducts(data.products);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch products", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    // When page changes, fetch new products
    fetchProducts(page);
  }, [page]);
  useEffect(() => {
    // console.log("Search:", search);
    // console.log("Search Value:", searchValue);
    // console.log("Selected Category:", selectedCategory);
    // console.log("Filter:", filter);
    // console.log("Loading:", loading);
    // console.log("Page:", page);
    // console.log("Current Mode:", currentMode);
    // console.log("Displayed Products:", displayedProducts);
    // console.log("Products prop:", products);
  }, [
    search,
    searchValue,
    selectedCategory,
    filter,
    loading,
    page,
    currentMode,
    displayedProducts,
    products,
  ]);

  // Then when rendering products (pagination or filtered)
  // Use displayedProducts, for example:
  const filteredProducts =
    filter === "search"
      ? displayedProducts.filter((product) =>
          product.name.toLowerCase().includes(search.toLowerCase())
        )
      : filter === "category"
      ? displayedProducts.filter((product) =>
          product.categories?.some(
            (cat) => cat.category?.name === selectedCategory
          )
        )
      : displayedProducts;
  return (
    <>
      <main className="min-h-screen bg-gradient-to-rs bg-gray-300/95 from-orange-700 via-amber-500 to-yellow-400 p-6">
        <div className="max-w-7xl mx-auto">
          {filter === "none" && <HeroBanner />}

          {/* Search and Top Icons */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 p-4 bg-white rounded-2xl shadow-lg">
            {/* Search Bar */}
            <div className="flex items-center gap-3 w-full md:w-2/3">
              <Input
                type="text"
                placeholder="جستجوی محصول..."
                className="w-full max-w-md ring-1 ring-gray-300 focus:ring-orange-500 bg-gray-200"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <Button
                variant="secondary"
                onClick={handleSearch}
                className="flex items-center gap-2"
              >
                جستجو
              </Button>
              {(search || selectedCategory) && (
                <Button
                  variant="secondary"
                  onClick={handleClear}
                  className="flex items-center gap-2"
                >
                  پاک کردن
                </Button>
              )}
            </div>

            {/* Top Icons */}
            <div className="flex items-center gap-6 text-2xl text-orange-600">
              <Dropdown
                items={categories.map((c: Category) => ({
                  title: c.name,
                  id: c.id,
                }))}
                title="دسته بندی ها"
                onSelect={(id: number, title: string) => {
                  setSelectedCategory(title);
                }}
              />
              <FontAwesomeIcon
                icon={faPhone}
                className="cursor-pointer hover:text-orange-800"
              />
              <FontAwesomeIcon
                icon={currentMode === "bookmarks" ? faStar : faStarRegular}
                onClick={() => {
                  setCurrentMode(
                    currentMode === "bookmarks" ? "default" : "bookmarks"
                  );
                }}
                className="cursor-pointer hover:text-orange-800"
              />
              <FontAwesomeIcon
                icon={faShoppingCart}
                className="cursor-pointer hover:text-orange-800"
              />
            </div>
          </div>
        </div>
        {currentMode === "default" ? (
          <>
            {" "}
            {/* Products Section */}
            <div className="mb-8">
              <div className="flex justify-between">
                <h2 className="text-3xl font-extrabold mb-6">
                  {filter === "none"
                    ? "تمام محصولات"
                    : "نتایج جستجو / دسته‌بندی"}
                </h2>
                {filteredProducts.length > 6 ? (
                  <>
                    <h2
                      onClick={() => {
                        setCurrentMode("");
                      }}
                      className="text-lg font-bold hover:cursor-pointer underline flex items-center justify-center gap-2.5"
                    >
                      <FontAwesomeIcon icon={faArrowLeft} className="mt-2" />
                      تمام محصولات{" "}
                    </h2>
                  </>
                ) : null}
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-48">
                  <LoadingSpinner />
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {filteredProducts.slice(0, 6).map((product) => {
                    return (
                      <Card
                        key={product.id}
                        className="hover:scale-105 hover:shadow-lg transition-transform"
                      >
                        {" "}
                        <div className="flex justify-between text-2xl text-orange-600 mt-2">
                          <FontAwesomeIcon
                            icon={
                              bookmarkedProducts.find(
                                (p: Product) => p.id === product.id
                              )
                                ? faStar
                                : faStarRegular
                            }
                            className="cursor-pointer hover:text-orange-800 ml-2"
                            onClick={() => {
                              const isThereAnyProducts =
                                bookmarkedProducts.find(
                                  (p: Product) => p.id === product.id
                                );
                              if (!isThereAnyProducts) {
                                addBookmark(product.name);
                              } else {
                                removeBookmark(product.name);
                              }
                            }}
                          />
                          {product.discount ? (
                            <>
                              {" "}
                              <span className="bg-red-500 text-white text-sm z-10 font-bold px-2 py-1 rounded-full mr-2">
                                {product.discount.discount_percent}%
                              </span>
                            </>
                          ) : null}
                        </div>
                        <CardContent className="flex flex-col items-center p-4">
                          <ProductImage productName={product.name} />
                          <h3 className="text-lg font-bold mb-2">
                            {product.name}
                          </h3>
                          <p className="text-gray-600 mb-2">
                            {product.price} تومان
                          </p>
                          <Button>خرید</Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center text-gray-700">
                  هیچ محصولی پیدا نشد.
                </p>
              )}
            </div>
            {/* Special Products - Always Visible */}
            <SpecialProducts products={specialProducts} />
          </>
        ) : currentMode === "bookmarks" ? (
          <>
            {" "}
            <div className="mb-8 w-screen min-h-screen">
              <div className="flex justify-between">
                <h2 className="text-3xl font-extrabold mb-6">
                  نشانی شده های شما
                </h2>
                {/* {bookmarkedProducts.length > 6 ? (
                  <>
                    <h2 className="text-lg font-bold hover:cursor-pointer underline flex items-center justify-center gap-2.5">
                      <FontAwesomeIcon icon={faArrowLeft} className="mt-2" />
                      تمام محصولات{" "}
                    </h2>
                  </>
                ) : null} */}
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-48">
                  <LoadingSpinner />
                </div>
              ) : bookmarkedProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {bookmarkedProducts.map((product) => {
                    return (
                      <Card
                        key={product.id}
                        className="hover:scale-105 hover:shadow-lg transition-transform"
                      >
                        {" "}
                        <div className="flex justify-between text-2xl text-orange-600 mt-2">
                          <FontAwesomeIcon
                            icon={
                              bookmarkedProducts.find(
                                (p: Product) => p.id === product.id
                              )
                                ? faStar
                                : faStarRegular
                            }
                            className="cursor-pointer hover:text-orange-800 ml-2"
                            onClick={() => {
                              removeBookmark(product.name);
                            }}
                          />
                          {product.discount ? (
                            <>
                              {" "}
                              <span className="bg-red-500 text-white text-sm z-10 font-bold px-2 py-1 rounded-full mr-2">
                                {product.discount.discount_percent}%
                              </span>
                            </>
                          ) : null}
                        </div>
                        <CardContent className="flex flex-col items-center p-4">
                          <ProductImage productName={product.name} />
                          <h3 className="text-lg font-bold mb-2">
                            {product.name}
                          </h3>
                          <p className="text-gray-600 mb-2">
                            {product.price} تومان
                          </p>
                          <Button>خرید</Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center text-gray-700 text-2xl mt-25 font-semibold">
                  هیچ محصولی پیدا نشد.
                </p>
              )}
            </div>
          </>
        ) : currentMode === "allProducts" ? (
          <>
            <AllProducts
              productsToDisplay={displayedProducts}
              nextPage={handleNextPage}
              prevPage={handlePrevPage}
            />
          </>
        ) : null}
      </main>
    </>
  );
}
