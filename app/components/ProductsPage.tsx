"use client";
import { useState, ChangeEvent } from "react";
import { Product } from "../types";

// --- UI COMPONENTS ---

const Input = ({
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={`w-full px-4 py-2 bg-white/75 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&[type=number]]:appearance-none ${className}`}
  />
);

const Button = ({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    {...props}
    className={`bg-amber-500 hover:cursor-pointer text-white px-4 py-2 rounded-md hover:bg-amber-600 transition ${className}`}
  >
    {children}
  </button>
);

const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`bg-white rounded-xl overflow-hidden ${className}`}>
    {children}
  </div>
);

const CardContent = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`p-4 flex flex-col justify-between h-full ${className}`}>
    {children}
  </div>
);

const ScrollArea = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`overflow-y-auto ${className}`}
    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
  >
    {children}
    <style jsx>{`
      div::-webkit-scrollbar {
        display: none;
      }
    `}</style>
  </div>
);

const Slider = ({
  min,
  max,
  step,
  value,
  onValueChange,
}: {
  min: number;
  max: number;
  step: number;
  value: number[];
  onValueChange: (val: number[]) => void;
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const newVal = [...value];
    let valNum = Number(e.target.value);
    if (valNum < min) valNum = min;
    if (valNum > max) valNum = max;
    newVal[index] = valNum;
    onValueChange(newVal);
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-4">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value[0]}
          onChange={(e) => handleChange(e, 0)}
          className="w-full accent-amber-500"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value[1]}
          onChange={(e) => handleChange(e, 1)}
          className="w-full accent-amber-500"
        />
      </div>
    </div>
  );
};

const Badge = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <span
    className={`inline-block bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-medium ${className}`}
  >
    {children}
  </span>
);

// --- PAGE COMPONENT ---

export default function ProductsPage({ products }: { products: Product[] }) {
  // Convert product prices to numbers once
  const productsWithNumPrice = products.map((p) => ({
    ...p,
    price: Number(p.price), // convert price string to number
  }));

  const [search, setSearch] = useState("");
  const prices = productsWithNumPrice.map((p) => p.price);
  const minPrice = Math.min(...prices, 0);
  const maxPrice = Math.max(...prices, 10000000);

  const [priceRange, setPriceRange] = useState<number[]>([minPrice, maxPrice]);
  const [useSlider, setUseSlider] = useState(false);

  // Filter products using numeric price and search
  const filtered = productsWithNumPrice.filter(
    (p) =>
      p.name.includes(search) &&
      p.price >= priceRange[0] &&
      p.price <= priceRange[1]
  );

  return (
    <div className="min-h-screen bg-gradient-to-r from-orange-700 via-amber-600 to-yellow-500 animate-gradient-x p-6 bg-gradient-to-br from-amber-50 to-white">
      <div className="max-w-full mx-4 border border-amber-300 rounded-lg p-4 px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-3xl font-bold text-amber-600">فروشگاه سازها</h1>
          <Input
            type="text"
            placeholder="جستجوی محصول..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mt-4 md:mt-0 max-w-md"
          />
        </div>

        <div className="mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <label className="block font-medium text-amber-800">
              محدوده قیمت:
            </label>
            <button
              onClick={() => setUseSlider(!useSlider)}
              className="text-sm text-amber-600 underline hover:text-amber-800 transition"
            >
              {useSlider ? "ورود دستی" : "استفاده از اسلایدر"}
            </button>
          </div>

          {useSlider ? (
            <>
              <Slider
                min={minPrice}
                max={maxPrice}
                step={500000}
                value={priceRange}
                onValueChange={setPriceRange}
              />
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>{priceRange[0].toLocaleString()} تومان</span>
                <span>{priceRange[1].toLocaleString()} تومان</span>
              </div>
            </>
          ) : (
            <div className="flex gap-4">
              <div className="w-1/2">
                <Input
                  type="number"
                  placeholder="حداقل قیمت"
                  value={priceRange[0]}
                  onChange={(e) =>
                    setPriceRange([Number(e.target.value) || 0, priceRange[1]])
                  }
                />
              </div>
              <div className="w-1/2">
                <Input
                  type="number"
                  placeholder="حداکثر قیمت"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([
                      priceRange[0],
                      Number(e.target.value) || maxPrice,
                    ])
                  }
                />
              </div>
            </div>
          )}
        </div>

        <ScrollArea className="h-[70vh] pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.length > 0 ? (
              filtered.map((product) => (
                <Card
                  key={product.id}
                  className="rounded-2xl shadow-md transition hover:shadow-lg border border-amber-200 min-h-[380px] flex flex-col"
                >
                  <img
                    src={"https://img.icons8.com/ios-filled/100/guitar.png"}
                    alt={product.name}
                    className="rounded-t-2xl w-full h-32 object-contain block"
                  />
                  <CardContent className="flex-grow">
                    <div>
                      <h2 className="text-lg font-semibold text-amber-700">
                        {product.name}
                      </h2>
                      <div className="flex flex-wrap gap-2 my-2">
                        {product.category?.map((cat: string, index: number) => (
                          <Badge key={index}>{cat}</Badge>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-4 max-w-[35ch]">
                        {product.description}
                      </p>
                    </div>
                    <div className="flex justify-between items-center mt-6">
                      <Badge>{product.price.toLocaleString()} تومان</Badge>
                      <Button>خرید</Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">
                محصولی یافت نشد.
              </p>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
