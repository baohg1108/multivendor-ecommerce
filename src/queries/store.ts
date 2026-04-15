"use server";

import { db } from "@/lib/db";
import { StoreDefaultShippingType } from "@/lib/types";

import { currentUser } from "@clerk/nextjs/server";

import { Prisma, StoreStatus } from "@prisma/client";
import error from "next/dist/api/error";

type UpsertStoreInput = {
  id: string;
  name: string;
  description: string;
  email: string;
  phone: string;
  url: string;
  logo: string;
  cover: string;
  featured?: boolean;
  status?: StoreStatus;
  returnPolicy?: string | null;
  defaultShippingService?: string | null;
  defaultShippingFees?: number | null;
  defaultDeliveryTimeMin?: number | null;
  defaultDeliveryTimeMax?: number | null;
};

export const upsertStore = async (store: UpsertStoreInput) => {
  try {
    const user = await currentUser();

    if (!user) {
      throw new Error("Unauthenticated");
    }

    if (user.privateMetadata.role !== "SELLER") {
      throw new Error(
        "Unauthorized Accesss: Seller Privileges Required for Entry",
      );
    }

    if (!store) {
      throw new Error("Please provide store data !");
    }

    const existingStore = await db.store.findFirst({
      where: {
        AND: [
          {
            OR: [
              { name: store.name },
              { url: store.url },
              { email: store.email },
              { phone: store.phone },
            ],
          },
          {
            NOT: [
              {
                id: store.id,
              },
            ],
          },
        ],
      },
    });

    if (existingStore) {
      let errorMessage = "";
      if (existingStore.name === store.name) {
        errorMessage = "A store with the same name already exitst !";
      } else if (existingStore.url === store.url) {
        errorMessage = "A store with the same url already exitst !";
      } else if (existingStore.email === store.email) {
        errorMessage = "A store with the same email already exitst !";
      } else if (existingStore.phone === store.phone) {
        errorMessage = "A store with the same phone number already exitst !";
      }
      throw new Error(errorMessage);
    }

    const updateData: Prisma.StoreUpdateInput = {
      name: store.name,
      description: store.description,
      email: store.email,
      phone: store.phone,
      url: store.url,
      logo: store.logo,
      cover: store.cover,
      featured: store.featured ?? false,
      status: store.status ?? StoreStatus.PENDING,
      returnPolicy: store.returnPolicy,
      defaultShippingService: store.defaultShippingService,
      defaultShippingFees: store.defaultShippingFees,
      defaultDeliveryTimeMin: store.defaultDeliveryTimeMin,
      defaultDeliveryTimeMax: store.defaultDeliveryTimeMax,
    };

    const createData: Prisma.StoreCreateInput = {
      name: store.name,
      description: store.description,
      email: store.email,
      phone: store.phone,
      url: store.url,
      logo: store.logo,
      cover: store.cover,
      featured: store.featured ?? false,
      status: store.status ?? StoreStatus.PENDING,
      returnPolicy: store.returnPolicy,
      defaultShippingService: store.defaultShippingService,
      defaultShippingFees: store.defaultShippingFees,
      defaultDeliveryTimeMin: store.defaultDeliveryTimeMin,
      defaultDeliveryTimeMax: store.defaultDeliveryTimeMax,
      user: {
        connect: { id: user.id },
      },
    };

    const storeDetails = await db.store.upsert({
      where: {
        id: store.id || "",
      },
      update: updateData,
      create: createData,
    });

    return storeDetails;
  } catch (error) {
    throw error;
  }
};

export const getStoreDefaultShippingDetails = async (storeUrl: string) => {
  try {
    if (!storeUrl) throw new Error("Store url is required !");

    const store = await db.store.findUnique({
      where: {
        url: storeUrl,
      },
      select: {
        defaultShippingService: true,
        defaultShippingFeePerItem: true,
        defaultShippingFeeForAdditionalItem: true,
        defaultShippingFeePerKg: true,
        defaultShippingFeeFixed: true,
        defaultDeliveryTimeMin: true,
        defaultDeliveryTimeMax: true,
        returnPolicy: true,
      },
    });

    if (!store) throw new Error("Store not found !");

    return store;
  } catch (error) {
    throw error;
  }
};

export const updateStoreDefaultShippingDetails = async ({
  storeUrl,
  details,
}: {
  storeUrl: string;
  details: StoreDefaultShippingType;
}) => {
  try {
    const user = await currentUser();

    if (!user) throw new Error("Unauthenticated");

    if (user.privateMetadata.role !== "SELLER") {
      throw new Error(
        "Unauthorized Accesss: Seller Privileges Required for Entry",
      );
    }
    if (!storeUrl) throw new Error("Store url is required !");
    if (!details)
      throw new Error("Store default shipping details are required !");

    const check_ownership = await db.store.findUnique({
      where: {
        url: storeUrl,
        userId: user.id,
      },
    });
    if (!check_ownership) {
      throw new Error(
        "Make sure you have the permission to update this store !",
      );
    }

    const updatedStore = await db.store.update({
      where: {
        url: storeUrl,
        userId: user.id,
      },
      data: details,
    });
    return updatedStore;
  } catch (error) {
    throw error;
  }
};
