import { OfferTag } from "@prisma/client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "react-responsive";

export default function OfferTagLinks({
  offerTags,
  open,
}: {
  offerTags: OfferTag[];
  open: boolean;
}) {
  const useBreakpoints = () => {
    const splitPoint = breakpoints.reduce((acc, bp) => {
      const matches = useMediaQuery({ query: bp.query });
      return matches ? bp.value : acc;
    }, 1);
    return splitPoint;
  };

  const splitPoint = useBreakpoints();

  return (
    <div className="w-fit relative">
      <div
        className={cn(
          "flex items-center flex-wrap xl:-translate-x-6 transition-all duration-100 ease-in-out",
          {
            "!translate-x-0": open,
          },
        )}
      >
        {offerTags.map((tag, i) => (
          <Link
            key={tag.id}
            href={`/browse?offer=${tag.url}`}
            className={cn(
              "text-center font-bold text-white px-4 leading-10 rounded-[20px] hover:bg-[#ffffff33]",
              {
                "text-red-500": i === 0,
              },
            )}
          >
            {tag.name}
          </Link>
        ))}
        {/* {offerTags.slice(0, splitPoint).map((tag, i) => (
          <Link
            key={tag.id}
            href={`/browse?offer=${tag.url}`}
            className={cn(
              "text-center font-bold text-white px-4 leading-10 rounded-[20px] hover:bg-[#ffffff33]",
              {
                "!translate-x-0": open,
              },
              {
                "text-red-500": i === 0,
              },
            )}
          >
            {tag.name}
          </Link>
        ))} */}
      </div>
    </div>
  );
}

const breakpoints = [
  { name: "isPhoneScreen", query: "(max-width: 640px)", value: 2 }, // mobile devices
  { name: "isSmallScreen", query: "(max-width: 640px)", value: 3 }, // sm
  { name: "isMediumScreen", query: "(max-width: 768px)", value: 4 }, // md
  { name: "isLargeScreen", query: "(max-width: 1024px)", value: 5 }, // lg
  { name: "isXlScreen", query: "(max-width: 1280px)", value: 6 }, // xl
  { name: "is2xlScreen", query: "(max-width: 1536px)", value: 7 }, // 2xl
];
