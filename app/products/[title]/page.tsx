// app/products/page.tsx
import HeaderWrapper from "@/app/components/headerWraper";
import ProductsPage from "@/app/components/ProductsPage";
import { getUser } from "@/lib/auth";
import getUserBookmarks from "@/lib/bookmarks";
import getCategorys from "@/lib/category";
import getDiscounts from "@/lib/discount";
import { getProductImages } from "@/lib/image";
import getProducts from "@/lib/products";
import { UNSAFE_GETUSERDATA_WHOLE } from "@/lib/user";

export default async function Page() {
  const userBookmarks = await getUserBookmarks("ww");
  const products: any = await getProducts(true);
  const discounts = await getDiscounts();
  const categories = await getCategorys();
  const user: any = await getUser();
  // console.log(products);
  return (
    <>
      <HeaderWrapper sticky={false} />
      <ProductsPage
        bookMarks={userBookmarks ?? []}
        discounts={discounts ?? []}
        categories={categories ?? []}
        products={products ?? []}
        user={user}
      />
    </>
  );
}
