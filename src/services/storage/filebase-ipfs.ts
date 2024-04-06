import { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  endpoint: "https://s3.filebase.com",
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.FILEBASE_IPFS_ACCESS_KEY!,
    secretAccessKey: process.env.FILEBASE_IPFS_SECRET_ACCESS_KEY!,
  },
});

export async function filebaseIpfsUpload(file: File, key: string) {
  const command = new PutObjectCommand({
    Bucket: process.env.NEXT_PUBLIC_FILEBASE_IPFS_BUCKET,
    Key: key,
    Body: file,
  });
  await s3Client.send(command);
  return `https://${process.env.NEXT_PUBLIC_FILEBASE_IPFS_BUCKET}.s3.filebase.com/${key}`;
}

export async function filebaseIpfsList(prefix: string) {
  const command = new ListObjectsV2Command({
    Bucket: process.env.NEXT_PUBLIC_FILEBASE_IPFS_BUCKET,
    Prefix: prefix,
  });
  const { Contents } = await s3Client.send(command);
  return Contents?.map((c) => ({
    url: `https://${process.env.NEXT_PUBLIC_FILEBASE_IPFS_BUCKET}.s3.filebase.com/${c.Key}`,
    uploadedAt: c.LastModified,
  })) ?? [];
}

export async function filebaseIpfsDelete(fileName: string) {
  const command = new DeleteObjectCommand({
    Bucket: process.env.NEXT_PUBLIC_FILEBASE_IPFS_BUCKET,
    Key: fileName,
  });
  await s3Client.send(command);
}