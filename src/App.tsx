import React, { useState, useEffect } from 'react';
import {
  Search,
  Video,
  Newspaper,
  Radio,
  Shield,
  Flame,
  Music as MusicIcon
} from 'lucide-react';

import {
  supabase,
  convertGoogleDriveLink
} from './supabase';

import { PostItem } from './types';
import { PostCard, FeaturedBanner, PlayerModal, PostDetail } from './components';

export type { PostItem };
export { PostCard, FeaturedBanner, PlayerModal, PostDetail };

export const isMusicPost = (p: { category?: string }) => {
  const cat = (p.category || '').toLowerCase().trim();
  return cat === 'audio' || cat === 'music';
};

export const isMoviePost = (p: { category?: string }) => {
  const cat = (p.category || '').toLowerCase().trim();
  return cat === 'video' || cat === 'movie';
};

export const isBeatsPost = (p: { category?: string }) => {
  const cat = (p.category || '').toLowerCase().trim();
  return cat === 'beats' || cat === 'beat';
};

export const isNewsPost = (p: { category?: string }) => {
  const cat = (p.category || '').toLowerCase().trim();
  return cat === 'news' || cat === 'gossip';
};

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<'home' | 'music' | 'videos' | 'news' | 'movies' | 'spotify' | 'promote' | 'musicupload' | 'beatstore' | 'services' | 'contact' | 'privacy' | 'dmca' | 'admin' | 'post' | 'radio-campaign' | 'tiktok-campaign'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [visiblePostLimit] = useState(25);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  // SUPABASE REAL-TIME COMMENTS STATE
  const [postComments, setPostComments] = useState<Record<string, { id: string; author: string; text: string; date: string }[]>>({});

  const [currentPlayingTrack, setCurrentPlayingTrack] = useState<PostItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const [posts, setPosts] = useState<PostItem[]>([]);

  // FETCH REAL COMMENTS FROM SUPABASE
  const fetchCommentsForPost = async (postId: string) => {
    try {
      const { data } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (data) {
        const formatted = data.map((c: any) => ({
          id: c.id.toString(),
          author: c.author_name,
          text: c.content,
          date: new Date(c.created_at).toLocaleDateString()
        }));
        setPostComments(prev => ({ ...prev, [postId]: formatted }));
      }
    } catch (err) {
      console.warn('Comments fetch notice:', err);
    }
  };

  // ADD REAL COMMENT TO SUPABASE
  const handleAddComment = async (postId: string, author: string, text: string) => {
    try {
      const { error } = await supabase
        .from('comments')
        .insert([{ post_id: postId, author_name: author, content: text }]);

      if (!error) {
        await fetchCommentsForPost(postId);
      }
    } catch (err) {
      console.warn('Comment insert notice:', err);
    }
  };

  const fetchAllSupabaseContent = async () => {
    try {
      const postsRes = await supabase.from('posts').select('*').order('id', { ascending: false });
      const fetchedPosts: PostItem[] = [];

      if (postsRes.data) {
        postsRes.data.forEach((p: any) => {
          const rawCat = (p.category || '').toLowerCase().trim();
          const imgUrl = p.cover_art || p.image_url || p.cover_url || p.cover || '';
          const audUrl = p.audio_url || p.audio_link || p.audioUrl || '';
          const vidUrl = p.video_url || p.video_link || p.videoUrl || '';

          let finalCat = 'audio';
          if (rawCat === 'video' || rawCat === 'videos' || rawCat === 'movie' || rawCat === 'movies') {
            finalCat = (rawCat === 'movie' || rawCat === 'movies') ? 'movie' : 'video';
          } else if (rawCat === 'news' || rawCat === 'gossip') {
            finalCat = 'news';
          } else if (rawCat === 'beats' || rawCat === 'beat') {
            finalCat = 'beats';
          } else {
            finalCat = 'audio';
          }

          fetchedPosts.push({
            id: p.id?.toString() || `p-${Date.now()}`,
            title: p.title || 'Untitled',
            artist: p.artist || p.main_artist || p.artist_name || 'Unknown Artist',
            featured_artist: p.featured_artist || p.featuring || '',
            content: p.content || p.body || p.description || '',
            category: finalCat,
            genre: p.genre || 'Afrobeats',
            image_url: imgUrl,
            cover: imgUrl,
            cover_art: p.cover_art || '',
            audio_url: audUrl,
            audioUrl: audUrl,
            video_url: vidUrl,
            date: p.created_at ? new Date(p.created_at).toLocaleDateString() : 'Just now',
            isHero: Boolean(p.is_hero || p.is_featured)
          });
        });
      }

      setPosts(fetchedPosts);
    } catch (err) {
      console.warn('Error fetching Supabase content:', err);
    }
  };

  useEffect(() => {
    fetchAllSupabaseContent();
  }, []);

  useEffect(() => {
    if (selectedPostId) {
      fetchCommentsForPost(selectedPostId);
    }
  }, [selectedPostId]);

  const handlePlayTrack = (track: PostItem | null | undefined) => {
    if (!track) return;
    const rawSrc = track.audio_url || track.audioUrl;
    if (!rawSrc) {
      alert(`No streaming audio link available.`);
      return;
    }
    const audioSrc = convertGoogleDriveLink(rawSrc);
    if (currentPlayingTrack?.id === track.id) {
      if (isPlaying) {
        audioElement?.pause();
        setIsPlaying(false);
      } else {
        audioElement?.play().catch(e => console.warn('Audio notice:', e));
        setIsPlaying(true);
      }
    } else {
      if (audioElement) audioElement.pause();
      const audio = new Audio(audioSrc);
      audio.play().catch(e => console.warn('Audio notice:', e));
      audio.onended = () => setIsPlaying(false);
      setAudioElement(audio);
      setCurrentPlayingTrack(track);
      setIsPlaying(true);
    }
  };

  const handleDownloadFile = async (item: any) => {
    const rawUrl = item.audio_url || item.audioUrl;
    if (!rawUrl) return;
    window.open(convertGoogleDriveLink(rawUrl), '_blank');
  };

  const flagshipTrack = (posts && posts.length > 0) ? posts[0] : null;

  return (
    <main className="w-full min-h-screen bg-[#0d0d0d] text-white overflow-x-hidden flex flex-col font-sans">
      
      {/* HEADER & BRANDING */}
      {currentRoute !== 'admin' && (
        <header className="sticky top-0 z-50 bg-[#0d0d0d]/95 backdrop-blur-md border-b border-gray-800 py-3">
          <div className="max-w-6xl mx-auto px-4 flex flex-col items-center gap-3">
            <div className="w-full flex items-center justify-between">
              <div onClick={() => setCurrentRoute('home')} className="cursor-pointer flex items-center gap-2 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/20">
                  <Flame className="w-5 h-5 text-stone-950 fill-stone-950" />
                </div>
                <div>
                  <h1 className="text-xl font-black tracking-wider bg-gradient-to-r from-white via-stone-200 to-amber-400 bg-clip-text text-transparent">
                    AFROPULSE
                  </h1>
                  <p className="text-[9px] tracking-widest text-amber-500 uppercase font-semibold">African Entertainment Portal</p>
                </div>
              </div>

              <div className="hidden md:flex items-center gap-4">
                <button onClick={() => setCurrentRoute('music')} className="text-xs font-semibold text-stone-300 hover:text-amber-400">Music</button>
                <button onClick={() => setCurrentRoute('movies')} className="text-xs font-semibold text-stone-300 hover:text-amber-400">Movies</button>
                <button onClick={() => setCurrentRoute('news')} className="text-xs font-semibold text-stone-300 hover:text-amber-400">News</button>
                <button onClick={() => setCurrentRoute('beatstore')} className="text-xs font-semibold text-stone-300 hover:text-amber-400">Beat Store</button>
                <button onClick={() => setCurrentRoute('admin')} className="text-xs text-stone-400 bg-stone-900 px-3 py-1.5 rounded-lg border border-stone-800">Admin Panel</button>
              </div>
            </div>

            <div className="w-full max-w-2xl relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="Search trending songs, music videos, movies, news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-stone-900/90 border border-stone-800 rounded-full pl-10 pr-4 py-2.5 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500/50"
              />
            </div>
          </div>
        </header>
      )}

      {/* SERVICE NAVIGATION BUTTONS */}
      {currentRoute !== 'admin' && (
        <div className="bg-[#0d0d0d] border-b border-gray-800 py-3">
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
            <button onClick={() => setCurrentRoute('music')} className="px-3 py-2 bg-[#161616] border border-gray-700/70 rounded-xl text-xs font-medium text-white hover:border-amber-500 flex items-center justify-center gap-2">
              <MusicIcon className="w-4 h-4 text-emerald-400" /> Music
            </button>
            <button onClick={() => setCurrentRoute('movies')} className="px-3 py-2 bg-[#161616] border border-gray-700/70 rounded-xl text-xs font-medium text-white hover:border-amber-500 flex items-center justify-center gap-2">
              <Video className="w-4 h-4 text-blue-400" /> Movies
            </button>
            <button onClick={() => setCurrentRoute('videos')} className="px-3 py-2 bg-[#161616] border border-gray-700/70 rounded-xl text-xs font-medium text-white hover:border-amber-500 flex items-center justify-center gap-2">
              <Play className="w-4 h-4 text-amber-400" /> Music Videos
            </button>
            <button onClick={() => setCurrentRoute('news')} className="px-3 py-2 bg-[#161616] border border-gray-700/70 rounded-xl text-xs font-medium text-white hover:border-amber-500 flex items-center justify-center gap-2">
              <Newspaper className="w-4 h-4 text-amber-500" /> News & Gossip
            </button>
            <button onClick={() => setCurrentRoute('beatstore')} className="px-3 py-2 bg-[#161616] border border-gray-700/70 rounded-xl text-xs font-medium text-white hover:border-amber-500 flex items-center justify-center gap-2">
              <Radio className="w-4 h-4 text-red-400" /> Beat Store
            </button>
            <button onClick={() => setCurrentRoute('promote')} className="px-3 py-2 bg-[#161616] border border-gray-700/70 rounded-xl text-xs font-medium text-white hover:border-amber-500 flex items-center justify-center gap-2">
              <Shield className="w-4 h-4 text-amber-400" /> PR & Promote
            </button>
          </div>
        </div>
      )}

      {/* MAIN CONTENT ROUTING */}
      <main className="flex-1">
        {currentRoute === 'home' && (
          <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
            {flagshipTrack && (
              <FeaturedBanner
                post={flagshipTrack}
                isPlaying={isPlaying && currentPlayingTrack?.id === flagshipTrack.id}
                onPlay={handlePlayTrack}
                onDownload={handleDownloadFile}
                onSelect={(p) => { setSelectedPostId(p.id); setCurrentRoute('post'); }}
              />
            )}

            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <h3 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                  <Flame className="w-5 h-5 text-amber-500" /> Latest Naija Music & Entertainment Feeds
                </h3>
              </div>

              <div className="space-y-3.5">
                {posts
                  .filter(p => !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase()) || (p.artist || '').toLowerCase().includes(searchQuery.toLowerCase()))
                  .slice(0, visiblePostLimit)
                  .map(p => (
                    <PostCard
                      key={p.id}
                      post={p}
                      onSelect={(post) => { setSelectedPostId(post.id); setCurrentRoute('post'); }}
                      onPlay={handlePlayTrack}
                      onDownload={handleDownloadFile}
                      isPlaying={isPlaying && currentPlayingTrack?.id === p.id}
                    />
                  ))}
              </div>
            </div>
          </div>
        )}

        {currentRoute === 'post' && selectedPostId && (() => {
          const post = posts.find(p => p.id === selectedPostId) || posts[0];
          const relatedPosts = posts.filter(p => p.category === post.category && p.id !== post.id).slice(0, 5);
          const comments = postComments[post.id] || [];

          return (
            <div className="max-w-7xl mx-auto px-4 py-8">
              <PostDetail
                post={post}
                relatedPosts={relatedPosts}
                comments={comments}
                isPlaying={isPlaying}
                currentPlayingId={currentPlayingTrack?.id}
                onBack={() => setCurrentRoute('home')}
                onPlayTrack={handlePlayTrack}
                onDownloadTrack={handleDownloadFile}
                onSelectPost={(id) => { setSelectedPostId(id); setCurrentRoute('post'); }}
                onAddComment={(author, text) => handleAddComment(post.id, author, text)}
              />
            </div>
          );
        })()}
      </main>

      <PlayerModal
        track={currentPlayingTrack}
        isPlaying={isPlaying}
        onTogglePlay={() => { if (currentPlayingTrack) handlePlayTrack(currentPlayingTrack); }}
        onDownload={handleDownloadFile}
        onClose={() => { audioElement?.pause(); setIsPlaying(false); setCurrentPlayingTrack(null); }}
        onSelectPost={(track) => { setSelectedPostId(track.id); setCurrentRoute('post'); }}
      />
    </main>
  );
}
