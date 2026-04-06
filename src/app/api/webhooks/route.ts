import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { User } from "@prisma/client";
import { clerkClient } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { parse } from "path/win32";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("Please add WEBHOOK_SECRET to your environment variables");
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response(
      "Error occurred while processing webhook: Missing required headers",
      { status: 400 },
    );
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Webhook instance
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the webhook
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }

  // Do something with payload
  // For this guide, log payload to console
  const { id } = evt.data;
  const eventType = evt.type;

  // When user is created or updated
  if (evt.type === "user.created" || evt.type === "user.updated") {
    console.log("userId: ", evt.data.id);
    const data = JSON.parse(body).data;
    console.log("user data --> ", data);
    const user: Partial<User> = {
      id: data.id,
      name: `${data.first_name} ${data.last_name}`,
      email: data.email_addresses[0].email_address,
      picture: data.image_url,
    };
    if (!user) return;

    const dbUser = await db.user.upsert({
      where: {
        email: user.email,
      },
      update: user,
      create: {
        id: user.id!,
        name: user.name!,
        email: user.email!,
        picture: user.picture!,
        role: user.role || "USER",
        updatedAt: new Date(),
      },
    });

    const client = await clerkClient();

    await client.users.updateUserMetadata(data.id, {
      privateMetadata: {
        role: dbUser.role || "USER",
      },
    });
  }

  // When  user is deleted
  if (evt.type === "user.deleted") {
    const userId = JSON.parse(body).data.id;
    await db.user.delete({
      where: {
        id: userId,
      },
    });
  }

  return new Response("Webhook received", { status: 200 });
}
