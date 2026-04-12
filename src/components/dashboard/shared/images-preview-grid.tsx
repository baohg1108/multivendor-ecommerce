import Image from "next/image";

import NoImageImg from "../../../../public/assets/images/image.png";
import { cn } from "@/lib/utils";

interface ImagePreviewGridProps {
  images: { url: string }[];
  onRemove: (value: string) => void;
}

const ImagesPreviewGrid: React.FC<ImagePreviewGridProps> = ({
  images,
  onRemove,
}) => {
  const imagesLength = images.length;
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
            "grid grid-cols-2 h-[800px] overflow-hidden bg-white rounded-md",
          )}
        >
          {images.map((img, i) => (
            <div
              key={i}
              className={cn(
                "relative group h-full w-full border border-gray-300",
              )}
            >
              <Image
                src={img.url}
                alt="Product image"
                width={800}
                height={800}
                className="h-full w-full object-cover object-top"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
};

export default ImagesPreviewGrid;
