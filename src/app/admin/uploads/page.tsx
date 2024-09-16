"use client";

import { useState, useEffect, useMemo } from "react";
import StorageUrls from "@/admin/StorageUrls";
import SiteGrid from "@/components/SiteGrid";
import JsonDropzone from "@/components/JsonDropzone";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";

// No changes required here since StorageUrl[] aligns with StorageListResponse
interface StorageUrl {
  url: string;
  uploadedAt: Date;
}

export default function AdminUploadsPage() {
  const [storageUrls, setStorageUrls] = useState<StorageUrl[]>([]);
  const [matchedUrls, setMatchedUrls] = useState<string[]>([]);
  const [matchedMetadata, setMatchedMetadata] = useState<Record<string, any>>(
    {}
  );
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<"uploadedAt" | "url">("uploadedAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const limit = 100; // Items per page

  useEffect(() => {
    const fetchStorageUrls = async () => {
      try {
        const response = await fetch(
          `/api/storage/urls?limit=${limit}&offset=${
            (currentPage - 1) * limit
          }&sortBy=${sortBy}&order=${order}`
        );
        const result = await response.json();
        const convertedData = result.data.map(
          (url: { url: string; uploadedAt: string }) => ({
            ...url,
            uploadedAt: new Date(url.uploadedAt),
          })
        );
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
      setMatchedUrls((prev) => [...prev, matchedUrl]);
      setMatchedMetadata((prev) => ({ ...prev, [matchedUrl]: json }));
    }
  };

  const totalPages = useMemo(() => Math.ceil(total / limit), [total, limit]);

  return (
    <SiteGrid
      contentMain={
        <div className="space-y-8">
          <Card className="p-6">
            <h1 className="text-2xl font-bold mb-4">Upload JSON Metadata</h1>
            <JsonDropzone
              onJsonProcessed={handleJsonProcessed}
              storageUrls={storageUrls}
            />
          </Card>

          <Card className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <h2 className="text-xl font-semibold mb-4 sm:mb-0">
                Uploaded Files
              </h2>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <Select
                  value={sortBy}
                  onValueChange={(value) =>
                    setSortBy(value as "uploadedAt" | "url")
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="uploadedAt">Uploaded At</SelectItem>
                    <SelectItem value="url">URL</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={order}
                  onValueChange={(value) => setOrder(value as "asc" | "desc")}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Order" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">Ascending</SelectItem>
                    <SelectItem value="desc">Descending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <StorageUrls
              urls={storageUrls}
              matchedUrls={matchedUrls}
              matchedMetadata={matchedMetadata}
            />

            <Pagination
              className="mt-6"
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </Card>
        </div>
      }
    />
  );
}
