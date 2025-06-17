// app/products/page.tsx
import HeaderWrapper from "@/app/components/headerWraper";
import ProductsPage from "@/app/components/ProductsPage";
import getCategorys from "@/lib/category";
import getDiscounts from "@/lib/discount";
import getProducts from "@/lib/products";

export default async function Page() {
  const products = await getProducts();
  const discounts = await getDiscounts();
  const categories = await getCategorys();

  return (
    <>
      <HeaderWrapper />
      <ProductsPage
        discounts={discounts ?? []}
        categories={categories ?? []}
        products={products ?? []}
      />
    </>
  );
}
