// AFROPULSE SUPABASE MULTI-MEDIA UPLOAD ENGINE
// Linked Tables: music, videos
// Linked Storage Buckets: music_files, cover_art, video_files

import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_URL) ||
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_URL) ||
  'https://your-supabase-project.supabase.co';

const supabaseAnonKey =
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_ANON_KEY) ||
  'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 1. Upload Function for Audio Tracks and Beats
export async function uploadAudioTrack(trackData: {
  title: string;
  artist: string;
  genre: string;
  trackType: 'song' | 'beat';
  audioFile: File;
  coverFile: File;
}) {
  const audioName = `audio-${Date.now()}-${trackData.audioFile.name}`;
  const { error: audioError } = await supabase.storage
    .from('music_files')
    .upload(audioName, trackData.audioFile);

  if (audioError) throw audioError;

  const { data: audioUrlData } = supabase.storage
    .from('music_files')
    .getPublicUrl(audioName);

  const coverName = `cover-${Date.now()}-${trackData.coverFile.name}`;
  const { error: coverError } = await supabase.storage
    .from('cover_art')
    .upload(coverName, trackData.coverFile);

  if (coverError) throw coverError;

  const { data: coverUrlData } = supabase.storage
    .from('cover_art')
    .getPublicUrl(coverName);

  const { data, error: dbError } = await supabase
    .from('music')
    .insert([
      {
        title: trackData.title,
        artist: trackData.artist,
        genre: trackData.genre,
        track_type: trackData.trackType,
        audio_url: audioUrlData.publicUrl,
        cover_url: coverUrlData.publicUrl,
        is_featured: false
      }
    ]);

  if (dbError) throw dbError;
  return data;
}

// 2. Upload Function for Videos, Movies & YouTube Premieres
export async function uploadVideoContent(videoData: {
  title: string;
  artist: string;
  category: 'music_video' | 'movie_premiere';
  youtubeUrl?: string; // Optional YouTube embed link for premieres
  videoFile?: File;    // Optional direct file upload if needed
  thumbnailFile: File;
}) {
  let finalVideoUrl = videoData.youtubeUrl || '';

  // If a direct video file was uploaded instead of a YouTube link, push to storage
  if (videoData.videoFile) {
    const videoFileName = `video-${Date.now()}-${videoData.videoFile.name}`;
    const { error: videoError } = await supabase.storage
      .from('video_files')
      .upload(videoFileName, videoData.videoFile);

    if (videoError) throw videoError;

    const { data: videoUrlData } = supabase.storage
      .from('video_files')
      .getPublicUrl(videoFileName);

    finalVideoUrl = videoUrlData.publicUrl;
  }

  // Upload Thumbnail Image
  const thumbName = `thumb-${Date.now()}-${videoData.thumbnailFile.name}`;
  const { error: thumbError } = await supabase.storage
    .from('cover_art')
    .upload(thumbName, videoData.thumbnailFile);

  if (thumbError) throw thumbError;

  const { data: thumbUrlData } = supabase.storage
    .from('cover_art')
    .getPublicUrl(thumbName);

  // Save Record into 'videos' Database Table
  const { data, error: dbError } = await supabase
    .from('videos')
    .insert([
      {
        title: videoData.title,
        artist: videoData.artist,
        category: videoData.category,
        video_url: videoData.videoFile ? finalVideoUrl : null,
        youtube_url: videoData.youtubeUrl || null,
        thumbnail_url: thumbUrlData.publicUrl
      }
    ]);

  if (dbError) throw dbError;
  return data;
}

// 3. Helper to upload raw file to any bucket and get public URL
export async function uploadStorageAsset(
  bucket: 'music_files' | 'cover_art' | 'video_files',
  file: File
): Promise<string> {
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const fileName = `${bucket.replace('_', '-')}-${Date.now()}-${sanitizedName}`;

  const { error: uploadError } = await supabase.storage.from(bucket).upload(fileName, file);
  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(fileName);
  return urlData.publicUrl;
}

// 4. Fetch all music records from Supabase
export async function fetchSupabaseMusic() {
  const { data, error } = await supabase
    .from('music')
    .select('*')
    .order('id', { ascending: false });
  if (error) throw error;
  return data || [];
}

// 5. Fetch all video records from Supabase
export async function fetchSupabaseVideos() {
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .order('id', { ascending: false });
  if (error) throw error;
  return data || [];
}

// 6. Update record in Supabase ('music' or 'videos')
export async function updateSupabaseRecord(
  table: 'music' | 'videos',
  id: string | number,
  updates: Record<string, any>
) {
  const { data, error } = await supabase
    .from(table)
    .update(updates)
    .eq('id', id)
    .select();
  if (error) throw error;
  return data;
}

// 7. Delete record from Supabase ('music' or 'videos')
export async function deleteSupabaseRecord(
  table: 'music' | 'videos',
  id: string | number
) {
  const { data, error } = await supabase
    .from(table)
    .delete()
    .eq('id', id);
  if (error) throw error;
  return data;
}
