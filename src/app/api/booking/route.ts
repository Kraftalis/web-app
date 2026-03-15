import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/booking — handles public booking form submission.
 * TODO: Replace with real DB logic when backend is ready.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      token,
      clientName,
      clientPhone,
      eventType,
      eventDate,
      packageId,
      dpAmount,
    } = body;

    // Validate required fields
    if (!token) {
      return NextResponse.json(
        { error: "Token is required." },
        { status: 400 },
      );
    }
    if (!clientName?.trim()) {
      return NextResponse.json(
        { error: "Client name is required." },
        { status: 400 },
      );
    }
    if (!clientPhone?.trim()) {
      return NextResponse.json(
        { error: "Phone number is required." },
        { status: 400 },
      );
    }
    if (!eventType?.trim()) {
      return NextResponse.json(
        { error: "Event type is required." },
        { status: 400 },
      );
    }
    if (!eventDate) {
      return NextResponse.json(
        { error: "Event date is required." },
        { status: 400 },
      );
    }
    if (!packageId) {
      return NextResponse.json(
        { error: "Package selection is required." },
        { status: 400 },
      );
    }
    if (!dpAmount || parseFloat(dpAmount) <= 0) {
      return NextResponse.json(
        { error: "Down payment amount is required." },
        { status: 400 },
      );
    }

    // Mock success — no DB write
    return NextResponse.json({ success: true, eventId: "mock-event-id" });
  } catch {
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
