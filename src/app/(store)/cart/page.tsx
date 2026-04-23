"use client";
import { useCartStore } from "@/cart-store/useCartStore";
import FastDelivery from "@/components/store/cards/fast-delivery";
import { SecurityPrivacyCard } from "@/components/store/product-page/returns-security-privacy-card";
import useFromStore from "@/hooks/useFromStore";
import { CartProductType } from "@/lib/types";
import { useState, useMemo } from "react";
import CartHeader from "@/components/store/cart-page/card-header";
import CardProduct from "@/components/store/cards/card-product";
import CartSummary from "@/components/store/cart-page/sumamry";

export default function CartPage() {
  const cartItems = useFromStore(useCartStore, (state) => state.cart);
  const [selectedItems, setSelectedItems] = useState<CartProductType[]>([]);
  const [totalShipping, setTotalShipping] = useState<number>(0);

  //   const totalPrice = useMemo(() => {
  //     return selectedItems.reduce(
  //       (sum, item) => sum + item.price * item.quantity,
  //       0,
  //     );
  //   }, [selectedItems]);

  return (
    <div>
      {cartItems && cartItems.length > 0 ? (
        <div className="bg-[#f5f5f5]">
          <div className="max-w-[1200px] mx-auto py-6 flex">
            <div className="min-w-0 flex-1">
              {/* cart header */}
              <CartHeader
                cartItems={cartItems}
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
              />
              <div className="h-auto overflow-x-hidden overflow-auto mt-2">
                {/* cart items */}
                {cartItems.map((product) => (
                  <CardProduct
                    key={product.productId}
                    product={product}
                    selectedItems={selectedItems}
                    setSelectedItems={setSelectedItems}
                    // setTotalShipping={setTotalShipping}
                  />
                ))}
              </div>
            </div>
            {/* Cart sidebar */}
            <div className="sticky top-4 ml-5 w-[380px] max-h-max">
              {/* Cart summary */}
              <CartSummary
                cartItems={cartItems}
                shippingFees={totalShipping}
              ></CartSummary>
              <div className="mt-2 p-4 bg-white px-5">
                <FastDelivery />
              </div>

              <div className="mt-2 p-4 bg-white px-5">
                <SecurityPrivacyCard />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>No product in cart</div>
      )}
    </div>
  );
}
