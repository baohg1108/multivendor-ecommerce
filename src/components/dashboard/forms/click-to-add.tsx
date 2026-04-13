import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Minus, PaintBucket, Plus } from "lucide-react";
import React, { useState } from "react";

import { SketchPicker } from "react-color";

export interface Detail {
  [key: string]: string | number | boolean | undefined;
}

const PlusButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      type="button"
      title="Add new detail"
      className="group cursor-pointer rounded-full border border-blue-300 bg-white p-1.5 shadow-sm outline-none transition-all duration-300 hover:-translate-y-0.5 hover:rotate-90 hover:border-blue-primary hover:bg-blue-primary/10"
      onClick={onClick}
    >
      <Plus className="h-5 w-5 text-blue-500 transition-colors group-hover:text-blue-primary" />
    </button>
  );
};

const MinusButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      type="button"
      title="Remove detail"
      className="group cursor-pointer rounded-full border border-red-300 bg-white p-1.5 shadow-sm outline-none transition-all duration-300 hover:-translate-y-0.5 hover:rotate-90 hover:border-red-500 hover:bg-red-500/10"
      onClick={onClick}
    >
      <Minus className="h-5 w-5 text-red-500 transition-colors group-hover:text-red-600" />
    </button>
  );
};

interface ClickToAddInputProps<T extends Detail> {
  details: T[];
  setDetails: React.Dispatch<React.SetStateAction<T[]>>;
  initialDetail: T;
  header: string;
  colorPicker?: boolean;
}

const ClickToAddInputs = <T extends Detail>({
  details,
  setDetails,
  initialDetail = {} as T,
  header,
  colorPicker,
}: ClickToAddInputProps<T>) => {
  // state to manage toggling color picker
  const [colorPickerIndex, setColorPickerIndex] = useState<number | null>(null);

  // function to handle changes in details properties
  const handleDetailsChange = (
    index: number,
    property: string,
    value: string | number,
  ) => {
    // update the details array with the new property value
    const updatedDetails = details.map((detail, i) =>
      i === index ? { ...detail, [property]: value } : detail,
    );
    setDetails(updatedDetails);
  };

  // function to add a new detail
  const handleAddDetail = () => {
    // add a new detail object to the details array
    setDetails([...details, { ...initialDetail }]);
  };

  // function to handle removing a detail
  const handleRemoveDetail = (index: number) => {
    if (details.length === 1) return;
    const updatedDetails = details.filter((_, i) => i !== index);
    setDetails(updatedDetails);
  };

  return (
    <div className="flex flex-col gap-y-4">
      {/* header */}
      <div>{header}</div>
      {/* display button if no details exist */}
      {details.length === 0 && (
        <PlusButton onClick={handleAddDetail}></PlusButton>
      )}
      {/* map through details if no render input fields */}
      {details.map((detail, index) => (
        <div key={index} className="flex items-center gap-x-4">
          {Object.keys(detail).map((property, propIndex) => (
            <div key={propIndex} className="flex items-center gap-x-4">
              {/* Color picker toggle */}
              {property === "color" && colorPicker && (
                <div className="flex gap-x-4">
                  <button
                    type="button"
                    className="cursor-pointer"
                    onClick={() =>
                      setColorPickerIndex(
                        colorPickerIndex === index ? null : index,
                      )
                    }
                  >
                    <PaintBucket></PaintBucket>
                  </button>
                  <span
                    className="w-8 h-8 rouunded-full"
                    style={{ backgroundColor: detail[property] as string }}
                  ></span>
                </div>
              )}
              {/*color picker*/}
              {colorPickerIndex === index &&
                property === "color" &&
                colorPicker && (
                  <SketchPicker
                    color={detail[property] as string}
                    onChange={(e) =>
                      handleDetailsChange(index, property, e.hex)
                    }
                  ></SketchPicker>
                )}

              {/* Input field */}
              <Input
                className="w-28"
                type={typeof detail[property] === "number" ? "number" : "text"}
                name={property}
                placeholder={property}
                value={detail[property] as string}
                min={typeof detail[property] === "number" ? 0 : undefined}
                step="0.01"
                onChange={(e) =>
                  handleDetailsChange(
                    index,
                    property,
                    e.target.value === "number"
                      ? parseFloat(e.target.value)
                      : e.target.value,
                  )
                }
              ></Input>
            </div>
          ))}
          {/* show buttons for each row  of inputs */}
          <MinusButton onClick={() => handleRemoveDetail(index)}></MinusButton>
          <PlusButton onClick={handleAddDetail}></PlusButton>
        </div>
      ))}
    </div>
  );
};

export default ClickToAddInputs;
