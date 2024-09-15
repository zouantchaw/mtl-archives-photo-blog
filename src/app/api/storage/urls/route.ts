import { getStorageUploadUrlsNoStore } from '@/services/storage/cache';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') ?? '20', 10);
  const offset = parseInt(searchParams.get('offset') ?? '0', 10);

  const storageUrls = await getStorageUploadUrlsNoStore();

  const paginatedUrls = storageUrls.slice(offset, offset + limit);
  const total = storageUrls.length;

  return NextResponse.json({ data: paginatedUrls, total });
}