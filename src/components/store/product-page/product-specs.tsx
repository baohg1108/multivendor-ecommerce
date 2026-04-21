import React from "react";
interface ProductSpecsProps {
  specs: {
    product: { name: string; value: string }[];
    variant: { name: string; value: string }[];
  };
}
const ProductSpecs = ({ specs }: ProductSpecsProps) => {
  const { product, variant } = specs;
  return (
    <div className="pt-6 ">
      <div className="h-12">
        <h2 className="text-black text-2xl font-bold">Specifications</h2>
      </div>
      <SpecsTable data={product} />
      <SpecsTable data={variant} noTopBorder />
    </div>
  );
};

export default ProductSpecs;
const SpecsTable = ({
  data,
  noTopBorder,
}: {
  data: { name: string; value: string }[];
  noTopBorder?: boolean;
}) => {
  return (
    <ul className={`border grid grid-cols-2 ${noTopBorder && "border-t-0"}`}>
      {data.map((spec, index) => (
        <li
          key={index}
          className={`flex border-t ${
            (index === 0 || noTopBorder) && "border-t-0"
          }`}
        >
          <div className="float-left text-sm leading-7 max-w-[50%] relative  w-1/2 flex">
            <div className="p-4 bg-[#f5f5f5] text-main-primary w-44">
              <span className="leading-5">{spec.name}</span>
            </div>
            <div className="p-4  text-[#151515] flex-1 break-words leading-5">
              <span className="leading-5">{spec.value}</span>
            </div>
            <div></div>
          </div>
        </li>
      ))}
    </ul>
  );
};
