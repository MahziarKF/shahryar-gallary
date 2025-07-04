"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faShoppingCart,
  faStar as faStarSolid,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import { Input } from "../productComponents/input";
import { Button } from "../productComponents/button";
import Dropdown from "../dropDown";
import { Category } from "@/app/types";

export default function ProductsHeader({
  searchValue,
  setSearchValue,
  handleSearch,
  handleClear,
  search,
  selectedCategory,
  categories,
  currentMode,
  setCurrentMode,
  setSelectedCategory,
}: {
  searchValue: string;
  setSearchValue: (val: string) => void;
  handleSearch: () => void;
  handleClear: () => void;
  search: string;
  selectedCategory: string | null;
  categories: Category[];
  currentMode: string;
  setCurrentMode: (val: string) => void;
  setSelectedCategory: (val: string | null) => void;
}) {
  return (
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
        <Button variant="secondary" onClick={handleSearch}>
          جستجو
        </Button>
        {(search || selectedCategory) && (
          <Button variant="secondary" onClick={handleClear}>
            پاک کردن
          </Button>
        )}
      </div>

      {/* Icons */}
      <div className="flex items-center gap-6 text-2xl text-orange-600">
        <Dropdown
          items={categories.map((c) => ({ title: c.name, id: c.id }))}
          title="دسته بندی ها"
          onSelect={(id: number, title: string) => setSelectedCategory(title)}
        />
        <FontAwesomeIcon
          icon={faPhone}
          className="cursor-pointer hover:text-orange-800"
        />
        <FontAwesomeIcon
          icon={currentMode === "bookmarks" ? faStarSolid : faStarRegular}
          onClick={() =>
            setCurrentMode(
              currentMode === "bookmarks" ? "default" : "bookmarks"
            )
          }
          className="cursor-pointer hover:text-orange-800"
        />
        <FontAwesomeIcon
          icon={faShoppingCart}
          className="cursor-pointer hover:text-orange-800"
        />
      </div>
    </div>
  );
}
