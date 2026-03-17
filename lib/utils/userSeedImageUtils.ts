import { supabase } from '../supabase';
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer';

// https://supabase.com/docs/reference/javascript/storage-from-upload
// ** For React Native, upload files using ArrayBuffer from base64 file data, as specified in the Supabase docs

// https://docs.expo.dev/tutorial/image-picker/
// https://docs.expo.dev/versions/v54.0.0/sdk/imagepicker/#imagepickeroptions
// •• ImagePicker options includes a boolean flag for base64 encoding

// https://supabase.com/docs/reference/javascript/storage-from-createsignedurl
// ** Signed URLs are used to access private storage buckets; tokens expire after 1 hour

// TODO: Add permissions handling for iOS and Android
// TODO: Add error handling for image upload

const USER_BUCKET = 'user_seed_images';

export type PickImageResult = { localUri: string; path: string } | null;

// Pick an image from the device and upload to supabase storage bucket. Returns the path of the uploaded image (or null if error)
export async function pickAndUploadImage(userId: string): Promise<string | null> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') return null;

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
    base64: true,
  });

  if (result.canceled) return null;
  const asset = result.assets[0];
  const base64 = asset.base64;
  if (!base64) return null;

  const extension = asset.mimeType?.split('/')[1];
  const uniqueId = Date.now().toString();
  const path = `${userId}/${uniqueId}.${extension}`;

  // Upload the image to the Supabase storage bucket
  const { error } = await supabase.storage.from(USER_BUCKET).upload(path, decode(base64), {
    contentType: `image/${extension}`,
    upsert: false,
  });

  if (error) {
    console.error('Error uploading image to Supabase storage:', error);
    return null;
  }
  return path;
}

// Get a signed URL for a seed image (required for access to private Supabase storage buckets; tokens expire after 1 hour)
export async function getSignedSeedImageUrl(path: string | null | undefined): Promise<string | null> {
  if (!path) return null;
  const { data, error } = await supabase.storage.from(USER_BUCKET).createSignedUrl(path, 60 * 60);
  if (error || !data?.signedUrl) return null;
  return data.signedUrl;
}
