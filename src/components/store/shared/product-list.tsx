import { ProductType } from "@/lib/types";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import ProductCard from "../cards/product/product-card";

interface Props {
  products: ProductType[];
  title?: string;
  link?: string;
  arrow?: boolean;
}

const ProductList: React.FC<Props> = ({ products, title, link, arrow }) => {
  const Title = () =>
    link ? (
      <Link href={link} className="h-12">
        <h2 className="text-black text-xl font-bold">
          {title}&nbsp;
          {arrow && <ChevronRight className="w-3 inline-block" />}
        </h2>
      </Link>
    ) : (
      <h2 className="text-black text-xl font-bold">
        {title}&nbsp;
        {arrow && <ChevronRight className="w-3 inline-block" />}
      </h2>
    );

  return (
    <div className="relative">
      {title && <Title></Title>}
      {products.length > 0 ? (
        <div
          className={cn(
            "flex flex-wrap  -translate-x-5 w-[calc(100%+3rem)] sm:w-[calc(100%+1.5rem)]",
            {
              "mt-2": title,
            },
          )}
        >
          {products.map((product) => (
            <div className="block" key={product.id}>
              <ProductCard key={product.id} product={product} />
            </div>
          ))}
        </div>
      ) : (
        "No products found"
      )}
    </div>
  );
};

export default ProductList;
