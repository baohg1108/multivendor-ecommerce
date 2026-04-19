import Image from "next/image";
import React, { useEffect } from "react";
import { ProductVariantImage } from "@prisma/client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

// import "swiper/css/navigation";
// import "swiper/css/pagination";

export default function ProductCardImageSwiper({
  images,
}: {
  images: ProductVariantImage[];
}) {
  const swiperRef = React.useRef<any>(null);
  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.autoplay.stop();
    }
  }, [swiperRef]);

  return (
    <div
      className="relative mb-2 w-full h-[200px] bg-white contrast-[90%] rounded-2xl overflow-hidden"
      onMouseEnter={() => swiperRef.current.swiper.autoplay.start()}
      onMouseLeave={() => {
        swiperRef.current.swiper.autoplay.stop();
        swiperRef.current.swiper.slideTo(0);
      }}
    >
      <Swiper ref={swiperRef} modules={[Autoplay]} autoplay={{ delay: 500 }}>
        {images.map((img) => (
          <SwiperSlide key={img.id}>
            <Image
              src={img.url}
              alt="Product"
              width={400}
              height={400}
              className="block object-cover h-[200px] w-48 sm:w-192"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
