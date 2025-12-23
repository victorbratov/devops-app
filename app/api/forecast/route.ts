import { NextRequest, NextResponse } from "next/server";

const FORECAST_URL =
  process.env.FORECAST_URL ||
  process.env.NEXT_PUBLIC_FORECAST_URL ||
  "http://localhost:8081/forecast";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const res = await fetch(FORECAST_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { message: text || "Failed to fetch forecast" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || "Failed to fetch forecast" },
      { status: 502 }
    );
  }
}

