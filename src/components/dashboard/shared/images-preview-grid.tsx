import Image from "next/image";
import React, { useEffect } from "react";

import NoImageImg from "../../../../public/assets/images/image.png";
import { cn } from "@/lib/utils";

import { getGridClassName } from "@/lib/utils";
import { Trash } from "lucide-react";
import { SetStateAction } from "react";
import { getDominantColors } from "@/lib/utils";
import ColorPalette from "./colors-palette";

interface ImagePreviewGridProps {
  images: { url: string }[];
  onRemove: (value: string) => void;
  colors?: { color: string }[];
  setColors: React.Dispatch<SetStateAction<{ color: string }[]>>;
}

const ImagesPreviewGrid: React.FC<ImagePreviewGridProps> = ({
  images,
  onRemove,
  colors,
  setColors,
}) => {
  const imagesLength = images.length;

  const GridClassName = getGridClassName(imagesLength);
  const [colorPalettes, setColorPalettes] = React.useState<string[][]>([]);

  useEffect(() => {
    const fetchPalettes = async () => {
      const palettes = await Promise.all(
        images.map(async (img) => {
          try {
            return await getDominantColors(img.url);
          } catch {
            return [];
          }
        }),
      );

      setColorPalettes(palettes);
    };

    if (imagesLength > 0) {
      fetchPalettes();
    }
  }, [images, imagesLength]);

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
            "grid h-[800px] overflow-hidden rounded-md bg-white",
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
                  "absolute inset-0 hidden cursor-pointer items-center justify-center bg-white/55 transition-all duration-500 group-hover:flex",
                  {
                    "!pb-[40%]": images.length === 1,
                  },
                )}
              >
                <ColorPalette
                  setColors={setColors}
                  extractedColors={colorPalettes[i]}
                  colors={colors}
                />
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
