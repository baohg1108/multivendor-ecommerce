import { MapPin } from "lucide-react";
import { FC } from "react";

interface Props {
  countryName: string;
  countryCode: string;
  city: string | undefined;
}

const ShipTo: FC<Props> = ({ countryName, countryCode, city }) => {
  return (
    <div className="flex justify-between h-7">
      <div className="flex items-center font-bold mr-2 whitespace-nowrap">
        <span>Ship to</span>
      </div>
      <div className="flex items-center overflow-hidden">
        <MapPin className="w-4 mb-1 text-black" />
        <span className="text-gray-500 text-sm cursor-pointer max-w-[200px] overflow-hidden pl-0.5 text-ellipsis whitespace-nowrap">
          {city && `${city}`},{countryName}
        </span>
      </div>
    </div>
  );
};

export default ShipTo;
