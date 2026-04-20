import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    let product = await prisma.product.findUnique({
      where: { slug: 'hoang-gia-bao' },
      include: { store: true }
    });

    if (!product) {
      console.log("Product 'hoang-gia-bao' not found. Searching for 'iphone-15-promax-1-2'...");
      product = await prisma.product.findUnique({
        where: { slug: 'iphone-15-promax-1-2' },
        include: { store: true }
      });
    }

    const candidates = await prisma.product.findMany({
      where: { slug: { contains: 'iphone-15' } },
      take: 10,
      select: { slug: true }
    });
    console.log("Candidate slugs containing 'iphone-15':", candidates.map(c => c.slug));

    if (!product) {
      console.log("Required product not found.");
      return;
    }

    console.log("\n1) Selected Product Info:");
    console.log({
      id: product.id,
      slug: product.slug,
      shippingFeeMethod: product.shippingFeeMethod,
      storeId: product.storeId
    });

    const store = product.store;
    console.log("\n2) Store Defaults:");
    console.log({
      defaultShippingFeePerItem: store.defaultShippingFeePerItem,
      defaultShippingFeeForAdditionalItem: store.defaultShippingFeeForAdditionalItem,
      defaultShippingFeePerKg: store.defaultShippingFeePerKg,
      defaultShippingFeeFixed: store.defaultShippingFeeFixed,
      defaultShippingService: store.defaultShippingService
    });

    const country = await prisma.country.findUnique({
      where: { code: 'VN' }
    });

    if (!country) {
      console.log("\n3) Country 'VN' not found.");
    } else {
      console.log("\n3) Country Info (VN):");
      console.log({
        id: country.id,
        name: country.name,
        code: country.code
      });

      const shippingRate = await prisma.shippingRate.findFirst({
        where: {
          countryId: country.id,
          storeId: product.storeId
        }
      });

      if (shippingRate) {
        console.log("\n4) Shipping Rate for VN and Store:");
        console.log({
          shippingService: shippingRate.shippingService,
          shippingFeePerItem: shippingRate.shippingFeePerItem,
          shippingFeeForAdditionalItem: shippingRate.shippingFeeForAdditionalItem,
          shippingFeePerKg: shippingRate.shippingFeePerKg,
          shippingFeeFixed: shippingRate.shippingFeeFixed
        });
      } else {
        console.log("\n4) No specific Shipping Rate found for VN and this store.");
      }
    }

  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
