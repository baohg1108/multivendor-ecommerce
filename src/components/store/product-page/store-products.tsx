"use client";
import { ProductType } from "@/lib/types";
import { getProducts } from "@/queries/product";
import { FC, useEffect, useState } from "react";
import ProductList from "../shared/product-list";
import { ChevronRight } from "lucide-react";

interface Props {
  storeUrl: string;
  storeName: string;
  count: number;
}

const StoreProducts: FC<Props> = ({ storeUrl, count, storeName }) => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getStoreProducts();
  }, []);

  const getStoreProducts = async () => {
    try {
      setLoading(true);

      const res = await getProducts({ store: storeUrl }, "", 1, count);
      setProducts(res.products);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  return (
    <div className="pt-6" id="reviews">
      <div className="h-12">
        <h2 className="text-main-primary text-2xl font-bold">
          Recommended from Global Goods Marketplace
          <ChevronRight className="w-3 inline-block" />
        </h2>
      </div>
      <div className="mt-8 min-[620px]:mt-0">
        <ProductList products={products} />
      </div>
    </div>
  );
};

export default StoreProducts;
