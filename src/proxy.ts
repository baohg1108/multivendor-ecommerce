import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import getUserCountry from "@/lib/utils";

export default clerkMiddleware(async (auth, req) => {
  const protectedRoutes = createRouteMatcher(["/dashboard", "/dashboard/(.*)"]);
  const response = NextResponse.next();

  if (protectedRoutes(req)) {
    await auth.protect();
  }

  if (!req.cookies.get("userCountry")) {
    const userCountry = await getUserCountry();

    response.cookies.set("userCountry", JSON.stringify(userCountry), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  return response;
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
