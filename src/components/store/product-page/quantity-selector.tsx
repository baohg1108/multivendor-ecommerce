import { CartProductType } from "@/lib/types";
import { useEffect, useMemo } from "react";
import { Minus, Plus } from "lucide-react";
import useFromStore from "@/hooks/useFromStore";
import { useCartStore } from "@/cart-store/useCartStore";

interface QuantitySelectorProps {
  productId: string;
  variantId: string;
  sizes: { sizeId: string; sizeName: string }[];
  sizeId: string | null;
  quantity: number;
  handleChange: (
    property: keyof CartProductType,
    value: CartProductType[keyof CartProductType],
  ) => void;
  stock: number;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  productId,
  sizeId,
  quantity,
  handleChange,
  stock,
  variantId,
  sizes,
}) => {
  const cart = useFromStore(useCartStore, (state) => state.cart);

  useEffect(() => {
    if (!sizeId) {
      return;
    }

    handleChange("quantity", 1);
  }, [sizeId, handleChange]);

  const maxQty = useMemo(() => {
    const search_product = cart?.find((p) => {
      p.productId === productId &&
        p.variantId === variantId &&
        p.sizeId === sizeId;
    });
    return search_product
      ? search_product.stock - search_product.quantity
      : stock;
  }, [cart, productId, variantId, sizeId, stock]);

  if (!sizeId) {
    return null;
  }

  const handleIncrease = () => {
    if (quantity < maxQty) {
      handleChange("quantity", quantity + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      handleChange("quantity", quantity - 1);
    }
  };

  return (
    <div className="w-full py-2 px-3 bg-white border border-gray-200 rounded-lg">
      <div className="w-full flex justify-between items-center gap-x-5">
        <div className="grow">
          <span className="block text-xs text-gray-500">Select Quantity</span>
          <span className="block text-xs \ text-gray-500">
            {maxQty !== stock &&
              `()You have ${maxQty} items of this product in your cart)`}
          </span>
          <input
            type="number"
            className="w-full p-0 bg-transparent border-0 focus:outline-0 text-gray-800"
            min={1}
            value={maxQty <= 0 ? 0 : quantity}
            max={maxQty}
            readOnly
          ></input>
        </div>
        <div className="flex justify-end items-center gap-x-1.5">
          <button
            type="button"
            className="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-full border border-gray-200 bg-white shadow-sm focus:outline-none focus:bg-gray-400"
            onClick={handleDecrease}
            disabled={quantity === 1}
          >
            <Minus className="w-3"></Minus>
          </button>
          <button
            type="button"
            className="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-full border border-gray-200 bg-white shadow-sm focus:outline-none focus:bg-gray-400"
            disabled={quantity === stock}
            onClick={handleIncrease}
          >
            <Plus className="w-3"></Plus>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuantitySelector;
