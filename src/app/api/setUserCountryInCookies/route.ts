import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userCountry } = body;

    if (!userCountry) {
      return new NextResponse("userCountry is required", { status: 400 });
    }

    const response = new NextResponse("User country data saved", {
      status: 200,
    });
    response.cookies.set("userCountry", JSON.stringify(userCountry), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    return response;
  } catch (error) {
    return new NextResponse("Couldn't save data", { status: 500 });
  }
}
