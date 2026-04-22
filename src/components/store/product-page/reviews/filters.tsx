import React, { SetStateAction } from "react";
import { Dispatch } from "react";
import { RatingStatisticsType } from "@/lib/types";
import { ReviewsFiltersType, ReviewsOrderType } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Props {
  filters: ReviewsFiltersType;
  setFilters: Dispatch<SetStateAction<ReviewsFiltersType>>;
  stats: RatingStatisticsType;
  setSort: Dispatch<SetStateAction<ReviewsOrderType | undefined>>;
}

const ReviewsFilters: React.FC<Props> = ({
  filters,
  setFilters,
  stats,
  setSort,
}) => {
  const { rating, hasImages } = filters;
  const { ratingStatistics, reviewsWithImagesCount, totalReviews } = stats;

  return (
    <div className="mt-8 relative overflow-hidden">
      <div className="flex flex-wrap gap-4">
        {/* All */}
        <div
          className={cn(
            "bg-[#f5f5f5] text-black border border-transparent rounded-full cursor-pointer py-1.5 px-4",
            {
              "bg-[#ffebed] text-[#fd384f] border-[#fd384f]":
                "!rating && !hasImages",
            },
          )}
          onClick={() => {
            setFilters({ rating: undefined, hasImages: undefined });
            setSort(undefined);
          }}
        >
          All ({totalReviews})
        </div>
        {/* Include Images */}
        <div
          className={cn(
            "bg-[#f5f5f5] text-black border border-transparent rounded-full cursor-pointer py-1.5 px-4",
            {
              "bg-[#ffebed] text-[#fd384f] border-[#fd384f]": hasImages,
            },
          )}
          onClick={() =>
            setFilters({ ...filters, hasImages: hasImages ? undefined : true })
          }
        >
          Include Images ({reviewsWithImagesCount})
        </div>
        {/* Rating filters */}
        {ratingStatistics.map((r: { rating: number; numReviews: number }) => (
          <div
            key={r.rating}
            className={cn(
              "bg-[#f5f5f5] text-black border border-transparent rounded-full cursor-pointer py-1.5 px-4",
              {
                "bg-[#ffebed] text-[#fd384f] border-[#fd384f]":
                  r.rating === rating,
              },
            )}
            onClick={() => {
              setFilters({ ...filters, rating: r.rating });
            }}
          >
            {r.rating} Stars ({r.numReviews})
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsFilters;
