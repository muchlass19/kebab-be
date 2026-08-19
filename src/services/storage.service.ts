import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";

export class StorageService {
  private s3 = new S3Client({
    region: process.env.DO_SPACES_REGION!,
    endpoint: process.env.DO_SPACES_ENDPOINT!,
    credentials: {
      accessKeyId: process.env.DO_SPACES_KEY!,
      secretAccessKey: process.env.DO_SPACES_SECRET!,
    },
  });

  createPresignedUrl = async (filename: string, contentType: string) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(contentType)) {
      throw new Error("Format gambar tidak diperbolehkan");
    }

    const extension = filename.split(".").pop()?.toLowerCase();

    if (!extension) {
      throw new Error("File extension tidak ditemukan");
    }

    const key = `uploads/${crypto.randomUUID()}.${extension}`;

    const command = new PutObjectCommand({
      Bucket: process.env.DO_SPACES_BUCKET!,
      Key: key,
      ContentType: contentType,
      ACL: "public-read",
    });

    const uploadUrl = await getSignedUrl(this.s3, command, {
      expiresIn: 300,
    });

    return {
      uploadUrl,
      key,
    };
  };
}
