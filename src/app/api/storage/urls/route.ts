import { getStorageUploadUrlsNoStore } from '@/services/storage/cache';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') ?? '20', 10);
  const offset = parseInt(searchParams.get('offset') ?? '0', 10);
  
  const sortBy = searchParams.get('sortBy') as 'uploadedAt' | 'url' | null;
  const order = searchParams.get('order') as 'asc' | 'desc' | null;

  const storageUrls = await getStorageUploadUrlsNoStore();

  // Sort storageUrls based on sortBy and order
  if (sortBy) {
    storageUrls.sort((a, b) => {
      let compare = 0;
      if (sortBy === 'uploadedAt') {
        const dateA = a.uploadedAt ? a.uploadedAt.getTime() : 0;
        const dateB = b.uploadedAt ? b.uploadedAt.getTime() : 0;
        compare = dateA - dateB;
      } else if (sortBy === 'url') {
        // Extract numeric parts from URLs
        const getNumber = (url: string) => {
          const match = url.match(/mtl_archives_image_(\d+)\.jpg$/);
          return match ? parseInt(match[1], 10) : 0;
        };
        const numA = getNumber(a.url);
        const numB = getNumber(b.url);
        compare = numA - numB;
      }
      return order === 'desc' ? -compare : compare;
    });
  }

  const paginatedUrls = storageUrls.slice(offset, offset + limit);
  const total = storageUrls.length;

  return NextResponse.json({ data: paginatedUrls, total });
}