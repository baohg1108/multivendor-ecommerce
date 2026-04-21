"use client";
import ReactStars from "react-rating-stars-component";

export default function RatingCard({ rating = 0 }: { rating: number }) {
  const fixed_rating = Number(rating.toFixed(2));
  const displayRating = Number.isInteger(rating)
    ? `${rating}`
    : rating.toFixed(1);
  return (
    <div className="w-full h-44 flex-1">
      <div className="p-6 bg-[#f5f5f5] flex flex-col h-full justify-center overflow-hidden rounded-lg">
        <div className="text-6xl font-bold">{displayRating}</div>
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
