import ProductList from "@/components/store/shared/product-list";
import { getProducts } from "@/queries/product";

export default async function HomePage() {
  const productsData = await getProducts({}, "");
  const { products } = productsData;
  console.log("products: ", products);

  return (
    <div className="p-6">
      <ProductList
        products={products}
        title="Products"
        arrow={false}
      ></ProductList>
    </div>
  );
}
