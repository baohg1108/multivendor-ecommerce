"use client";

import React, { SetStateAction, useState } from "react";

interface ColorPaletteProps {
  extractedColors?: string[];
  colors?: { color: string }[];
  setColors: React.Dispatch<SetStateAction<{ color: string }[]>>;
}

const ColorPalette: React.FC<ColorPaletteProps> = ({
  extractedColors,
  colors,
  setColors,
}) => {
  const [activeColor, setActiveColor] = useState<string>("");

  const handleAddProductColor = (color: string) => {
    if (!color || !setColors) return;

    const currentColorsData = colors ?? [];

    const existingColor = currentColorsData.find((c) => color === c.color);
    if (existingColor) {
      return;
    }

    const newColors = currentColorsData.filter((c) => c.color !== "");
    setColors([...newColors, { color }]);
  };

  const getReadableIconColor = (hexColor: string) => {
    const normalized = hexColor.replace("#", "");
    if (normalized.length !== 6) {
      return "#000";
    }

    const r = Number.parseInt(normalized.slice(0, 2), 16);
    const g = Number.parseInt(normalized.slice(2, 4), 16);
    const b = Number.parseInt(normalized.slice(4, 6), 16);

    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.6 ? "#000" : "#fff";
  };

  const spinnerColor =
    activeColor || colors?.[colors.length - 1]?.color || "#fff";
  const spinnerIconColor = getReadableIconColor(spinnerColor);

  const Color = ({
    color,
    onSelect,
  }: {
    color: string;
    onSelect: (color: string) => void;
  }) => {
    return (
      <button
        type="button"
        onClick={() => onSelect(color)}
        style={{ backgroundColor: color }}
        onMouseEnter={() => setActiveColor(color.toUpperCase())}
        className="w-20 h-[80px] cursor-pointer transition-all duration-100 ease-linear relative hover:w-[120px] hover:duration-300"
        aria-label={`Select ${color}`}
        title={color.toUpperCase()}
      >
        <div className="w-full h-8 text-center text-xs font-semibold absolute -top-6 text-black">
          {color}
        </div>
      </button>
    );
  };

  if (!extractedColors?.length) {
    return null;
  }

  const handleSelectColor = (color: string) => {
    const normalized = color.toUpperCase();
    setActiveColor(normalized);
    handleAddProductColor(normalized);
  };

  return (
    <div className="pt-10 w-[320px] h-[160px] rounded-b-md overflow-hidden">
      <div className="w-[320px] h-[180px] rounded-md perspective-1000">
        <div className="relative w-full flex items-center justify-center bg-white h-16 rounded-t-md">
          <div
            className="absolute w-16 h-16 grid place-items-center shadow-lg rounded-full -top-10"
            // style={{ backgroundColor: spinnerColor }}
            style={{ backgroundColor: activeColor || "#FFF" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              // fill={spinnerIconColor}
              fill={activeColor ? "#fff" : "#000"}
              viewBox="0 0 16 16"
              className="animate-spin"
            >
              <path d="M8 0a8 8 0 100 16A8 8 0 008 0zM6.5 4.5a.5.5 0 011 0v3a.5.5 0 01-.5.5H4a.5.5 0 010-1h2a.5.5 0 01.5.5v-3z"></path>
              <path d="M16 0a8 8 0 100 16A8 8 0 008 0zM6.5 4.5a.5.5 0 011 0v3a.5.5 0 01-.5.5H4a.5.5 0 010-1h2a.5.5 0 01.5.5v-3z"></path>
            </svg>
          </div>
        </div>
        <div className="w-full h-[180px] absolute bottom-0 !flex items-center justify-center">
          {extractedColors.map((color, index) => (
            <Color
              key={`${color}-${index}`}
              color={color}
              onSelect={handleSelectColor}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColorPalette;
