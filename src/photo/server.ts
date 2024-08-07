import {
  getExtensionFromStorageUrl,
  getIdFromStorageUrl,
} from '@/services/storage';
import { convertExifToFormData } from '@/photo/form';
import {
  getFujifilmSimulationFromMakerNote,
  isExifForFujifilm,
} from '@/vendors/fujifilm';
import { ExifData, ExifParserFactory } from 'ts-exif-parser';
import { PhotoFormData } from './form';
import { FilmSimulation } from '@/simulation';

export const extractExifDataFromBlobPath = async (
  blobPath: string
): Promise<{
  blobId?: string
  photoFormExif?: Partial<PhotoFormData>
}> => {
  const url = decodeURIComponent(blobPath);

  const blobId = getIdFromStorageUrl(url);
  const extension = getExtensionFromStorageUrl(url);

  let fileBytes: ArrayBuffer | undefined;
  try {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    fileBytes = await response.arrayBuffer();
  } catch (error) {
    console.error('Error fetching file:', error);
    return { blobId };
  }

  let exifData: ExifData | undefined;
  let filmSimulation: FilmSimulation | undefined;

  if (fileBytes) {
    const parser = ExifParserFactory.create(Buffer.from(fileBytes));

    // Data for form
    parser.enableBinaryFields(false);
    exifData = parser.parse();

    // Capture film simulation for Fujifilm cameras
    if (isExifForFujifilm(exifData)) {
      // Parse exif data again with binary fields
      // in order to access MakerNote tag
      parser.enableBinaryFields(true);
      const exifDataBinary = parser.parse();
      const makerNote = exifDataBinary.tags?.MakerNote;
      if (Buffer.isBuffer(makerNote)) {
        filmSimulation = getFujifilmSimulationFromMakerNote(makerNote);
      }
    }
  }

  return {
    blobId,
    ...exifData && {
      photoFormExif: {
        ...convertExifToFormData(exifData, filmSimulation),
        extension,
        url,
      },
    },
  };
};