"use client";
import { Product } from "@/app/types";
import { CardContent, Card } from "../productComponents/card";
import { Button } from "../productComponents/button";
import ProductImage from "../productView/productImage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faStar as faStarSolid,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import LoadingSpinner from "../loading/loadingSpinner";
import { useState } from "react";

type PropsType = {
  productsToDisplay: Product[];
  nextPage: () => void;
  prevPage: () => void;
  loading?: boolean;
  bookmarkedProducts: Product[];
  addBookmark: (productName: string) => void;
  removeBookmark: (productName: string) => void;
};

export default function AllProducts({
  productsToDisplay,
  nextPage,
  prevPage,
  loading = false,
  bookmarkedProducts = [],
  addBookmark,
  removeBookmark,
}: PropsType) {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-extrabold">تمام محصولات</h2>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <LoadingSpinner />
        </div>
      ) : productsToDisplay.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {productsToDisplay.map((product) => (
              <Card
                key={product.id}
                className="hover:scale-105 hover:shadow-lg transition-transform"
              >
                <div className="flex justify-between text-2xl text-orange-600 mt-2 px-4">
                  <FontAwesomeIcon
                    icon={
                      bookmarkedProducts.find((p) => p.id === product.id)
                        ? faStarSolid
                        : faStarRegular
                    }
                    className="cursor-pointer hover:text-orange-800"
                    onClick={() => {
                      const alreadyBookmarked = bookmarkedProducts.find(
                        (p) => p.id === product.id
                      );
                      alreadyBookmarked
                        ? removeBookmark(product.name)
                        : addBookmark(product.name);
                    }}
                  />
                  {product.discount ? (
                    <span className="bg-red-500 text-white text-sm z-10 font-bold px-2 py-1 rounded-full">
                      {product.discount.discount_percent}%
                    </span>
                  ) : null}
                </div>
                <CardContent className="flex flex-col items-center p-4">
                  <ProductImage productName={product.name} />
                  <h3 className="text-lg font-bold mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-2">{product.price} تومان</p>
                  <Button>خرید</Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between mt-6">
            <Button onClick={prevPage} variant="primary">
              صفحه قبل
            </Button>
            <Button onClick={nextPage} variant="primary">
              صفحه بعد
            </Button>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-700">هیچ محصولی پیدا نشد.</p>
      )}
    </div>
  );
}
