import { NextRequest } from "next/server";
import { successResponse, validationError, internalError } from "@/lib/api";
import { uploadToS3 } from "@/lib/s3";
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
 * Accepts a FormData body with a `file` field and optional `folder` field.
 * Uploads the file server-side to S3 (avoids browser CORS issues).
 *
 * Returns: { publicUrl, fileName }
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) ?? "receipts";

    if (!file || !(file instanceof File)) {
      return validationError("A file is required.");
    }

    // Validate content type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return validationError(
        `Unsupported file type. Allowed: ${ALLOWED_TYPES.join(", ")}`,
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return validationError("File too large. Maximum size is 5 MB.");
    }

    // Build object key: folder/uuid.ext
    const ext = file.name.split(".").pop() ?? "bin";
    const key = `${folder}/${randomUUID()}.${ext}`;

    // Read file into buffer and upload server-side
    const buffer = Buffer.from(await file.arrayBuffer());
    const publicUrl = await uploadToS3(key, buffer, file.type);

    return successResponse({ publicUrl, fileName: file.name });
  } catch (err) {
    console.error("[API] POST /api/upload error:", err);
    return internalError();
  }
}
