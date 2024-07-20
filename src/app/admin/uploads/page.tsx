'use client';

import { useState, useEffect } from 'react';
import StorageUrls from '@/admin/StorageUrls';
import SiteGrid from '@/components/SiteGrid';
import JsonDropzone from '@/components/JsonDropzone';

export default function AdminUploadsPage() {
  const [storageUrls, setStorageUrls] = useState([]);
  const [matchedUrls, setMatchedUrls] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/storage/urls')
      .then(response => response.json())
      .then(data => {
        setStorageUrls(data);
        console.log("storageUrls (first 5):", data.slice(0, 5));
      });
  }, []);

  const handleJsonProcessed = (json: any, matchedUrl: string | null) => {
    console.log('Processed JSON:', json);
    console.log('Matched URL:', matchedUrl);
    if (matchedUrl) {
      setMatchedUrls(prev => [...prev, matchedUrl]);
    }
  };

  return (
    <SiteGrid
      contentMain={
        <>
          <JsonDropzone
            onJsonProcessed={handleJsonProcessed}
            storageUrls={storageUrls}
          />
          <StorageUrls urls={storageUrls} matchedUrls={matchedUrls} />
        </>
      }
    />
  );
}