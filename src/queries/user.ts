"use server";
import { db } from "@/lib/db";
import { CartProductType } from "@/lib/types";
import { getShippingDetails } from "@/queries/product";
import { currentUser } from "@clerk/nextjs/server";
import { CartItem, Country as CountryDB } from "@prisma/client";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
import { Prisma } from "@prisma/client";

export const followStore = async (storeId: string): Promise<boolean> => {
  try {
    const user = await currentUser();

    if (!user) throw new Error("User not authenticated");

    const store = await db.store.findUnique({
      where: {
        id: storeId,
      },
    });

    const userData = await db.user.findUnique({
      where: {
        id: user.id,
      },
    });

    if (!userData) throw new Error("User not found");

    const userFollowingStore = await db.user.findFirst({
      where: {
        id: user.id,
        following: {
          some: {
            id: storeId,
          },
        },
      },
    });

    if (userFollowingStore) {
      await db.store.update({
        where: {
          id: storeId,
        },
        data: {
          followers: {
            disconnect: {
              id: userData.id,
            },
          },
        },
      });
      return false; // Unfollowed
    } else {
      await db.store.update({
        where: {
          id: storeId,
        },
        data: {
          followers: {
            connect: {
              id: userData.id,
            },
          },
        },
      });
      return true; // Followed
    }
  } catch (error) {
    console.error("Error following/unfollowing store:", error);
    throw new Error("Failed to follow/unfollow store");
  }
};

export const saveUserCart = async (
  cartProducts: CartProductType[],
): Promise<boolean> => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated");
  const userId = user.id;

  // search for is authenticated user already has a cart, if yes delete it and create a new one with the new cart items, if no create a new one
  const userCart = await db.cart.findFirst({
    where: { userId },
  });

  // Delete any existing user cart
  if (userCart) {
    await db.cart.delete({
      where: {
        userId,
      },
    });
  }
  const validatedCartItems = await Promise.all(
    cartProducts.map(async (cartProduct) => {
      const { productId, variantId, sizeId, quantity } = cartProduct;

      // Fetch the product, variant, and size from the database
      const product = await db.product.findUnique({
        where: {
          id: productId,
        },
        include: {
          store: true,
          freeShipping: {
            include: {
              eligibleCountries: true,
            },
          },
          variants: {
            where: {
              id: variantId,
            },
            include: {
              sizes: {
                where: {
                  id: sizeId,
                },
              },
              images: true,
            },
          },
        },
      });

      if (
        !product ||
        product.variants.length === 0 ||
        product.variants[0].sizes.length === 0
      ) {
        throw new Error(
          `Invalid product, variant, or size combination for productId ${productId}, variantId ${variantId}, sizeId ${sizeId}`,
        );
      }

      const variant = product.variants[0];
      const size = variant.sizes[0];

      // Validate stock and price
      const validQuantity = Math.min(quantity, size.quantity);

      const price = size.discountPrice
        ? size.price - size.price * (size.discountPrice / 100)
        : size.price;

      // Calculate Shipping details
      const countryCookie = await getCookie("userCountry", { cookies });

      let details = {
        shippingFee: 0,
        extraShippingFee: 0,
        isFreeShipping: false,
      };

      if (countryCookie) {
        const country = JSON.parse(countryCookie);
        const temp_details = await getShippingDetails(
          product.shippingFeeMethod,
          country,
          product.store,
          product.freeShipping,
          // product.freeShippingForAllCountries,
        );
        if (typeof temp_details !== "boolean") {
          details = temp_details;
        }
      }
      let shippingFee = 0;
      const { shippingFeeMethod } = product;
      if (shippingFeeMethod === "ITEM") {
        shippingFee =
          quantity === 1
            ? details.shippingFee
            : details.shippingFee + details.extraShippingFee * (quantity - 1);
      } else if (shippingFeeMethod === "WEIGHT") {
        shippingFee = details.shippingFee * variant.weight * quantity;
      } else if (shippingFeeMethod === "FIXED") {
        shippingFee = details.shippingFee;
      }

      const totalPrice = price * validQuantity + shippingFee;
      return {
        productId,
        variantId,
        productSlug: product.slug,
        variantSlug: variant.slug,
        sizeId,
        storeId: product.storeId,
        sku: variant.sku,
        name: `${product.name} · ${variant.variantName}`,
        image: variant.images[0].url,
        size: size.size,
        quantity: validQuantity,
        price,
        shippingFee,
        totalPrice,
      };
    }),
  );

  const subtotal = validatedCartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const shippingFees = validatedCartItems.reduce(
    (acc, item) => acc + item.shippingFee,
    0,
  );
  const total = subtotal + shippingFees;
  const cart = await db.cart.create({
    data: {
      cartItems: {
        create: validatedCartItems.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          sizeId: item.sizeId,
          storeId: item.storeId,
          sku: item.sku,
          productSlug: item.productSlug,
          variantSlug: item.variantSlug,
          name: item.name,
          image: item.image,
          quantity: item.quantity,
          size: item.size,
          price: item.price,
          shippingFee: item.shippingFee,
          totalPrice: item.totalPrice,
        })),
      },
      shippingFees,
      subtotal,
      total,
      userId,
    },
  });
  if (cart) return true;
  return false;
};
