import { getProductPageData, getProducts } from "@/queries/product";
import { redirect, notFound } from "next/navigation";
import ProductPageContainer from "@/components/store/product-page/container";
import { Separator } from "@/components/ui/separator";
import RelatedProducts from "@/components/store/product-page/shipping/related-product";
import ProductDescription from "@/components/store/product-page/product-description";
import ProductSpecs from "@/components/store/product-page/product-specs";
import ProductQuestions from "@/components/store/product-page/product-questions";
import StoreCard from "@/components/store/cards/store-card";
import StoreProducts from "@/components/store/product-page/store-products";
import ProductReviews from "@/components/store/product-page/reviews/product-reviews";
// import AddReview from "@/components/store/product-page/reviews/add-review";
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

  // display the product page with the selected size
  const {
    specs,
    questions,
    shippingDetails,
    category,
    subCategory,
    store,
    reviewsStatistics,
    reviews,
    variantInfo,
    productId,
  } = productData;

  const relatedProducts = await getProducts(
    {
      category: category.url,
      // subCategory: subCategory.url,
    },
    "",
    1,
    12,
  );

  return (
    <div>
      <div className="max-w-[1650px] mx-auto p-4 overflow-x-hidden">
        <ProductPageContainer productData={productData} sizeId={sizeId}>
          {relatedProducts.products && (
            <>
              <Separator />
              {/* Related Products */}
              <RelatedProducts products={relatedProducts.products} />
            </>
          )}

          <Separator className="mt-6" />
          {/* Product reviews */}
          <ProductReviews
            productId={productData.productId}
            rating={productData.rating}
            statistics={reviewsStatistics.ratingStatistics}
            reviews={reviews}
            variantsInfo={variantInfo}
          ></ProductReviews>

          <>
            <Separator className="mt-6" />
            {/* Product Description */}
            <ProductDescription
              text={[
                productData.description,
                productData.variantDescription || "",
              ]}
            ></ProductDescription>
          </>

          {(specs.product.length > 0 || specs.variant.length > 0) && (
            <>
              <Separator className="mt-6" />
              {/* Specs table */}
              <ProductSpecs specs={specs}></ProductSpecs>
            </>
          )}

          {questions.length > 0 && (
            <>
              <Separator className="mt-6" />
              {/* Questions */}
              {/* <ProductQuestions questions={productData.questions} /> */}
              <ProductQuestions
                questions={productData.questions.map((q) => ({
                  ...q,
                  answer: q.answer ?? "",
                }))}
              />
            </>
          )}

          <Separator className="my-6" />
          {/* Store card */}
          {/* <StoreCard store={productData.store} /> */}
          <StoreCard
            store={{
              ...productData.store,
              isUserFollowingStore: productData.store.isUserFollowingsStore,
            }}
          />
          {/* Store Product */}
          <StoreProducts
            storeUrl={store.url}
            storeName={store.name}
            count={12}
          />
        </ProductPageContainer>
      </div>
    </div>
  );
}
