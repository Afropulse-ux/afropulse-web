import React from 'react';
import { Play, Pause, Download, Flame, FileText } from 'lucide-react';
import { PostItem } from '../types';

interface FeaturedBannerProps {
  post: PostItem;
  isPlaying: boolean;
  onPlay: (post: PostItem) => void;
  onDownload: (post: PostItem) => void;
  onSelect: (post: PostItem) => void;
}

export const FeaturedBanner: React.FC<FeaturedBannerProps> = ({
  post,
  isPlaying,
  onPlay,
  onDownload,
  onSelect,
}) => {
  // 2. COVER ARTWORK DISPLAY: Set strictly to post.image_url
  const artworkSrc = post.image_url || post.cover || '';

  return (
    <div className="bg-gradient-to-r from-stone-900 via-stone-900 to-amber-950/40 border border-stone-800 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Artwork Banner Container */}
      <div
        onClick={() => onSelect(post)}
        className="w-32 h-32 md:w-44 md:h-44 shrink-0 rounded-xl overflow-hidden relative shadow-xl border border-stone-700 cursor-pointer group bg-stone-950"
      >
        {artworkSrc ? (
          <img
            src={artworkSrc}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-600 text-xs font-bold uppercase">
            No Art
          </div>
        )}
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlay(post);
            }}
            className="w-12 h-12 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 flex items-center justify-center shadow-lg transition-transform hover:scale-110"
            title="Stream / Play Audio"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-stone-950" />
            ) : (
              <Play className="w-6 h-6 fill-stone-950 ml-0.5" />
            )}
          </button>
        </div>
      </div>

      {/* Details Container */}
      <div className="flex-1 space-y-3 text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-2">
          <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-amber-500 text-stone-950 uppercase tracking-widest flex items-center gap-1">
            <Flame className="w-3 h-3 fill-stone-950" /> #1 Featured Trending Song
          </span>
          <span className="text-xs text-stone-400">{post.date}</span>
        </div>

        {/* Title */}
        <h2
          onClick={() => onSelect(post)}
          className="text-2xl md:text-3xl font-black text-white tracking-tight cursor-pointer hover:text-amber-400 transition"
        >
          {post.title}
        </h2>

        {/* 1. ARTIST & FEATURED ARTIST NAMES: MUST explicitly render post.artist, NOT post.title */}
        <div className="flex items-center justify-center md:justify-start gap-1.5 flex-wrap">
          <p className="text-sm font-semibold text-amber-400">{post.artist || 'AfroPulse Artist'}</p>
          {post.featured_artist && post.featured_artist.trim() !== '' && (
            <span className="text-xs text-stone-400 font-medium">ft. {post.featured_artist}</span>
          )}
          {post.genre && (
            <span className="text-[10px] bg-stone-800 text-stone-300 font-mono px-2 py-0.5 rounded">
              {post.genre}
            </span>
          )}
        </div>

        {/* 5. TEXT FORMATTING & LINE BREAKS: style={{ whiteSpace: 'pre-wrap' }} */}
        <p
          className="text-xs text-stone-300 line-clamp-2 max-w-2xl"
          style={{ whiteSpace: 'pre-wrap' }}
        >
          {post.content || post.description || post.body}
        </p>

        {/* 3. AUDIO PLAYER, STREAMING & MP3 DOWNLOADS */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
          <button
            onClick={() => onPlay(post)}
            className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg transition-all"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-stone-950" />
            ) : (
              <Play className="w-4 h-4 fill-stone-950" />
            )}
            Stream / Play Audio
          </button>

          {post.audio_url && (
            <a
              href={post.audio_url}
              download={`${(post.title || 'afropulse_track').replace(/[^a-z0-9]/gi, '_')}.mp3`}
              onClick={(e) => {
                e.preventDefault();
                onDownload(post);
              }}
              className="bg-stone-800 hover:bg-stone-700 text-amber-400 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all border border-stone-700 cursor-pointer"
            >
              <Download className="w-4 h-4" /> Download MP3
            </a>
          )}

          <button
            onClick={() => onSelect(post)}
            className="bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all border border-stone-700"
          >
            <FileText className="w-4 h-4 text-amber-400" /> View Post / Read Story
          </button>
        </div>
      </div>
    </div>
  );
};
export default FeaturedBanner;
