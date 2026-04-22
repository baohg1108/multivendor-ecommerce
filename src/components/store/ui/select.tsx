import { cn } from "@/lib/utils";
import Image from "next/image";
import { FC, useState } from "react";

interface Props {
  name: string;
  value: string;
  placeholder?: string;
  subPlaceholder?: string;
  onChange: (value: string) => void;
  options: { name: string; value: string; image?: string; colors?: string }[];
  inputClassName?: string;
}

const Select: FC<Props> = ({
  name,
  onChange,
  options,
  value,
  placeholder,
  subPlaceholder,
  inputClassName,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [activeVariant, setActiveVariant] = useState(
    options.find((o) => o.value === value),
  );

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  // Handle option click
  const handleOptionClick = (option: string) => {
    onChange(option);
    setActiveVariant(options.find((o) => o.value === option));
    setIsOpen(false);
  };
  return (
    <div className="relative min-w-48 w-full z-50">
      <div>
        <div className="relative">
          {activeVariant?.image && (
            <Image
              src={activeVariant.image}
              alt=""
              height={50}
              width={50}
              className="absolute h-10 w-10 rounded-full top-1/2 -translate-y-1/2 left-2 shadow-md object-top object-cover"
            />
          )}
          <input
            name={name}
            className={cn(
              "w-full pr-6 pl-8 py-4 rounded-xl outline-none duration-200",
              {
                "ring-1 ring-[transparent] focus:ring-[#11BE86]":
                  !activeVariant?.colors,
                "pl-14": activeVariant?.image,
              },
              inputClassName,
            )}
            placeholder={placeholder}
            value={value}
            onFocus={toggleDropdown}
            onBlur={() => setIsOpen(false)}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      </div>
      {isOpen && (
        <div className="absolute top-16 w-full left-0 rounded-xl border  p-4 bg-white shadow-lg">
          <p className="font-semibold text-xs text-[#5D5D5F]">
            {subPlaceholder}
          </p>
          <ul className="flex gap-2 flex-col mt-2">
            {options.map((option, index) => (
              <li
                key={index}
                className="flex items-center gap-x-2 px-2 cursor-pointer text-sm hover:bg-green-100 py-2 rounded-lg"
                onMouseDown={() => handleOptionClick(option.value)}
              >
                {option.image && (
                  <Image
                    src={option.image}
                    alt=""
                    width={100}
                    height={100}
                    className="w-10 h-10 rounded-full shadow-md object-top object-cover"
                  />
                )}
                {option.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Select;
