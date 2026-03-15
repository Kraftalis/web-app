import { NextResponse } from "next/server";
import { hashSync } from "bcryptjs";
import { findUserByEmail, createUser } from "@/services/user-service";
import { createAuditLog } from "@/services/audit-service";
import { createEmailVerificationToken } from "@/services/verification-service";
import { sendVerificationEmail } from "@/services/email-service";

/**
 * POST /api/auth/register
 * Creates a new user with email and password.
 * Validates input and checks for duplicate emails.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body as {
      name?: string;
      email?: string;
      password?: string;
    };

    // ─── Input validation ─────────────────────────────────────────
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 },
      );
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Password strength validation
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 },
      );
    }

    // ─── Check for existing user ──────────────────────────────────
    const existingUser = await findUserByEmail(email.toLowerCase());
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 },
      );
    }

    // ─── Create user ─────────────────────────────────────────────
    const passwordHash = hashSync(password, 12);

    const user = await createUser({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
    });

    // ─── Audit log ───────────────────────────────────────────────
    await createAuditLog({
      userId: user.id,
      action: "REGISTER",
      metadata: { provider: "credentials" },
    });

    // ─── Send verification email ─────────────────────────────────
    const verificationToken = await createEmailVerificationToken(
      email.toLowerCase().trim(),
    );
    await sendVerificationEmail(
      email.toLowerCase().trim(),
      verificationToken.token,
      name?.trim(),
    );

    return NextResponse.json(
      {
        message:
          "Account created successfully. Please check your email to verify your account.",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[API] /auth/register error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
