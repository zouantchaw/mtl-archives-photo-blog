'use client';

import AdminChildPage from '@/components/AdminChildPage';
import { PATH_ADMIN_UPLOADS } from '@/site/paths';
import { PhotoFormData } from './form';
import { Tags } from '@/tag';
import PhotoForm from './form/PhotoForm';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function UploadPageClient({
  blobId,
  photoFormExif,
  uniqueTags,
}: {
  blobId?: string
  photoFormExif: Partial<PhotoFormData>
  uniqueTags: Tags
}) {
  const [pending, setIsPending] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState('');
  const [initialPhotoForm, setInitialPhotoForm] = useState(photoFormExif);
  const searchParams = useSearchParams();

  useEffect(() => {
    const metadataParam = searchParams.get('metadata');
    console.log('metadataParam', metadataParam);
    if (metadataParam) {
      try {
        const parsedMetadata = JSON.parse(decodeURIComponent(metadataParam));
        setInitialPhotoForm({ ...photoFormExif, ...parsedMetadata });
      } catch (error) {
        console.error('Error parsing metadata:', error);
      }
    }
  }, [searchParams, photoFormExif]);

  return (
    <AdminChildPage
      backPath={PATH_ADMIN_UPLOADS}
      backLabel="Uploads"
      breadcrumb={pending && updatedTitle
        ? updatedTitle
        : blobId}
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