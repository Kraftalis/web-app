import { NextResponse } from "next/server";
import type { ApiResponse } from "./types";
import { ErrorCode } from "./types";

/**
 * Helpers to build standard API responses.
 */

export function successResponse<T>(
  data: T,
  meta?: ApiResponse["meta"],
  status = 200,
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ success: true, data, meta }, { status });
}

export function createdResponse<T>(data: T): NextResponse<ApiResponse<T>> {
  return successResponse(data, undefined, 201);
}

export function errorResponse(
  code: ErrorCode,
  message: string,
  status: number,
  details?: Record<string, string[]>,
): NextResponse<ApiResponse<never>> {
  return NextResponse.json(
    { success: false, error: { code, message, details } },
    { status },
  );
}

// ─── Pre-built error helpers ────────────────────────────────

export function validationError(
  message: string,
  details?: Record<string, string[]>,
) {
  return errorResponse(ErrorCode.VALIDATION_ERROR, message, 400, details);
}

export function unauthorizedError(message = "Authentication required.") {
  return errorResponse(ErrorCode.UNAUTHORIZED, message, 401);
}

export function forbiddenError(message = "Insufficient permissions.") {
  return errorResponse(ErrorCode.FORBIDDEN, message, 403);
}

export function notFoundError(message = "Resource not found.") {
  return errorResponse(ErrorCode.NOT_FOUND, message, 404);
}

export function conflictError(message = "Resource already exists.") {
  return errorResponse(ErrorCode.CONFLICT, message, 409);
}

export function internalError(message = "Internal server error.") {
  return errorResponse(ErrorCode.INTERNAL_ERROR, message, 500);
}
