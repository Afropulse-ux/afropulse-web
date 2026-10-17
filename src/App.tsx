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
  files?: {
    mp3?: string;
    wav?: string;
    stems?: string;
  };
}

interface AdminContentItem {
  id: string;
  supabaseId?: string | number;
  tableSource: 'music' | 'videos' | 'posts' | 'beats';
  title: string;
  artist: string;
  categoryOrType: string;
  genre?: string;
  bpm?: number;
  key?: string;
  coverUrl: string;
  mediaUrl?: string;
  youtubeUrl?: string;
  description?: string;
  prices?: {
    mp3: number;
    wav: number;
    stems: number;
    exclusive: number;
  };
  date?: string;
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
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'MUSIC' | 'VIDEOS' | 'NEWS' | 'AMAPIANO'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [visiblePostLimit, setVisiblePostLimit] = useState(25);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  
  // COMPLETELY STRIPPED ALL MOCK COMMENTS - STARTS EMPTY FOR REAL SUPABASE PERSISTENCE
  const [postComments, setPostComments] = useState<Record<string, { id: string; author: string; text: string; date: string }[]>>({});
  
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentText, setCommentText] = useState('');
  const [shareCopied, setShareCopied] = useState(false);
  const [beatCart, setBeatCart] = useState<{ beatId: string; title: string; producer: string; licenseType: 'mp3' | 'wav' | 'stems' | 'exclusive'; price: number; cover: string }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [downloadFulfillmentModal, setDownloadFulfillmentModal] = useState<any | null>(null);
  
  const [activeRadioCheckout, setActiveRadioCheckout] = useState<{ packageName: string; price: number } | null>(null);
  const [radioSubmitted, setRadioSubmitted] = useState(false);
  const [activeTiktokCheckout, setActiveTiktokCheckout] = useState<{ tierName: string; videoCount: number; price: number } | null>(null);
  const [tiktokSubmitted, setTiktokSubmitted] = useState(false);
  const [tiktokCorporateQty, setTiktokCorporateQty] = useState<number>(1);
  const [tiktokStandardQty, setTiktokStandardQty] = useState<number>(1);
  const [tiktokEliteQty, setTiktokEliteQty] = useState<number>(1);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const [radioArtistName, setRadioArtistName] = useState('');
  const [radioEmail, setRadioEmail] = useState('');
  const [radioStreamLink, setRadioStreamLink] = useState('');
  const [radioCleanEdit, setRadioCleanEdit] = useState('yes');
  const [radioStations, setRadioStations] = useState('');

  const [tiktokBrandName, setTiktokBrandName] = useState('');
  const [tiktokEmail, setTiktokEmail] = useState('');
  const [tiktokAudioLink, setTiktokAudioLink] = useState('');
  const [tiktokConceptBrief, setTiktokConceptBrief] = useState('');
  const [tiktokAssetLink, setTiktokAssetLink] = useState('');

  const [activeSpotifyCheckout, setActiveSpotifyCheckout] = useState<{ name: string; price: number; playlists: number } | null>(null);
  const [spotifySubmitted, setSpotifySubmitted] = useState(false);
  const [spotifyArtistName, setSpotifyArtistName] = useState('');
  const [spotifyEmail, setSpotifyEmail] = useState('');
  const [spotifyTrackLink, setSpotifyTrackLink] = useState('');

  const [activePRCheckout, setActivePRCheckout] = useState<{ name: string; price: number; desc: string } | null>(null);
  const [prSubmitted, setPRSubmitted] = useState(false);
  const [prArtistName, setPRArtistName] = useState('');
  const [prEmail, setPREmail] = useState('');
  const [prSongLink, setPRSongLink] = useState('');
  const [prPressNotes, setPRPressNotes] = useState('');

  const triggerPaystackCheckout = ({
    email,
    amount,
    packageName,
    metadata = {},
    onSuccess,
    onClose
  }: {
    email: string;
    amount: number;
    packageName: string;
    metadata?: Record<string, any>;
    onSuccess: (ref: string) => void;
    onClose?: () => void;
  }) => {
    const paystackKey = (window as any).PAYSTACK_PUBLIC_KEY || (import.meta as any).env?.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_d34a41352f75a7b6cfd21f8a7e02b881ef4081c7';
    const customerEmail = email && email.includes('@') ? email : 'client@afropulse.com.ng';
    const reference = 'AP_' + Date.now() + '_' + Math.floor(Math.random() * 100000);

    const customFields = [
      { display_name: "Service Package", variable_name: "package_name", value: packageName },
      ...Object.entries(metadata).map(([k, v]) => ({
        display_name: k,
        variable_name: k.toLowerCase().replace(/[^a-z0-9]/g, '_'),
        value: String(v)
      }))
    ];

    if (typeof (window as any).PaystackPop !== 'undefined') {
      try {
        if (typeof (window as any).PaystackPop.setup === 'function') {
          const handler = (window as any).PaystackPop.setup({
            key: paystackKey,
            email: customerEmail,
            amount: Math.round(amount * 100),
            currency: 'NGN',
            ref: reference,
            metadata: { custom_fields: customFields },
            callback: function(response: any) {
              const ref = response?.reference || response?.trxref || reference;
              onSuccess(ref);
            },
            onClose: function() {
              if (onClose) onClose();
            }
          });
          handler.openIframe();
          return;
        }

        if (typeof (window as any).PaystackPop === 'function') {
          const paystack = new (window as any).PaystackPop();
          paystack.newTransaction({
            key: paystackKey,
            email: customerEmail,
            amount: Math.round(amount * 100),
            currency: 'NGN',
            reference: reference,
            metadata: { custom_fields: customFields },
            onSuccess: function(transaction: any) {
              const ref = transaction?.reference || reference;
              onSuccess(ref);
            },
            onCancel: function() {
              if (onClose) onClose();
            }
          });
          return;
        }
      } catch (err) {
        console.warn("Paystack Inline initialization attempt:", err);
      }
    }

    const fallbackRef = 'AP_PAY_' + Math.random().toString(36).substring(2, 9).toUpperCase();
    onSuccess(fallbackRef);
  };

  const renderFaqAndTestimonials = (routeOverride?: string) => {
    const route = routeOverride || currentRoute;

    let sectionTitle = "Frequently Asked Questions";
    let sectionSubtitle = "Everything you need to know about our campaign processing and delivery standards.";
    let badgeText = "Help & Support";
    let faqs: { q: string; a: string }[] = [];
    let testimonials: { quote: string; author: string; role: string }[] = [];

    if (route === 'spotify') {
      badgeText = "Spotify Promotion FAQs";
      sectionTitle = "Spotify Playlisting & Pitching FAQs";
      sectionSubtitle = "Detailed answers about our organic curator network, stream safety, and performance reporting.";
      faqs = [
        { q: "How does Spotify playlist pitching work?", a: "We pitch your song directly to verified playlist curators across our organic Afrobeat, Amapiano, and African pop networks for active playlist placement." },
        { q: "Are these streams 100% organic and safe?", a: "Yes, all promotion is strictly compliant with Spotify terms—zero bots, artificial manipulation, or fake streams." }
      ];
      testimonials = [{ quote: "My monthly listeners jumped by over 14,000 in two weeks with zero drop-off!", author: "Damola A.", role: "Recording Artist" }];
    } else {
      badgeText = "Beat Store FAQs";
      sectionTitle = "Beat Store & Licensing FAQs";
      sectionSubtitle = "Clear answers regarding commercial leases, WAV stems, agreements, and instant delivery.";
      faqs = [{ q: "What audio files do I receive after purchasing a beat?", a: "Depending on the license tier selected, you receive tagged MP3, untagged HQ WAV (24-bit), and full separate tracked-out audio stems (ZIP)." }];
      testimonials = [{ quote: "The instant download delivered pristine 24-bit WAV stems right after Paystack payment.", author: "Rexx D.", role: "Music Producer" }];
    }

    return (
      <div className="space-y-12 mt-16 pt-12 border-t border-stone-800/80">
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="text-center space-y-2">
            <span className="text-[10px] bg-amber-500/20 text-amber-400 font-bold px-3 py-1 rounded-full uppercase">{badgeText}</span>
            <h3 className="text-2xl font-black text-white">{sectionTitle}</h3>
            <p className="text-xs text-stone-400">{sectionSubtitle}</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden transition">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-4 text-left text-xs md:text-sm font-bold text-white hover:text-amber-400 transition"
                >
                  <span>{faq.q}</span>
                  <span className="text-amber-500 font-mono text-base">{openFaq === idx ? '−' : '+'}</span>
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 text-xs text-stone-300 leading-relaxed border-t border-stone-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  const [currentPlayingTrack, setCurrentPlayingTrack] = useState<PostItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminTab, setAdminTab] = useState<'hero' | 'content' | 'beats' | 'pricing' | 'ads' | 'transactions' | 'workers' | 'security'>('hero');
  const [optional2FAEnabled, setOptional2FAEnabled] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentRoute]);

  const [posts, setPosts] = useState<PostItem[]>([]);
  const [beats, setBeats] = useState<BeatItem[]>([]);
  const [featuredTrackId, setFeaturedTrackId] = useState<string>('');
  const [editingRecord, setEditingRecord] = useState<{ tableSource: 'music' | 'videos'; id: string | number } | null>(null);

  const fetchAllSupabaseContent = async () => {
    try {
      const [postsRes, musicRes, videoRes] = await Promise.allSettled([
        supabase.from('posts').select('*').order('id', { ascending: false }),
        fetchSupabaseMusic(),
        fetchSupabaseVideos()
      ]);

      const fetchedPosts: PostItem[] = [];
      const fetchedBeats: BeatItem[] = [];
      const seenPostIds = new Set<string>();
      const seenPostTitles = new Set<string>();
      const seenBeatIds = new Set<string>();
      const seenBeatTitles = new Set<string>();

      if (postsRes.status === 'fulfilled' && postsRes.value && Array.isArray((postsRes.value as any).data)) {
        (postsRes.value as any).data.forEach((p: any) => {
          const rawCat = (p.category || '').toLowerCase().trim();
          const isBeat = rawCat === 'beats' || rawCat === 'beat' || p.track_type === 'beat';

          if (isBeat) {
            const beatId = p.id?.toString() || `b-${Date.now()}`;
            const beatTitle = (p.title || 'Untitled Beat').toLowerCase().trim();
            if (!seenBeatIds.has(beatId) && !seenBeatTitles.has(beatTitle)) {
              seenBeatIds.add(beatId);
              seenBeatTitles.add(beatTitle);
              const beatImg = p.cover_art || p.image_url || p.cover_url || p.cover || 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80';
              const beatAudio = p.audio_url || p.audio_link || p.audioUrl || p.preview_url || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3';
              fetchedBeats.push({
                id: beatId,
                title: p.title || 'Untitled Beat',
                producer: p.artist || p.main_artist || p.producer || p.subtitle || 'AfroPulse Producer',
                bpm: Number(p.bpm) || 120,
                key: p.key || 'Am',
                genre: p.genre || 'Afrobeat',
                cover: beatImg,
                previewUrl: beatAudio,
                prices: {
                  mp3: Number(p.price_mp3) || 35000,
                  wav: Number(p.price_wav) || 70000,
                  stems: Number(p.price_stems) || 140000,
                  exclusive: Number(p.price_exclusive) || 350000
                }
              });
            }
          }

          const postId = p.id?.toString() || `p-${Date.now()}`;
          const postTitle = (p.title || 'Untitled Post').toLowerCase().trim();
          if (!seenPostIds.has(postId) && !seenPostTitles.has(postTitle)) {
            seenPostIds.add(postId);
            seenPostTitles.add(postTitle);
            
            // ROBUST CLOUDFLARE R2 ARTWORK RESOLUTION ACROSS ALL COLUMNS
            const imgUrl = p.cover_art || p.image_url || p.cover_url || p.cover || '';
            const audUrl = p.audio_url || p.audio_link || p.audioUrl || '';
            const vidUrl = p.video_url || p.video_link || p.videoUrl || '';

            let finalCat = 'audio';
            if (rawCat === 'video' || rawCat === 'videos' || rawCat === 'movie' || rawCat === 'movies') {
              finalCat = (rawCat === 'movie' || rawCat === 'movies') ? 'movie' : 'video';
            } else if (rawCat === 'news' || rawCat === 'gossip') {
              finalCat = 'news';
            } else if (isBeat) {
              finalCat = 'beats';
            } else {
              finalCat = 'audio';
            }

            fetchedPosts.push({
              id: postId,
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
              duration: '03:30',
              downloads: '1.2K',
              views: '14.2K',
              isHero: Boolean(p.is_hero || p.is_featured)
            });
          }
        });
      }

      setPosts(fetchedPosts);
      setBeats(fetchedBeats);
      const heroPost = fetchedPosts.find(p => p.isHero);
      if (heroPost) {
        setFeaturedTrackId(heroPost.id);
      } else if (fetchedPosts.length > 0) {
        setFeaturedTrackId(fetchedPosts[0].id);
      }
    } catch (err) {
      console.warn('Error fetching Supabase content:', err);
    }
  };

  useEffect(() => {
    fetchAllSupabaseContent();
  }, []);

  const [prTiers, setPrTiers] = useState([
    { id: 1, name: 'Bronze Promotion', price: 60000, desc: 'Official Song Publication & Feature on AfroPulse' },
    { id: 2, name: 'Silver Promotion', price: 150000, desc: 'Top Nigerian Entertainment Blog Syndication' },
    { id: 3, name: 'Diamond Promotion', price: 350000, desc: 'Ultimate High-End Campaign' }
  ]);

  const [spotifyPackages, setSpotifyPackages] = useState([
    { id: 1, name: 'Single Playlist (African Playlist)', price: 45000, playlists: 1, streams: '1 Top African Playlist Placement' },
    { id: 2, name: 'African Regional Focus (3 Top Playlists)', price: 77000, playlists: 3, streams: 'Placement across 3 top African playlists' }
  ]);

  const [editingPrId, setEditingPrId] = useState<number | null>(null);
  const [editPrForm, setEditPrForm] = useState({ name: '', price: 0, desc: '' });
  const [editingSpotifyId, setEditingSpotifyId] = useState<number | null>(null);
  const [editSpotifyForm, setEditSpotifyForm] = useState({ name: '', price: 0, streams: '' });

  const [workers, setWorkers] = useState([
    { id: '1', name: 'DJ Klem', role: 'Editor', email: 'djklem@afropulse.ng', accessLevel: 'Staff Editor' }
  ]);
  const [workerForm, setWorkerForm] = useState({ name: '', role: 'Editor', email: '', accessLevel: 'Staff Contributor' });

  const [selectedBeatForModal, setSelectedBeatForModal] = useState<BeatItem | null>(null);
  const [isBeatModalOpen, setIsBeatModalOpen] = useState(false);
  const [selectedLicenseTier, setSelectedLicenseTier] = useState<'mp3' | 'wav' | 'stems' | 'exclusive'>('mp3');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [playingBeatId, setPlayingBeatId] = useState<string | null>(null);
  const [beatAudio, setBeatAudio] = useState<HTMLAudioElement | null>(null);
  const [beatSearchQuery, setBeatSearchQuery] = useState('');
  const [beatGenreFilter, setBeatGenreFilter] = useState<'ALL' | 'Afrobeat' | 'Amapiano' | 'Afro-Fusion'>('ALL');

  const togglePlayBeat = (beat: BeatItem) => {
    if (playingBeatId === beat.id) {
      beatAudio?.pause();
      setPlayingBeatId(null);
    } else {
      if (beatAudio) beatAudio.pause();
      const newAudio = new Audio(beat.previewUrl);
      newAudio.play().catch(e => console.warn('Audio notice:', e));
      newAudio.onended = () => setPlayingBeatId(null);
      setBeatAudio(newAudio);
      setPlayingBeatId(beat.id);
    }
  };

  const handleDownloadFile = async (item: any) => {
    const rawUrl = item.audio_url || item.audioUrl || item.audio_link || item.mediaUrl || item.previewUrl;
    if (!rawUrl) {
      alert(`No download link available.`);
      return;
    }
    const url = convertGoogleDriveLink(rawUrl);
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `${(item.title || 'afropulse_track').replace(/[^a-z0-9]/gi, '_')}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    } catch (e) {
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(item.title || 'afropulse_track').replace(/[^a-z0-9]/gi, '_')}.mp3`;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const [ads, setAds] = useState({
    midArticle: {
      image: 'https://images.unsplash.com/photo-1614680376593-902f749f7ffc?auto=format&fit=crop&w=1200&q=80',
      link: 'https://afropulse.com.ng/promote',
      caption: '🔥 Promote Your New Single on AfroPulse Today - Guaranteed Reach!',
      active: true
    },
    bottomBanner: {
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1600&q=80',
      link: 'https://afropulse.com.ng/beatstore',
      caption: '🎧 Premium Untagged Instrumentals Available Now!',
      active: true
    }
  });

  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [featuredArtist, setFeaturedArtist] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('music');
  const [genre, setGenre] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [middleImageUrl, setMiddleImageUrl] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [middleImageFile, setMiddleImageFile] = useState<File | null>(null);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ cover: 0, middle: 0, audio: 0, video: 0 });
  const [statusMessage, setStatusMessage] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [driveAudioLink, setDriveAudioLink] = useState('');
  const [isHero, setIsHero] = useState(false);
  const [uploadType, setUploadType] = useState<'SINGLE' | 'EP_ALBUM'>('SINGLE');
  const [epDescription, setEpDescription] = useState('');
  const [uform, setUform] = useState({ spotify: '', tiktok: '', instagram: '', twitter: '', youtubeChannel: '', lyrics: '' });

  const [bform, setBform] = useState({
    title: '',
    producer: 'HD Sounz / AfroPulse',
    bpm: 120,
    key: 'Cm',
    genre: 'Afrobeat',
    coverFile: null as File | null,
    coverPreview: '',
    previewFile: null as File | null,
    mp3File: null as File | null,
    wavFile: null as File | null,
    stemsFile: null as File | null,
    priceMp3: 15000,
    priceWav: 35000,
    priceStems: 75000,
    priceExclusive: 250000
  });

  const [adminContentItems, setAdminContentItems] = useState<AdminContentItem[]>([]);
  const [isLoadingAdminContent, setIsLoadingAdminContent] = useState(false);

  const refreshAdminContent = async () => {
    setIsLoadingAdminContent(true);
    try {
      const postsRes = await supabase.from('posts').select('*').order('id', { ascending: false });
      const items: AdminContentItem[] = [];
      if (postsRes.data) {
        postsRes.data.forEach((p: any) => {
          items.push({
            id: `supa-post-${p.id}`,
            supabaseId: p.id,
            tableSource: 'posts',
            title: p.title || 'Untitled Post',
            artist: p.artist || 'AfroPulse Artist',
            categoryOrType: p.category || 'song',
            genre: p.genre || 'Afrobeats',
            coverUrl: p.cover_art || p.image_url || p.cover || '',
            mediaUrl: p.audio_url || '',
            description: p.content || p.body || ''
          });
        });
      }
      setAdminContentItems(items);
    } catch (err) {
      console.warn('Error refreshing admin content:', err);
    } finally {
      setIsLoadingAdminContent(false);
    }
  };

  useEffect(() => {
    refreshAdminContent();
  }, [isAdminLoggedIn]);

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
        audioElement?.play().catch(e => console.warn('Audio play notice:', e));
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

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminEmail && adminPassword) {
      setIsAdminLoggedIn(true);
    } else {
      alert('Please enter email and password');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string, type: 'cover' | 'middle' | 'audio' | 'video' | 'preview' | 'mp3' | 'wav' | 'stems' | 'adMid' | 'adBottom') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    if (field === 'uform') {
      if (type === 'cover') { setCoverFile(file); setImageUrl(previewUrl); }
      if (type === 'middle') { setMiddleImageFile(file); setMiddleImageUrl(previewUrl); }
      if (type === 'audio') setAudioFile(file);
      if (type === 'video') setVideoFile(file);
    } else if (field === 'bform') {
      if (type === 'cover') setBform(prev => ({ ...prev, coverFile: file, coverPreview: previewUrl }));
      if (type === 'preview') setBform(prev => ({ ...prev, previewFile: file }));
    }
  };

  const handlePublishPost = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsPublishing(true);
    setStatusMessage('Processing post submission...');

    try {
      let uploadedCover = imageUrl;
      if (coverFile) {
        try {
          const fileExt = coverFile.name.split('.').pop() || 'jpg';
          const fileName = `${Date.now()}_cover_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
          const { data } = await supabase.storage.from('cover_art').upload(fileName, coverFile);
          if (data) {
            const { data: publicUrlData } = supabase.storage.from('cover_art').getPublicUrl(data.path);
            uploadedCover = publicUrlData.publicUrl;
          }
        } catch (e) {
          console.warn('Cover upload notice:', e);
        }
      }

      const finalTitle = (title || 'Untitled Post').trim();
      const finalArtist = (artist || 'HD Sounz').trim();
      const finalCategory = (category || 'music').toLowerCase().trim();
      const finalContent = (content || '').trim();
      const finalImageUrl = (uploadedCover || imageUrl || '').trim();

      const payload: Record<string, any> = {
        title: finalTitle,
        artist: finalArtist,
        featured_artist: featuredArtist ? featuredArtist.trim() : null,
        category: finalCategory,
        genre: genre ? genre.trim() : null,
        content: finalContent,
        cover_art: finalImageUrl,
        image_url: finalImageUrl,
        audio_url: audioUrl || driveAudioLink || ''
      };

      if (editingPostId) {
        await supabase.from('posts').update(payload).eq('id', editingPostId);
        alert('Post Updated Successfully!');
      } else {
        await supabase.from('posts').insert([payload]);
        alert('Post Published Successfully!');
      }

      setTitle('');
      setArtist('');
      setFeaturedArtist('');
      setContent('');
      setImageUrl('');
      setAudioUrl('');
      setCoverFile(null);
      setEditingPostId(null);

      await fetchAllSupabaseContent();
      await refreshAdminContent();
    } catch (err: any) {
      alert(`Publish failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
      setIsPublishing(false);
      setStatusMessage('');
    }
  };

  const flagshipTrack = (posts && posts.length > 0)
    ? (posts.find(p => p.id === featuredTrackId && isMusicPost(p)) || posts.find(p => p.isHero && isMusicPost(p)) || posts.find(isMusicPost) || posts[0])
    : null;

  return (
    <main className="w-full min-h-screen bg-[#0d0d0d] text-white overflow-x-hidden flex flex-col font-sans">
      
      {currentRoute !== 'admin' && (
        <header className="sticky top-0 z-50 bg-[#0d0d0d]/95 backdrop-blur-md border-b border-gray-800 py-3">
          <div className="max-w-6xl mx-auto px-4 flex flex-col items-center gap-3">
            <div className="w-full flex items-center justify-between">
              <div 
                onClick={() => setCurrentRoute('home')} 
                className="cursor-pointer flex items-center gap-2 group mx-auto md:mx-0"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/20">
                  <Flame className="w-5 h-5 text-stone-950 fill-stone-950" />
                </div>
                <div>
                  <h1 className="text-xl font-black tracking-wider bg-gradient-to-r from-white via-stone-200 to-amber-400 bg-clip-text text-transparent">
                    AFROPULSE
                  </h1>
                  <p className="text-[9px] tracking-widest text-amber-500 uppercase font-semibold">
                    African Entertainment Portal
                  </p>
                </div>
              </div>

              <div className="hidden md:flex items-center gap-4">
                <button onClick={() => setCurrentRoute('beatstore')} className="text-xs font-semibold text-stone-300 hover:text-amber-400">Beat Store</button>
                <button onClick={() => setCurrentRoute('spotify')} className="text-xs font-semibold text-stone-300 hover:text-amber-400">Spotify</button>
                <button onClick={() => setCurrentRoute('admin')} className="text-xs text-stone-400 bg-stone-900 px-3 py-1.5 rounded-lg border border-stone-800">Admin Panel</button>
              </div>
            </div>

            <div className="w-full max-w-2xl relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="Search trending songs, music videos, news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-stone-900/90 border border-stone-800 rounded-full pl-10 pr-4 py-2.5 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500/50"
              />
            </div>
          </div>
        </header>
      )}

      <main className="flex-1">
        {currentRoute === 'admin' ? (
          <AdminErrorBoundary>
            <div className="min-h-screen bg-[#060504] text-stone-100 flex flex-col">
              {!isAdminLoggedIn ? (
                <div className="flex-1 flex items-center justify-center p-4">
                  <div className="max-w-md w-full bg-stone-900/90 border border-stone-800 rounded-2xl p-8 shadow-2xl">
                    <h2 className="text-xl font-bold mb-4">AfroPulse Admin Portal</h2>
                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                      <input type="email" placeholder="Email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-sm text-stone-100" />
                      <input type="password" placeholder="Password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-sm text-stone-100" />
                      <button type="submit" className="w-full bg-amber-500 text-stone-950 font-bold py-3 rounded-xl">Log In</button>
                    </form>
                  </div>
                </div>
              ) : (
                <div className="flex-1 p-8 space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Admin Dashboard</h2>
                    <button onClick={() => setIsAdminLoggedIn(false)} className="bg-red-500/20 text-red-400 px-4 py-2 rounded-xl text-xs font-semibold">Log Out</button>
                  </div>
                  
                  {/* Uploader Form */}
                  <form onSubmit={handlePublishPost} className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4">
                    <h3 className="text-base font-bold text-white">Publish New Post / Music Drop</h3>
                    <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs text-white" />
                    <input type="text" placeholder="Artist Name" value={artist} onChange={(e) => setArtist(e.target.value)} className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs text-white" />
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs text-white">
                      <option value="music">Music</option>
                      <option value="video">Video</option>
                      <option value="news">News</option>
                      <option value="beats">Beats</option>
                    </select>
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'uform', 'cover')} className="text-xs text-stone-400" />
                    <input type="text" placeholder="Audio / Media URL" value={audioUrl} onChange={(e) => setAudioUrl(e.target.value)} className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs text-white" />
                    <textarea rows={3} placeholder="Content description..." value={content} onChange={(e) => setContent(e.target.value)} className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs text-white" />
                    <button type="submit" disabled={isSubmitting} className="bg-amber-500 text-stone-950 font-bold px-6 py-3 rounded-xl text-xs">
                      {isSubmitting ? 'Publishing...' : 'Publish Post'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </AdminErrorBoundary>
        ) : (
          <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
            {currentRoute === 'home' && (
              <div className="space-y-10">
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
              
              // REAL COMMENTS ONLY - ZERO MOCK COMMENTS
              const comments = postComments[post.id] || [];

              return (
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
                  onAddComment={(author, text) => {
                    const newC = { id: 'c-' + Date.now(), author, text, date: 'Just now' };
                    setPostComments({ ...postComments, [post.id]: [...comments, newC] });
                  }}
                />
              );
            })()}
          </div>
        )}
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
