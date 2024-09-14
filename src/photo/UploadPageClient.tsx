"use client";

import AdminChildPage from "@/components/AdminChildPage";
import { PATH_ADMIN_UPLOADS } from "@/site/paths";
import { PhotoFormData } from "./form";
import { Tags } from "@/tag";
import PhotoForm from "./form/PhotoForm";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { toast } from "sonner";

interface Metadata {
  name?: string;
  description?: string;
  image?: string;
  external_url?: string;
  attributes?: Array<{ trait_type: string; value: string | number }>;
}

function generateRandomDateForYear(year: number): Date {
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31);
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

function extractYearFromDateValue(value: string | number): number | null {
  if (typeof value === "number") {
    return value;
  } else if (typeof value === "string") {
    const yearMatch = value.match(/\b\d{4}\b/);
    return yearMatch ? parseInt(yearMatch[0], 10) : null;
  }
  return null;
}

export default function UploadPageClient({
  blobId,
  photoFormExif,
  uniqueTags,
}: {
  blobId?: string;
  photoFormExif: Partial<PhotoFormData>;
  uniqueTags: Tags;
}) {
  const [initialPhotoForm, setInitialPhotoForm] =
    useState<Partial<PhotoFormData>>(photoFormExif);
  const searchParams = useSearchParams();

  useEffect(() => {
    const metadataParam = searchParams.get("metadata");
    if (metadataParam) {
      try {
        const parsedMetadata: Metadata = JSON.parse(
          decodeURIComponent(metadataParam)
        );
        console.log("Parsed metadata:", parsedMetadata);

        const updatedForm: Partial<PhotoFormData> = {
          ...photoFormExif,
          title: parsedMetadata.name || "",
        };

        // Handle date and add year as tag
        const dateAttribute = parsedMetadata.attributes?.find(
          (attr) => attr.trait_type === "Date"
        );
        let yearTag: string | null = null;
        if (dateAttribute && dateAttribute.value !== undefined) {
          const year = extractYearFromDateValue(dateAttribute.value);
          if (year) {
            const randomDate = generateRandomDateForYear(year);
            updatedForm.takenAt = format(
              randomDate,
              "yyyy-MM-dd'T'HH:mm:ssXXX"
            );
            updatedForm.takenAtNaive = format(
              randomDate,
              "yyyy-MM-dd HH:mm:ss"
            );
            yearTag = year.toString();
          }
        }

        // Combine metadata information into tags
        const tags: string[] = [];

        if (parsedMetadata.description) {
          tags.push(`Description: ${parsedMetadata.description}`);
        }

        const creditsAttribute = parsedMetadata.attributes?.find(
          (attr) => attr.trait_type === "Credits"
        );
        if (creditsAttribute) {
          tags.push(`Credits: ${creditsAttribute.value}`);
        }

        // Add other attributes as tags, including the year if available
        parsedMetadata.attributes
          ?.filter((attr) => !["Date", "Credits"].includes(attr.trait_type))
          .forEach((attr) => tags.push(`${attr.trait_type}: ${attr.value}`));

        if (yearTag) {
          tags.push(yearTag);
        }

        if (tags.length > 0) {
          updatedForm.tags = tags.join(", ");
        }

        setInitialPhotoForm(updatedForm);
      } catch (error) {
        console.error("Error parsing metadata:", error);
        toast.error("Failed to parse metadata");
      }
    }
  }, [searchParams, photoFormExif]);

  return (
    <AdminChildPage backPath={PATH_ADMIN_UPLOADS} backLabel="Uploads">
      <PhotoForm
        {...{
          blobId,
          initialPhotoForm,
          uniqueTags,
        }}
      />
    </AdminChildPage>
  );
}
