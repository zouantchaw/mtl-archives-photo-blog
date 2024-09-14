"use client";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Loader2, Upload, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

interface JsonFile {
  name: string;
  description: string;
  image: string;
  external_url: string;
  attributes: Array<{ trait_type: string; value: string }>;
}

interface Props {
  onJsonProcessed: (jsonData: JsonFile, matchedUrl: string | null) => void;
  storageUrls: Array<{ url: string; uploadedAt: Date }>;
}

export default function JsonDropzone({ onJsonProcessed, storageUrls }: Props) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [stats, setStats] = useState({ processed: 0, matched: 0, failed: 0 });

  const findMatchingUrl = (jsonFileName: string): string | null => {
    console.log(`\nProcessing JSON file: ${jsonFileName}`);
    const jsonNumber = jsonFileName.match(/\d+/)?.[0];
    console.log(`Extracted number: ${jsonNumber}`);

    if (!jsonNumber) {
      console.log("No number found in JSON filename");
      return null;
    }

    console.log("Attempting to match with storage URLs:");
    for (const { url } of storageUrls) {
      const urlParts = url.split("/");
      const fileName = urlParts[urlParts.length - 1];
      console.log(`  Checking URL: ${url}`);
      console.log(`    File name: ${fileName}`);
      if (fileName.includes(`_${jsonNumber}.`)) {
        console.log(`    Match found!`);
        return url;
      }
    }

    console.log("No match found for this JSON file");
    return null;
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setIsProcessing(true);
      let processed = 0;
      let matched = 0;
      let failed = 0;

      console.log(`\nStarting to process ${acceptedFiles.length} files`);
      console.log(`Available storage URLs: ${storageUrls.length}`);

      const processFile = async (file: File) => {
        const reader = new FileReader();
        return new Promise<void>((resolve) => {
          reader.onload = async (e) => {
            const text = e.target?.result as string;
            try {
              const json: JsonFile = JSON.parse(text);
              const matchedUrl = findMatchingUrl(file.name);
              console.log(`File ${file.name}:`);
              console.log(`  Parsed JSON:`, json);
              console.log(`  Matched URL: ${matchedUrl || "None"}`);
              onJsonProcessed(json, matchedUrl);
              processed++;
              if (matchedUrl) matched++;
              else failed++;
            } catch (error) {
              console.error(`Error processing JSON file ${file.name}:`, error);
              failed++;
            }
            resolve();
          };
          reader.readAsText(file);
        });
      };

      Promise.all(acceptedFiles.map(processFile)).then(() => {
        setStats({ processed, matched, failed });
        setIsProcessing(false);
        console.log(`\nProcessing complete:`);
        console.log(`  Processed: ${processed}`);
        console.log(`  Matched: ${matched}`);
        console.log(`  Failed: ${failed}`);
        toast.success(
          `Processed ${processed} files, ${matched} matched, ${failed} failed`
        );
      });
    },
    [onJsonProcessed, storageUrls]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/json": [".json"] },
    multiple: true,
  });

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
            : "border-gray-300 hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-600"
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
        {isDragActive ? (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Drop the JSON files here ...
          </p>
        ) : (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Drag &apos;n&apos; drop some JSON files here, or click to select
            files
          </p>
        )}
      </div>
      {isProcessing && (
        <div className="mt-4 flex items-center justify-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <p>Processing...</p>
        </div>
      )}
      {stats.processed > 0 && (
        <div className="mt-4 space-y-2">
          <p className="font-semibold">Results:</p>
          <div className="flex items-center">
            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
            <p>Matched: {stats.matched} files</p>
          </div>
          <div className="flex items-center">
            <XCircle className="mr-2 h-4 w-4 text-red-500" />
            <p>Failed to match: {stats.failed} files</p>
          </div>
        </div>
      )}
    </div>
  );
}
