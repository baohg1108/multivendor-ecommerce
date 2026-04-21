import { RatingStatisticsType } from "@/lib/types";
import { Star } from "lucide-react";

interface Props {
  productId: string;
  rating: number;
  statistics: {
    ratingStatistics?: RatingStatisticsType;
    reviewsWithImagesCount?: number;
  };
  reviews?: Array<{
    id: string;
    rating: number;
    review: string;
    createdAt: Date | string;
    userId?: string;
    user?: {
      name?: string;
      picture?: string;
    };
  }>;
}

const ProductReviews: React.FC<Props> = ({ statistics, reviews = [] }) => {
  const totalReviews = statistics?.ratingStatistics?.totalReviews ?? 0;

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
          {/* Rating cards */}
          {/* Rating stats card */}
        </div>
      </div>
      {totalReviews > 0 && (
        <>
          <div className="space-y-6">
            {/* reviews filter */}
            {/* review sort */}
          </div>
          {/* review  */}
          <div className="mt-10 min-h-72 grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((item) => (
              <div key={item.id} className="border rounded-lg p-4 bg-white">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-sm text-gray-900">
                    {item.user?.name || item.userId || "Customer"}
                  </span>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={`${item.id}-${idx}`}
                        className={`w-3.5 h-3.5 ${
                          idx < Math.round(item.rating)
                            ? "fill-amber-400 text-amber-400"
                            : "fill-gray-200 text-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-700 line-clamp-5">
                  {item.review}
                </p>
              </div>
            ))}
          </div>
          {/* Pagination */}
        </>
      )}
    </div>
  );
};

export default ProductReviews;
