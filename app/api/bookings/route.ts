import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:8080";

export async function GET(req: NextRequest) {
  try {
    const auth = req.headers.get("authorization");
    const res = await fetch(`${API_BASE_URL}/bookings`, {
      headers: {
        Authorization: auth || "",
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { message: text || "Failed to fetch bookings" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || "Failed to fetch bookings" },
      { status: 502 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = req.headers.get("authorization");
    const body = await req.text();

    const res = await fetch(`${API_BASE_URL}/bookings`, {
      method: "POST",
      headers: {
        Authorization: auth || "",
        "Content-Type": "application/json",
      },
      body,
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { message: text || "Failed to create booking" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || "Failed to create booking" },
      { status: 502 }
    );
  }
}

