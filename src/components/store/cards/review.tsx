"use client";
import ColorWheel from "@/components/shared/color-wheel";
import { ReviewWithImageType } from "@/lib/types";
import { Star } from "lucide-react";
import Image from "next/image";

export default function ReviewCard({
  review,
}: {
  review: ReviewWithImageType;
}) {
  const { images, user } = review;
  const colors = review.color
    .split(",")
    .filter((color) => color.trim() !== "")
    .map((color) => ({ name: color.trim() }));

  const name = user?.name?.trim() || "Customer";
  const firstChar = name[0] || "C";
  const lastChar = name[name.length - 1] || "r";
  const cesnoredName = `${firstChar}***${lastChar}`;
  const profileImage = user?.picture?.trim();

  return (
    <div className="border border-[#d8d8d8] rounded-xl flex h-fit relative py-4 px-2.5">
      <div className="w-16 space-y-1">
        {profileImage ? (
          <Image
            src={profileImage}
            alt="Profile image"
            width={100}
            height={100}
            className="w-11 h-11 rounded-full object-cover"
          />
        ) : (
          <div className="w-11 h-11 rounded-full bg-[#f17900] text-white flex items-center justify-center text-3xl lowercase">
            {firstChar}
          </div>
        )}
        <span className="text-xs text-main-secondary">
          {cesnoredName.toUpperCase()}
        </span>
      </div>
      <div className="flex flex-1 flex-col justify-between leading-5 overflow-hidden px-1.5">
        <div className="space-y-2">
          {/*
          <ReactStars
            key={review.rating}
            count={5}
            size={24}
            color="#F5F5F5"
            activeColor="#FFD804"
            value={review.rating}
            isHalf
            edit={false}
          />
          */}
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={`${review.id}-${index}`}
                className={`h-5 w-5 ${
                  index < review.rating
                    ? "fill-[#FFD804] text-[#FFD804]"
                    : "fill-[#F5F5F5] text-[#F5F5F5]"
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-x-2">
            <ColorWheel colors={colors} size={24} />
            <div className="text-gray-500 text-sm">{review.variant}</div>
            <span>.</span>
            <div className="text-gray-500 text-sm">{review.size}</div>
            <span>.</span>
            <div className="text-gray-500 text-sm">{review.quantity} PC</div>
          </div>
          <p className="text-sm">{review.review}</p>
          {images.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {images.map((img) => (
                <div
                  key={img.id}
                  className="w-20 h-20 rounded-xl overflow-hidden cursor-pointer"
                >
                  <Image
                    src={img.url}
                    alt={img.alt}
                    width={100}
                    height={100}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
