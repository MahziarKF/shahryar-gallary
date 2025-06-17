"use client";

import React, { useState } from "react";
import Image from "next/image";
import heroBannerGuitarImage from "@/public/heroSectionGuitar.jpg";
import { Button } from "./productComponents/button";
import { Input } from "./productComponents/input";
import { Card, CardContent } from "./productComponents/card";
import { Category, Product, Discount } from "../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faTimes,
  faPhone,
  faStar,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import HeroBanner from "./productView/heroBanner";

const CategoryCard = ({
  title,
  onClick,
  isActive,
}: {
  title: string;
  onClick: () => void;
  isActive: boolean;
}) => (
  <div
    className={`rounded-[30px] overflow-hidden shadow-md cursor-pointer transition-transform bg-white p-4 text-center font-bold text-lg hover:scale-105 ${
      isActive ? "bg-yellow-300" : ""
    }`}
    onClick={onClick}
  >
    {title}
  </div>
);

const SpecialProducts = ({ products }: { products: Product[] }) => {
  const special = products.filter(
    (product) =>
      product.discount &&
      product.discount.length > 0 &&
      product.discount[0].discount_percent > 0
  );

  if (special.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-3xl font-extrabold mb-6">Special Discounts</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {special.map((product) => (
          <Card
            key={product.id}
            className="relative hover:scale-105 hover:shadow-lg transition-transform"
          >
            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {product.discount![0].discount_percent}%
            </span>
            <CardContent className="flex flex-col items-center p-4">
              <img
                src={product.image_url || "/placeholder.png"}
                alt={product.name}
                className="w-40 h-40 object-contain mb-4"
              />
              <h3 className="text-lg font-bold mb-2">{product.name}</h3>
              <p className="text-gray-600 mb-2">{product.price} تومان</p>
              <Button>خرید</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

interface propTypes {
  products: Product[];
  categories: Category[];
  discounts: Discount[];
}

export default function ProductsPage({ products, categories }: propTypes) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory((prev) =>
      prev === categoryName ? null : categoryName
    );
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory =
      !selectedCategory ||
      product.categories?.some(
        (cat) => cat.category?.name === selectedCategory
      );
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-gradient-to-rs bg-gray-300/95 from-orange-700 via-amber-500 to-yellow-400 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Search and Top Icons */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 p-4 bg-white rounded-2xl shadow-lg">
          {/* Search Bar */}
          <div className="flex items-center gap-3 w-full md:w-2/3">
            <Input
              type="text"
              placeholder="جستجوی محصول..."
              className="w-full max-w-md ring-1 ring-gray-300 focus:ring-orange-500 bg-gray-200"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button variant="primary" className="flex items-center gap-2">
              <FontAwesomeIcon icon={faSearch} />
              جستجو
            </Button>
            {search ? (
              <Button
                variant="secondary"
                onClick={() => {
                  setSearch("");
                  setSelectedCategory(null);
                }}
                className="flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faTimes} />
                پاک کردن
              </Button>
            ) : null}
          </div>

          {/* Top Icons */}
          <div className="flex items-center gap-6 text-2xl text-orange-600">
            <FontAwesomeIcon
              icon={faPhone}
              className="cursor-pointer hover:text-orange-800"
            />
            <FontAwesomeIcon
              icon={faStar}
              className="cursor-pointer hover:text-orange-800"
            />
            <FontAwesomeIcon
              icon={faShoppingCart}
              className="cursor-pointer hover:text-orange-800"
            />
          </div>
        </div>

        {/* Hero Banner */}
        <HeroBanner />

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold mb-6">دسته‌بندی‌ها</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <CategoryCard
                key={cat.name}
                title={cat.name}
                onClick={() => handleCategoryClick(cat.name)}
                isActive={selectedCategory === cat.name}
              />
            ))}
          </div>
        </div>

        {/* Special Products */}
        <SpecialProducts products={products} />

        {/* All Products */}
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold mb-6">تمام محصولات</h2>
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="hover:scale-105 hover:shadow-lg transition-transform"
                >
                  <CardContent className="flex flex-col items-center p-4">
                    <img
                      src={product.image_url || "/placeholder.png"}
                      alt={product.name}
                      className="w-40 h-40 object-contain mb-4"
                    />
                    <h3 className="text-lg font-bold mb-2">{product.name}</h3>
                    <p className="text-gray-600 mb-2">{product.price} تومان</p>
                    <Button>خرید</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-700">هیچ محصولی پیدا نشد.</p>
          )}
        </div>
      </div>
    </main>
  );
}
