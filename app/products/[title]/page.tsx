import ProductsPage from "@/app/components/ProductsPage";
import getProducts from "@/lib/products";

export default async function Page() {
  const products = await getProducts();
  return (
    <>
      <ProductsPage products={products ? products : []}></ProductsPage>
    </>
  );
}
