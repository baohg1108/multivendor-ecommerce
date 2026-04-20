import { getProductPageData } from "@/queries/product";
import { redirect, notFound } from "next/navigation";
import ProductPageContainer from "@/components/store/product-page/container";
import { Separator } from "@/components/ui/separator";

interface PageProps {
  params: Promise<{ productSlug: string; variantSlug: string }>;
  searchParams: Promise<{ size?: string }>;
}

export default async function ProductVariantPage({
  params,
  searchParams,
}: PageProps) {
  const { productSlug, variantSlug } = await params;
  const { size: sizeId } = await searchParams;

  const productData = await getProductPageData(productSlug, variantSlug);

  if (!productData) {
    return notFound();
  }

  const { sizes } = productData;

  if (sizeId) {
    const isValidSize = sizes.some((size) => size.id === sizeId);

    if (!isValidSize) {
      return redirect(`/product/${productSlug}/${variantSlug}`);
    }
  } else if (sizes.length === 1) {
    redirect(`/product/${productSlug}/${variantSlug}?size=${sizes[0].id}`);
  }

  const relatedProducts = { products: [] };
  const { specs, questions } = productData;

  return (
    <div>
      <div className="max-w-[1650px] mx-auto p-4 overflow-x-hidden">
        <ProductPageContainer productData={productData} sizeId={sizeId}>
          {relatedProducts.products && (
            <>
              <Separator />
              {/* Related Products */}
            </>
          )}

          <Separator className="mt-6" />
          {/* Product reviews */}

          <>
            <Separator className="mt-6" />
            {/* Product Description */}
          </>

          {(specs.product.length > 0 || specs.variant.length > 0) && (
            <>
              <Separator className="mt-6" />
              {/* Specs table */}
            </>
          )}

          {questions.length > 0 && (
            <>
              <Separator className="mt-6" />
              {/* Questions */}
            </>
          )}

          <Separator className="my-6" />
          {/* Store card */}
          {/* Store Product */}
        </ProductPageContainer>
      </div>
    </div>
  );
}
