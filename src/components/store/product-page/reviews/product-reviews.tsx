"use client";

import { RatingStatisticsType, VariantInfoType } from "@/lib/types";
import ReviewsSort from "./sort";
import RatingCard from "../../cards/product-rating";
import RatingStatisticsCard from "../../cards/rating-statistics";
import React, { useState, useEffect } from "react";
import { ReviewWithImageType } from "@/lib/types";
import ReviewCard from "../../cards/review";
import { ReviewsFiltersType, ReviewsOrderType } from "@/lib/types";
import { getProductFilteredReviews } from "@/queries/product";
import ReviewFilters from "./filters";
import Pagination from "../../shared/pagination";
// import AddReview from "./add-review";
import ReviewDetails from "../../forms/review-details";
interface Props {
  productId: string;
  rating: number;
  statistics: RatingStatisticsType;
  reviews: ReviewWithImageType[];
  variantsInfo: VariantInfoType[];
}

const ProductReviews: React.FC<Props> = ({
  statistics,
  rating,
  reviews,
  productId,
  variantsInfo,
}) => {
  const [data, setData] = React.useState<ReviewWithImageType[]>(reviews);
  const [filteredTotalReviews, setFilteredTotalReviews] = React.useState(
    statistics.totalReviews,
  );
  const { totalReviews, ratingStatistics } = statistics;
  const half = Math.ceil(data.length / 2);

  // filtering
  const filtered_data = {
    rating: undefined,
    hasImages: undefined,
  };

  // sorting
  const [filters, setFilters] =
    React.useState<ReviewsFiltersType>(filtered_data);
  const [sort, setSort] = useState<ReviewsOrderType>();

  const handleSetFilters: React.Dispatch<
    React.SetStateAction<ReviewsFiltersType>
  > = (value) => {
    setPage(1);
    setFilters(value);
  };

  const handleSetSort: React.Dispatch<
    React.SetStateAction<ReviewsOrderType | undefined>
  > = (value) => {
    setPage(1);
    setSort(value);
  };

  // pagination
  const [page, setPage] = useState(1);
  const pageSize =
    filters.rating || filters.hasImages || sort
      ? 2
      : Math.max(reviews.length, 1);

  useEffect(() => {
    const loadReviews = async () => {
      const res = await getProductFilteredReviews(
        productId,
        filters,
        sort,
        page,
        pageSize,
      );
      setData(res?.reviews || []);
      setFilteredTotalReviews(res?.totalReviews || 0);
    };

    void loadReviews();
  }, [filters, sort, page, pageSize, productId]);

  const totalPages = Math.max(1, Math.ceil(filteredTotalReviews / pageSize));

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
            <ReviewFilters
              filters={filters}
              setFilters={handleSetFilters}
              stats={statistics}
              setSort={handleSetSort}
            />
            {/* review sort */}
            <ReviewsSort sort={sort} setSort={handleSetSort} />
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
          <Pagination
            page={page}
            totalPages={totalPages}
            setPage={setPage}
          ></Pagination>
        </>
      )}
      <div className="mt-3">
        <ReviewDetails
          productId={productId}
          setReviews={setData}
          variantsInfo={variantsInfo}
          reviews={data}
        ></ReviewDetails>
      </div>
    </div>
  );
};

export default ProductReviews;
