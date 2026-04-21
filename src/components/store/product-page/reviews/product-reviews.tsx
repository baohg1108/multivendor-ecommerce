"use client";

import { RatingStatisticsType } from "@/lib/types";
import RatingCard from "../../cards/product-rating";
import RatingStatisticsCard from "../../cards/rating-statistics";
import React from "react";
import { ReviewWithImageType } from "@/lib/types";
import ReviewCard from "../../cards/review";

interface Props {
  productId: string;
  rating: number;
  statistics: RatingStatisticsType;
  reviews: ReviewWithImageType[];
}

const ProductReviews: React.FC<Props> = ({ statistics, rating, reviews }) => {
  const [data] = React.useState<ReviewWithImageType[]>(reviews);
  const { totalReviews, ratingStatistics } = statistics;
  const half = Math.ceil(data.length / 2);

  return (
    <div id="reviews" className="pt-6">
      {/* Title */}
      <div className="h-12">
        <h2 className="text-black text-2xl font-bold">
          Customer Reviews ({totalReviews})
        </h2>
      </div>
      {/* Statistics */}
      <div className="w-full">
        <div className="flex items-center gap-4">
          <RatingCard rating={rating} />
          <RatingStatisticsCard statistics={ratingStatistics || []} />
        </div>
      </div>
      {totalReviews > 0 && (
        <>
          <div className="space-y-6">
            {/* reviews filter */}
            {/* review sort */}
          </div>
          {/* review  */}
          <div className="mt-10 min-h-72 grid grid-cols-2 gap-4">
            {data.length > 0 ? (
              <>
                <div className="flex flex-col gap-3">
                  {data.slice(0, half).map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
                <div className="flex flex-col gap-3">
                  {data.slice(half).map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              </>
            ) : (
              <>No Reviews Found</>
            )}
          </div>
          {/* Pagination */}
        </>
      )}
    </div>
  );
};

export default ProductReviews;
