'use client';

import { useState, useEffect, useMemo } from 'react';
import StorageUrls from '@/admin/StorageUrls';
import SiteGrid from '@/components/SiteGrid';
import JsonDropzone from '@/components/JsonDropzone';
import { toast } from 'sonner';

// No changes required here since StorageUrl[] aligns with StorageListResponse
interface StorageUrl {
  url: string;
  uploadedAt: Date;
}

export default function AdminUploadsPage() {
  const [storageUrls, setStorageUrls] = useState<StorageUrl[]>([]);
  const [matchedUrls, setMatchedUrls] = useState<string[]>([]);
  const [matchedMetadata, setMatchedMetadata] = useState<Record<string, any>>({});
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'uploadedAt' | 'url'>('uploadedAt');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const limit = 20; // Items per page

  useEffect(() => {
    const fetchStorageUrls = async () => {
      try {
        const response = await fetch(
          `/api/storage/urls?limit=${limit}&offset=${(currentPage - 1) * limit}&sortBy=${sortBy}&order=${order}`
        );
        const result = await response.json();
        // Convert uploadedAt from string to Date
        const convertedData = result.data.map((url: { url: string; uploadedAt: string }) => ({
          ...url,
          uploadedAt: new Date(url.uploadedAt),
        }));
        setStorageUrls(convertedData);
        setTotal(result.total);
      } catch (error) {
        console.error("Error fetching storage URLs:", error);
        toast.error("Failed to fetch storage URLs");
      }
    };

    fetchStorageUrls();
  }, [currentPage, sortBy, order]);

  const handleJsonProcessed = (json: any, matchedUrl: string | null) => {
    if (matchedUrl) {
      setMatchedUrls(prev => [...prev, matchedUrl]);
      setMatchedMetadata(prev => ({ ...prev, [matchedUrl]: json }));
    }
  };

  const totalPages = useMemo(() => Math.ceil(total / limit), [total, limit]);

  return (
    <SiteGrid
      contentMain={
        <>
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-4">Upload JSON Metadata</h1>
            <JsonDropzone
              onJsonProcessed={handleJsonProcessed}
              storageUrls={storageUrls}
            />
          </div>
          {/* Sorting Controls */}
          <div className="mb-4 flex items-center space-x-4">
            <label>
              Sort By:
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'uploadedAt' | 'url')}
                className="ml-2 p-2 border rounded"
              >
                <option value="uploadedAt">Uploaded At</option>
                <option value="url">URL</option>
              </select>
            </label>
            <label>
              Order:
              <select
                value={order}
                onChange={(e) => setOrder(e.target.value as 'asc' | 'desc')}
                className="ml-2 p-2 border rounded"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </label>
          </div>
          <StorageUrls
            urls={storageUrls}
            matchedUrls={matchedUrls}
            matchedMetadata={matchedMetadata}
          />
          <div className="flex justify-center mt-4 space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      }
    />
  );
}