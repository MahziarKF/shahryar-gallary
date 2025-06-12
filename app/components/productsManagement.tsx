import { useState, useEffect } from "react";
import ManageProducts from "./manageProducts";

export default function ProductsManagement({
  products,
  categorys,
}: {
  products: any[];
  categorys: any[];
}) {
  const [selectedKey, setSelectedKey] = useState("Products");
  const managementOptions = [
    { label: "محصولات", key: "Products" },
    { label: "نرخ فروش", key: "Rates" },
  ];
  const renderContent = () => {
    switch (selectedKey) {
      case "Products":
        return (
          <ManageProducts productsFromProps={products} categorys={categorys} />
        );
      case "Rates":
        return <p>hi</p>;
      default:
        return null;
    }
  };
  return (
    <>
      {" "}
      <div className="w-full flex sm:gap-5 justify-around mb-5">
        {managementOptions.map((option) => (
          <div
            key={option.key}
            className={`py-3 px-15 rounded-lg text-lg font-bold text-center transition cursor-pointer ${
              selectedKey === option.key
                ? "bg-orange-600 text-white shadow-lg"
                : "bg-orange-100 text-orange-700 hover:bg-orange-200"
            }`}
            onClick={() => setSelectedKey(option.key)}
          >
            {option.label}
          </div>
        ))}
      </div>
      <div className="w-full">{renderContent()}</div>
    </>
  );
}
