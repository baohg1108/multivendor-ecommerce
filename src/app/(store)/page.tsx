import { useCartStore } from "@/cart-store/useCartStore";
import ProductList from "@/components/store/shared/product-list";
import { getProducts } from "@/queries/product";

export default async function HomePage() {
  const productsData = await getProducts({}, "");
  const { products } = productsData;
  const cart = useCartStore.getState().cart;
  const addToCart = useCartStore.getState().addToCart;

  return (
    <div className="p-14">
      <ProductList
        products={products}
        title="Products"
        arrow={false}
      ></ProductList>
    </div>
  );
}
