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
  X
} from 'lucide-react';

// Initialize Supabase Client
const SUPABASE_URL = 'https://your-supabase-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface PostItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'MUSIC' | 'VIDEOS' | 'NEWS' | 'AMAPIANO' | 'BEAT';
  cover: string;
  date: string;
  duration?: string;
  downloads?: string;
  views?: string;
  reads?: string;
  readTime?: string;
  body: string;
  lyrics?: string[];
  audioUrl?: string;
  videoUrl?: string;
  isHero?: boolean;
  socials?: {
    spotify?: string;
    tiktok?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
}

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

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<'home' | 'music' | 'videos' | 'news' | 'movies' | 'spotify' | 'promote' | 'musicupload' | 'beatstore' | 'services' | 'contact' | 'privacy' | 'dmca' | 'admin' | 'post' | 'radio-campaign' | 'tiktok-campaign'>('home');
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'MUSIC' | 'VIDEOS' | 'NEWS' | 'AMAPIANO'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [visiblePostLimit, setVisiblePostLimit] = useState(25);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [postComments, setPostComments] = useState<Record<string, { id: string; author: string; text: string; date: string }[]>>({
    '1': [
      { id: 'c1', author: 'Oluwaseun T.', text: 'This remix goes hard! Sarz log drums are unmatched.', date: '1 hour ago' },
      { id: 'c2', author: 'Chinedu K.', text: 'Tiwa verse is pure fire 🔥', date: '30 mins ago' }
    ]
  });
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentText, setCommentText] = useState('');
  const [shareCopied, setShareCopied] = useState(false);
  const [beatCart, setBeatCart] = useState<{ beatId: string; title: string; producer: string; licenseType: 'mp3' | 'wav' | 'stems' | 'exclusive'; price: number; cover: string }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [downloadFulfillmentModal, setDownloadFulfillmentModal] = useState<any | null>(null);
  
  // Campaign Post-Payment & Submission State
  const [activeRadioCheckout, setActiveRadioCheckout] = useState<{ packageName: string; price: number } | null>(null);
  const [radioSubmitted, setRadioSubmitted] = useState(false);
  const [activeTiktokCheckout, setActiveTiktokCheckout] = useState<{ tierName: string; videoCount: number; price: number } | null>(null);
  const [tiktokSubmitted, setTiktokSubmitted] = useState(false);
  const [tiktokCorporateQty, setTiktokCorporateQty] = useState<number>(1);
  const [tiktokStandardQty, setTiktokStandardQty] = useState<number>(1);
  const [tiktokEliteQty, setTiktokEliteQty] = useState<number>(1);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const renderFaqAndTestimonials = () => {
    const faqs = [
      { q: 'How long does campaign rollout take?', a: '24 to 48 hours for processing and campaign kick-off.' },
      { q: 'Do I need to upload large files?', a: 'No, simply paste your Spotify, Apple Music, Audiomack, or streaming link.' },
      { q: 'Are these promotions safe for my music profile?', a: '100% organic, policy-compliant campaigns targeting genuine listeners and creators.' },
      { q: 'How do I monitor my promotion progress?', a: 'You will receive campaign confirmation emails and performance reports.' },
      { q: 'What if my link has an error?', a: 'Our team verifies all submission links prior to servicing and contacts you immediately for corrections.' }
    ];

    const testimonials = [
      { quote: 'AfroPulse got my single onto three major radio rotations in less than a week. The process was super smooth!', author: 'Kev O.', role: 'Independent Artist' },
      { quote: 'The TikTok creator push gave our song the exact jumpstart it needed. Seeing micro-influencers naturally make videos with my track was amazing.', author: 'Tobi S.', role: 'Afrobeats Creator' },
      { quote: 'Fast turnaround and legitimate results. Booking campaigns through their self-service portal is the easiest strategy for independent releases.', author: 'Mark B.', role: 'Producer & Label Manager' }
    ];

    return (
      <div className="space-y-12 mt-16 pt-12 border-t border-stone-800/80">
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="text-center space-y-2">
            <span className="text-[10px] bg-amber-500/20 text-amber-400 font-bold px-3 py-1 rounded-full uppercase">Help & Support</span>
            <h3 className="text-2xl font-black text-white">Frequently Asked Questions</h3>
            <p className="text-xs text-stone-400">Everything you need to know about our campaign processing and delivery standards.</p>
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

        <div className="space-y-6 max-w-6xl mx-auto">
          <div className="text-center space-y-2">
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-3 py-1 rounded-full uppercase">Artist Success Stories</span>
            <h3 className="text-2xl font-black text-white">Trusted by Independent Creators</h3>
            <p className="text-xs text-stone-400">Read what artists, producers, and label managers say about our campaigns.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-stone-900 border border-stone-800 rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-sm">
                <p className="text-xs text-stone-300 leading-relaxed italic">"{t.quote}"</p>
                <div className="pt-4 border-t border-stone-800/80 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-amber-500/20 text-amber-400 font-black text-xs flex items-center justify-center shrink-0">
                    {t.author.charAt(0)}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">{t.author}</h5>
                    <p className="text-[10px] text-stone-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  // Audio Player State
  const [currentPlayingTrack, setCurrentPlayingTrack] = useState<PostItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  // Admin Auth & RBAC State (Instant login, 2FA optional toggle in settings)
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminTab, setAdminTab] = useState<'hero' | 'content' | 'beats' | 'pricing' | 'ads' | 'transactions' | 'workers' | 'security'>('hero');
  const [optional2FAEnabled, setOptional2FAEnabled] = useState(false);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentRoute]);

  // Dynamic Posts State
  const [posts, setPosts] = useState<PostItem[]>([
    {
      id: '1',
      title: 'Buga Dance (Remix)',
      subtitle: 'Kwamz ft. Tiwa Savage & Sarz',
      category: 'MUSIC',
      cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
      date: '2 hours ago',
      duration: '03:45',
      downloads: '142.5K',
      body: 'Kwamz teams up with the Queen of Afrobeats Tiwa Savage and legendary super-producer Sarz for an irresistible dancefloor anthem combining hypnotic log drums with seductive melodies.',
      lyrics: [
        '[Intro: Tiwa Savage & Kwamz]',
        'Omo Ologo ni mi o',
        'Sarz on the beat again oo',
        'When the drum sound heavy, make you scatter the floor...',
        '[Chorus]',
        'Buga for the money, dance for the grace',
        'Afropulse rhythm taking over the place!'
      ],
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      isHero: true,
      socials: {
        spotify: 'https://spotify.com/track/sample1',
        tiktok: '@kwamzofficial',
        instagram: '@kwamzmusic',
        twitter: '@kwamz',
        youtube: 'https://youtube.com/watch?v=sample1'
      }
    },
    {
      id: '2',
      title: 'Golden Rhythms (Amapiano Master)',
      subtitle: 'The Afrovibe Collective & Kabza Keys',
      category: 'AMAPIANO',
      cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
      date: '3 hours ago',
      duration: '04:12',
      downloads: '98.4K',
      body: 'An immersive journey through deep log drums and soaring piano chords straight from the underground clubs of Johannesburg and Lagos.',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      socials: {
        spotify: 'https://spotify.com/track/sample2',
        instagram: '@kabzakeys'
      }
    },
    {
      id: '3',
      title: 'Lagos Nights (Official 4K Video)',
      subtitle: 'Lumina ft. Burna Boy (Dir. TG Omori)',
      category: 'VIDEOS',
      cover: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80',
      date: '5 hours ago',
      duration: '03:42',
      views: '2.8M views',
      body: 'Cinematic visual masterpiece capturing the vibrant neon-lit nightlife of Lagos island.',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      socials: {
        youtube: 'https://youtube.com/watch?v=lagosnights'
      }
    },
    {
      id: '4',
      title: 'African Music Awards 2026: Historic Winners',
      subtitle: 'Burna Boy, Tyla, and Rema Dominate Dallas',
      category: 'NEWS',
      cover: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
      date: '6 hours ago',
      reads: '45.2K reads',
      readTime: '4 min read',
      body: 'The 2026 African Muzik Magazine Awards concluded in Dallas with historic triumphs for Afrobeats and Amapiano pioneers.'
    }
  ]);

  const [featuredTrackId, setFeaturedTrackId] = useState<string>('1');

  // Beat Store State
  const [beats, setBeats] = useState<BeatItem[]>([
    {
      id: 'b1',
      title: 'Lagos Sunset (Afrobeat Instrumental)',
      producer: 'HD Sounz / AfroPulse',
      bpm: 112,
      key: 'Am',
      genre: 'Afrobeat',
      cover: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80',
      previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
      prices: { mp3: 35000, wav: 70000, stems: 140000, exclusive: 350000 }
    },
    {
      id: 'b2',
      title: 'Sandton Groove (Amapiano Beat)',
      producer: 'Kabza Keys',
      bpm: 115,
      key: 'F#m',
      genre: 'Amapiano',
      cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80',
      previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
      prices: { mp3: 35000, wav: 70000, stems: 140000, exclusive: 350000 }
    }
  ]);

  // Universal Pricing Matrix State with Full CRUD Editing
  const [prTiers, setPrTiers] = useState([
    { id: 1, name: 'Bronze Promotion', price: 60000, desc: 'Official Song Publication & Feature on AfroPulse • Sponsored Social Media Ads Push • TikTok Viral Creator Push • Placement on 2 Active Spotify Playlists' },
    { id: 2, name: 'Silver Promotion', price: 150000, desc: 'Everything in Bronze • Top Nigerian Entertainment Blog Syndication • Dedicated TikTok Influencer Campaign • Placement on 3 Top African Spotify Playlists • Press Release & Email Servicing to Regional Radio DJs & Tastemakers' },
    { id: 3, name: 'Diamond Promotion', price: 350000, desc: 'Ultimate High-End Campaign • Guaranteed Multi-Station Nigerian Radio Airplay Rotation Coordination • High-Impact TikTok Viral Challenge & Creator Push • Placement on Premium European & African Spotify Playlists • Homepage Banner Placement on AfroPulse + Targeted Social Ad Campaign • Club DJ Servicing & Media Press Release Distribution' }
  ]);

  const [spotifyPackages, setSpotifyPackages] = useState([
    { id: 1, name: 'Single Playlist (African Playlist)', price: 45000, playlists: 1, streams: '1 Top African Playlist Placement' },
    { id: 2, name: 'African Regional Focus (3 Top Playlists)', price: 77000, playlists: 3, streams: 'Placement across 3 top African playlists' },
    { id: 3, name: 'Europe & International Campaign', price: 115000, playlists: 4, streams: '4 Premium European & Diaspora Playlist Placements' }
  ]);

  // Editing state for pricing CRUD
  const [editingPrId, setEditingPrId] = useState<number | null>(null);
  const [editPrForm, setEditPrForm] = useState({ name: '', price: 0, desc: '' });

  const [editingSpotifyId, setEditingSpotifyId] = useState<number | null>(null);
  const [editSpotifyForm, setEditSpotifyForm] = useState({ name: '', price: 0, streams: '' });

  // Workers / Team Management State
  const [workers, setWorkers] = useState([
    { id: '1', name: 'DJ Klem', role: 'Editor', email: 'djklem@afropulse.ng', accessLevel: 'Staff Editor • Beats & Music' },
    { id: '2', name: 'Amina Bello', role: 'PR Manager', email: 'amina@afropulse.ng', accessLevel: 'PR & Promotions' }
  ]);
  const [workerForm, setWorkerForm] = useState({ name: '', role: 'Editor', email: '', accessLevel: 'Staff Contributor' });

  // Beat Store Licensing Modal State
  const [selectedBeatForModal, setSelectedBeatForModal] = useState<BeatItem | null>(null);
  const [isBeatModalOpen, setIsBeatModalOpen] = useState(false);

  // Ad Manager State with Direct File Uploads
  const [ads, setAds] = useState({
    midArticle: {
      image: 'https://images.unsplash.com/photo-1614680376593-902f749f7ffc?auto=format&fit=crop&w=1200&q=80',
      link: 'https://afropulse.com.ng/promote',
      caption: '🔥 Promote Your New Single on AfroPulse Today - Guaranteed 100k+ Reach!',
      active: true
    },
    bottomBanner: {
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1600&q=80',
      link: 'https://afropulse.com.ng/beatstore',
      caption: '🎧 Premium Untagged Afrobeat & Amapiano Instrumentals Available Now!',
      active: true
    }
  });

  // Admin Uploader Form State (Direct File Pickers)
  const [uform, setUform] = useState({
    title: '',
    subtitle: '',
    category: 'MUSIC' as 'MUSIC' | 'VIDEOS' | 'NEWS' | 'AMAPIANO',
    coverFile: null as File | null,
    coverPreview: '',
    audioFile: null as File | null,
    videoFile: null as File | null,
    youtubeUrl: '',
    body: '',
    lyrics: '',
    spotify: '',
    tiktok: '',
    instagram: '',
    twitter: '',
    youtubeChannel: '',
    isHero: false
  });

  // Admin Beat Uploader State
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

  // Helper for playing tracks
  const handlePlayTrack = (track: PostItem) => {
    if (!track.audioUrl) return;
    if (currentPlayingTrack?.id === track.id) {
      if (isPlaying) {
        audioElement?.pause();
        setIsPlaying(false);
      } else {
        audioElement?.play();
        setIsPlaying(true);
      }
    } else {
      if (audioElement) {
        audioElement.pause();
      }
      const audio = new Audio(track.audioUrl);
      audio.play();
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string, type: 'cover' | 'audio' | 'video' | 'preview' | 'mp3' | 'wav' | 'stems' | 'adMid' | 'adBottom') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    if (field === 'uform') {
      if (type === 'cover') setUform(prev => ({ ...prev, coverFile: file, coverPreview: previewUrl }));
      if (type === 'audio') setUform(prev => ({ ...prev, audioFile: file }));
      if (type === 'video') setUform(prev => ({ ...prev, videoFile: file }));
    } else if (field === 'bform') {
      if (type === 'cover') setBform(prev => ({ ...prev, coverFile: file, coverPreview: previewUrl }));
      if (type === 'preview') setBform(prev => ({ ...prev, previewFile: file }));
      if (type === 'mp3') setBform(prev => ({ ...prev, mp3File: file }));
      if (type === 'wav') setBform(prev => ({ ...prev, wavFile: file }));
      if (type === 'stems') setBform(prev => ({ ...prev, stemsFile: file }));
    } else if (field === 'ads') {
      if (type === 'adMid') setAds(prev => ({ ...prev, midArticle: { ...prev.midArticle, image: previewUrl } }));
      if (type === 'adBottom') setAds(prev => ({ ...prev, bottomBanner: { ...prev.bottomBanner, image: previewUrl } }));
    }
  };

  const handlePublishPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uform.title) {
      alert('Please enter a title');
      return;
    }
    const newPost: PostItem = {
      id: Date.now().toString(),
      title: uform.title,
      subtitle: uform.subtitle || 'AfroPulse Exclusive',
      category: uform.category,
      cover: uform.coverPreview || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
      date: 'Just now',
      duration: '03:30',
      downloads: '12',
      body: uform.body,
      lyrics: uform.lyrics ? uform.lyrics.split('\n') : undefined,
      audioUrl: uform.audioFile ? URL.createObjectURL(uform.audioFile) : 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      videoUrl: uform.videoFile ? URL.createObjectURL(uform.videoFile) : (uform.youtubeUrl || undefined),
      isHero: uform.isHero,
      socials: {
        spotify: uform.spotify,
        tiktok: uform.tiktok,
        instagram: uform.instagram,
        twitter: uform.twitter,
        youtube: uform.youtubeChannel
      }
    };

    let updated = [newPost, ...posts];
    if (uform.isHero) {
      updated = updated.map(p => p.id === newPost.id ? { ...p, isHero: true } : { ...p, isHero: false });
      setFeaturedTrackId(newPost.id);
    }
    setPosts(updated);
    alert('Post published successfully to live AfroPulse feed!');
    setUform({
      title: '',
      subtitle: '',
      category: 'MUSIC',
      coverFile: null,
      coverPreview: '',
      audioFile: null,
      videoFile: null,
      youtubeUrl: '',
      body: '',
      lyrics: '',
      spotify: '',
      tiktok: '',
      instagram: '',
      twitter: '',
      youtubeChannel: '',
      isHero: false
    });
  };

  const handlePublishBeat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bform.title) {
      alert('Please enter beat title');
      return;
    }
    const newBeat: BeatItem = {
      id: 'b-' + Date.now(),
      title: bform.title,
      producer: bform.producer,
      bpm: bform.bpm,
      key: bform.key,
      genre: bform.genre,
      cover: bform.coverPreview || 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80',
      previewUrl: bform.previewFile ? URL.createObjectURL(bform.previewFile) : 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
      prices: {
        mp3: Number(bform.priceMp3),
        wav: Number(bform.priceWav),
        stems: Number(bform.priceStems),
        exclusive: Number(bform.priceExclusive)
      }
    };
    setBeats([newBeat, ...beats]);
    alert('Beat published successfully to Beat Store!');
    setBform({
      title: '',
      producer: 'HD Sounz / AfroPulse',
      bpm: 120,
      key: 'Cm',
      genre: 'Afrobeat',
      coverFile: null,
      coverPreview: '',
      previewFile: null,
      mp3File: null,
      wavFile: null,
      stemsFile: null,
      priceMp3: 15000,
      priceWav: 35000,
      priceStems: 75000,
      priceExclusive: 250000
    });
  };

  const flagshipTrack = posts.find(p => p.id === featuredTrackId) || posts[0];

  return (
    <main className="w-full min-h-screen bg-[#0d0d0d] text-white overflow-x-hidden flex flex-col font-sans">
      
      {/* 1. HEADER & BRANDING (Logo centered/aligned + Real-time search bar directly below) */}
      {currentRoute !== 'admin' && (
        <header className="sticky top-0 z-50 bg-[#0d0d0d]/95 backdrop-blur-md border-b border-gray-800 py-3">
          <div className="max-w-6xl mx-auto px-4 flex flex-col items-center gap-3">
            
            {/* Top Row: Logo & Top Nav Links */}
            <div className="w-full flex items-center justify-between">
              <div 
                onClick={() => setCurrentRoute('home')} 
                className="cursor-pointer flex items-center gap-2 group mx-auto md:mx-0"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
                  <Flame className="w-5 h-5 text-stone-950 fill-stone-950" />
                </div>
                <div>
                  <h1 className="text-xl font-black tracking-wider bg-gradient-to-r from-white via-stone-200 to-amber-400 bg-clip-text text-transparent text-center md:text-left">
                    AFROPULSE
                  </h1>
                  <p className="text-[9px] tracking-widest text-amber-500 uppercase font-semibold">
                    African Entertainment Portal
                  </p>
                </div>
              </div>

              <div className="hidden md:flex items-center gap-4">
                <button 
                  onClick={() => setCurrentRoute('beatstore')} 
                  className="text-xs font-semibold text-stone-300 hover:text-amber-400 transition"
                >
                  Beat Store
                </button>
                <button 
                  onClick={() => setCurrentRoute('spotify')} 
                  className="text-xs font-semibold text-stone-300 hover:text-amber-400 transition"
                >
                  Spotify
                </button>
                <button 
                  onClick={() => setCurrentRoute('admin')} 
                  className="text-xs text-stone-400 hover:text-stone-200 bg-stone-900 px-3 py-1.5 rounded-lg border border-stone-800"
                >
                  Admin Panel
                </button>
                <button 
                  onClick={() => setCurrentRoute('promote')} 
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold px-4 py-2 rounded-full text-xs shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
                >
                  Promote Your Music & PR
                </button>
              </div>
            </div>

            {/* Real-time Search Bar Directly Below Logo */}
            <div className="w-full max-w-2xl relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="Search trending songs, music videos, movies, news & gossip..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-stone-900/90 border border-stone-800 rounded-full pl-10 pr-4 py-2.5 text-xs md:text-sm text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500/50 transition-colors shadow-inner"
              />
            </div>

          </div>
        </header>
      )}

      {/* 2. RECTANGULAR SERVICE CARDS NAVIGATION (Structured Grid) */}
      {currentRoute !== 'admin' && (
        <div className="bg-[#0d0d0d] border-b border-gray-800 py-3">
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            <button 
              onClick={() => { setCurrentRoute('music'); setActiveCategory('MUSIC'); }}
              className="px-4 py-2.5 bg-[#161616] border border-gray-700/70 rounded-xl text-xs md:text-sm font-medium text-white hover:border-amber-500 hover:bg-[#1f1f1f] transition-all flex items-center justify-center gap-2 shadow-sm text-center"
            >
              <MusicIcon className="w-4 h-4 text-emerald-400 shrink-0" /> Music
            </button>
            <button 
              onClick={() => { setCurrentRoute('movies'); setActiveCategory('VIDEOS'); }}
              className="px-4 py-2.5 bg-[#161616] border border-gray-700/70 rounded-xl text-xs md:text-sm font-medium text-white hover:border-amber-500 hover:bg-[#1f1f1f] transition-all flex items-center justify-center gap-2 shadow-sm text-center"
            >
              <Video className="w-4 h-4 text-blue-400 shrink-0" /> Movies
            </button>
            <button 
              onClick={() => { setCurrentRoute('videos'); setActiveCategory('VIDEOS'); }}
              className="px-4 py-2.5 bg-[#161616] border border-gray-700/70 rounded-xl text-xs md:text-sm font-medium text-white hover:border-amber-500 hover:bg-[#1f1f1f] transition-all flex items-center justify-center gap-2 shadow-sm text-center"
            >
              <Play className="w-4 h-4 text-amber-400 shrink-0" /> Music Videos
            </button>
            <button 
              onClick={() => setCurrentRoute('spotify')}
              className="px-4 py-2.5 bg-[#161616] border border-gray-700/70 rounded-xl text-xs md:text-sm font-medium text-white hover:border-amber-500 hover:bg-[#1f1f1f] transition-all flex items-center justify-center gap-2 shadow-sm text-center"
            >
              <Disc className="w-4 h-4 text-green-400 shrink-0" /> Spotify Playlisting
            </button>
            <button 
              onClick={() => setCurrentRoute('promote')}
              className="px-4 py-2.5 bg-[#161616] border border-gray-700/70 rounded-xl text-xs md:text-sm font-medium text-white hover:border-amber-500 hover:bg-[#1f1f1f] transition-all flex items-center justify-center gap-2 shadow-sm text-center"
            >
              <Shield className="w-4 h-4 text-amber-400 shrink-0" /> Music Promotion & PR
            </button>
            <button 
              onClick={() => setCurrentRoute('musicupload')}
              className="px-4 py-2.5 bg-[#161616] border border-gray-700/70 rounded-xl text-xs md:text-sm font-medium text-white hover:border-amber-500 hover:bg-[#1f1f1f] transition-all flex items-center justify-center gap-2 shadow-sm text-center"
            >
              <Upload className="w-4 h-4 text-purple-400 shrink-0" /> Music Upload
            </button>
            <button 
              onClick={() => { setCurrentRoute('news'); setActiveCategory('NEWS'); }}
              className="px-4 py-2.5 bg-[#161616] border border-gray-700/70 rounded-xl text-xs md:text-sm font-medium text-white hover:border-amber-500 hover:bg-[#1f1f1f] transition-all flex items-center justify-center gap-2 shadow-sm text-center"
            >
              <Newspaper className="w-4 h-4 text-amber-500 shrink-0" /> News & Gossip
            </button>
            <button 
              onClick={() => setCurrentRoute('beatstore')}
              className="px-4 py-2.5 bg-[#161616] border border-gray-700/70 rounded-xl text-xs md:text-sm font-medium text-white hover:border-amber-500 hover:bg-[#1f1f1f] transition-all flex items-center justify-center gap-2 shadow-sm text-center"
            >
              <Radio className="w-4 h-4 text-red-400 shrink-0" /> Beat Store
            </button>
          </div>
        </div>
      )}

      {/* DYNAMIC HEADER BANNER WIRING (Connected to Ad Manager) */}
      {currentRoute !== 'admin' && ads.midArticle.active && (
        <div className="bg-stone-900 border-b border-stone-800 py-3 px-4">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src={ads.midArticle.image} alt="" className="w-24 h-12 rounded-lg object-cover border border-stone-700" />
              <div>
                <span className="text-[9px] bg-amber-500/20 text-amber-400 font-bold px-2 py-0.5 rounded uppercase">Sponsored Banner</span>
                <p className="text-xs font-bold text-white mt-0.5">{ads.midArticle.caption}</p>
              </div>
            </div>
            <a
              href={ads.midArticle.link}
              target="_blank"
              rel="noreferrer"
              className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-4 py-1.5 rounded-lg text-xs transition-all"
            >
              Visit Sponsor →
            </a>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1">
        
        {/* ================= ADMIN DASHBOARD ROUTE ================= */}
        {currentRoute === 'admin' ? (
          <div className="min-h-screen bg-[#060504] text-stone-100 flex flex-col">
            
            {!isAdminLoggedIn ? (
              /* INSTANT LOGIN (NO MANDATORY 2FA) */
              <div className="flex-1 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-stone-900/90 border border-stone-800 rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                      <Shield className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold tracking-wide">AfroPulse Admin Portal</h2>
                      <p className="text-xs text-stone-400">Secure Instant Sign In</p>
                    </div>
                  </div>

                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-stone-300 mb-1">Admin Email</label>
                      <input
                        type="email"
                        required
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        placeholder="admin@afropulse.com.ng"
                        className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-300 mb-1">Password</label>
                      <input
                        type="password"
                        required
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold py-3 rounded-xl shadow-lg transition-all"
                    >
                      Log In Instantly
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentRoute('home')}
                      className="w-full mt-2 bg-stone-800 hover:bg-stone-700 text-stone-300 font-medium py-2.5 rounded-xl text-xs transition-all"
                    >
                      Return to Public Website
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              /* ISOLATED EXECUTIVE COMMAND CENTER */
              <div className="flex-1 flex flex-col">
                
                {/* Admin Header */}
                <header className="bg-stone-950 border-b border-stone-800 px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold tracking-wide">AfroPulse Executive Command Center</h2>
                      <p className="text-xs text-emerald-400 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Admin Session Active
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setIsAdminLoggedIn(false);
                        setCurrentRoute('home');
                      }}
                      className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all"
                    >
                      <LogOut className="w-4 h-4" />
                      Log Out & Exit
                    </button>
                  </div>
                </header>

                <div className="flex-1 flex flex-col md:flex-row">
                  
                  {/* Admin Sidebar Tabs */}
                  <aside className="w-full md:w-64 bg-stone-950/60 border-r border-stone-800 p-4 space-y-1">
                    <button
                      onClick={() => setAdminTab('hero')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${adminTab === 'hero' ? 'bg-amber-500 text-stone-950 font-bold shadow-lg shadow-amber-500/10' : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/50'}`}
                    >
                      <Flame className="w-4 h-4" />
                      Hero / Featured Track
                    </button>
                    <button
                      onClick={() => setAdminTab('content')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${adminTab === 'content' ? 'bg-amber-500 text-stone-950 font-bold shadow-lg shadow-amber-500/10' : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/50'}`}
                    >
                      <Upload className="w-4 h-4" />
                      Upload & Content Manager
                    </button>
                    <button
                      onClick={() => setAdminTab('beats')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${adminTab === 'beats' ? 'bg-amber-500 text-stone-950 font-bold shadow-lg shadow-amber-500/10' : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/50'}`}
                    >
                      <Disc className="w-4 h-4" />
                      Beat Store Manager
                    </button>
                    <button
                      onClick={() => setAdminTab('pricing')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${adminTab === 'pricing' ? 'bg-amber-500 text-stone-950 font-bold shadow-lg shadow-amber-500/10' : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/50'}`}
                    >
                      <DollarSign className="w-4 h-4" />
                      Universal Pricing Editor
                    </button>
                    <button
                      onClick={() => setAdminTab('ads')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${adminTab === 'ads' ? 'bg-amber-500 text-stone-950 font-bold shadow-lg shadow-amber-500/10' : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/50'}`}
                    >
                      <ImageIcon className="w-4 h-4" />
                      Ad Banner Manager
                    </button>
                    <button
                      onClick={() => setAdminTab('transactions')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${adminTab === 'transactions' ? 'bg-amber-500 text-stone-950 font-bold shadow-lg shadow-amber-500/10' : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/50'}`}
                    >
                      <Activity className="w-4 h-4" />
                      Paystack Ledger
                    </button>
                    <button
                      onClick={() => setAdminTab('workers')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${adminTab === 'workers' ? 'bg-amber-500 text-stone-950 font-bold shadow-lg shadow-amber-500/10' : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/50'}`}
                    >
                      <Users className="w-4 h-4" />
                      Worker RBAC Control
                    </button>
                    <button
                      onClick={() => setAdminTab('security')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${adminTab === 'security' ? 'bg-amber-500 text-stone-950 font-bold shadow-lg shadow-amber-500/10' : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/50'}`}
                    >
                      <KeyIcon className="w-4 h-4" />
                      Master Security & 2FA
                    </button>
                  </aside>

                  {/* Admin Tab Content */}
                  <div className="flex-1 p-6 md:p-10 overflow-y-auto">
                    
                    {/* 1. HERO / FEATURED TRACK MANAGER */}
                    {adminTab === 'hero' && (
                      <div className="max-w-4xl space-y-6">
                        <div>
                          <h3 className="text-xl font-bold">Hero Section & Featured Track Manager</h3>
                          <p className="text-xs text-stone-400">Instantly select and update the #1 trending showcase banner across the entire portal.</p>
                        </div>

                        <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-6 space-y-6">
                          <div className="flex items-center gap-4 bg-stone-950 p-4 rounded-xl border border-stone-800">
                            <img src={flagshipTrack.cover} alt="" className="w-16 h-16 rounded-xl object-cover" />
                            <div className="flex-1">
                              <span className="text-[10px] bg-amber-500/20 text-amber-400 font-bold px-2 py-0.5 rounded-full uppercase">Current #1 Hero Song</span>
                              <h4 className="text-base font-bold text-white mt-1">{flagshipTrack.title}</h4>
                              <p className="text-xs text-stone-400">{flagshipTrack.subtitle}</p>
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-stone-300 mb-2">Select Track from Live Posts Database</label>
                            <div className="space-y-3">
                              {posts.map(p => (
                                <div key={p.id} className="flex items-center justify-between p-3 bg-stone-950 border border-stone-800 hover:border-amber-500/50 rounded-xl transition-all">
                                  <div className="flex items-center gap-3">
                                    <img src={p.cover} alt="" className="w-12 h-12 rounded-lg object-cover" />
                                    <div>
                                      <h5 className="text-sm font-semibold text-white">{p.title}</h5>
                                      <p className="text-xs text-stone-400">{p.subtitle} • <span className="text-amber-400">{p.category}</span></p>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => {
                                      setFeaturedTrackId(p.id);
                                      setPosts(posts.map(item => item.id === p.id ? { ...item, isHero: true } : { ...item, isHero: false }));
                                      alert(`Successfully set "${p.title}" as #1 Top Featured Hero Track!`);
                                    }}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${featuredTrackId === p.id ? 'bg-emerald-500 text-stone-950' : 'bg-amber-500 hover:bg-amber-400 text-stone-950'}`}
                                  >
                                    {featuredTrackId === p.id ? 'Active Hero Track' : 'Set as Hero Song'}
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 2. UPLOAD & CONTENT MANAGER (DIRECT FILE PICKERS) */}
                    {adminTab === 'content' && (
                      <div className="max-w-4xl space-y-8">
                        <div>
                          <h3 className="text-xl font-bold">Music & Video Uploader Command</h3>
                          <p className="text-xs text-stone-400">Direct file pickers, rich metadata, and social handle integration.</p>
                        </div>

                        {/* Uploader Form */}
                        <form onSubmit={handlePublishPost} className="bg-stone-900/90 border border-stone-800 rounded-2xl p-6 space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-semibold text-stone-300 mb-1">Track / Article Title</label>
                              <input
                                type="text"
                                required
                                value={uform.title}
                                onChange={(e) => setUform({ ...uform, title: e.target.value })}
                                placeholder="e.g. Omo Ologo (Remix)"
                                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-stone-300 mb-1">Featured Artist(s) / Subtitle</label>
                              <input
                                type="text"
                                value={uform.subtitle}
                                onChange={(e) => setUform({ ...uform, subtitle: e.target.value })}
                                placeholder="e.g. ft. Burna Boy & Tyla"
                                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-semibold text-stone-300 mb-1">Category / Post Type</label>
                              <select
                                value={uform.category}
                                onChange={(e) => setUform({ ...uform, category: e.target.value as any })}
                                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                              >
                                <option value="MUSIC">Music Single Drop</option>
                                <option value="AMAPIANO">Amapiano Vault</option>
                                <option value="VIDEOS">Official Music Video</option>
                                <option value="MOVIES">🎬 Movie Premieres & Cinematic Streams</option>
                                <option value="NEWS">Gossip & News Article</option>
                              </select>
                            </div>
                            <div className="flex items-center gap-3 pt-6">
                              <input
                                type="checkbox"
                                id="heroToggle"
                                checked={uform.isHero}
                                onChange={(e) => setUform({ ...uform, isHero: e.target.checked })}
                                className="w-4 h-4 accent-amber-500 rounded"
                              />
                              <label htmlFor="heroToggle" className="text-xs font-semibold text-amber-400">
                                🔥 Set immediately as #1 Featured Track (Hero Banner)
                              </label>
                            </div>
                          </div>

                          {/* Direct File Pickers */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                            {/* Cover Artwork Uploader */}
                            <div className="bg-stone-950 border border-stone-800 p-4 rounded-xl text-center space-y-3">
                              <label className="block text-xs font-bold text-stone-300">Cover Artwork (PNG/JPG)</label>
                              {uform.coverPreview ? (
                                <img src={uform.coverPreview} alt="" className="w-20 h-20 mx-auto rounded-lg object-cover" />
                              ) : (
                                <div className="w-20 h-20 mx-auto rounded-lg bg-stone-900 border border-dashed border-stone-700 flex items-center justify-center text-stone-500">
                                  <ImageIcon className="w-6 h-6" />
                                </div>
                              )}
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, 'uform', 'cover')}
                                className="w-full text-xs text-stone-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-500 file:text-stone-950 hover:file:bg-amber-400 cursor-pointer"
                              />
                            </div>

                            {/* Audio File Uploader */}
                            <div className="bg-stone-950 border border-stone-800 p-4 rounded-xl text-center space-y-3">
                              <label className="block text-xs font-bold text-stone-300">Audio File (MP3 / WAV)</label>
                              <div className="w-20 h-20 mx-auto rounded-lg bg-stone-900 border border-dashed border-stone-700 flex items-center justify-center text-amber-400">
                                <MusicIcon className="w-6 h-6" />
                              </div>
                              <input
                                type="file"
                                accept="audio/*"
                                onChange={(e) => handleFileChange(e, 'uform', 'audio')}
                                className="w-full text-xs text-stone-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-500 file:text-stone-950 hover:file:bg-amber-400 cursor-pointer"
                              />
                            </div>

                            {/* Video File Uploader */}
                            <div className="bg-stone-950 border border-stone-800 p-4 rounded-xl text-center space-y-3">
                              <label className="block text-xs font-bold text-stone-300">Video Asset (MP4)</label>
                              <div className="w-20 h-20 mx-auto rounded-lg bg-stone-900 border border-dashed border-stone-700 flex items-center justify-center text-blue-400">
                                <VideoIcon className="w-6 h-6" />
                              </div>
                              <input
                                type="file"
                                accept="video/*"
                                onChange={(e) => handleFileChange(e, 'uform', 'video')}
                                className="w-full text-xs text-stone-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-500 file:text-stone-950 hover:file:bg-amber-400 cursor-pointer"
                              />
                            </div>
                          </div>

                          {/* Embedded YouTube / Movie Premiere Link */}
                          <div className="bg-stone-950 border border-stone-800 p-4 rounded-xl space-y-2">
                            <label className="block text-xs font-bold text-amber-400">Embedded YouTube Link / Movie Premiere Embed URL (e.g. https://www.youtube.com/embed/...)</label>
                            <input
                              type="text"
                              placeholder="https://www.youtube.com/embed/..."
                              value={uform.youtubeUrl}
                              onChange={(e) => setUform({ ...uform, youtubeUrl: e.target.value })}
                              className="w-full bg-stone-900 border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                            />
                            <p className="text-[10px] text-stone-400">Paste YouTube embed URL or watch link for music videos and movie premieres without heavy file hosting.</p>
                          </div>

                          {/* Social Handles Inputs */}
                          <div className="space-y-3 pt-2 border-t border-stone-800">
                            <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider">Artist & Personality Social Handles</label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <input
                                type="text"
                                placeholder="Spotify Artist/Track URL"
                                value={uform.spotify}
                                onChange={(e) => setUform({ ...uform, spotify: e.target.value })}
                                className="bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100"
                              />
                              <input
                                type="text"
                                placeholder="TikTok Handle (@username)"
                                value={uform.tiktok}
                                onChange={(e) => setUform({ ...uform, tiktok: e.target.value })}
                                className="bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100"
                              />
                              <input
                                type="text"
                                placeholder="Instagram Handle"
                                value={uform.instagram}
                                onChange={(e) => setUform({ ...uform, instagram: e.target.value })}
                                className="bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100"
                              />
                              <input
                                type="text"
                                placeholder="X (Twitter) Handle"
                                value={uform.twitter}
                                onChange={(e) => setUform({ ...uform, twitter: e.target.value })}
                                className="bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100"
                              />
                              <input
                                type="text"
                                placeholder="YouTube Channel Link"
                                value={uform.youtubeChannel}
                                onChange={(e) => setUform({ ...uform, youtubeChannel: e.target.value })}
                                className="bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100"
                              />
                            </div>
                          </div>

                          {/* Description & Lyrics */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-semibold text-stone-300 mb-1">Rich-Text Description / Body</label>
                              <textarea
                                rows={4}
                                value={uform.body}
                                onChange={(e) => setUform({ ...uform, body: e.target.value })}
                                placeholder="Enter article summary, song background or press release..."
                                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-stone-300 mb-1">Song Lyrics (Optional)</label>
                              <textarea
                                rows={4}
                                value={uform.lyrics}
                                onChange={(e) => setUform({ ...uform, lyrics: e.target.value })}
                                placeholder="[Verse 1]&#10;Enter lyrics line by line..."
                                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-sm font-mono text-amber-200/90 focus:outline-none focus:border-amber-500"
                              />
                            </div>
                          </div>

                          <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold py-3.5 rounded-xl shadow-lg transition-all"
                          >
                            Publish Post to Live AfroPulse Feed
                          </button>
                        </form>

                        {/* Fixed Content Manager Table */}
                        <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-6 space-y-4">
                          <h4 className="text-base font-bold text-white">Live Content Manager (Delete & Edit Posts)</h4>
                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                              <thead className="bg-stone-950 text-stone-400 uppercase tracking-wider border-b border-stone-800">
                                <tr>
                                  <th className="p-3">Post ID</th>
                                  <th className="p-3">Type Badge</th>
                                  <th className="p-3">Title</th>
                                  <th className="p-3">Date Posted</th>
                                  <th className="p-3 text-right">Actions</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-stone-800">
                                {posts.map(p => (
                                  <tr key={p.id} className="hover:bg-stone-950/50">
                                    <td className="p-3 font-mono text-stone-400">#{p.id}</td>
                                    <td className="p-3">
                                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400">
                                        {p.category}
                                      </span>
                                    </td>
                                    <td className="p-3 font-semibold text-white">{p.title}</td>
                                    <td className="p-3 text-stone-400">{p.date}</td>
                                    <td className="p-3 text-right">
                                      <button
                                        onClick={() => {
                                          if (confirm(`Are you sure you want to delete "${p.title}"?`)) {
                                            setPosts(posts.filter(item => item.id !== p.id));
                                          }
                                        }}
                                        className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-1.5 rounded-lg font-medium transition-all inline-flex items-center gap-1"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        Delete
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                      </div>
                    )}

                    {/* 3. BEAT STORE MANAGER TAB (Direct File Uploaders) */}
                    {adminTab === 'beats' && (
                      <div className="max-w-4xl space-y-8">
                        <div>
                          <h3 className="text-xl font-bold">Beat Store Manager & Direct Deliverable Uploads</h3>
                          <p className="text-xs text-stone-400">Direct file uploaders for untagged MP3, high-res WAV, and trackout stems ZIP archives.</p>
                        </div>

                        {/* Beat Upload Form */}
                        <form onSubmit={handlePublishBeat} className="bg-stone-900/90 border border-stone-800 rounded-2xl p-6 space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-xs font-semibold text-stone-300 mb-1">Beat Title</label>
                              <input
                                type="text"
                                required
                                value={bform.title}
                                onChange={(e) => setBform({ ...bform, title: e.target.value })}
                                placeholder="e.g. Lagos Sunset"
                                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-sm text-stone-100"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-stone-300 mb-1">Producer Tag</label>
                              <input
                                type="text"
                                value={bform.producer}
                                onChange={(e) => setBform({ ...bform, producer: e.target.value })}
                                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-sm text-stone-100"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-stone-300 mb-1">Genre</label>
                              <select
                                value={bform.genre}
                                onChange={(e) => setBform({ ...bform, genre: e.target.value })}
                                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-sm text-stone-100"
                              >
                                <option value="Afrobeat">Afrobeat</option>
                                <option value="Amapiano">Amapiano</option>
                                <option value="Dancehall">Dancehall</option>
                                <option value="Hip Hop">Hip Hop</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-semibold text-stone-300 mb-1">BPM</label>
                              <input
                                type="number"
                                value={bform.bpm}
                                onChange={(e) => setBform({ ...bform, bpm: Number(e.target.value) })}
                                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-sm text-stone-100"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-stone-300 mb-1">Musical Key</label>
                              <input
                                type="text"
                                value={bform.key}
                                onChange={(e) => setBform({ ...bform, key: e.target.value })}
                                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-sm text-stone-100"
                              />
                            </div>
                          </div>

                          {/* Direct Deliverable File Dropzones */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-stone-950 border border-stone-800 p-4 rounded-xl text-center space-y-2">
                              <label className="block text-xs font-bold text-stone-300">Beat Cover Art</label>
                              {bform.coverPreview ? (
                                <img src={bform.coverPreview} alt="" className="w-16 h-16 mx-auto rounded-lg object-cover" />
                              ) : (
                                <div className="w-16 h-16 mx-auto rounded-lg bg-stone-900 flex items-center justify-center text-stone-500">
                                  <ImageIcon className="w-5 h-5" />
                                </div>
                              )}
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, 'bform', 'cover')}
                                className="w-full text-xs text-stone-400 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-xs file:bg-amber-500 file:text-stone-950 cursor-pointer"
                              />
                            </div>

                            <div className="bg-stone-950 border border-stone-800 p-4 rounded-xl text-center space-y-2">
                              <label className="block text-xs font-bold text-stone-300">Watermarked Preview Audio</label>
                              <div className="w-16 h-16 mx-auto rounded-lg bg-stone-900 flex items-center justify-center text-amber-400">
                                <MusicIcon className="w-5 h-5" />
                              </div>
                              <input
                                type="file"
                                accept="audio/*"
                                onChange={(e) => handleFileChange(e, 'bform', 'preview')}
                                className="w-full text-xs text-stone-400 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-xs file:bg-amber-500 file:text-stone-950 cursor-pointer"
                              />
                            </div>

                            <div className="bg-stone-950 border border-stone-800 p-4 rounded-xl text-center space-y-2">
                              <label className="block text-xs font-bold text-stone-300">Stems ZIP Archive</label>
                              <div className="w-16 h-16 mx-auto rounded-lg bg-stone-900 flex items-center justify-center text-emerald-400">
                                <Download className="w-5 h-5" />
                              </div>
                              <input
                                type="file"
                                accept=".zip,.rar"
                                onChange={(e) => handleFileChange(e, 'bform', 'stems')}
                                className="w-full text-xs text-stone-400 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-xs file:bg-amber-500 file:text-stone-950 cursor-pointer"
                              />
                            </div>
                          </div>

                          {/* Pricing Inputs */}
                          <div className="space-y-3 pt-2 border-t border-stone-800">
                            <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider">Licensing Tier Prices (₦)</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              <div>
                                <label className="block text-[10px] text-stone-400 mb-1">Basic MP3 (₦)</label>
                                <input
                                  type="number"
                                  value={bform.priceMp3}
                                  onChange={(e) => setBform({ ...bform, priceMp3: Number(e.target.value) })}
                                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] text-stone-400 mb-1">Standard WAV (₦)</label>
                                <input
                                  type="number"
                                  value={bform.priceWav}
                                  onChange={(e) => setBform({ ...bform, priceWav: Number(e.target.value) })}
                                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] text-stone-400 mb-1">Premium Stems (₦)</label>
                                <input
                                  type="number"
                                  value={bform.priceStems}
                                  onChange={(e) => setBform({ ...bform, priceStems: Number(e.target.value) })}
                                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] text-stone-400 mb-1">Exclusive Rights (₦)</label>
                                <input
                                  type="number"
                                  value={bform.priceExclusive}
                                  onChange={(e) => setBform({ ...bform, priceExclusive: Number(e.target.value) })}
                                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100"
                                />
                              </div>
                            </div>
                          </div>

                          <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold py-3.5 rounded-xl shadow-lg transition-all"
                          >
                            Publish Beat to Store
                          </button>
                        </form>
                      </div>
                    )}

                    {/* 4. UNIVERSAL PRICING MANAGER WITH FULL CRUD EDIT BUTTON */}
                    {adminTab === 'pricing' && (
                      <div className="max-w-4xl space-y-8">
                        <div>
                          <h3 className="text-xl font-bold">Universal Pricing & Services Manager (Full CRUD)</h3>
                          <p className="text-xs text-stone-400">Click Edit on any package to modify title, price, and deliverables live across /promote and /spotify.</p>
                        </div>

                        {/* PR Matrix Editor */}
                        <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-6 space-y-4">
                          <h4 className="text-base font-bold text-white">5-Tier PR & Music Promotion Matrix</h4>
                          <div className="space-y-3">
                            {prTiers.map(tier => (
                              <div key={tier.id} className="flex flex-col md:flex-row items-center gap-4 p-4 bg-stone-950 border border-stone-800 rounded-xl">
                                {editingPrId === tier.id ? (
                                  <div className="flex-1 space-y-3 w-full">
                                    <input
                                      type="text"
                                      value={editPrForm.name}
                                      onChange={(e) => setEditPrForm({ ...editPrForm, name: e.target.value })}
                                      className="w-full bg-stone-900 border border-amber-500 rounded-lg px-3 py-1.5 text-sm font-bold text-white"
                                      placeholder="Package Title"
                                    />
                                    <div className="flex gap-2">
                                      <input
                                        type="number"
                                        value={editPrForm.price}
                                        onChange={(e) => setEditPrForm({ ...editPrForm, price: Number(e.target.value) })}
                                        className="w-36 bg-stone-900 border border-amber-500 rounded-lg px-3 py-1.5 text-sm font-mono font-bold text-amber-400"
                                        placeholder="Price (₦)"
                                      />
                                      <input
                                        type="text"
                                        value={editPrForm.desc}
                                        onChange={(e) => setEditPrForm({ ...editPrForm, desc: e.target.value })}
                                        className="flex-1 bg-stone-900 border border-amber-500 rounded-lg px-3 py-1.5 text-xs text-stone-300"
                                        placeholder="Description"
                                      />
                                    </div>
                                    <div className="flex justify-end gap-2">
                                      <button
                                        onClick={() => setEditingPrId(null)}
                                        className="bg-stone-800 hover:bg-stone-700 text-stone-300 px-3 py-1.5 rounded-lg text-xs"
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        onClick={() => {
                                          setPrTiers(prTiers.map(t => t.id === tier.id ? { ...t, name: editPrForm.name, price: editPrForm.price, desc: editPrForm.desc } : t));
                                          setEditingPrId(null);
                                          alert('PR Tier updated successfully!');
                                        }}
                                        className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-4 py-1.5 rounded-lg text-xs flex items-center gap-1"
                                      >
                                        <Save className="w-3.5 h-3.5" /> Save Changes
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <div className="flex-1 w-full">
                                      <h5 className="text-sm font-bold text-white mb-1">{tier.name}</h5>
                                      <p className="text-xs text-stone-400">{tier.desc}</p>
                                    </div>
                                    <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                                      <span className="text-sm font-mono font-bold text-amber-400">₦{tier.price.toLocaleString()}</span>
                                      <button
                                        onClick={() => {
                                          setEditingPrId(tier.id);
                                          setEditPrForm({ name: tier.name, price: tier.price, desc: tier.desc });
                                        }}
                                        className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1"
                                      >
                                        <Edit2 className="w-3.5 h-3.5" /> Edit
                                      </button>
                                    </div>
                                  </>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Spotify Bundles Editor */}
                        <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-6 space-y-4">
                          <h4 className="text-base font-bold text-white">Spotify Playlisting Bundles</h4>
                          <div className="space-y-3">
                            {spotifyPackages.map(pkg => (
                              <div key={pkg.id} className="flex flex-col md:flex-row items-center gap-4 p-4 bg-stone-950 border border-stone-800 rounded-xl">
                                {editingSpotifyId === pkg.id ? (
                                  <div className="flex-1 space-y-3 w-full">
                                    <input
                                      type="text"
                                      value={editSpotifyForm.name}
                                      onChange={(e) => setEditSpotifyForm({ ...editSpotifyForm, name: e.target.value })}
                                      className="w-full bg-stone-900 border border-amber-500 rounded-lg px-3 py-1.5 text-sm font-bold text-white"
                                    />
                                    <div className="flex gap-2">
                                      <input
                                        type="number"
                                        value={editSpotifyForm.price}
                                        onChange={(e) => setEditSpotifyForm({ ...editSpotifyForm, price: Number(e.target.value) })}
                                        className="w-36 bg-stone-900 border border-amber-500 rounded-lg px-3 py-1.5 text-sm font-mono font-bold text-amber-400"
                                      />
                                      <input
                                        type="text"
                                        value={editSpotifyForm.streams}
                                        onChange={(e) => setEditSpotifyForm({ ...editSpotifyForm, streams: e.target.value })}
                                        className="flex-1 bg-stone-900 border border-amber-500 rounded-lg px-3 py-1.5 text-xs text-stone-300"
                                      />
                                    </div>
                                    <div className="flex justify-end gap-2">
                                      <button
                                        onClick={() => setEditingSpotifyId(null)}
                                        className="bg-stone-800 hover:bg-stone-700 text-stone-300 px-3 py-1.5 rounded-lg text-xs"
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        onClick={() => {
                                          setSpotifyPackages(spotifyPackages.map(p => p.id === pkg.id ? { ...p, name: editSpotifyForm.name, price: editSpotifyForm.price, streams: editSpotifyForm.streams } : p));
                                          setEditingSpotifyId(null);
                                          alert('Spotify package updated successfully!');
                                        }}
                                        className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-4 py-1.5 rounded-lg text-xs flex items-center gap-1"
                                      >
                                        <Save className="w-3.5 h-3.5" /> Save Changes
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <div className="flex-1 w-full">
                                      <h5 className="text-sm font-bold text-white mb-1">{pkg.name}</h5>
                                      <p className="text-xs text-amber-400 font-medium">{pkg.streams} • {pkg.playlists} Playlists</p>
                                    </div>
                                    <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                                      <span className="text-sm font-mono font-bold text-amber-400">₦{pkg.price.toLocaleString()}</span>
                                      <button
                                        onClick={() => {
                                          setEditingSpotifyId(pkg.id);
                                          setEditSpotifyForm({ name: pkg.name, price: pkg.price, streams: pkg.streams });
                                        }}
                                        className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1"
                                      >
                                        <Edit2 className="w-3.5 h-3.5" /> Edit
                                      </button>
                                    </div>
                                  </>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    )}

                    {/* 5. AD BANNER MANAGER (Direct Image File Uploaders) */}
                    {adminTab === 'ads' && (
                      <div className="max-w-4xl space-y-8">
                        <div>
                          <h3 className="text-xl font-bold">Ad Banner Manager</h3>
                          <p className="text-xs text-stone-400">Upload banner image assets directly with live preview boxes.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Mid-Article Ad Slot */}
                          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-6 space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="text-base font-bold text-white">Mid-Article Ad Slot</h4>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={ads.midArticle.active}
                                  onChange={(e) => setAds({ ...ads, midArticle: { ...ads.midArticle, active: e.target.checked } })}
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-stone-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                              </label>
                            </div>

                            <div className="space-y-3">
                              <div className="w-full h-32 rounded-xl bg-stone-950 border border-stone-800 overflow-hidden relative">
                                <img src={ads.midArticle.image} alt="" className="w-full h-full object-cover" />
                              </div>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, 'ads', 'adMid')}
                                className="w-full text-xs text-stone-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-amber-500 file:text-stone-950 cursor-pointer"
                              />
                              <div>
                                <label className="block text-xs font-semibold text-stone-300 mb-1">Destination URL</label>
                                <input
                                  type="text"
                                  value={ads.midArticle.link}
                                  onChange={(e) => setAds({ ...ads, midArticle: { ...ads.midArticle, link: e.target.value } })}
                                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-stone-300 mb-1">Custom Caption / Text</label>
                                <input
                                  type="text"
                                  value={ads.midArticle.caption}
                                  onChange={(e) => setAds({ ...ads, midArticle: { ...ads.midArticle, caption: e.target.value } })}
                                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Bottom Banner Ad Slot */}
                          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-6 space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="text-base font-bold text-white">Bottom Banner Slot (3000x3000px)</h4>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={ads.bottomBanner.active}
                                  onChange={(e) => setAds({ ...ads, bottomBanner: { ...ads.bottomBanner, active: e.target.checked } })}
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-stone-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                              </label>
                            </div>

                            <div className="space-y-3">
                              <div className="w-full h-32 rounded-xl bg-stone-950 border border-stone-800 overflow-hidden relative">
                                <img src={ads.bottomBanner.image} alt="" className="w-full h-full object-cover" />
                              </div>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, 'ads', 'adBottom')}
                                className="w-full text-xs text-stone-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-amber-500 file:text-stone-950 cursor-pointer"
                              />
                              <div>
                                <label className="block text-xs font-semibold text-stone-300 mb-1">Destination URL</label>
                                <input
                                  type="text"
                                  value={ads.bottomBanner.link}
                                  onChange={(e) => setAds({ ...ads, bottomBanner: { ...ads.bottomBanner, link: e.target.value } })}
                                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-stone-300 mb-1">Custom Caption / Text</label>
                                <input
                                  type="text"
                                  value={ads.bottomBanner.caption}
                                  onChange={(e) => setAds({ ...ads, bottomBanner: { ...ads.bottomBanner, caption: e.target.value } })}
                                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TRANSACTIONS LEDGER */}
                    {adminTab === 'transactions' && (
                      <div className="max-w-4xl space-y-6">
                        <div>
                          <h3 className="text-xl font-bold">Paystack Transactions Ledger</h3>
                          <p className="text-xs text-stone-400">Live transaction logs verified via Paystack inline gateway.</p>
                        </div>
                        <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-6">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-stone-950 text-stone-400 uppercase tracking-wider border-b border-stone-800">
                              <tr>
                                <th className="p-3">Ref ID</th>
                                <th className="p-3">Artist Email</th>
                                <th className="p-3">Package</th>
                                <th className="p-3">Amount (₦)</th>
                                <th className="p-3">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-800">
                              <tr className="hover:bg-stone-950/50">
                                <td className="p-3 font-mono text-amber-400">PAY-9824103</td>
                                <td className="p-3">artist@afropulse.ng</td>
                                <td className="p-3">Advanced National TV & Radio Push</td>
                                <td className="p-3 font-mono font-bold">₦35,000</td>
                                <td className="p-3"><span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400 font-bold">Successful</span></td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* WORKERS RBAC */}
                    {adminTab === 'workers' && (
                      <div className="max-w-4xl space-y-6">
                        <div>
                          <h3 className="text-xl font-bold">Worker & Team RBAC Management</h3>
                          <p className="text-xs text-stone-400">Manage team member privileges and staff access levels.</p>
                        </div>

                        {/* Add New Worker Form */}
                        <form onSubmit={(e) => {
                          e.preventDefault();
                          if (!workerForm.name || !workerForm.email) {
                            alert('Please enter worker name and email');
                            return;
                          }
                          const newW = {
                            id: 'w-' + Date.now(),
                            name: workerForm.name,
                            role: workerForm.role,
                            email: workerForm.email,
                            accessLevel: workerForm.accessLevel
                          };
                          setWorkers([...workers, newW]);
                          alert(`Worker ${workerForm.name} added successfully!`);
                          setWorkerForm({ name: '', role: 'Editor', email: '', accessLevel: 'Staff Contributor' });
                        }} className="bg-stone-900/90 border border-stone-800 rounded-2xl p-6 space-y-4">
                          <h4 className="text-sm font-bold text-amber-400">Add New Team Member / Worker</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-semibold text-stone-300 mb-1">Worker Name</label>
                              <input
                                type="text"
                                required
                                placeholder="e.g. Samuel Ade"
                                value={workerForm.name}
                                onChange={(e) => setWorkerForm({ ...workerForm, name: e.target.value })}
                                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2 text-xs text-stone-100"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-stone-300 mb-1">Email Address</label>
                              <input
                                type="email"
                                required
                                placeholder="samuel@afropulse.ng"
                                value={workerForm.email}
                                onChange={(e) => setWorkerForm({ ...workerForm, email: e.target.value })}
                                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2 text-xs text-stone-100"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-stone-300 mb-1">Role</label>
                              <select
                                value={workerForm.role}
                                onChange={(e) => setWorkerForm({ ...workerForm, role: e.target.value })}
                                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2 text-xs text-stone-100"
                              >
                                <option value="Editor">Editor</option>
                                <option value="PR Manager">PR Manager</option>
                                <option value="Beat Producer">Beat Producer</option>
                                <option value="Administrator">Administrator</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-stone-300 mb-1">Access Level Description</label>
                              <input
                                type="text"
                                placeholder="e.g. Can upload beats & music"
                                value={workerForm.accessLevel}
                                onChange={(e) => setWorkerForm({ ...workerForm, accessLevel: e.target.value })}
                                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2 text-xs text-stone-100"
                              />
                            </div>
                          </div>
                          <button
                            type="submit"
                            className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-5 py-2.5 rounded-xl text-xs transition-all shadow"
                          >
                            Add Worker & Grant Access
                          </button>
                        </form>

                        {/* Workers List */}
                        <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-6 space-y-4">
                          <h4 className="text-base font-bold text-white">Active Team Members ({workers.length})</h4>
                          <div className="space-y-3">
                            {workers.map(w => (
                              <div key={w.id} className="flex items-center justify-between p-4 bg-stone-950 border border-stone-800 rounded-xl">
                                <div>
                                  <h5 className="text-sm font-bold text-white">{w.name} <span className="text-xs text-amber-400 font-normal">({w.role})</span></h5>
                                  <p className="text-xs text-stone-400">{w.email} • {w.accessLevel}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="px-3 py-1 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-400">Active</span>
                                  <button
                                    onClick={() => {
                                      if (confirm(`Revoke access and remove worker ${w.name}?`)) {
                                        setWorkers(workers.filter(item => item.id !== w.id));
                                      }
                                    }}
                                    className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* MASTER SECURITY & OPTIONAL 2FA TOGGLE */}
                    {adminTab === 'security' && (
                      <div className="max-w-4xl space-y-6">
                        <div>
                          <h3 className="text-xl font-bold">Master Security & Optional 2FA</h3>
                          <p className="text-xs text-stone-400">Configure master password and optional 2FA TOTP security settings.</p>
                        </div>
                        <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-6 space-y-6">
                          <div className="flex items-center justify-between p-4 bg-stone-950 border border-stone-800 rounded-xl">
                            <div>
                              <h5 className="text-sm font-bold text-white">Optional Two-Factor Authentication (2FA)</h5>
                              <p className="text-xs text-stone-400">Enable or disable TOTP authentication checks on login.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={optional2FAEnabled}
                                onChange={(e) => setOptional2FAEnabled(e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-stone-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                            </label>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-stone-300 mb-1">Master Password Reset</label>
                            <input
                              type="password"
                              placeholder="Enter new master password"
                              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-sm text-stone-100 mb-3"
                            />
                            <button className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-5 py-2.5 rounded-xl text-xs">
                              Update Master Password
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                </div>

              </div>
            )}

          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">

            {/* ROUTE: HOME */}
            {currentRoute === 'home' && (
              <div className="space-y-10">
                
                {/* 3. FEATURED #1 SONG (HERO BANNER) */}
                <div className="bg-gradient-to-r from-stone-900 via-stone-900 to-amber-950/40 border border-stone-800 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
                  <div 
                    onClick={() => { setSelectedPostId(flagshipTrack.id); setCurrentRoute('post'); }}
                    className="w-32 h-32 md:w-44 md:h-44 shrink-0 rounded-xl overflow-hidden relative shadow-xl border border-stone-700 cursor-pointer group"
                  >
                    <img src={flagshipTrack.cover} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <button
                        onClick={(e) => { e.stopPropagation(); handlePlayTrack(flagshipTrack); }}
                        className="w-12 h-12 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 flex items-center justify-center shadow-lg transition-transform hover:scale-110"
                      >
                        {isPlaying && currentPlayingTrack?.id === flagshipTrack.id ? <Pause className="w-6 h-6 fill-stone-950" /> : <Play className="w-6 h-6 fill-stone-950 ml-0.5" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 space-y-3 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-amber-500 text-stone-950 uppercase tracking-widest flex items-center gap-1">
                        <Flame className="w-3 h-3 fill-stone-950" /> #1 Featured Trending Song
                      </span>
                      <span className="text-xs text-stone-400">{flagshipTrack.date}</span>
                    </div>
                    <h2 
                      onClick={() => { setSelectedPostId(flagshipTrack.id); setCurrentRoute('post'); }}
                      className="text-2xl md:text-3xl font-black text-white tracking-tight cursor-pointer hover:text-amber-400 transition"
                    >
                      {flagshipTrack.title}
                    </h2>
                    <p className="text-sm font-semibold text-amber-400">{flagshipTrack.subtitle}</p>
                    <p className="text-xs text-stone-300 line-clamp-2 max-w-2xl">{flagshipTrack.body}</p>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                      <button
                        onClick={() => handlePlayTrack(flagshipTrack)}
                        className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg transition-all"
                      >
                        {isPlaying && currentPlayingTrack?.id === flagshipTrack.id ? <Pause className="w-4 h-4 fill-stone-950" /> : <Play className="w-4 h-4 fill-stone-950" />}
                        Stream / Play Audio
                      </button>
                      <button
                        onClick={() => { setSelectedPostId(flagshipTrack.id); setCurrentRoute('post'); }}
                        className="bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all border border-stone-700"
                      >
                        <FileText className="w-4 h-4 text-amber-400" /> View Post / Read Story
                      </button>
                    </div>
                  </div>
                </div>

                {/* 6. PROMOTION BANNER CTA ("Promote Your Music On AfroPulse") */}
                <div className="bg-gradient-to-r from-emerald-950/60 via-stone-900 to-stone-900 border border-emerald-500/30 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                  <div className="space-y-2 text-center md:text-left">
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2.5 py-1 rounded-full uppercase">Official PR & Distribution</span>
                    <h3 className="text-xl font-black text-white">Promote Your Music On AfroPulse & Reach Millions</h3>
                    <p className="text-xs text-stone-300">Get your songs featured on our main feed, top charts, Spotify playlists, and radio rotations.</p>
                  </div>
                  <button
                    onClick={() => setCurrentRoute('promote')}
                    className="shrink-0 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-extrabold px-6 py-3 rounded-xl text-xs shadow-lg transition-all hover:scale-105"
                  >
                    Start Your Campaign Now →
                  </button>
                </div>

                {/* MAIN CONTENT CONTAINER & SIDEBAR */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                  
                  {/* LEFT 2 COLUMNS: 4. MAIN FEED (25 posts) & 7. NEWS & GOSSIP & 8. MOVIES & VIDEOS */}
                  <div className="lg:col-span-2 space-y-12">
                    
                    {/* 4. MAIN FEED (Naijaloaded / Jaguda Style - Latest Posts & Releases) */}
                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                        <h3 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                          <Flame className="w-5 h-5 text-amber-500" /> Latest Naija Music & Entertainment Feeds
                        </h3>
                        <span className="text-xs text-stone-400">Showing {Math.min(visiblePostLimit, posts.length)} of {posts.length} releases</span>
                      </div>

                      <div className="space-y-3.5">
                        {posts
                          .slice(0, visiblePostLimit)
                          .map(p => (
                            <div
                              key={p.id}
                              onClick={() => { setSelectedPostId(p.id); setCurrentRoute('post'); }}
                              className="flex items-center gap-4 p-3.5 bg-stone-900/90 rounded-xl border border-stone-800/80 hover:border-amber-500/50 transition shadow-sm cursor-pointer"
                            >
                              <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden relative border border-stone-800">
                                <img src={p.cover} alt="" className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1 min-w-0 space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${p.category === 'MUSIC' ? 'bg-emerald-500/20 text-emerald-400' : p.category === 'NEWS' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                    {p.category}
                                  </span>
                                  <span className="text-[10px] text-stone-400">{p.date}</span>
                                  <span className="text-[10px] text-stone-500">• {p.views || '12.4K'} views</span>
                                </div>
                                <h4 className="text-sm md:text-base font-semibold text-white line-clamp-2 leading-snug">{p.title}</h4>
                                <p className="text-xs text-stone-400 line-clamp-1">{p.subtitle} • {p.body}</p>
                              </div>
                              <button
                                onClick={(e) => { e.stopPropagation(); setSelectedPostId(p.id); setCurrentRoute('post'); }}
                                className="shrink-0 px-3.5 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg shadow"
                              >
                                View Post →
                              </button>
                            </div>
                          ))}
                      </div>

                      {visiblePostLimit < posts.length && (
                        <div className="text-center pt-3">
                          <button
                            onClick={() => setVisiblePostLimit(prev => Math.min(prev + 15, posts.length))}
                            className="px-8 py-3 rounded-xl text-xs font-bold bg-stone-900 hover:bg-amber-500 hover:text-stone-950 text-stone-200 border border-stone-800 transition shadow-lg"
                          >
                            Load More Releases ↓
                          </button>
                        </div>
                      )}
                    </div>

                    {/* 7. NEWS & GOSSIP SECTION (10 recent news updates) */}
                    <div className="space-y-4 pt-6">
                      <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                        <h3 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                          <Newspaper className="w-5 h-5 text-amber-500" /> Latest News & Gossip Archive
                        </h3>
                        <button onClick={() => setActiveCategory('NEWS')} className="text-xs font-bold text-amber-400 hover:underline">Read More News →</button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {posts
                          .filter(p => p.category === 'NEWS' || p.category === 'ALL')
                          .slice(0, 10)
                          .map(n => (
                            <div key={n.id} className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex gap-4 hover:border-amber-500/40 transition">
                              <img src={n.cover} alt="" className="w-20 h-20 rounded-lg object-cover shrink-0" />
                              <div className="flex-1 min-w-0 space-y-1">
                                <span className="text-[9px] bg-amber-500/20 text-amber-400 font-bold px-2 py-0.5 rounded uppercase">Gossip</span>
                                <h5 className="text-xs font-bold text-white line-clamp-2">{n.title}</h5>
                                <p className="text-[11px] text-stone-400 line-clamp-2">{n.body}</p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* 8. MOVIES & MUSIC VIDEOS SECTION (10 recent video entries) */}
                    <div className="space-y-4 pt-6">
                      <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                        <h3 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                          <Video className="w-5 h-5 text-blue-400" /> Movies & Official Music Videos
                        </h3>
                        <button onClick={() => setActiveCategory('VIDEOS')} className="text-xs font-bold text-blue-400 hover:underline">View More Videos →</button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {posts
                          .filter(p => p.category === 'VIDEOS' || p.category === 'MUSIC')
                          .slice(0, 10)
                          .map(v => (
                            <div key={v.id} className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden group">
                              <div className="relative h-40 bg-stone-950 overflow-hidden">
                                <img src={v.cover} alt="" className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                  <button onClick={() => handlePlayTrack(v)} className="w-12 h-12 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 flex items-center justify-center shadow-lg transition-transform hover:scale-110">
                                    <Play className="w-5 h-5 fill-stone-950 ml-0.5" />
                                  </button>
                                </div>
                                <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/70 backdrop-blur text-[10px] font-bold text-white rounded">03:45</span>
                              </div>
                              <div className="p-4 space-y-1">
                                <h5 className="text-xs font-bold text-white truncate">{v.title}</h5>
                                <p className="text-[11px] text-stone-400 truncate">{v.subtitle}</p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>

                  </div>

                  {/* RIGHT COLUMN: 5. TOP 10 TRENDING TRACKS & SIDENAV WIDGETS */}
                  <div className="space-y-6">
                    
                    {/* 5. TOP 10 TRENDING TRACKS */}
                    <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-6 space-y-4 shadow-xl">
                      <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                        <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                          <Flame className="w-4 h-4 text-amber-500" /> Top 10 Trending Songs
                        </h4>
                        <span className="text-[10px] bg-amber-500/20 text-amber-400 font-bold px-2 py-0.5 rounded">Chart</span>
                      </div>

                      <div className="space-y-2.5">
                        {posts
                          .filter(p => p.category === 'MUSIC' || p.category === 'AMAPIANO' || (!['NEWS', 'VIDEOS', 'MOVIES'].includes(p.category)))
                          .sort((a, b) => {
                            const parseVal = (val?: string) => {
                              if (!val) return 0;
                              const num = parseFloat(val);
                              if (val.toUpperCase().includes('M')) return num * 1000000;
                              if (val.toUpperCase().includes('K')) return num * 1000;
                              return num;
                            };
                            return parseVal(b.downloads || b.views || '0') - parseVal(a.downloads || a.views || '0');
                          })
                          .slice(0, 10)
                          .map((track, idx) => (
                            <div
                              key={track.id}
                              onClick={() => { setSelectedPostId(track.id); setCurrentRoute('post'); }}
                              className="flex items-center gap-3 p-2.5 bg-stone-950 border border-stone-800 rounded-xl hover:border-amber-500/40 transition-all cursor-pointer"
                            >
                              <span className={`text-xs font-black w-6 text-center ${idx === 0 ? 'text-amber-400 text-sm' : idx === 1 ? 'text-stone-300' : idx === 2 ? 'text-amber-600' : 'text-stone-500'}`}>
                                #{idx + 1}
                              </span>
                              <img src={track.cover} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0 border border-stone-800" />
                              <div className="flex-1 min-w-0">
                                <h5 className="text-xs font-semibold text-white line-clamp-2 leading-snug">{track.title}</h5>
                                <p className="text-[10px] text-stone-400 truncate">{track.subtitle}</p>
                              </div>
                              <span className="text-[10px] text-amber-400 font-bold shrink-0">View →</span>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* VIP Newsletter Subscription */}
                    <div className="bg-gradient-to-br from-stone-900 to-amber-950/40 border border-stone-800 rounded-2xl p-6 space-y-4 shadow-lg">
                      <h4 className="text-sm font-bold text-white">AfroPulse VIP Newsletter</h4>
                      <p className="text-xs text-stone-400">Get breaking Afrobeats drops and beat release notifications straight to your inbox.</p>
                      <input
                        type="email"
                        placeholder="Enter your email address"
                        className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                      />
                      <button
                        onClick={() => alert('Successfully subscribed to AfroPulse VIP Newsletter!')}
                        className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-2.5 rounded-xl text-xs transition-all shadow"
                      >
                        Subscribe Now
                      </button>
                    </div>

                    {/* Social Media Follow Widgets */}
                    <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-6 space-y-3">
                      <h4 className="text-sm font-bold text-white">Follow AfroPulse</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <a href="https://instagram.com" target="_blank" rel="noreferrer" className="bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 border border-pink-500/20 p-2.5 rounded-xl text-xs font-bold text-center">
                          📸 Instagram
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noreferrer" className="bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/20 p-2.5 rounded-xl text-xs font-bold text-center">
                          🕥 X (Twitter)
                        </a>
                        <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 p-2.5 rounded-xl text-xs font-bold text-center">
                          🎵 TikTok
                        </a>
                        <a href="https://youtube.com" target="_blank" rel="noreferrer" className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 p-2.5 rounded-xl text-xs font-bold text-center">
                          ▶️ YouTube
                        </a>
                      </div>
                    </div>

                  </div>

                </div>

              </div>
            )}

            {/* ROUTE: BEAT STORE */}
            {currentRoute === 'beatstore' && (
              <div className="space-y-8 max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-stone-800 pb-6">
                  <div className="space-y-2 text-center md:text-left">
                    <span className="text-xs bg-amber-500/20 text-amber-400 font-bold px-3 py-1 rounded-full uppercase">AfroPulse Beat Store</span>
                    <h2 className="text-3xl font-black text-white">Professional Untagged Instrumentals</h2>
                    <p className="text-xs text-stone-400">High-grade Afrobeat, Amapiano, and Dancehall beats crafted by top Lagos producers.</p>
                  </div>
                  <button
                    onClick={() => setIsCartOpen(true)}
                    className="relative bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold px-6 py-3 rounded-xl text-xs flex items-center gap-2 shadow-lg transition"
                  >
                    🛒 View Cart ({beatCart.length}) 
                    {beatCart.length > 0 && <span className="bg-stone-950 text-amber-400 px-2 py-0.5 rounded-full text-[10px]">₦{beatCart.reduce((s, i) => s + i.price, 0).toLocaleString()}</span>}
                  </button>
                </div>

                {/* FEATURED BEAT BANNER ("Beat of the Week") */}
                {beats.length > 0 && (
                  <div className="bg-gradient-to-r from-stone-900 via-stone-900 to-amber-950/40 border border-amber-500/30 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 shadow-xl relative overflow-hidden">
                    <img src={beats[0].cover} alt="" className="w-32 h-32 md:w-40 md:h-40 rounded-xl object-cover border border-stone-700 shadow-lg" />
                    <div className="flex-1 space-y-3 text-center md:text-left">
                      <div className="flex items-center justify-center md:justify-start gap-2">
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-amber-500 text-stone-950 uppercase tracking-wider">🔥 Beat of the Week</span>
                        <span className="text-xs text-stone-400">{beats[0].genre} • {beats[0].bpm} BPM • {beats[0].key}</span>
                      </div>
                      <h3 className="text-2xl font-black text-white">{beats[0].title}</h3>
                      <p className="text-xs text-amber-400 font-semibold">Produced by {beats[0].producer}</p>
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                        <button
                          onClick={() => {
                            const audio = new Audio(beats[0].previewUrl);
                            audio.play();
                            alert(`Streaming preview for ${beats[0].title}...`);
                          }}
                          className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow"
                        >
                          ▶️ Stream Preview
                        </button>
                        <button
                          onClick={() => {
                            setSelectedBeatForModal(beats[0]);
                            setIsBeatModalOpen(true);
                          }}
                          className="bg-stone-800 hover:bg-stone-700 text-stone-100 font-bold px-5 py-2.5 rounded-xl text-xs border border-stone-700 shadow transition"
                        >
                          Buy License / Tiers ↗
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* BEAT CATALOG GRID */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white">Full Instrumental Catalog</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {beats.map(beat => (
                      <div key={beat.id} className="bg-stone-900 border border-stone-800 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 shadow">
                        <div className="relative w-28 h-28 shrink-0 rounded-xl overflow-hidden border border-stone-800 shadow">
                          <img src={beat.cover} alt="" className="w-full h-full object-cover" />
                          <button
                            onClick={() => {
                              const audio = new Audio(beat.previewUrl);
                              audio.play();
                              alert(`Playing preview: ${beat.title}`);
                            }}
                            className="absolute inset-0 bg-black/40 flex items-center justify-center hover:bg-black/20 transition"
                          >
                            <Play className="w-8 h-8 fill-amber-400 text-amber-400" />
                          </button>
                        </div>
                        <div className="flex-1 space-y-3 text-center md:text-left w-full min-w-0">
                          <div className="space-y-1">
                            <h4 className="text-base font-bold text-white truncate">{beat.title}</h4>
                            <p className="text-xs text-stone-400">Prod. by {beat.producer} • {beat.bpm} BPM • {beat.key}</p>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedBeatForModal(beat);
                              setIsBeatModalOpen(true);
                            }}
                            className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold py-2.5 rounded-xl text-xs shadow-md transition flex items-center justify-center gap-2"
                          >
                            Add to Cart / Buy License 🛒
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* LICENSING TIERS POP-UP MODAL */}
                {isBeatModalOpen && selectedBeatForModal && (
                  <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-xl w-full p-6 md:p-8 space-y-6 shadow-2xl">
                      <div className="flex items-center justify-between border-b border-stone-800 pb-4">
                        <div>
                          <span className="text-[10px] bg-amber-500/20 text-amber-400 font-bold px-2.5 py-1 rounded uppercase">Select License Tier</span>
                          <h3 className="text-xl font-black text-white mt-1">{selectedBeatForModal.title}</h3>
                          <p className="text-xs text-stone-400">Prod. by {selectedBeatForModal.producer} • {selectedBeatForModal.bpm} BPM</p>
                        </div>
                        <button onClick={() => setIsBeatModalOpen(false)} className="text-stone-400 hover:text-white p-2">✕</button>
                      </div>

                      <div className="space-y-3">
                        <div 
                          onClick={() => {
                            setBeatCart([...beatCart, { beatId: selectedBeatForModal.id, title: selectedBeatForModal.title, producer: selectedBeatForModal.producer, licenseType: 'mp3', price: 35000, cover: selectedBeatForModal.cover }]);
                            setIsBeatModalOpen(false);
                            setIsCartOpen(true);
                          }}
                          className="bg-stone-950 border border-stone-800 hover:border-amber-500 p-4 rounded-xl flex items-center justify-between cursor-pointer transition"
                        >
                          <div>
                            <h4 className="text-sm font-bold text-white">MP3 Standard Lease</h4>
                            <p className="text-xs text-stone-400">High Quality MP3 audio file (.mp3)</p>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-mono font-bold text-amber-400">₦35,000</span>
                            <p className="text-[10px] text-stone-500">~$25 USD</p>
                          </div>
                        </div>

                        <div 
                          onClick={() => {
                            setBeatCart([...beatCart, { beatId: selectedBeatForModal.id, title: selectedBeatForModal.title, producer: selectedBeatForModal.producer, licenseType: 'wav', price: 70000, cover: selectedBeatForModal.cover }]);
                            setIsBeatModalOpen(false);
                            setIsCartOpen(true);
                          }}
                          className="bg-stone-950 border border-stone-800 hover:border-amber-500 p-4 rounded-xl flex items-center justify-between cursor-pointer transition"
                        >
                          <div>
                            <h4 className="text-sm font-bold text-white">WAV Premium Lease</h4>
                            <p className="text-xs text-stone-400">Lossless WAV audio file (.wav)</p>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-mono font-bold text-amber-400">₦70,000</span>
                            <p className="text-[10px] text-stone-500">~$50 USD</p>
                          </div>
                        </div>

                        <div 
                          onClick={() => {
                            setBeatCart([...beatCart, { beatId: selectedBeatForModal.id, title: selectedBeatForModal.title, producer: selectedBeatForModal.producer, licenseType: 'stems', price: 140000, cover: selectedBeatForModal.cover }]);
                            setIsBeatModalOpen(false);
                            setIsCartOpen(true);
                          }}
                          className="bg-stone-950 border border-stone-800 hover:border-amber-500 p-4 rounded-xl flex items-center justify-between cursor-pointer transition"
                        >
                          <div>
                            <h4 className="text-sm font-bold text-white">Unlimited Trackout Lease</h4>
                            <p className="text-xs text-stone-400">Uncompressed WAV + Track Stems (.zip)</p>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-mono font-bold text-amber-400">₦140,000</span>
                            <p className="text-[10px] text-stone-500">~$100 USD</p>
                          </div>
                        </div>

                        <div 
                          onClick={() => {
                            setBeatCart([...beatCart, { beatId: selectedBeatForModal.id, title: selectedBeatForModal.title, producer: selectedBeatForModal.producer, licenseType: 'exclusive', price: 350000, cover: selectedBeatForModal.cover }]);
                            setIsBeatModalOpen(false);
                            setIsCartOpen(true);
                          }}
                          className="bg-amber-500/10 border border-amber-500/30 hover:border-amber-500 p-4 rounded-xl flex items-center justify-between cursor-pointer transition"
                        >
                          <div>
                            <h4 className="text-sm font-bold text-amber-400">Exclusive Rights</h4>
                            <p className="text-xs text-stone-300">Full Transfer / Removal from store</p>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-mono font-bold text-amber-400">₦350,000+</span>
                            <p className="text-[10px] text-stone-400">~$250+ USD</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* CART SLIDING DRAWER / MODAL */}
                {isCartOpen && (
                  <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end">
                    <div className="w-full max-w-md bg-stone-950 border-l border-stone-800 p-6 flex flex-col justify-between space-y-6 h-full shadow-2xl">
                      <div className="space-y-6 overflow-y-auto flex-1">
                        <div className="flex items-center justify-between border-b border-stone-800 pb-4">
                          <h3 className="text-lg font-black text-white">Your Beat Cart ({beatCart.length})</h3>
                          <button onClick={() => setIsCartOpen(false)} className="text-stone-400 hover:text-white p-2">✕</button>
                        </div>

                        {beatCart.length === 0 ? (
                          <div className="text-center py-16 text-stone-500 space-y-3">
                            <p className="text-sm">Your beat cart is empty.</p>
                            <button onClick={() => setIsCartOpen(false)} className="bg-amber-500 text-stone-950 font-bold px-4 py-2 rounded-xl text-xs">Browse Instrumentals</button>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {beatCart.map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between p-3 bg-stone-900 border border-stone-800 rounded-xl">
                                <div className="flex items-center gap-3">
                                  <img src={item.cover} alt="" className="w-12 h-12 rounded-lg object-cover" />
                                  <div>
                                    <h5 className="text-xs font-bold text-white">{item.title}</h5>
                                    <p className="text-[10px] text-amber-400 uppercase font-semibold">{item.licenseType} License • ₦{item.price.toLocaleString()}</p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => setBeatCart(beatCart.filter((_, i) => i !== idx))}
                                  className="text-red-400 hover:text-red-300 text-xs p-2"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {beatCart.length > 0 && (
                        <div className="space-y-4 pt-4 border-t border-stone-800">
                          <div className="flex items-center justify-between text-sm font-bold text-white">
                            <span>Total Amount (NGN):</span>
                            <span className="font-mono text-amber-400 text-lg">₦{beatCart.reduce((s, i) => s + i.price, 0).toLocaleString()}</span>
                          </div>
                          <button
                            onClick={() => {
                              const order = {
                                orderId: 'PAY-' + Math.floor(100000 + Math.random() * 900000),
                                items: [...beatCart],
                                total: beatCart.reduce((s, i) => s + i.price, 0),
                                date: new Date().toLocaleString()
                              };
                              setBeatCart([]);
                              setIsCartOpen(false);
                              setDownloadFulfillmentModal(order);
                            }}
                            className="w-full bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-extrabold py-3.5 rounded-xl text-xs shadow-lg transition uppercase tracking-wider"
                          >
                            Complete Paystack Checkout Securely 🔒
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* SECURE DOWNLOAD FULFILLMENT MODAL */}
                {downloadFulfillmentModal && (
                  <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-lg w-full p-6 md:p-8 space-y-6 shadow-2xl">
                      <div className="text-center space-y-2">
                        <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-xl font-bold">✓</div>
                        <h3 className="text-2xl font-black text-white">Payment Successful & Verified!</h3>
                        <p className="text-xs text-stone-400">Order Reference: <span className="font-mono text-amber-400">{downloadFulfillmentModal.orderId}</span> via Paystack.</p>
                      </div>

                      <div className="space-y-4 bg-stone-950 p-4 rounded-xl border border-stone-800">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Instant Secure Downloads & Licenses</h4>
                        <div className="space-y-3">
                          {downloadFulfillmentModal.items.map((item: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-stone-900 rounded-lg border border-stone-800">
                              <div className="min-w-0 pr-2">
                                <h5 className="text-xs font-bold text-white truncate">{item.title}</h5>
                                <p className="text-[10px] text-stone-400">{item.licenseType.toUpperCase()} File + Signed Agreement PDF</p>
                              </div>
                              <button
                                onClick={() => alert(`Downloading secure high-res ${item.licenseType.toUpperCase()} file & license agreement for ${item.title}...`)}
                                className="shrink-0 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 shadow"
                              >
                                <Download className="w-3.5 h-3.5" /> Download
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => setDownloadFulfillmentModal(null)}
                        className="w-full bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold py-3 rounded-xl text-xs"
                      >
                        Close & Return to Store
                      </button>
                    </div>
                  </div>
                )}
                {renderFaqAndTestimonials()}
              </div>
            )}

            {/* ROUTE: MUSIC UPLOAD */}
            {currentRoute === 'musicupload' && (
              <div className="space-y-8 max-w-4xl mx-auto">
                <div className="text-center max-w-2xl mx-auto space-y-3">
                  <span className="text-xs bg-purple-500/20 text-purple-400 font-bold px-3 py-1 rounded-full uppercase">Music Distribution & Upload</span>
                  <h2 className="text-3xl font-black text-white">Upload Your Music to AfroPulse</h2>
                  <p className="text-xs text-stone-400">Distribute your singles or EPs directly to the AfroPulse platform with secure Paystack verification.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 flex flex-col justify-between space-y-6">
                    <div className="space-y-3">
                      <span className="text-[10px] bg-purple-500/20 text-purple-400 font-bold px-2.5 py-1 rounded-full">Single Drop</span>
                      <h4 className="text-lg font-bold text-white">Single Song Upload</h4>
                      <p className="text-xs text-stone-300">Full song publication on AfroPulse website + standard social media post.</p>
                    </div>
                    <div className="space-y-4 pt-4 border-t border-stone-800">
                      <div className="text-2xl font-mono font-bold text-amber-400">₦15,000</div>
                      <button
                        onClick={() => alert('Proceeding to Paystack checkout for Single Song Upload (₦15,000)...')}
                        className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-3 rounded-xl text-xs shadow-lg transition-all"
                      >
                        Proceed to Paystack Checkout
                      </button>
                    </div>
                  </div>

                  <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 flex flex-col justify-between space-y-6">
                    <div className="space-y-3">
                      <span className="text-[10px] bg-amber-500/20 text-amber-400 font-bold px-2.5 py-1 rounded-full">Project Drop</span>
                      <h4 className="text-lg font-bold text-white">EP / Album Project Upload</h4>
                      <p className="text-xs text-stone-300">Full project publication on AfroPulse website, custom featured placement, and social media blast.</p>
                    </div>
                    <div className="space-y-4 pt-4 border-t border-stone-800">
                      <div className="text-2xl font-mono font-bold text-amber-400">₦45,000</div>
                      <button
                        onClick={() => alert('Proceeding to Paystack checkout for EP / Album Project Upload (₦45,000)...')}
                        className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-3 rounded-xl text-xs shadow-lg transition-all"
                      >
                        Proceed to Paystack Checkout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ROUTE: MUSIC */}
            {currentRoute === 'music' && (
              <div className="space-y-6 max-w-4xl mx-auto">
                <div className="text-center max-w-xl mx-auto space-y-2">
                  <h2 className="text-3xl font-black text-white">AfroPulse Music Catalog</h2>
                  <p className="text-xs text-stone-400">Stream and download the latest Nigerian & African hit singles.</p>
                </div>
                <div className="space-y-3.5">
                  {posts.filter(p => p.category === 'MUSIC' || p.category === 'AMAPIANO').map(p => (
                    <div
                      key={p.id}
                      onClick={() => { setSelectedPostId(p.id); setCurrentRoute('post'); }}
                      className="flex items-center gap-4 p-3.5 bg-stone-900/90 rounded-xl border border-stone-800/80 hover:border-amber-500/50 transition shadow-sm cursor-pointer"
                    >
                      <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden relative border border-stone-800">
                        <img src={p.cover} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-500/20 text-emerald-400">MUSIC</span>
                          <span className="text-[10px] text-stone-400">{p.date}</span>
                          <span className="text-[10px] text-stone-500">• {p.downloads || '14.2K'} downloads</span>
                        </div>
                        <h4 className="text-sm md:text-base font-semibold text-white line-clamp-2 leading-snug">{p.title}</h4>
                        <p className="text-xs text-stone-400 line-clamp-1">{p.subtitle} • {p.body}</p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedPostId(p.id); setCurrentRoute('post'); }}
                        className="shrink-0 px-3.5 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg shadow"
                      >
                        View Post →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ROUTE: VIDEOS */}
            {currentRoute === 'videos' && (
              <div className="space-y-6 max-w-4xl mx-auto">
                <div className="text-center max-w-xl mx-auto space-y-2">
                  <h2 className="text-3xl font-black text-white">Official Music Videos</h2>
                  <p className="text-xs text-stone-400">Watch cinematic 4K music video premieres from top African artists.</p>
                </div>
                <div className="space-y-3.5">
                  {posts.filter(p => p.category === 'VIDEOS').map(p => (
                    <div
                      key={p.id}
                      onClick={() => { setSelectedPostId(p.id); setCurrentRoute('post'); }}
                      className="flex items-center gap-4 p-3.5 bg-stone-900/90 rounded-xl border border-stone-800/80 hover:border-amber-500/50 transition shadow-sm cursor-pointer"
                    >
                      <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden relative border border-stone-800">
                        <img src={p.cover} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-blue-500/20 text-blue-400">MUSIC VIDEO</span>
                          <span className="text-[10px] text-stone-400">{p.date}</span>
                          <span className="text-[10px] text-stone-500">• {p.views || '2.8M'} views</span>
                        </div>
                        <h4 className="text-sm md:text-base font-semibold text-white line-clamp-2 leading-snug">{p.title}</h4>
                        <p className="text-xs text-stone-400 line-clamp-1">{p.subtitle} • {p.body}</p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedPostId(p.id); setCurrentRoute('post'); }}
                        className="shrink-0 px-3.5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow"
                      >
                        Watch →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ROUTE: MOVIES */}
            {currentRoute === 'movies' && (
              <div className="space-y-6 max-w-4xl mx-auto">
                <div className="text-center max-w-xl mx-auto space-y-2">
                  <h2 className="text-3xl font-black text-white">Movie Premieres & Cinematic Streams</h2>
                  <p className="text-xs text-stone-400">Exclusive Nollywood movie premieres and cinematic releases.</p>
                </div>
                <div className="space-y-3.5">
                  {posts.filter(p => p.category === 'MOVIES' || p.category === 'VIDEOS').map(p => (
                    <div
                      key={p.id}
                      onClick={() => { setSelectedPostId(p.id); setCurrentRoute('post'); }}
                      className="flex items-center gap-4 p-3.5 bg-stone-900/90 rounded-xl border border-stone-800/80 hover:border-amber-500/50 transition shadow-sm cursor-pointer"
                    >
                      <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden relative border border-stone-800">
                        <img src={p.cover} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-500/20 text-amber-400">MOVIE</span>
                          <span className="text-[10px] text-stone-400">{p.date}</span>
                        </div>
                        <h4 className="text-sm md:text-base font-semibold text-white line-clamp-2 leading-snug">{p.title}</h4>
                        <p className="text-xs text-stone-400 line-clamp-1">{p.subtitle} • {p.body}</p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedPostId(p.id); setCurrentRoute('post'); }}
                        className="shrink-0 px-3.5 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg shadow"
                      >
                        Stream →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ROUTE: NEWS */}
            {currentRoute === 'news' && (
              <div className="space-y-6 max-w-4xl mx-auto">
                <div className="text-center max-w-xl mx-auto space-y-2">
                  <h2 className="text-3xl font-black text-white">News & Gossip Desk</h2>
                  <p className="text-xs text-stone-400">Latest breaking entertainment news, interviews, and celebrity gist.</p>
                </div>
                <div className="space-y-3.5">
                  {posts.filter(p => p.category === 'NEWS').map(p => (
                    <div
                      key={p.id}
                      onClick={() => { setSelectedPostId(p.id); setCurrentRoute('post'); }}
                      className="flex items-center gap-4 p-3.5 bg-stone-900/90 rounded-xl border border-stone-800/80 hover:border-amber-500/50 transition shadow-sm cursor-pointer"
                    >
                      <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden relative border border-stone-800">
                        <img src={p.cover} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-500/20 text-amber-400">NEWS</span>
                          <span className="text-[10px] text-stone-400">{p.date}</span>
                          <span className="text-[10px] text-stone-500">• {p.readTime || '3 min read'}</span>
                        </div>
                        <h4 className="text-sm md:text-base font-semibold text-white line-clamp-2 leading-snug">{p.title}</h4>
                        <p className="text-xs text-stone-400 line-clamp-1">{p.body}</p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedPostId(p.id); setCurrentRoute('post'); }}
                        className="shrink-0 px-3.5 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg shadow"
                      >
                        Read →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ROUTE: INNER POST DETAIL PAGE (/post/:id) */}
            {currentRoute === 'post' && selectedPostId && (() => {
              const post = posts.find(p => p.id === selectedPostId) || posts[0];
              const relatedPosts = posts.filter(p => p.category === post.category && p.id !== post.id).slice(0, 5);
              const comments = postComments[post.id] || [
                { id: 'c1', author: 'Oluwaseun T.', text: 'Amazing drop! The production quality on this is top-notch.', date: '2 hours ago' },
                { id: 'c2', author: 'Chinedu K.', text: 'AfroPulse never misses with these releases 🔥', date: '1 hour ago' }
              ];

              return (
                <div className="max-w-4xl mx-auto space-y-8 py-4">
                  <button
                    onClick={() => setCurrentRoute('home')}
                    className="flex items-center gap-2 text-xs font-bold text-amber-400 hover:underline"
                  >
                    ← Back to Feed
                  </button>

                  <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded text-xs font-bold bg-amber-500/20 text-amber-400 uppercase">
                        {post.category}
                      </span>
                      <span className="text-xs text-stone-400">{post.date}</span>
                      <span className="text-xs text-stone-500">• {post.views || post.downloads || '14.2K'} views</span>
                    </div>

                    <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-snug">{post.title}</h1>
                    <p className="text-sm font-semibold text-amber-400">{post.subtitle}</p>

                    <div className="w-full h-72 md:h-96 rounded-xl overflow-hidden border border-stone-800 shadow-lg">
                      <img src={post.cover} alt="" className="w-full h-full object-cover" />
                    </div>

                    <div className="space-y-4 text-stone-300 text-sm leading-relaxed pt-2">
                      <p>{post.body}</p>
                      {post.lyrics && (
                        <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-2 font-mono text-xs text-amber-300/90">
                          <h5 className="font-bold text-white uppercase text-[10px] tracking-wider mb-2">Lyrics / Verse</h5>
                          {post.lyrics.map((l, i) => <div key={i}>{l}</div>)}
                        </div>
                      )}
                    </div>

                    {/* MEDIA PLAYER & DOWNLOAD SECTION */}
                    <div className="bg-stone-950 border border-stone-800 rounded-xl p-6 space-y-4">
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider">Media Player & Downloads</h4>
                      {post.audioUrl ? (
                        <div className="flex flex-col md:flex-row items-center gap-4 bg-stone-900 p-4 rounded-xl border border-stone-800">
                          <button
                            onClick={() => handlePlayTrack(post)}
                            className="w-14 h-14 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 flex items-center justify-center shadow-lg transition-transform hover:scale-105 shrink-0"
                          >
                            {isPlaying && currentPlayingTrack?.id === post.id ? <Pause className="w-6 h-6 fill-stone-950" /> : <Play className="w-6 h-6 fill-stone-950 ml-0.5" />}
                          </button>
                          <div className="flex-1 text-center md:text-left min-w-0">
                            <h5 className="text-sm font-bold text-white truncate">{post.title}</h5>
                            <p className="text-xs text-stone-400">{post.subtitle} • {post.duration || '03:45'}</p>
                          </div>
                          <button
                            onClick={() => alert(`Downloading ${post.title} (MP3 320kbps)...`)}
                            className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow"
                          >
                            <Download className="w-4 h-4" /> Download MP3
                          </button>
                        </div>
                      ) : post.videoUrl ? (
                        <div className="space-y-4">
                          <div className="aspect-video w-full rounded-xl overflow-hidden bg-stone-900 border border-stone-800">
                            <iframe
                              src={post.videoUrl.replace('watch?v=', 'embed/')}
                              title={post.title}
                              className="w-full h-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            ></iframe>
                          </div>
                          <a
                            href={post.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs"
                          >
                            Watch on YouTube / External Stream ↗
                          </a>
                        </div>
                      ) : (
                        <div className="text-xs text-stone-400 p-4 bg-stone-900 rounded-xl text-center">
                          Text article read edition. No media attachment required.
                        </div>
                      )}
                    </div>

                    {/* SHARE BUTTONS SECTION */}
                    <div className="space-y-3 pt-2">
                      <h5 className="text-xs font-bold text-stone-300 uppercase tracking-wider">Share This Release</h5>
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            setShareCopied(true);
                            setTimeout(() => setShareCopied(false), 2000);
                          }}
                          className="bg-stone-800 hover:bg-stone-700 text-stone-200 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                        >
                          {shareCopied ? '✓ Copied Link!' : '🔗 Copy Link'}
                        </button>
                        <a
                          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + ' - Listen on AfroPulse: ' + window.location.href)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-600/30 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
                        >
                          🟢 WhatsApp
                        </a>
                        <a
                          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-600/30 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
                        >
                          📘 Facebook
                        </a>
                        <a
                          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-sky-600/20 hover:bg-sky-600/30 text-sky-400 border border-sky-600/30 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
                        >
                          🕥 X (Twitter)
                        </a>
                        <a
                          href={`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border border-indigo-600/30 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
                        >
                          ✈️ Telegram
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* RELATED CONTENT */}
                  {relatedPosts.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-base font-bold text-white">Related {post.category} Releases</h3>
                      <div className="space-y-3">
                        {relatedPosts.map(rp => (
                          <div
                            key={rp.id}
                            onClick={() => { setSelectedPostId(rp.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                            className="flex items-center gap-4 p-3 bg-stone-900 border border-stone-800 rounded-xl hover:border-amber-500/50 transition cursor-pointer"
                          >
                            <img src={rp.cover} alt="" className="w-16 h-16 rounded-lg object-cover shrink-0" />
                            <div className="flex-1 min-w-0 space-y-1">
                              <h5 className="text-xs font-bold text-white line-clamp-1">{rp.title}</h5>
                              <p className="text-[11px] text-stone-400 truncate">{rp.subtitle}</p>
                            </div>
                            <span className="text-xs text-amber-400 font-bold px-3 py-1 bg-amber-500/10 rounded-lg">View →</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* COMMENTS SECTION */}
                  <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-amber-500" /> Comments ({comments.length})
                    </h3>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!commentAuthor.trim() || !commentText.trim()) {
                          alert('Please enter your name and comment');
                          return;
                        }
                        const newC = {
                          id: 'c-' + Date.now(),
                          author: commentAuthor,
                          text: commentText,
                          date: 'Just now'
                        };
                        setPostComments({
                          ...postComments,
                          [post.id]: [...comments, newC]
                        });
                        setCommentAuthor('');
                        setCommentText('');
                        alert('Comment posted successfully!');
                      }}
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
                          className="bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100"
                        />
                      </div>
                      <textarea
                        required
                        rows={3}
                        placeholder="Write your thoughts or review here..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-xs text-stone-100"
                      ></textarea>
                      <button
                        type="submit"
                        className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-5 py-2.5 rounded-xl text-xs transition"
                      >
                        Post Comment
                      </button>
                    </form>

                    <div className="space-y-3">
                      {comments.map(c => (
                        <div key={c.id} className="p-4 bg-stone-950 border border-stone-800/80 rounded-xl space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-amber-400">{c.author}</span>
                            <span className="text-[10px] text-stone-500">{c.date}</span>
                          </div>
                          <p className="text-xs text-stone-300">{c.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* ROUTE: SPOTIFY PLAYLISTING */}
            {currentRoute === 'spotify' && (
              <div className="space-y-8 max-w-6xl mx-auto">
                <div className="text-center max-w-2xl mx-auto space-y-3">
                  <span className="text-xs bg-emerald-500/20 text-emerald-400 font-bold px-3 py-1 rounded-full uppercase">Spotify Editorial Pitching</span>
                  <h2 className="text-3xl font-black text-white">Boost Your Streams on Verified Spotify Playlists</h2>
                  <p className="text-xs text-stone-400">Guaranteed placement on top African music playlists with real organic listener engagement.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {spotifyPackages.map(pkg => (
                    <div key={pkg.id} className="bg-stone-900 border border-stone-800 rounded-2xl p-6 flex flex-col justify-between space-y-6">
                      <div className="space-y-3">
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2.5 py-1 rounded-full">{pkg.playlists} Playlists</span>
                        <h4 className="text-base font-bold text-white">{pkg.name}</h4>
                        <p className="text-xs text-amber-400 font-bold">{pkg.streams}</p>
                      </div>
                      <div className="space-y-4 pt-4 border-t border-stone-800">
                        <div className="text-2xl font-mono font-bold text-white">₦{pkg.price.toLocaleString()}</div>
                        <button
                          onClick={() => alert(`Proceeding to Paystack checkout for ${pkg.name} (₦{pkg.price.toLocaleString()})`)}
                          className="w-full bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold py-3 rounded-xl text-xs shadow-lg transition-all"
                        >
                          Proceed to Paystack Checkout
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {renderFaqAndTestimonials()}
              </div>
            )}

            {/* ROUTE: PROMOTE YOUR MUSIC & PR */}
            {currentRoute === 'promote' && (
              <div className="space-y-8 max-w-6xl mx-auto">
                <div className="text-center max-w-2xl mx-auto space-y-3">
                  <span className="text-xs bg-amber-500/20 text-amber-400 font-bold px-3 py-1 rounded-full uppercase">PR Campaign Matrix</span>
                  <h2 className="text-3xl font-black text-white">Dominate the African Music Scene</h2>
                  <p className="text-xs text-stone-400">Select your promotional package and launch your press campaign with secure Paystack gateway verification.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {prTiers.map(tier => (
                    <div key={tier.id} className="bg-stone-900 border border-stone-800 rounded-2xl p-6 flex flex-col justify-between space-y-6">
                      <div className="space-y-3">
                        <h4 className="text-base font-bold text-white">{tier.name}</h4>
                        <p className="text-xs text-stone-300">{tier.desc}</p>
                      </div>
                      <div className="space-y-4 pt-4 border-t border-stone-800">
                        <div className="text-2xl font-mono font-bold text-amber-400">₦{tier.price.toLocaleString()}</div>
                        <button
                          onClick={() => alert(`Proceeding to Paystack checkout for ${tier.name} (₦{tier.price.toLocaleString()})`)}
                          className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-3 rounded-xl text-xs shadow-lg transition-all"
                        >
                          Proceed to Paystack Checkout
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {renderFaqAndTestimonials()}
              </div>
            )}

            {/* ROUTE: CONTACT US */}
            {currentRoute === 'contact' && (
              <div className="max-w-2xl mx-auto bg-stone-900 border border-stone-800 rounded-2xl p-8 space-y-6">
                <div>
                  <h2 className="text-2xl font-black text-white">Contact Us & Inquiries</h2>
                  <p className="text-xs text-stone-400 mt-1">Get in touch with the AfroPulse management and editorial team.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">Your Full Name / Artist Name</label>
                    <input type="text" placeholder="e.g. Wizkid Fan" className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-sm text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">Support Email Address</label>
                    <input type="email" placeholder="artist@domain.com" className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-sm text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">Inquiry / Message</label>
                    <textarea rows={4} placeholder="Type your message or PR inquiry here..." className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-sm text-white" />
                  </div>
                  <button onClick={() => alert('Inquiry message sent successfully! Our team will contact you within 24 hours.')} className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-3 rounded-xl text-xs">
                    Send Inquiry
                  </button>
                </div>
              </div>
            )}

            {/* ROUTE: PRIVACY POLICY */}
            {currentRoute === 'privacy' && (
              <div className="max-w-3xl mx-auto bg-stone-900 border border-stone-800 rounded-2xl p-8 space-y-6 text-xs text-stone-300">
                <h2 className="text-2xl font-black text-white">Privacy & Content Protection Policy</h2>
                <p>AfroPulse Entertainment operates as a media promotion and music distribution service provider. Most promotional music, artwork, and video assets are uploaded for promotional purposes on behalf of independent artists and record labels.</p>
                <h3 className="text-sm font-bold text-amber-400">Copyright Disclaimer</h3>
                <p>AfroPulse does not claim ownership over third-party copyrighted material uploaded under artist management agreements. All rights remain with the original creators and publishers.</p>
              </div>
            )}

            {/* ROUTE: DMCA TAKEDOWN */}
            {currentRoute === 'dmca' && (
              <div className="max-w-2xl mx-auto bg-stone-900 border border-stone-800 rounded-2xl p-8 space-y-6">
                <div>
                  <h2 className="text-2xl font-black text-white">DMCA Takedown Request</h2>
                  <p className="text-xs text-stone-400 mt-1">Submit a formal copyright infringement notification for prompt removal.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">Copyright Holder Name</label>
                    <input type="text" placeholder="Full Legal Name" className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-sm text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">Infringing URL on AfroPulse</label>
                    <input type="text" placeholder="https://afropulse.com.ng/song/..." className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-sm text-white" />
                  </div>
                  <button onClick={() => alert('DMCA Takedown notice received. Our legal desk will process removal within 24 hours.')} className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-3 rounded-xl text-xs">
                    Submit Takedown Notice
                  </button>
                </div>
              </div>
            )}

            {/* ROUTE: RADIO CAMPAIGN */}
            {currentRoute === 'radio-campaign' && (
              <div className="max-w-4xl mx-auto space-y-8 py-4">
                <div className="text-center max-w-xl mx-auto space-y-2">
                  <span className="text-xs bg-amber-500/20 text-amber-400 font-bold px-3 py-1 rounded-full uppercase">Broadcast Airplay</span>
                  <h2 className="text-3xl font-black text-white">Radio Campaign & Airplay Services</h2>
                  <p className="text-xs text-stone-400">Secure guaranteed rotation across top FM radio stations and regional hubs in Nigeria.</p>
                </div>

                {radioSubmitted ? (
                  <div className="bg-stone-900 border border-emerald-500/40 rounded-2xl p-8 text-center space-y-6">
                    <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">✓</div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-black text-white">Radio Campaign Successfully Submitted!</h3>
                      <p className="text-xs text-stone-300 max-w-md mx-auto">
                        Your payment has been verified via Paystack. Your radio station servicing brief has been automatically dispatched to the AfroPulse admin desk and station programmers.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setRadioSubmitted(false);
                        setActiveRadioCheckout(null);
                        setCurrentRoute('home');
                      }}
                      className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-6 py-3 rounded-xl text-xs"
                    >
                      Return to Home Portal
                    </button>
                  </div>
                ) : activeRadioCheckout ? (
                  <div className="bg-stone-900 border border-stone-800 rounded-2xl p-8 max-w-2xl mx-auto space-y-6">
                    <div className="flex items-center justify-between border-b border-stone-800 pb-4">
                      <div>
                        <span className="text-[10px] bg-amber-500/20 text-amber-400 font-bold px-2.5 py-1 rounded-full uppercase">Paystack Secure Checkout</span>
                        <h3 className="text-xl font-bold text-white mt-1">{activeRadioCheckout.packageName}</h3>
                      </div>
                      <div className="text-2xl font-mono font-bold text-amber-400">₦{activeRadioCheckout.price.toLocaleString()}</div>
                    </div>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        setRadioSubmitted(true);
                      }}
                      className="space-y-4"
                    >
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">Instant Radio Servicing Submission Form</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-stone-300 mb-1">Artist / Label Name</label>
                          <input type="text" required placeholder="e.g. Starboy Records" className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2.5 text-xs text-white" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-stone-300 mb-1">Contact Email</label>
                          <input type="email" required placeholder="artist@domain.com" className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2.5 text-xs text-white" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-300 mb-1">Streaming / Audio Link</label>
                        <input type="url" required placeholder="Paste Spotify, Apple Music, Audiomack, YouTube, or Google Drive link..." className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2.5 text-xs text-white font-mono" />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-stone-300 mb-1">Radio Edit / Clean Version Check</label>
                          <select className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2.5 text-xs text-white">
                            <option value="yes">Yes, Radio Clean Edit Ready</option>
                            <option value="needs_edit">Needs Studio Radio Edit Service</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-stone-300 mb-1">Preferred Target Cities / Stations</label>
                          <input type="text" required placeholder="e.g. Lagos (Beat FM, Cool FM), PH" className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2.5 text-xs text-white" />
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <button
                          type="button"
                          onClick={() => setActiveRadioCheckout(null)}
                          className="w-1/3 bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold py-3 rounded-xl text-xs"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="w-2/3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-3 rounded-xl text-xs shadow-lg"
                        >
                          Simulate Paystack Payment & Submit Brief 🔒
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 flex flex-col justify-between space-y-6">
                      <div className="space-y-3">
                        <span className="text-[10px] bg-amber-500/20 text-amber-400 font-bold px-2.5 py-1 rounded-full">Standard Airplay</span>
                        <h4 className="text-lg font-bold text-white">Single Station Airplay (1 Month)</h4>
                        <p className="text-xs text-stone-300">Guaranteed daily rotation for 1 full month across prime FM broadcasting schedules.</p>
                      </div>
                      <div className="space-y-4 pt-4 border-t border-stone-800">
                        <div className="text-2xl font-mono font-bold text-amber-400">₦35,000</div>
                        <button
                          onClick={() => setActiveRadioCheckout({ packageName: 'Single Station Airplay (1 Month)', price: 35000 })}
                          className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-3 rounded-xl text-xs shadow-lg transition-all"
                        >
                          Proceed to Paystack Checkout 🔒
                        </button>
                      </div>
                    </div>

                    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 flex flex-col justify-between space-y-6">
                      <div className="space-y-3">
                        <span className="text-[10px] bg-blue-500/20 text-blue-400 font-bold px-2.5 py-1 rounded-full">National Multi-Hub</span>
                        <h4 className="text-lg font-bold text-white">Viral Multi-State Radio Surge (5 Major Hubs)</h4>
                        <p className="text-xs text-stone-300">Syndicated airplay across Lagos, Port Harcourt, Abuja, and key regional music hubs.</p>
                      </div>
                      <div className="space-y-4 pt-4 border-t border-stone-800">
                        <div className="text-2xl font-mono font-bold text-amber-400">₦250,000</div>
                        <button
                          onClick={() => setActiveRadioCheckout({ packageName: 'Viral Multi-State Radio Surge (5 Hubs)', price: 250000 })}
                          className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-3 rounded-xl text-xs shadow-lg transition-all"
                        >
                          Proceed to Paystack Checkout 🔒
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {renderFaqAndTestimonials()}
              </div>
            )}

            {/* ROUTE: TIKTOK CAMPAIGN */}
            {currentRoute === 'tiktok-campaign' && (
              <div className="max-w-4xl mx-auto space-y-8 py-4">
                <div className="text-center max-w-xl mx-auto space-y-2">
                  <span className="text-xs bg-purple-500/20 text-purple-400 font-bold px-3 py-1 rounded-full uppercase">Viral TikTok Promotion</span>
                  <h2 className="text-3xl font-black text-white">TikTok Campaign & Creator Push</h2>
                  <p className="text-xs text-stone-400">Drive viral engagement with top-tier TikTok creators, dance challenges, and corporate ad campaigns.</p>
                </div>

                {tiktokSubmitted ? (
                  <div className="bg-stone-900 border border-emerald-500/40 rounded-2xl p-8 text-center space-y-6">
                    <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">✓</div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-black text-white">TikTok Campaign Successfully Submitted!</h3>
                      <p className="text-xs text-stone-300 max-w-md mx-auto">
                        Your Paystack payment has been verified. Your campaign assets and creator instructions have been automatically dispatched to the AfroPulse TikTok influencer network manager.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setTiktokSubmitted(false);
                        setActiveTiktokCheckout(null);
                        setCurrentRoute('home');
                      }}
                      className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-6 py-3 rounded-xl text-xs"
                    >
                      Return to Home Portal
                    </button>
                  </div>
                ) : activeTiktokCheckout ? (
                  <div className="bg-stone-900 border border-stone-800 rounded-2xl p-8 max-w-2xl mx-auto space-y-6">
                    <div className="flex items-center justify-between border-b border-stone-800 pb-4">
                      <div>
                        <span className="text-[10px] bg-purple-500/20 text-purple-400 font-bold px-2.5 py-1 rounded-full uppercase">Paystack Secure Checkout</span>
                        <h3 className="text-xl font-bold text-white mt-1">{activeTiktokCheckout.tierName} ({activeTiktokCheckout.videoCount} Videos)</h3>
                      </div>
                      <div className="text-2xl font-mono font-bold text-amber-400">₦{activeTiktokCheckout.price.toLocaleString()}</div>
                    </div>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        setTiktokSubmitted(true);
                      }}
                      className="space-y-4"
                    >
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">Instant Campaign Submission Form</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-stone-300 mb-1">Artist / Brand Name</label>
                          <input type="text" required placeholder="e.g. Asake / Pepsi Nigeria" className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2.5 text-xs text-white" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-stone-300 mb-1">Contact Email</label>
                          <input type="email" required placeholder="contact@brand.com" className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2.5 text-xs text-white" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-300 mb-1">TikTok Song Audio Link / Name (Spotify / SoundCloud / TikTok Sound)</label>
                        <input type="text" required placeholder="https://tiktok.com/music/... or song title" className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2.5 text-xs text-white font-mono" />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-300 mb-1">Target Instructions / Concept Brief</label>
                        <textarea rows={3} required placeholder="Describe dance challenge choreography, hook emphasis, or video concept..." className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs text-white"></textarea>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-300 mb-1">Artwork / Asset Upload Link (Google Drive / Dropbox)</label>
                        <input type="url" required placeholder="https://drive.google.com/..." className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2.5 text-xs text-white font-mono" />
                      </div>

                      <div className="flex gap-3 pt-4">
                        <button
                          type="button"
                          onClick={() => setActiveTiktokCheckout(null)}
                          className="w-1/3 bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold py-3 rounded-xl text-xs"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="w-2/3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-3 rounded-xl text-xs shadow-lg"
                        >
                          Simulate Paystack Payment & Submit Campaign 🔒
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Section 1: Corporate Brand Adverts */}
                    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-pink-500/20 text-pink-400">Corporate & Brands</span>
                          <h4 className="text-lg font-bold text-white mt-1">Corporate Video Adverts & Campaigns</h4>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-stone-400 font-mono">Unit Price:</span>
                          <div className="text-base font-mono font-bold text-amber-400">₦25,000 / video</div>
                        </div>
                      </div>
                      <p className="text-xs text-stone-300">Custom commercial video advert creation and viral push targeted to active Nigerian consumer demographics.</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end pt-2">
                        <div>
                          <label className="block text-xs font-semibold text-stone-300 mb-1">Select Number of Videos (Flexible Quantity):</label>
                          <input 
                            type="number" 
                            min="1" 
                            value={tiktokCorporateQty}
                            onChange={(e) => setTikTokCorporateQtyHelper ? setTikTokCorporateQtyHelper(parseInt(e.target.value) || 1) : setTiktokCorporateQty(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                          />
                        </div>
                        <div className="flex items-center justify-between bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5">
                          <span className="text-xs text-stone-400">Total Price:</span>
                          <span className="text-lg font-mono font-bold text-amber-400">₦{(tiktokCorporateQty * 25000).toLocaleString()}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => setActiveTiktokCheckout({ tierName: 'Corporate Video Advert', videoCount: tiktokCorporateQty, price: tiktokCorporateQty * 25000 })}
                        className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-3 rounded-xl text-xs shadow-lg mt-2"
                      >
                        Proceed to Paystack Checkout 🔒
                      </button>
                    </div>

                    {/* Section 2: Music Artists - Standard & Elite */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Tier 1: Standard Creator Push */}
                      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 flex flex-col justify-between space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/20 text-amber-400">Music Artists • Tier 1</span>
                            <span className="text-xs font-mono font-bold text-amber-400">₦3,000 / video</span>
                          </div>
                          <h4 className="text-base font-bold text-white">Standard Creator Push / Micro-Influencers</h4>
                          <p className="text-xs text-stone-300">Get your song featured in dance and trend videos by rising TikTok creators.</p>
                          <div className="space-y-1.5 pt-2">
                            <label className="block text-xs font-semibold text-stone-300">Number of Videos (Min 1):</label>
                            <input 
                              type="number" 
                              min="1" 
                              value={tiktokStandardQty}
                              onChange={(e) => setTiktokStandardQty(Math.max(1, parseInt(e.target.value) || 1))}
                              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                            />
                          </div>
                        </div>
                        <div className="space-y-3 pt-4 border-t border-stone-800">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-stone-400">Dynamic Total:</span>
                            <span className="text-base font-mono font-bold text-amber-400">₦{(tiktokStandardQty * 3000).toLocaleString()}</span>
                          </div>
                          <button
                            onClick={() => setActiveTiktokCheckout({ tierName: 'Standard Creator Push', videoCount: tiktokStandardQty, price: tiktokStandardQty * 3000 })}
                            className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-3 rounded-xl text-xs shadow"
                          >
                            Checkout Standard Push 🔒
                          </button>
                        </div>
                      </div>

                      {/* Tier 2: Elite Influencer Campaign */}
                      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 flex flex-col justify-between space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400">Music Artists • Tier 2</span>
                            <span className="text-xs font-mono font-bold text-amber-400">₦20,000 / video</span>
                          </div>
                          <h4 className="text-base font-bold text-white">Elite Influencers (50k+ Followers)</h4>
                          <p className="text-xs text-stone-300">Direct promotion working with established creators with 50k+ active followers.</p>
                          <div className="space-y-1.5 pt-2">
                            <label className="block text-xs font-semibold text-stone-300">Number of Elite Videos (Min 1):</label>
                            <input 
                              type="number" 
                              min="1" 
                              value={tiktokEliteQty}
                              onChange={(e) => setTiktokEliteQty(Math.max(1, parseInt(e.target.value) || 1))}
                              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                            />
                          </div>
                        </div>
                        <div className="space-y-3 pt-4 border-t border-stone-800">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-stone-400">Dynamic Total:</span>
                            <span className="text-base font-mono font-bold text-amber-400">₦{(tiktokEliteQty * 20000).toLocaleString()}</span>
                          </div>
                          <button
                            onClick={() => setActiveTiktokCheckout({ tierName: 'Elite Influencer Campaign', videoCount: tiktokEliteQty, price: tiktokEliteQty * 20000 })}
                            className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-3 rounded-xl text-xs shadow"
                          >
                            Checkout Elite Campaign 🔒
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* High-Converting Call to Action Banner */}
                    <div className="bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-stone-900 border border-amber-500/40 rounded-2xl p-8 text-center space-y-4 mt-8">
                      <h3 className="text-2xl font-black text-white">Ready to Go Viral or Distribute Your Music?</h3>
                      <p className="text-xs text-stone-300 max-w-xl mx-auto">
                        Join thousands of successful artists and brands who trust AfroPulse Entertainment for guaranteed radio rotation, viral TikTok campaigns, and instant Paystack checkout.
                      </p>
                      <div className="flex flex-wrap justify-center gap-4 pt-2">
                        <button onClick={() => setCurrentRoute('beatstore')} className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-6 py-3 rounded-xl text-xs shadow-lg">
                          Explore Beat Store 🎵
                        </button>
                        <button onClick={() => setCurrentRoute('promote')} className="bg-stone-800 hover:bg-stone-700 text-white font-bold px-6 py-3 rounded-xl text-xs border border-stone-700">
                          View All PR Packages 🚀
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {renderFaqAndTestimonials()}
              </div>
            )}

          </div>
        )}

      </main>

      {/* COMPREHENSIVE FOOTER ECOSYSTEM */}
      <footer className="bg-stone-950 border-t border-stone-900 pt-12 pb-10 text-stone-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center text-stone-950 font-black text-xs">AP</div>
              <h4 className="text-sm font-black text-white tracking-wider">AFROPULSE</h4>
            </div>
            <p className="text-[11px] leading-relaxed">
              AfroPulse Entertainment operates as the premier African media promotion portal and music distribution service provider.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-white uppercase tracking-wider text-xs mb-3">Core Services</h5>
            <ul className="space-y-2 text-[11px]">
              <li><button onClick={() => setCurrentRoute('beatstore')} className="hover:text-amber-400 transition-colors">Beat Store</button></li>
              <li><button onClick={() => setCurrentRoute('spotify')} className="hover:text-amber-400 transition-colors">Spotify Playlisting</button></li>
              <li><button onClick={() => setCurrentRoute('promote')} className="hover:text-amber-400 transition-colors">Promote Your Music & PR</button></li>
              <li><button onClick={() => setCurrentRoute('radio-campaign')} className="hover:text-amber-400 transition-colors">Radio Campaign</button></li>
              <li><button onClick={() => setCurrentRoute('tiktok-campaign')} className="hover:text-amber-400 transition-colors">TikTok Campaign</button></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white uppercase tracking-wider text-xs mb-3">Company & Legal</h5>
            <ul className="space-y-2 text-[11px]">
              <li><button onClick={() => setCurrentRoute('contact')} className="hover:text-amber-400 transition-colors">Contact Us / Inquiries</button></li>
              <li><button onClick={() => setCurrentRoute('privacy')} className="hover:text-amber-400 transition-colors">Privacy & Content Protection Policy</button></li>
              <li><button onClick={() => setCurrentRoute('dmca')} className="hover:text-amber-400 transition-colors">DMCA Takedown Request</button></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white uppercase tracking-wider text-xs mb-3">Official Support</h5>
            <p className="text-[11px] mb-1">Victoria Island, Lagos, Nigeria</p>
            <p className="text-[11px] mb-1">Email: support@afropulse.com.ng</p>
            <div className="mt-3 pt-3 border-t border-stone-900 flex items-center justify-between text-[10px] text-stone-500">
              <span>© 2026 AfroPulse Entertainment.</span>
              <button onClick={() => setCurrentRoute('admin')} className="text-stone-400 hover:text-amber-400 transition-colors underline underline-offset-2">Admin Panel</button>
            </div>
          </div>

        </div>
      </footer>

    </main>
  );
}
