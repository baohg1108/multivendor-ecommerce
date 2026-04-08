"use client";

import { FC, useEffect, useState } from "react";
import Image from "next/image";
import {
  CldUploadWidget,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
  type: "standard" | "profile" | "cover";
  dontShowPreview?: boolean;
}

const ImageUpload: FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
  type,
  dontShowPreview,
}) => {
  // const [isMounted, setIsMounted] = useState(false);
  // useEffect(() => {
  //   setIsMounted(true);
  // }, []);

  // if (!isMounted) {
  //   return null;
  // }

  // const onUpload = (result: any) => {
  //   console.log("result", result);
  //   onChange(result.info.secure_url);
  // };
  const onUpload = (result: CloudinaryUploadWidgetResults) => {
    const info = result.info as { secure_url: string };
    onChange(info.secure_url);
  };

  if (type === "profile") {
    return (
      <div className="relative rounded-full w-52 h-52  bg-gray-200 border-2 border-white shadow-2xl">
        {value.length > 0 && (
          <Image
            src={value[0]}
            alt=""
            width={300}
            height={300}
            className="w-52 h-52 rounded-full object-cover top-0 left-0 bottom-0 right-0"
          />
        )}
        <CldUploadWidget onSuccess={onUpload} uploadPreset={"admin-product"}>
          {({ open }) => {
            const onClick = () => {
              open();
            };

            return (
              <button
                type="button"
                className="absolute right-0 bottom-6 object-cover font-medium text-[17px] "
                disabled={disabled}
                onClick={onClick}
              >
                <svg
                  viewBox=" 0 0 640 512"
                  fill="white"
                  height="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M213.1 32L168 80H80C35.8 80 0 115.8 0 160v240c0 44.2 35.8 80 80 80h480c44.2 0 80-35.8 80-80V160c0-44.2-35.8-80-80-80h-88l-45.1-48H213.1zM320 400c-79.5 0-144-64.5-144-144s64.5-144 144-144 144 64.5 144 144-64.5 144-144 144zm0-240c-52.9 0-96 43.1-96 96s43.1 96 96 96 96-43.1 96-96-43.1-96-96-96z" />{" "}
                </svg>
              </button>
            );
          }}
        </CldUploadWidget>
      </div>
    );
  } else {
    return <div></div>;
  }
};

export default ImageUpload;
