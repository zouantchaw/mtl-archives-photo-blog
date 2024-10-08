'use client';

import AdminChildPage from '@/components/AdminChildPage';
import { Photo } from '.';
import { PATH_ADMIN_PHOTOS } from '@/site/paths';
import SubmitButtonWithStatus from '@/components/SubmitButtonWithStatus';
import { PhotoFormData, convertPhotoToFormData } from './form';
import PhotoForm from './form/PhotoForm';
import { useFormState } from 'react-dom';
import { areSimpleObjectsEqual } from '@/utility/object';
import IconGrSync from '@/site/IconGrSync';
import { getExifDataAction } from './actions';
import { Tags } from '@/tag';
import { useState, useEffect } from 'react';

export default function PhotoEditPageClient({
  photo,
  uniqueTags,
}: {
  photo: Photo
  uniqueTags?: Tags
}) {
  const seedExifData = { url: photo.url };

  const [updatedExifData, action] = useFormState<Partial<PhotoFormData>>(
    getExifDataAction,
    seedExifData,
  );

  const [pending, setIsPending] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(photo.title || '');
  const [formData, setFormData] = useState<PhotoFormData>(convertPhotoToFormData(photo));

  useEffect(() => {
    setFormData(prevData => ({
      ...prevData,
      title: updatedTitle,
    }));
  }, [updatedTitle]);

  const hasExifDataBeenFound = !areSimpleObjectsEqual(
    updatedExifData,
    seedExifData,
  );

  return (
    <AdminChildPage
      backPath={PATH_ADMIN_PHOTOS}
      backLabel="Photos"
      breadcrumb={pending && updatedTitle
        ? updatedTitle
        : photo.title || photo.id}
      accessory={
        <form action={action}>
          <input name="photoUrl" value={photo.url} hidden readOnly />
          <SubmitButtonWithStatus
            icon={<IconGrSync
              className="translate-y-[-1px] sm:mr-[4px]"
            />}
          >
            EXIF
          </SubmitButtonWithStatus>
        </form>}
      isLoading={pending}
    >
      <PhotoForm
        type="edit"
        initialPhotoForm={formData}
        updatedExifData={hasExifDataBeenFound
          ? updatedExifData
          : undefined}
        uniqueTags={uniqueTags}
        onTitleChange={setUpdatedTitle}
        onFormStatusChange={setIsPending}
      />
    </AdminChildPage>
  );
};
