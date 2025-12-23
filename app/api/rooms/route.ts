import { NextResponse } from "next/server";

const API_BASE_URL =
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:8080";

export async function GET() {
  try {
    const res = await fetch(`${API_BASE_URL}/rooms`, {
      // Prevent caching so UI always reflects latest data
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { message: text || "Failed to fetch rooms" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || "Failed to fetch rooms" },
      { status: 502 }
    );
  }
}

