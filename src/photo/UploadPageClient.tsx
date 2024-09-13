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
    console.log("metadataParam", metadataParam);
    if (metadataParam) {
      try {
        const parsedMetadata: Metadata = JSON.parse(decodeURIComponent(metadataParam));
        const updatedForm: Partial<PhotoFormData> = {
          ...photoFormExif,
          title: parsedMetadata.name || photoFormExif.title,
          tags:
            parsedMetadata.attributes
              ?.filter(
                (attr) =>
                  attr.trait_type !== "Date" && attr.trait_type !== "Credits"
              )
              .map((attr) => attr.value)
              .join(", ") || photoFormExif.tags,
        };

        // Add date if available
        const dateAttribute = parsedMetadata.attributes?.find(
          (attr) => attr.trait_type === "Date"
        );
        if (dateAttribute) {
          updatedForm.takenAtNaive = dateAttribute.value;
        }

        setInitialPhotoForm(updatedForm);
        setUpdatedTitle(updatedForm.title || "");
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
