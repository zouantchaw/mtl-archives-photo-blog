import { getStorageUploadUrlsNoStore } from '@/services/storage/cache';
import { NextResponse } from 'next/server';

export async function GET() {
  const storageUrls = await getStorageUploadUrlsNoStore();
  return NextResponse.json(storageUrls);
}