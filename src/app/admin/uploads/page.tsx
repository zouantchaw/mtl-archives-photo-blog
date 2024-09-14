'use client';

import { useState, useEffect } from 'react';
import StorageUrls from '@/admin/StorageUrls';
import SiteGrid from '@/components/SiteGrid';
import JsonDropzone from '@/components/JsonDropzone';
import { toast } from 'sonner';

export default function AdminUploadsPage() {
  const [storageUrls, setStorageUrls] = useState([]);
  const [matchedUrls, setMatchedUrls] = useState<string[]>([]);
  const [matchedMetadata, setMatchedMetadata] = useState<Record<string, any>>({});

  useEffect(() => {
    fetch('/api/storage/urls')
      .then(response => response.json())
      .then(data => {
        setStorageUrls(data);
      })
      .catch(error => {
        console.error("Error fetching storage URLs:", error);
        toast.error("Failed to fetch storage URLs");
      });
  }, []);

  const handleJsonProcessed = (json: any, matchedUrl: string | null) => {
    if (matchedUrl) {
      setMatchedUrls(prev => [...prev, matchedUrl]);
      setMatchedMetadata(prev => ({ ...prev, [matchedUrl]: json }));
    }
  };

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
          <StorageUrls
            urls={storageUrls}
            matchedUrls={matchedUrls}
            matchedMetadata={matchedMetadata}
          />
        </>
      }
    />
  );
}