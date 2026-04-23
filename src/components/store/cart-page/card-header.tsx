import { useCartStore } from "@/cart-store/useCartStore";
import { CartProductType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { Dispatch, FC, SetStateAction } from "react";

interface Props {
  cartItems: CartProductType[];
  selectedItems: CartProductType[];
  setSelectedItems: Dispatch<SetStateAction<CartProductType[]>>;
}

const CartHeader: FC<Props> = ({
  cartItems,
  selectedItems,
  setSelectedItems,
}) => {
  const removeMultipleFromCart = useCartStore(
    (state) => state.removeMultipleFromCart,
  );

  const cartLength = cartItems.length;
  const selectedLength = selectedItems.length;

  const handleSelectAll = () => {
    const areAllSelected = cartItems.every((item) =>
      selectedItems.some(
        (selected) =>
          selected.productId === item.productId &&
          selected.variantId === item.variantId &&
          selected.sizeId === item.sizeId,
      ),
    );
    setSelectedItems(areAllSelected ? [] : cartItems);
  };

  const removeSelectedFromCart = () => {
    removeMultipleFromCart(selectedItems);

    // Remove the selected items from both cart and selectedItems
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.filter(
        (selected) =>
          !cartItems.some(
            (item) =>
              item.productId === selected.productId &&
              item.variantId === selected.variantId &&
              item.sizeId === selected.sizeId,
          ),
      ),
    );
  };

  return (
    <div className="bg-white py-4">
      <div>
        <div className="px-6 g-white">
          <div className="flex items-center text-[#222] font-bold text-2xl">
            <h1>Cart ({cartLength})</h1>
          </div>
        </div>
        <div className="flex justify-between bg-white pt-4 px-6">
          <div className="flex items-center justify-start w-full">
            <label
              className="p-0 text-gray-900 text-sm leading-6 list-none inline-flex items-center m-0 mr-2 cursor-pointer align-middle"
              onClick={() => handleSelectAll()}
            >
              <span className="leading-8 inline-flex p-0.5 cursor-pointer">
                <span
                  className={cn(
                    "leading-8 w-5 h-5 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:border-orange-background",
                    {
                      "border-orange-background":
                        cartLength > 0 && selectedLength === cartLength,
                    },
                  )}
                >
                  {cartLength > 0 && selectedLength === cartLength && (
                    <span className="bg-orange-background  w-5 h-5 rounded-full flex items-center justify-center">
                      <Check className="w-3.5 text-white mt-0.5" />
                    </span>
                  )}
                </span>
              </span>
              <span className="leading-8 px-2 select-none">
                Select all products
              </span>
            </label>
            {selectedLength > 0 && (
              <div
                className="pl-4 border-l border-l-[#ebebeb] cursor-pointer"
                onClick={() => removeSelectedFromCart()}
              >
                <div className="text-[#3170ee] font-semibold text-sm leading-5">
                  Delete all selected products
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartHeader;
