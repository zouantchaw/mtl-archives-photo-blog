import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

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
  const [stats, setStats] = useState({ processed: 0, matched: 0 });
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setIsProcessing(true);
    let processed = 0;
    let matched = 0;

    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result as string;
        try {
          const json: JsonFile = JSON.parse(text);
          const ipfsId = json.image.split('/').pop()?.split('.')[0] || '';
          const matchedUrl = storageUrls.find(({ url }) => url.includes(ipfsId))?.url || null;
          onJsonProcessed(json, matchedUrl);
          processed++;
          if (matchedUrl) matched++;
        } catch (error) {
          console.error('Error processing JSON file:', error);
        }
        
        if (processed === acceptedFiles.length) {
          setStats({ processed, matched });
          setIsProcessing(false);
        }
      };
      reader.readAsText(file);
    });
  }, [onJsonProcessed, storageUrls]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'application/json': ['.json'] } });

  return (
    <div {...getRootProps()} className="border-2 border-dashed p-4 text-center cursor-pointer">
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the JSON files here ...</p>
      ) : (
        <p>Drag 'n' drop some JSON files here, or click to select files</p>
      )}
      {isProcessing && <p>Processing...</p>}
      {stats.processed > 0 && (
        <div className="mt-4">
          <p>Processed: {stats.processed} files</p>
          <p>Matched: {stats.matched} files</p>
        </div>
      )}
    </div>
  );
}