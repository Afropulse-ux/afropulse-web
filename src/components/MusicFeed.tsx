import React from 'react';
import { PostItem } from '../types';
import { PostCard } from './PostCard';

interface MusicFeedProps {
  posts: PostItem[];
  currentPlayingId?: string;
  isPlaying?: boolean;
  onSelectPost: (post: PostItem) => void;
  onPlayTrack: (post: PostItem) => void;
  onDownloadTrack: (post: PostItem) => void;
}

export const MusicFeed: React.FC<MusicFeedProps> = ({
  posts,
  currentPlayingId,
  isPlaying = false,
  onSelectPost,
  onPlayTrack,
  onDownloadTrack,
}) => {
  // STRICT CATEGORY FILTERING: category 'audio' or 'music' ONLY
  const musicPosts = posts.filter(p => {
    const cat = (p.category || '').toLowerCase().trim();
    return cat === 'audio' || cat === 'music';
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h2 className="text-3xl font-black text-white">AfroPulse Music Catalog</h2>
        <p className="text-xs text-stone-400">Stream and download the latest Nigerian & African hit singles.</p>
      </div>

      <div className="space-y-3.5">
        {musicPosts.map(post => (
          <PostCard
            key={post.id}
            post={post}
            onSelect={onSelectPost}
            onPlay={onPlayTrack}
            onDownload={onDownloadTrack}
            isPlaying={isPlaying && currentPlayingId === post.id}
          />
        ))}

        {musicPosts.length === 0 && (
          <div className="text-center py-12 bg-stone-900/50 rounded-2xl border border-stone-800">
            <p className="text-sm text-stone-400">No music tracks found in this category yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default MusicFeed;
