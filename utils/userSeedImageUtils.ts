import { supabase } from './supabase';
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer';
import { PreviewImage } from './types';

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

// Pick an image from the device and return the local URI and path
export async function pickImage(): Promise<PreviewImage | null> {
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
  if (!asset?.base64) {
    console.log('Picked image missing base64 data');
    return null;
  }

  return {
    uri: asset.uri,
    mimeType: asset.mimeType,
    base64: asset.base64,
  };
}

// Upload an image to supabase storage bucket. Returns the path of the uploaded image (or null if error)
export async function uploadImage(userId: string, mimeType: string | undefined, base64: string | null | undefined): Promise<string | null> {
  if (!mimeType || !base64) return null;

  const extension = mimeType.split('/')[1];
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

  if (error) {
    console.log('createSignedUrl error', { path, error });
    return null;
  }

  if (!data?.signedUrl) {
    console.log('createSignedUrl missing signedUrl', { path, data });
    return null;
  }
  return data.signedUrl;
}

// Delete a seed image from supabase storage bucket
export async function deleteSeedImage(path: string): Promise<void> {
  const { error } = await supabase.storage.from(USER_BUCKET).remove([path]);
  if (error) throw error;
}
