import React from 'react';
import { Play, Pause, Download } from 'lucide-react';
import { PostItem } from '../types';
import { convertGoogleDriveLink } from '../supabase';

interface PostCardProps {
  post: PostItem;
  onSelect: (post: PostItem) => void;
  onPlay?: (post: PostItem) => void;
  onDownload?: (post: PostItem) => void;
  isPlaying?: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onSelect,
  onPlay,
  onDownload,
  isPlaying = false,
}) => {
  const cat = (post.category || 'music').toLowerCase().trim();
  const isAudio = cat === 'audio' || cat === 'music';
  const isBeats = cat === 'beats' || cat === 'beat';
  const processedAudioUrl = convertGoogleDriveLink(post.audio_url || post.audioUrl || '');
  const canPlay = (isAudio || isBeats) && Boolean(processedAudioUrl) && processedAudioUrl.startsWith('http');

  // Resolves remote R2 cover art from all possible database column names
  const artworkSrc = post.cover_art || post.image_url || post.cover_url || post.cover || '';

  return (
    <div
      onClick={() => onSelect(post)}
      className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 bg-stone-900/90 rounded-xl border border-stone-800/80 hover:border-amber-500/50 transition shadow-sm cursor-pointer w-full mb-3"
    >
      {/* Top Header Row on Mobile / Left Column on Desktop */}
      <div className="flex items-center gap-4 w-full md:w-auto shrink-0">
        {/* Cover Artwork */}
        <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden relative border border-stone-800 bg-stone-950">
          {artworkSrc ? (
            <img
              src={artworkSrc}
              alt={post.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-stone-600 text-[10px] uppercase font-bold">
              No Art
            </div>
          )}
        </div>

        {/* Action Buttons for Mobile Screen */}
        <div className="flex md:hidden items-center gap-2 ml-auto shrink-0">
          {canPlay && onPlay && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPlay({ ...post, audio_url: processedAudioUrl });
              }}
              className="p-2.5 bg-stone-800 hover:bg-stone-700 text-amber-400 rounded-lg border border-stone-700 transition"
              title="Stream / Play Track"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-amber-400" />
              ) : (
                <Play className="w-4 h-4 fill-amber-400 ml-0.5" />
              )}
            </button>
          )}

          {canPlay && (
            <a
              href={processedAudioUrl}
              download={`${(post.title || 'afropulse_track').replace(/[^a-z0-9]/gi, '_')}.mp3`}
              onClick={(e) => {
                if (onDownload) {
                  e.stopPropagation();
                  e.preventDefault();
                  onDownload({ ...post, audio_url: processedAudioUrl });
                }
              }}
              className="p-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg shadow font-bold cursor-pointer transition"
              title="Download MP3"
            >
              <Download className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      {/* Main Content & Expanded Titles Container */}
      <div className="flex flex-col flex-1 min-w-0 space-y-1.5 w-full">
        {/* Category & Genre Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
              isAudio
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'news' === cat
                ? 'bg-amber-500/20 text-amber-400'
                : isBeats
                ? 'bg-cyan-500/20 text-cyan-400'
                : 'bg-blue-500/20 text-blue-400'
            }`}
          >
            {post.category?.toUpperCase() || 'MUSIC'}
          </span>
          {post.genre && (
            <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-stone-800 text-stone-300 uppercase font-mono">
              {post.genre}
            </span>
          )}
          {post.date && <span className="text-[10px] text-stone-400">{post.date}</span>}
        </div>

        {/* Post Title - Full Width & Bold Text */}
        <h4 className="text-base md:text-lg font-bold text-white break-words whitespace-normal leading-snug w-full">
          {post.title}
        </h4>

        {/* Artist & Featured Artist Names */}
        {post.artist && (
          <div className="flex items-center gap-1.5 text-xs text-stone-400 flex-wrap">
            <span className="text-amber-400 font-bold">{post.artist}</span>
            {post.featured_artist && post.featured_artist.trim() !== '' && (
              <span className="text-stone-300 font-medium">ft. {post.featured_artist}</span>
            )}
          </div>
        )}

        {/* Content Preview */}
        {(post.content || post.description || post.body) && (
          <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
            {post.content || post.description || post.body}
          </p>
        )}
      </div>

      {/* Desktop Action Buttons */}
      <div className="hidden md:flex shrink-0 items-center gap-2 ml-auto">
        {canPlay && onPlay && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlay({ ...post, audio_url: processedAudioUrl });
            }}
            className="p-2.5 bg-stone-800 hover:bg-stone-700 text-amber-400 rounded-lg border border-stone-700 transition"
            title="Stream / Play Track"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-amber-400" />
            ) : (
              <Play className="w-4 h-4 fill-amber-400 ml-0.5" />
            )}
          </button>
        )}

        {canPlay && (
          <a
            href={processedAudioUrl}
            download={`${(post.title || 'afropulse_track').replace(/[^a-z0-9]/gi, '_')}.mp3`}
            onClick={(e) => {
              if (onDownload) {
                e.stopPropagation();
                e.preventDefault();
                onDownload({ ...post, audio_url: processedAudioUrl });
              }
            }}
            className="p-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg shadow font-bold cursor-pointer transition"
            title="Download MP3"
          >
            <Download className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
};
