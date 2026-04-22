import { cn } from "@/lib/utils";
import { MoveLeft, MoveRight } from "lucide-react";
import { Dispatch, FC, SetStateAction } from "react";

interface Props {
  page: number;
  totalPages: number;
  setPage: Dispatch<SetStateAction<number>>;
  isProductPage?: boolean;
}

const Pagination: FC<Props> = ({
  page,
  setPage,
  totalPages,
  isProductPage = false,
}) => {
  const handlePrevious = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };
  return (
    <div className="w-full py-0 lg:px-0 sm:px-6 px-4">
      <div
        className={`w-full flex items-center  gap-x-4 border-t border-gray-200 ${
          isProductPage ? "justify-center pt-4" : "justify-end"
        }`}
      >
        <div
          onClick={() => handlePrevious()}
          className="flex items-center pt-3 text-gray-600 hover:text-orange-background cursor-pointer"
        >
          <MoveLeft className="w-3" />
          <p className="text-sm ml-3 font-medium leading-none">Previous</p>
        </div>
        <div className="flex flex-wrap">
          {Array.from({ length: totalPages }).map((_, i) => (
            <span
              key={i}
              className={cn(
                "text-sm font-medium leading-none cursor-pointer text-gray-600  hover:text-orange-background  border-t border-transparent pt-3 mr-4 px-2",
                {
                  "text-orange-background border-orange-background":
                    i + 1 === page,
                },
              )}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </span>
          ))}
        </div>
        <div
          onClick={() => handleNext()}
          className="flex items-center pt-3 text-gray-600 hover:text-orange-background cursor-pointer"
        >
          <p className="text-sm font-medium leading-none mr-3">Next</p>
          <MoveRight className="w-3" />
        </div>
      </div>
    </div>
  );
};

export default Pagination;
