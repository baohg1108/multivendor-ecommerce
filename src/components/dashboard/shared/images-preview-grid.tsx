import Image from "next/image";

import NoImageImg from "../../../../public/assets/images/image.png";
import { cn } from "@/lib/utils";

import { getGridClassName } from "@/lib/utils";
import { Trash } from "lucide-react";

interface ImagePreviewGridProps {
  images: { url: string }[];
  onRemove: (value: string) => void;
}

const ImagesPreviewGrid: React.FC<ImagePreviewGridProps> = ({
  images,
  onRemove,
}) => {
  const imagesLength = images.length;

  const GridClassName = getGridClassName(imagesLength);
  if (imagesLength === 0) {
    return (
      <div>
        <Image
          src={NoImageImg}
          alt="No Image"
          width={500}
          height={600}
          className="rounded-md"
        />
      </div>
    );
  } else {
    return (
      <div className="max-w-4xl">
        <div
          className={cn(
            "grid h-[800px] overflow-hidden bg-white rounded-md",
            GridClassName,
          )}
        >
          {images.map((img, i) => (
            <div
              key={i}
              className={cn(
                "relative group h-full w-full border border-gray-300",
                `grid_${imagesLength}_image_${i + 1}`,
                {
                  "h-[266.66px]": images.length === 6,
                },
              )}
            >
              <Image
                src={img.url}
                alt="Product image"
                width={800}
                height={800}
                className="h-full w-full object-cover object-top"
              />
              <div
                className={cn(
                  "absolute top-0 left-0 right-0 bottom-0 hidden group-hover:flex bg-white/55 cursor-pointer items-center justify-center flex-col gap-y-3 transition-all duration-500",
                  {
                    "!pb-[40%]": images.length === 1,
                  },
                )}
              >
                <button
                  className="Btn"
                  type="button"
                  onClick={() => onRemove(img.url)}
                >
                  <div className="sign">
                    <Trash size={18}></Trash>
                  </div>
                  <div className="text">Delete</div>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
};

export default ImagesPreviewGrid;
