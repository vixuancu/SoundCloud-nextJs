import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  // Lấy tất cả query params
  const query = Object.fromEntries(req.nextUrl.searchParams);
  //   return Response.json({ data: "hoidanit" });
  console.log("check query:", query);
  //method mặc định là GET
  return await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/tracks/${query.audio}`
  );
}
