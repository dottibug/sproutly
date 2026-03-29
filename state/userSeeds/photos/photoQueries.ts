import { supabase } from '../../app/supabase';
import { decode } from 'base64-arraybuffer';
import { UserSeedPhoto } from './photoTypes';
import { UserSeed } from '../seeds/seedTypes';
import { buildUserSeedPhoto } from './photoUtils';

// https://supabase.com/docs/reference/javascript/storage-from-upload
// ** For React Native, upload files using ArrayBuffer from base64 file data, as specified in the Supabase docs

// https://docs.expo.dev/tutorial/image-picker/
// https://docs.expo.dev/versions/v54.0.0/sdk/imagepicker/#imagepickeroptions
// •• ImagePicker options includes a boolean flag for base64 encoding

// https://supabase.com/docs/reference/javascript/storage-from-createsignedurl
// ** Signed URLs are used to access private storage buckets; tokens expire after 1 hour

const USER_BUCKET = 'user_seed_images';

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
export async function getSignedImageUrl(path: string): Promise<string> {
  if (!path) return '';
  if (path.startsWith('http')) return path;

  const { data, error } = await supabase.storage.from(USER_BUCKET).createSignedUrl(path, 60 * 60);

  if (error) {
    console.log('createSignedUrl error', { path, error });
    return '';
  }

  if (!data?.signedUrl) {
    console.log('createSignedUrl missing signedUrl', { path, data });
    return 'null';
  }
  return data.signedUrl;
}

// Delete a seed image from supabase storage bucket
export async function deleteSeedImage(path: string): Promise<void> {
  const { error } = await supabase.storage.from(USER_BUCKET).remove([path]);
  if (error) throw error;
}

// Insert a new photo into the user_seed_photos table
export async function insertPhoto(userId: string, userSeedId: string, imagePath: string): Promise<UserSeedPhoto> {
  const { data, error } = await supabase
    .from('user_seed_photos')
    .insert({
      user_id: userId,
      user_seed_id: userSeedId,
      image_url: imagePath,
    })
    .select('id, user_seed_id, user_id, image_url, created_at')
    .single();

  if (error) throw error;

  return buildUserSeedPhoto(data.id, data.user_id, data.user_seed_id, data.image_url, data.created_at);
}

// Delete a photo row from user_seed_photos table
export async function deletePhoto(userId: string, photoId: string): Promise<void> {
  const { error } = await supabase.from('user_seed_photos').delete().eq('id', photoId).eq('user_id', userId);
  if (error) throw error;
}

// Fetch photos associated with the seeds in a user's collection
export async function fetchPhotosByUserSeedId(userSeedIds: string[]): Promise<UserSeedPhoto[]> {
  if (userSeedIds.length === 0) return [];

  const { data, error } = await supabase
    .from('user_seed_photos')
    .select('id, user_seed_id, user_id, image_url, created_at')
    .in('user_seed_id', userSeedIds)
    .order('created_at', { ascending: false });

  if (error) throw error;

  const photos = data?.map((photo) => buildUserSeedPhoto(photo.id, photo.user_id, photo.user_seed_id, photo.image_url, photo.created_at));

  return photos ?? ([] as UserSeedPhoto[]);
}

// Get signed URLs for the photos in a seed
export async function signPhotos(seed: UserSeed): Promise<UserSeed> {
  // Get signed URLs for any photos attached to a seed
  const photos = await Promise.all(
    seed.photos.map(async (photo) => ({
      ...photo,
      imageUri: await getSignedImageUrl(photo.imageUri),
    })),
  );

  // Get the signed URL for any custom seed images
  let image = seed.image;
  if (seed.customSeedId !== null && seed.image) {
    image = await getSignedImageUrl(seed.image);
  }

  return {
    ...seed,
    image,
    photos,
  };
}
