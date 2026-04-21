import { CartProductType } from "@/lib/types";
import { useEffect } from "react";
import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  sizeId: string | null;
  quantity: number;
  handleChange: (
    property: keyof CartProductType,
    value: CartProductType[keyof CartProductType],
  ) => void;
  stock: number;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  sizeId,
  quantity,
  handleChange,
  stock,
}) => {
  useEffect(() => {
    if (!sizeId) {
      return;
    }

    handleChange("quantity", 1);
  }, [sizeId, handleChange]);

  if (!sizeId) {
    return null;
  }

  const handleIncrease = () => {
    if (quantity < stock) {
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
          <input
            type="number"
            className="w-full p-0 bg-transparent border-0 focus:outline-0 text-gray-800"
            min={1}
            value={quantity}
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
