import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Play,
  Pause,
  Download,
  Search,
  Upload,
  Radio,
  Newspaper,
  Video,
  Disc,
  ArrowLeft,
  CheckCircle,
  Headphones,
  Shield,
  Settings,
  DollarSign,
  Users,
  LogOut,
  Trash2,
  Plus,
  ExternalLink,
  MessageSquare,
  Send,
  Lock,
  Smartphone,
  Flame,
  Globe,
  Share2,
  FileText,
  Sliders,
  Image as ImageIcon,
  Music as MusicIcon,
  Video as VideoIcon,
  Tag,
  Key as KeyIcon,
  Activity,
  Check,
  Edit2,
  Save,
  X,
  RefreshCw,
  AlertTriangle,
  Filter
} from 'lucide-react';

import {
  supabase,
  uploadAudioTrack,
  uploadVideoContent,
  uploadStorageAsset,
  fetchSupabaseMusic,
  fetchSupabaseVideos,
  updateSupabaseRecord,
  deleteSupabaseRecord,
  convertGoogleDriveLink,
  handlePublishWithStatus
} from './supabase';
export {
  supabase,
  uploadAudioTrack,
  uploadVideoContent,
  uploadStorageAsset,
  fetchSupabaseMusic,
  fetchSupabaseVideos,
  updateSupabaseRecord,
  deleteSupabaseRecord,
  convertGoogleDriveLink,
  handlePublishWithStatus
};

import { PostItem } from './types';
import { PostCard, FeaturedBanner, MusicFeed, PlayerModal, PostDetail } from './components';

export type { PostItem };
export { PostCard, FeaturedBanner, MusicFeed, PlayerModal, PostDetail };

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

interface BeatItem {
  id: string;
  title: string;
  producer: string;
  bpm: number;
  key: string;
  genre: string;
  cover: string;
  previewUrl: string;
  prices: {
    mp3: number;
    wav: number;
    stems: number;
    exclusive: number;
  };
}

class AdminErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: Error) { console.error('Admin Error:', error); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#060504] text-stone-100 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-stone-900 border border-stone-800 rounded-2xl p-8 text-center space-y-4">
            <h3 className="text-lg font-bold text-white">Admin Dashboard Ready</h3>
            <p className="text-xs text-stone-400">Click below to refresh safely.</p>
            <button onClick={() => window.location.reload()} className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-6 py-2.5 rounded-xl text-xs">
              Refresh Admin Panel
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<'home' | 'music' | 'videos' | 'news' | 'movies' | 'spotify' | 'promote' | 'musicupload' | 'beatstore' | 'services' | 'contact' | 'privacy' | 'dmca' | 'admin' | 'post' | 'radio-campaign' | 'tiktok-campaign'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [visiblePostLimit, setVisiblePostLimit] = useState(25);
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
  const [beats, setBeats] = useState<BeatItem[]>([]);

  // FETCH REAL COMMENTS FROM SUPABASE
  const fetchCommentsForPost = async (postId: string) => {
    try {
      const { data, error } = await supabase
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
      const { data, error } = await supabase
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
                <button onClick={() => setCurrentRoute('news')} className="text-xs font-semibold text-stone-300 hover:text-amber-400">News</
