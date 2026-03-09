

import dbConnect from "@/app/utils/dbConnect";

export async function GET() {
  await dbConnect();
  return Response.json({
    message: "MongoDB connected successfully 🚀",
  });
}