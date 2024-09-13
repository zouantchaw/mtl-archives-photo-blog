"use client";

import AdminChildPage from "@/components/AdminChildPage";
import { PATH_ADMIN_UPLOADS } from "@/site/paths";
import { PhotoFormData } from "./form";
import { Tags } from "@/tag";
import PhotoForm from "./form/PhotoForm";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

interface Metadata {
  name?: string;
  description?: string;
  image?: string;
  external_url?: string;
  attributes?: Array<{ trait_type: string; value: string }>;
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
  const [pending, setIsPending] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState("");
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
        };

        // Set title from metadata
        if (parsedMetadata.name) {
          updatedForm.title = parsedMetadata.name;
          setUpdatedTitle(parsedMetadata.name);
        }

        // Add date if available
        const dateAttribute = parsedMetadata.attributes?.find(
          (attr) => attr.trait_type === "Date"
        );
        if (dateAttribute && "takenAtNaive" in updatedForm) {
          updatedForm.takenAtNaive = dateAttribute.value.toString();
        }

        // Combine description and credits if available
        let combinedDescription = "";
        if (parsedMetadata.description) {
          combinedDescription += parsedMetadata.description;
        }
        const creditsAttribute = parsedMetadata.attributes?.find(
          (attr) => attr.trait_type === "Credits"
        );
        if (creditsAttribute) {
          if (combinedDescription) combinedDescription += "\n\n";
          combinedDescription += `Credits: ${creditsAttribute.value}`;
        }

        // Add combined description if the field exists in PhotoFormData
        if (combinedDescription && "description" in updatedForm) {
          (updatedForm as any).description = combinedDescription;
        }

        // Add other attributes as tags
        const tags = parsedMetadata.attributes
          ?.filter((attr) => !["Date", "Credits"].includes(attr.trait_type))
          .map((attr) => `${attr.trait_type}: ${attr.value}`);

        if (tags && tags.length > 0 && "tags" in updatedForm) {
          updatedForm.tags = tags.join(", ");
        }

        setInitialPhotoForm(updatedForm);
      } catch (error) {
        console.error("Error parsing metadata:", error);
      }
    }
  }, [searchParams, photoFormExif]);

  return (
    <AdminChildPage
      backPath={PATH_ADMIN_UPLOADS}
      backLabel="Uploads"
      breadcrumb={pending && updatedTitle ? updatedTitle : blobId}
      isLoading={pending}
    >
      <PhotoForm
        initialPhotoForm={initialPhotoForm}
        uniqueTags={uniqueTags}
        onTitleChange={setUpdatedTitle}
        onFormStatusChange={setIsPending}
      />
    </AdminChildPage>
  );
}
