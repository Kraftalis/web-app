import { NextRequest } from "next/server";
import { successResponse, validationError, internalError } from "@/lib/api";
import { generatePresignedUploadUrl } from "@/lib/s3";
import { randomUUID } from "crypto";

/**
 * Allowed MIME types for receipt uploads.
 */
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "application/pdf",
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

/**
 * POST /api/upload
 * Returns a presigned S3 PUT URL for direct client upload.
 *
 * Body: { fileName: string, contentType: string, fileSize: number, folder?: string }
 * Returns: { uploadUrl, publicUrl, key }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileName, contentType, fileSize, folder } = body;

    // Validate required fields
    if (!fileName || !contentType) {
      return validationError("fileName and contentType are required.");
    }

    // Validate content type
    if (!ALLOWED_TYPES.includes(contentType)) {
      return validationError(
        `Unsupported file type. Allowed: ${ALLOWED_TYPES.join(", ")}`,
      );
    }

    // Validate file size
    if (fileSize && fileSize > MAX_FILE_SIZE) {
      return validationError("File too large. Maximum size is 5 MB.");
    }

    // Build object key: folder/uuid-originalname
    const ext = fileName.split(".").pop() ?? "bin";
    const prefix = folder ?? "receipts";
    const key = `${prefix}/${randomUUID()}.${ext}`;

    const { uploadUrl, publicUrl } = await generatePresignedUploadUrl(
      key,
      contentType,
    );

    return successResponse({ uploadUrl, publicUrl, key });
  } catch (err) {
    console.error("[API] POST /api/upload error:", err);
    return internalError();
  }
}
