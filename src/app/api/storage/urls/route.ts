import { getStorageUploadUrlsPaginated } from '@/services/storage/cache';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') ?? '20', 10);
  const offset = parseInt(searchParams.get('offset') ?? '0', 10);
  
  const sortBy = searchParams.get('sortBy') as 'uploadedAt' | 'url' | null;
  const order = searchParams.get('order') as 'asc' | 'desc' | null;
  const search = searchParams.get('search') || '';

  let { data: storageUrls, total } = await getStorageUploadUrlsPaginated(limit, offset);
  console.log('total', total);

  // Apply search filter
  if (search) {
    const searchLower = search.toLowerCase();
    storageUrls = storageUrls.filter(url => 
      url.url.toLowerCase().includes(searchLower) ||
      (url.uploadedAt && url.uploadedAt.toISOString().toLowerCase().includes(searchLower))
    );
    total = storageUrls.length;
  }

  // Sort storageUrls based on sortBy and order
  if (sortBy) {
    storageUrls.sort((a, b) => {
      let compare = 0;
      if (sortBy === 'uploadedAt') {
        const dateA = a.uploadedAt ? new Date(a.uploadedAt).getTime() : 0;
        const dateB = b.uploadedAt ? new Date(b.uploadedAt).getTime() : 0;
        compare = dateA - dateB;
      } else if (sortBy === 'url') {
        const getNumberAndPrefix = (url: string) => {
          const match = url.match(/^(.*?)(\d+)(?:\.(jpg|jpeg))$/i);
          if (match) {
            return {
              prefix: match[1].toLowerCase(),
              number: parseInt(match[2], 10),
              suffix: match[3].toLowerCase()
            };
          }
          return { prefix: url.toLowerCase(), number: Infinity, suffix: '' };
        };
        const { prefix: prefixA, number: numA, suffix: suffixA } = getNumberAndPrefix(a.url);
        const { prefix: prefixB, number: numB, suffix: suffixB } = getNumberAndPrefix(b.url);

        compare = prefixA.localeCompare(prefixB);
        if (compare === 0) {
          compare = numA - numB;
          if (compare === 0) {
            compare = suffixA.localeCompare(suffixB);
          }
        }
      }
      return order === 'desc' ? -compare : compare;
    });
  }

  return NextResponse.json({ 
    data: storageUrls, 
    total,
    page: Math.floor(offset / limit) + 1,
    totalPages: Math.ceil(total / limit)
  });
}