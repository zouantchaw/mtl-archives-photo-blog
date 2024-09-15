import { unstable_noStore } from "next/cache";
import {
  getStoragePhotoUrls,
  getStorageUploadUrls,
  StorageListResponse, // Add this import
} from "@/services/storage";

export const getStorageUploadUrlsNoStore =
  async (): Promise<StorageListResponse> => {
    unstable_noStore();
    return getStorageUploadUrls();
  };

export const getStoragePhotoUrlsNoStore: typeof getStoragePhotoUrls = (
  ...args
) => {
  unstable_noStore();
  return getStoragePhotoUrls(...args);
};

export interface PaginatedStorageUrls {
  data: StorageListResponse;
  total: number;
}

export const getStorageUploadUrlsPaginated = async (
  limit: number,
  offset: number
): Promise<PaginatedStorageUrls> => {
  const storageUrls = await getStorageUploadUrlsNoStore();
  const paginatedUrls = storageUrls.slice(offset, offset + limit);
  const total = storageUrls.length;
  return { data: paginatedUrls, total };
};
