import { Size } from "@prisma/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

interface Props {
  sizes: Size[];
  sizeId: string | undefined;
}
const SizeSelector = ({ sizeId, sizes }: Props) => {
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams!);

  const handleSelectSize = (size: Size) => {
    params.set("size", size.id!);
    replace(`${pathname}?${params.toString()}`);
  };
  return (
    <div className="flex flex-wrap gap-4">
      {sizes.map((size) => (
        <span
          key={size.size}
          className="border rounded-full px-5 py-1 cursor-pointer transition-all hover:bg-orange-400 hover:text-white"
          style={{ borderColor: size.id === sizeId ? "#000" : "#ccc" }}
          onClick={() => handleSelectSize(size)}
        >
          {size.size}
        </span>
      ))}
    </div>
  );
};

export default SizeSelector;
