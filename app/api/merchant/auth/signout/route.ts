

import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Signed out" });
  // Clear the merchant token cookie
  response.cookies.set("merchant_token", "", {
    httpOnly: true,
    expires:  new Date(0),
    path:     "/",
  });
  return response;
}