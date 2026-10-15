import React from 'react';
import { Play, Pause, Download } from 'lucide-react';
import { PostItem } from '../types';

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
  const isNews = cat === 'news' || cat === 'gossip';
  const isBeats = cat === 'beats' || cat === 'beat';

  // Strictly use post.image_url first without fallback to local mock images
  const artworkSrc = post.image_url || post.cover || '';

  return (
    <div
      onClick={() => onSelect(post)}
      className="flex items-center gap-4 p-3.5 bg-stone-900/90 rounded-xl border border-stone-800/80 hover:border-amber-500/50 transition shadow-sm cursor-pointer"
    >
      {/* 2. COVER ARTWORK DISPLAY: Set strictly to post.image_url */}
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

      <div className="flex-1 min-w-0 space-y-1">
        {/* Category & Genre Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
              isAudio
                ? 'bg-emerald-500/20 text-emerald-400'
                : isNews
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
          <span className="text-[10px] text-stone-400">{post.date}</span>
          <span className="text-[10px] text-stone-500">
            • {post.downloads || post.views || '14.2K'} views
          </span>
        </div>

        {/* Post Title */}
        <h4 className="text-sm md:text-base font-semibold text-white line-clamp-2 leading-snug">
          {post.title}
        </h4>

        {/* 1. ARTIST & FEATURED ARTIST NAMES: Explicitly post.artist, NEVER post.title */}
        <div className="flex items-center gap-1.5 text-xs text-stone-400 flex-wrap">
          <span className="text-amber-400 font-semibold">{post.artist || 'AfroPulse Artist'}</span>
          {post.featured_artist && post.featured_artist.trim() !== '' && (
            <span className="text-stone-400 font-medium">ft. {post.featured_artist}</span>
          )}
        </div>

        {/* 5. TEXT FORMATTING & LINE BREAKS: style={{ whiteSpace: 'pre-wrap' }} */}
        <p
          className="text-xs text-stone-400 line-clamp-1"
          style={{ whiteSpace: 'pre-wrap' }}
        >
          {post.content || post.description || post.body}
        </p>
      </div>

      {/* Action Buttons: Play/Stream & Direct Download */}
      <div className="shrink-0 flex items-center gap-2">
        {post.audio_url && onPlay && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlay(post);
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

        {/* 3. AUDIO PLAYER, STREAMING & MP3 DOWNLOADS: direct href to post.audio_url */}
        {post.audio_url && (
          <a
            href={post.audio_url}
            download={`${(post.title || 'afropulse_track').replace(/[^a-z0-9]/gi, '_')}.mp3`}
            onClick={(e) => {
              if (onDownload) {
                e.stopPropagation();
                e.preventDefault();
                onDownload(post);
              }
            }}
            className="p-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg shadow font-bold cursor-pointer transition"
            title="Download MP3"
          >
            <Download className="w-4 h-4" />
          </a>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(post);
          }}
          className="px-3.5 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg shadow transition"
        >
          View Post →
        </button>
      </div>
    </div>
  );
};
export default PostCard;
