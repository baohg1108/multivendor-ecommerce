"use server";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

/**
 * @name followStore
 * @description - toggle fl stt a store by the current user
 *              - if user not fl, it fl the store
 *             - if user already fl, it unfl the store
 * @access User
 * @param storeId
 * @returns {boolean}
 */

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
