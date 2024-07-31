// app/api/proxy/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const targetUrl = url.searchParams.get("url");

  if (!targetUrl) {
    return NextResponse.json({
      error: "URL parameter is required",
      status: false,
    });
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 500);

    const response = await fetch(targetUrl, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    return NextResponse.json({ status: response.ok });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message || "An error occurred",
      status: false,
    });
  }
}
