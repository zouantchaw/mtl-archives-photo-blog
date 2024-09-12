import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Loader2, Upload, CheckCircle, XCircle } from "lucide-react";

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
  const [stats, setStats] = useState({ processed: 0, matched: 0, failed: 0 });
  const [isProcessing, setIsProcessing] = useState(false);

  const findMatchingUrl = (jsonFileName: string): string | null => {
    // Extract the number from the JSON file name
    const jsonNumber = jsonFileName.match(/\d+/)?.[0];
    if (!jsonNumber) return null;

    // Find a matching URL based on the extracted number
    const matchedUrl =
      storageUrls.find(({ url }) => {
        const urlParts = url.split("/");
        const fileName = urlParts[urlParts.length - 1];
        return fileName.includes(jsonNumber);
      })?.url || null;

    return matchedUrl;
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setIsProcessing(true);
      let processed = 0;
      let matched = 0;
      let failed = 0;

      acceptedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const text = e.target?.result as string;
          try {
            const json: JsonFile = JSON.parse(text);
            const matchedUrl = findMatchingUrl(file.name);
            onJsonProcessed(json, matchedUrl);
            processed++;
            if (matchedUrl) matched++;
            else failed++;
          } catch (error) {
            console.error("Error processing JSON file:", error);
            failed++;
          }

          if (processed === acceptedFiles.length) {
            setStats({ processed, matched, failed });
            setIsProcessing(false);
          }
        };
        reader.readAsText(file);
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
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        {isDragActive ? (
          <p className="mt-2 text-sm text-gray-600">
            Drop the JSON files here ...
          </p>
        ) : (
          <p className="mt-2 text-sm text-gray-600">
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
