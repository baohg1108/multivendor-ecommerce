import { RatingStatisticsType } from "@/lib/types";
import RatingCard from "../../cards/product-rating";
import RatingStatisticsCard from "../../cards/rating-statistics";

interface Props {
productId: string;
rating: number;
statistics: RatingStatisticsType;
ratingStatistics: RatingStatisticsType;
}

const ProductReviews: React.FC<Props> = ({
statistics,
rating,
ratingStatistics,
}) => {
const { totalReviews } = statistics;
return (

<div id="reviews" className="pt-6">
{/_ Title _/}
<div className="h-12">
<h2 className="text-black text-2xl font-bold">
Customer Reviews ({totalReviews})
</h2>
</div>
{/_ Statistics _/}
<div className="w-full">
<div className="flex items-center gap-4">
{/_ Rating cards _/}
<RatingCard rating={rating} />
{/_ Rating stats card _/}
<RatingStatisticsCard statistics={ratingStatistics} />
</div>
</div>
{totalReviews > 0 && (
<>
<div className="space-y-6">
{/_ reviews filter _/}
{/_ review sort _/}
</div>
{/_ review _/}
{/\* <div className="mt-10 min-h-72 grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Pagination */}
        </>
      )}
    </div>

);
};

export default ProductReviews;
"use client";
import ReactStars from "react-rating-stars-component";

export default function RatingCard({ rating }: { rating: number }) {
const fixed_rating = Number(rating.toFixed(2));
return (

<div className="w-full h-44 flex-1">
<div className="p-6 bg-[#f5f5f5] flex flex-col h-full justify-center overflow-hidden rounded-lg">
<div className="text-6xl font-bold">{rating.toFixed(2)}</div>
<div className="py-1.5">
<ReactStars
            count={5}
            value={fixed_rating}
            size={24}
            color="#e2dfdf"
            isHalf
            edit={false}
          />
</div>
<div className="text-[#03c97a] leading-5 mt-2">
All from verified purchases
</div>
</div>
</div>
);
}
"use client";

import { StatisticsCardType } from "@/lib/types";
import ReactStars from "react-rating-stars-component";

export default function RatingStatisticsCard({
statistics,
}: {
statistics: StatisticsCardType;
}) {
return (
<div className="w-full h-44 flex-1">
<div className="py-5 px-7 bg-[#f5f5f5] flex flex-col gap-y-2 h-full justify-center overflow-hidden rounded-lg">
{(statistics || [])
.slice()
.reverse()
.map((rating) => (
<div key={rating.rating} className="flex items-center h-4">
<ReactStars
                count={5}
                value={rating.rating}
                size={15}
                color="#e2dfdf"
                isHalf
                edit={false}
              />
<div className="relative w-full flex-1 h-1.5 mx-2.5 bg-[#e2dfdf] rounded-full">
<div
className="absolute left-0 h-full rounded-full bg-[#ffc50A]"
style={{ width: `${rating.percentage}%` }}
/>
</div>
<div className="text-xs w-12 leading-4">{rating.numReviews}</div>
</div>
))}
</div>
</div>
);
}
