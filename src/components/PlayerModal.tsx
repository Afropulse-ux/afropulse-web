import React from 'react';
import { Play, Pause, Download, X } from 'lucide-react';
import { PostItem } from '../types';

interface PlayerModalProps {
  track: PostItem | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onDownload: (track: PostItem) => void;
  onClose: () => void;
  onSelectPost?: (track: PostItem) => void;
}

export const PlayerModal: React.FC<PlayerModalProps> = ({
  track,
  isPlaying,
  onTogglePlay,
  onDownload,
  onClose,
  onSelectPost,
}) => {
  if (!track) return null;

  // 2. COVER ARTWORK DISPLAY: Set strictly to track.image_url
  const artworkSrc = track.image_url || track.cover || '';

  return (
    <aside
      aria-label="Audio Streaming Player"
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:w-96 z-50 bg-stone-900/95 backdrop-blur-md border border-amber-500/40 rounded-2xl p-3.5 shadow-2xl flex items-center gap-3"
    >
      {/* Artwork */}
      {artworkSrc && (
        <img
          src={artworkSrc}
          alt={track.title}
          onClick={() => onSelectPost && onSelectPost(track)}
          className="w-12 h-12 rounded-xl object-cover shrink-0 border border-stone-800 cursor-pointer"
        />
      )}

      {/* Track & Artist Info */}
      <div
        className="flex-1 min-w-0 cursor-pointer"
        onClick={() => onSelectPost && onSelectPost(track)}
      >
        <h5 className="text-xs font-bold text-white truncate">{track.title}</h5>
        {/* 1. ARTIST & FEATURED ARTIST NAMES: explicitly track.artist, NOT track.title */}
        <p className="text-[10px] text-amber-400 font-medium truncate">
          <span>{track.artist || 'AfroPulse Artist'}</span>
          {track.featured_artist && track.featured_artist.trim() !== '' && (
            <span className="text-stone-400 ml-1">ft. {track.featured_artist}</span>
          )}
        </p>
      </div>

      {/* Stream / Play Button */}
      <button
        onClick={onTogglePlay}
        className="w-9 h-9 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 flex items-center justify-center shrink-0 shadow transition-transform hover:scale-105"
        title={isPlaying ? 'Pause' : 'Stream / Play Audio'}
      >
        {isPlaying ? (
          <Pause className="w-4 h-4 fill-stone-950" />
        ) : (
          <Play className="w-4 h-4 fill-stone-950 ml-0.5" />
        )}
      </button>

      {/* 3. AUDIO PLAYER, STREAMING & MP3 DOWNLOADS: direct link to track.audio_url */}
      {track.audio_url && (
        <a
          href={track.audio_url}
          download={`${(track.title || 'afropulse_track').replace(/[^a-z0-9]/gi, '_')}.mp3`}
          onClick={(e) => {
            e.preventDefault();
            onDownload(track);
          }}
          className="w-9 h-9 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-400 flex items-center justify-center shrink-0 border border-stone-700 shadow transition-transform hover:scale-105 cursor-pointer"
          title="Download MP3"
        >
          <Download className="w-4 h-4" />
        </a>
      )}

      {/* Close Player */}
      <button
        onClick={onClose}
        className="text-stone-500 hover:text-white p-1 text-xs"
        title="Close Player"
      >
        <X className="w-4 h-4" />
      </button>
    </aside>
  );
};
export default PlayerModal;
