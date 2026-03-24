import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/**
 * S3-compatible client for Supabase Storage.
 * Uses credentials from environment variables.
 */
const s3 = new S3Client({
  region: process.env.S3_REGION ?? "ap-south-1",
  endpoint: process.env.S3_ENDPOINT_URL,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true, // Required for Supabase Storage S3 compatibility
});

const BUCKET = process.env.S3_BUCKET_NAME ?? "kraftalis";

/**
 * Generate a presigned PUT URL for direct client upload.
 *
 * @param key    Object key (path) in the bucket, e.g. "receipts/abc123.jpg"
 * @param contentType  MIME type, e.g. "image/jpeg"
 * @param expiresIn    URL validity in seconds (default 300 = 5 min)
 * @returns Presigned URL and the final public URL
 */
export async function generatePresignedUploadUrl(
  key: string,
  contentType: string,
  expiresIn = 300,
): Promise<{ uploadUrl: string; publicUrl: string }> {
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn });

  // Supabase Storage public URL pattern
  const baseUrl = process.env.S3_ENDPOINT_URL!.replace("/s3", "");
  const publicUrl = `${baseUrl}/object/public/${BUCKET}/${key}`;

  return { uploadUrl, publicUrl };
}

/**
 * Upload a file buffer directly to S3 from the server.
 * This avoids CORS issues with browser-direct uploads.
 *
 * @param key          Object key (path) in the bucket
 * @param body         File contents as Buffer or Uint8Array
 * @param contentType  MIME type
 * @returns Public URL for the uploaded object
 */
export async function uploadToS3(
  key: string,
  body: Buffer | Uint8Array,
  contentType: string,
): Promise<string> {
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  );

  const baseUrl = process.env.S3_ENDPOINT_URL!.replace("/s3", "");
  return `${baseUrl}/object/public/${BUCKET}/${key}`;
}

export { s3, BUCKET };
