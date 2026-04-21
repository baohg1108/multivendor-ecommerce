"use client";

import ReactStars from "react-rating-stars-component";

type RatingStatisticItem = {
  rating: number;
  numReviews: number;
  percentage: number;
};

export default function RatingStatisticsCard({
  statistics,
}: {
  statistics: RatingStatisticItem[];
}) {
  return (
    <div className="w-full h-44 flex-1">
      <div className="py-5 px-7 bg-[#f5f5f5] flex flex-col gap-y-2 h-full justify-center overflow-hidden rounded-lg">
        {(statistics || [])
          .slice()
          .reverse()
          .map((rating: RatingStatisticItem) => (
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
