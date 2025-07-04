import ProductImage from "./productImage"; // Adjust path if needed
import { Product } from "@/app/types";
import { CardContent, Card } from "../productComponents/card";
import { Button } from "../productComponents/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
export default function SpecialProducts({ products }: { products: Product[] }) {
  const special = products.filter(
    (product) =>
      product.discount &&
      product.discount.length > 0 &&
      product.discount[0].discount_percent > 0
  );

  if (special.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-3xl font-extrabold mb-6">کالا های پیشنهادی</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {special.map((product) => (
          <Card
            key={product.id}
            className="relative hover:scale-105 hover:shadow-lg transition-transform"
          >
            <div className="flex justify-between text-2xl text-orange-600 mt-2">
              <FontAwesomeIcon
                icon={faStarRegular}
                className="cursor-pointer hover:text-orange-800 ml-2"
                onClick={() => {
                  // TODO: add bookmark logic here
                }}
              />
              {product.discount ? (
                <>
                  {" "}
                  <span className="bg-red-500 text-white text-sm z-10 font-bold px-2 py-1 rounded-full mr-2">
                    {product.discount![0].discount_percent}%
                  </span>
                </>
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
    </div>
  );
}
