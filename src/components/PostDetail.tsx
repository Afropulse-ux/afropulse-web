import React, { useState } from 'react';
import { Play, Pause, Download, MessageSquare, ExternalLink, Globe, Share2 } from 'lucide-react';
import { PostItem } from '../types';
import { convertGoogleDriveLink } from '../supabase';

interface PostDetailProps {
  post: PostItem;
  relatedPosts: PostItem[];
  comments: { id: string; author: string; text: string; date: string }[];
  isPlaying: boolean;
  currentPlayingId?: string;
  onBack: () => void;
  onPlayTrack: (post: PostItem) => void;
  onDownloadTrack: (post: PostItem) => void;
  onSelectPost: (id: string) => void;
  onAddComment: (author: string, text: string) => void;
}

export const PostDetail: React.FC<PostDetailProps> = ({
  post,
  relatedPosts,
  comments,
  isPlaying,
  currentPlayingId,
  onBack,
  onPlayTrack,
  onDownloadTrack,
  onSelectPost,
  onAddComment,
}) => {
  const [shareCopied, setShareCopied] = useState(false);
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentText, setCommentText] = useState('');

  // 2. COVER ARTWORK DISPLAY: Set strictly to post.image_url
  const artworkSrc = post.image_url || post.cover || '';

  // 4. SOCIAL MEDIA & EXTERNAL STREAMING LINKS: Map directly from post object
  const spotifyUrl = post.spotify_url || post.socials?.spotify;
  const appleMusicUrl = post.apple_music_url || post.socials?.appleMusic;
  const audiomackUrl = post.audiomack_url || post.socials?.audiomack;
  const instagramUrl = post.instagram_url || post.socials?.instagram;
  const twitterUrl = post.twitter_url || post.socials?.twitter;
  const youtubeUrl = post.youtube_url || post.socials?.youtube;
  const tiktokUrl = post.socials?.tiktok;

  const processedAudioUrl = convertGoogleDriveLink(post.audio_url || post.audioUrl || '');

  const hasExternalLinks = Boolean(
    spotifyUrl || appleMusicUrl || audiomackUrl || instagramUrl || twitterUrl || youtubeUrl || tiktokUrl
  );

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentAuthor.trim() || !commentText.trim()) {
      alert('Please enter your name and comment');
      return;
    }
    onAddComment(commentAuthor.trim(), commentText.trim());
    setCommentAuthor('');
    setCommentText('');
    alert('Comment posted successfully!');
  };

  const isCurrentAudioPlaying = isPlaying && currentPlayingId === post.id;

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-bold text-amber-400 hover:underline cursor-pointer"
      >
        ← Back to Feed
      </button>

      {/* Main Post Card */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
        {/* Category, Genre, Date */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-3 py-1 rounded text-xs font-bold bg-amber-500/20 text-amber-400 uppercase">
            {post.category}
          </span>
          {post.genre && (
            <span className="px-3 py-1 rounded text-xs font-bold bg-stone-800 text-stone-300 uppercase font-mono">
              {post.genre}
            </span>
          )}
          <span className="text-xs text-stone-400">{post.date}</span>
          <span className="text-xs text-stone-500">
            • {post.views || post.downloads || '14.2K'} views
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-snug">
          {post.title}
        </h1>

        {/* 1. ARTIST & FEATURED ARTIST NAMES: MUST explicitly render post.artist, NOT post.title */}
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-semibold text-amber-400">
            {post.artist || 'AfroPulse Artist'}
          </p>
          {post.featured_artist && post.featured_artist.trim() !== '' && (
            <span className="text-xs font-medium text-stone-400">
              ft. {post.featured_artist}
            </span>
          )}
        </div>

        {/* 2. COVER ARTWORK DISPLAY: Set strictly to post.image_url */}
        <div className="w-full h-72 md:h-96 rounded-xl overflow-hidden border border-stone-800 shadow-lg bg-stone-950">
          {artworkSrc ? (
            <img
              src={artworkSrc}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-stone-600 font-bold uppercase">
              No Cover Artwork
            </div>
          )}
        </div>

        {/* 5. TEXT FORMATTING & LINE BREAKS: style={{ whiteSpace: 'pre-wrap' }} */}
        <div
          className="space-y-4 text-stone-300 text-sm leading-relaxed pt-2"
          style={{ whiteSpace: 'pre-wrap' }}
        >
          <p style={{ whiteSpace: 'pre-wrap' }}>
            {post.content || post.description || post.body}
          </p>

          {post.middle_image_url && (
            <div className="py-4">
              <img
                src={post.middle_image_url}
                alt="Middle Content"
                className="w-full rounded-xl border border-stone-800 shadow-md"
              />
            </div>
          )}

          {post.lyrics && post.lyrics.length > 0 && (
            <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-2 font-mono text-xs text-amber-300/90">
              <h5 className="font-bold text-white uppercase text-[10px] tracking-wider mb-2">
                Lyrics / Verse
              </h5>
              {post.lyrics.map((l, i) => (
                <div key={i}>{l}</div>
              ))}
            </div>
          )}
        </div>

        {/* 3. AUDIO PLAYER, STREAMING & MP3 DOWNLOADS */}
        <div className="bg-stone-950 border border-stone-800 rounded-xl p-6 space-y-4">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">
            Media Player & Downloads
          </h4>

          {post.audio_url || post.audioUrl ? (
            <div className="flex flex-col md:flex-row items-center gap-4 bg-stone-900 p-4 rounded-xl border border-stone-800">
              {/* Stream / Play Button */}
              <button
                onClick={() => onPlayTrack({ ...post, audio_url: processedAudioUrl })}
                className="w-14 h-14 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 flex items-center justify-center shadow-lg transition-transform hover:scale-105 shrink-0"
                title="Stream Audio"
              >
                {isCurrentAudioPlaying ? (
                  <Pause className="w-6 h-6 fill-stone-950" />
                ) : (
                  <Play className="w-6 h-6 fill-stone-950 ml-0.5" />
                )}
              </button>

              <div className="flex-1 text-center md:text-left min-w-0">
                <h5 className="text-sm font-bold text-white truncate">{post.title}</h5>
                <p className="text-xs text-amber-400 font-semibold">
                  <span>{post.artist || 'AfroPulse Artist'}</span>
                  {post.featured_artist && post.featured_artist.trim() !== '' && (
                    <span className="text-stone-400 ml-1">ft. {post.featured_artist}</span>
                  )}
                  <span> • {post.duration || '03:45'}</span>
                </p>

                {/* HTML5 <audio> tag with src directly pointing to audio url */}
                <audio
                  controls
                  src={processedAudioUrl}
                  className="w-full mt-2 h-9 rounded-lg"
                />
              </div>

              {/* Download MP3 Button directly linked to audio url */}
              <a
                href={processedAudioUrl}
                download={`${(post.title || 'afropulse_track').replace(/[^a-z0-9]/gi, '_')}.mp3`}
                onClick={(e) => {
                  e.preventDefault();
                  onDownloadTrack({ ...post, audio_url: processedAudioUrl });
                }}
                className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow transition-transform hover:scale-105 cursor-pointer shrink-0"
              >
                <Download className="w-4 h-4" /> Download MP3
              </a>
            </div>
          ) : post.video_url ? (
            <div className="space-y-4">
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-stone-900 border border-stone-800">
                <iframe
                  src={post.video_url.replace('watch?v=', 'embed/')}
                  title={post.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <a
                href={post.video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs"
              >
                Watch Video Stream / Premiere ↗
              </a>
            </div>
          ) : (
            <div className="text-xs text-stone-400 p-4 bg-stone-900 rounded-xl text-center">
              Text article read edition. No media attachment required.
            </div>
          )}
        </div>

        {/* 4. SOCIAL MEDIA & EXTERNAL STREAMING LINKS: Active clickable buttons */}
        {hasExternalLinks && (
          <div className="bg-stone-950 border border-stone-800 rounded-xl p-5 space-y-3">
            <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              Stream / Follow {post.artist || 'Artist'} Across Platforms
            </h5>
            <div className="flex flex-wrap items-center gap-2.5">
              {spotifyUrl && (
                <a
                  href={spotifyUrl.startsWith('http') ? spotifyUrl : `https://${spotifyUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#1DB954]/20 hover:bg-[#1DB954]/30 text-[#1DB954] border border-[#1DB954]/40 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                >
                  🟢 Spotify
                </a>
              )}
              {appleMusicUrl && (
                <a
                  href={appleMusicUrl.startsWith('http') ? appleMusicUrl : `https://${appleMusicUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#FA243C]/20 hover:bg-[#FA243C]/30 text-[#FA243C] border border-[#FA243C]/40 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                >
                  🍎 Apple Music
                </a>
              )}
              {audiomackUrl && (
                <a
                  href={audiomackUrl.startsWith('http') ? audiomackUrl : `https://${audiomackUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#FFA200]/20 hover:bg-[#FFA200]/30 text-[#FFA200] border border-[#FFA200]/40 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                >
                  🟧 Audiomack
                </a>
              )}
              {youtubeUrl && (
                <a
                  href={youtubeUrl.startsWith('http') ? youtubeUrl : `https://${youtubeUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/40 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                >
                  🔴 YouTube
                </a>
              )}
              {instagramUrl && (
                <a
                  href={instagramUrl.startsWith('http') ? instagramUrl : `https://instagram.com/${instagramUrl.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-pink-600/20 hover:bg-pink-600/30 text-pink-400 border border-pink-600/40 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                >
                  📸 Instagram
                </a>
              )}
              {twitterUrl && (
                <a
                  href={twitterUrl.startsWith('http') ? twitterUrl : `https://x.com/${twitterUrl.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-sky-600/20 hover:bg-sky-600/30 text-sky-400 border border-sky-600/40 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                >
                  🕥 X (Twitter)
                </a>
              )}
              {tiktokUrl && (
                <a
                  href={tiktokUrl.startsWith('http') ? tiktokUrl : `https://tiktok.com/@${tiktokUrl.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border border-purple-600/40 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                >
                  🎵 TikTok
                </a>
              )}
            </div>
          </div>
        )}

        {/* Share Buttons Section */}
        <div className="space-y-3 pt-2">
          <h5 className="text-xs font-bold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
            <Share2 className="w-3.5 h-3.5 text-stone-400" /> Share This Release
          </h5>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setShareCopied(true);
                setTimeout(() => setShareCopied(false), 2000);
              }}
              className="bg-stone-800 hover:bg-stone-700 text-stone-200 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              {shareCopied ? '✓ Copied Link!' : '🔗 Copy Link'}
            </button>
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                post.title + ' - Listen on AfroPulse: ' + window.location.href
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-600/30 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              🟢 WhatsApp
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                window.location.href
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-600/30 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              📘 Facebook
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                post.title
              )}&url=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-sky-600/20 hover:bg-sky-600/30 text-sky-400 border border-sky-600/30 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              🕥 X (Twitter)
            </a>
            <a
              href={`https://t.me/share/url?url=${encodeURIComponent(
                window.location.href
              )}&text=${encodeURIComponent(post.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border border-indigo-600/30 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              ✈️ Telegram
            </a>
          </div>
        </div>
      </div>

      {/* Related Content */}
      {relatedPosts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white">
            Related {post.category} Releases
          </h3>
          <div className="space-y-3">
            {relatedPosts.map((rp) => (
              <div
                key={rp.id}
                onClick={() => {
                  onSelectPost(rp.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-4 p-3 bg-stone-900 border border-stone-800 rounded-xl hover:border-amber-500/50 transition cursor-pointer"
              >
                <img
                  src={rp.image_url || rp.cover}
                  alt={rp.title}
                  className="w-16 h-16 rounded-lg object-cover shrink-0"
                />
                <div className="flex-1 min-w-0 space-y-1">
                  <h5 className="text-xs font-bold text-white line-clamp-1">{rp.title}</h5>
                  {/* 1. ARTIST & FEATURED ARTIST NAMES */}
                  <p className="text-[11px] text-amber-400 font-medium truncate">
                    <span>{rp.artist || 'AfroPulse Artist'}</span>
                    {rp.featured_artist && rp.featured_artist.trim() !== '' && (
                      <span className="text-stone-400 ml-1">ft. {rp.featured_artist}</span>
                    )}
                  </p>
                </div>
                <span className="text-xs text-amber-400 font-bold px-3 py-1 bg-amber-500/10 rounded-lg">
                  View →
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comments Section */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-amber-500" /> Comments ({comments.length})
        </h3>

        <form
          onSubmit={handleCommentSubmit}
          className="space-y-4 p-4 bg-stone-950 border border-stone-800 rounded-xl"
        >
          <h4 className="text-xs font-bold text-amber-400 uppercase">Leave a Comment</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              required
              placeholder="Your Name / Artist Name"
              value={commentAuthor}
              onChange={(e) => setCommentAuthor(e.target.value)}
              className="bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
            />
          </div>
          <textarea
            required
            rows={3}
            placeholder="Share your thoughts on this release..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3.5 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 resize-none"
          />
          <button
            type="submit"
            className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-5 py-2.5 rounded-xl text-xs transition shadow"
          >
            Submit Comment
          </button>
        </form>

        <div className="space-y-3">
          {comments.map((c) => (
            <div
              key={c.id}
              className="p-4 bg-stone-950 border border-stone-800 rounded-xl space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400">{c.author}</span>
                <span className="text-[10px] text-stone-500">{c.date}</span>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed" style={{ whiteSpace: 'pre-wrap' }}>
                {c.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default PostDetail;
