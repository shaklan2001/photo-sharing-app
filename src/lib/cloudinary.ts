import { Cloudinary } from '@cloudinary/url-gen';

export const cloudinary = new Cloudinary({
  cloud: {
    cloudName: process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  },
});

export interface UploadResponse {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
}

export const uploadToCloudinary = async (
  file: string
): Promise<UploadResponse> => {
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