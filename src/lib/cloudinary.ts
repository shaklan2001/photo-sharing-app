import { Cloudinary } from '@cloudinary/url-gen';
import { Platform } from 'react-native';

const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;

if (!cloudName) {
  throw new Error('Missing Cloudinary cloud name. Please check your .env file.');
}

export const cloudinary = new Cloudinary({
  cloud: {
    cloudName,
    ...(Platform.OS === 'android' && {
      secure: true,
      cdnSubdomain: true,
    }),
  },
  url: {
    secure: true,
    cname: undefined,
  },
});

export interface UploadApiResponse {
  public_id: string;
  version: number;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  access_mode: string;
  original_filename: string;
}

export const uploadToCloudinary = async (
  file: string
): Promise<UploadApiResponse> => {
  const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = 'Photoshare';
  
  const formData = new FormData();
  formData.append('file', {
    uri: file,
    type: 'image/jpeg',
    name: 'photo.jpg',
  } as any);
  formData.append('upload_preset', uploadPreset);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};