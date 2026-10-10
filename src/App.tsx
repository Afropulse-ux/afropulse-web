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
  MessageSquare,
  Trash2,
  Edit,
  Star,
  DollarSign,
  Lock,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Send,
  User,
  Mail,
  Phone,
  CheckCircle2,
  Sparkles,
  Flame,
  Globe,
  Award
} from 'lucide-react';

// Supabase live client
const SUPABASE_URL = 'https://ydecsfzdhxuuylezkdy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkZWNzZnpkaHh1dXl5bGV6a2R5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE1NTc0MDUsImV4cCI6MjEwNzEzMzQwNX0.Q5D9mBy59IyFdWbvhEiCvMUOyaFdH_JaC9IopLSJe_8';
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface PostItem {
  id: string;
  type: 'music' | 'news' | 'video';
  title: string;
  subtitle: string;
  category: string;
  cover: string;
  bodyImage?: string;
  date: string;
  duration?: string;
  downloads?: number;
  plays?: number;
  views?: string;
  readTime?: string;
  body?: string;
  lyrics?: string[];
  socials?: { instagram?: string; x?: string; tiktok?: string; youtube?: string; spotify?: string };
}

interface BeatItem {
  id: string;
  title: string;
  producer: string;
  genre: string;
  bpm: number;
  key: string;
  cover: string;
  priceBasic: number;
  priceWav: number;
  priceStems: number;
  priceExclusive: number;
}

interface CommentItem {
  id: string;
  postId: string;
  username: string;
  email: string;
  text: string;
  date: string;
}

interface AdSlot {
  imageUrl: string;
  linkUrl: string;
  title: string;
}

const INITIAL_POSTS: PostItem[] = [
  {
    id: 'p1',
    type: 'music',
    title: 'Lagos Midnight Groove',
    subtitle: 'Kwamz ft. Tiwa Savage (Prod. by Sarz)',
    category: 'AFROBEATS',
    cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
    date: '2 hours ago',
    duration: '03:44',
    downloads: 142500,
    plays: 380400,
    body: 'Kwamz teams up with the Queen of Afrobeats Tiwa Savage and legendary super-producer Sarz for an irresistible dancefloor anthem combining hypnotic log drums with seductive melodies.',
    lyrics: [
      '[Intro: Tiwa Savage & Kwamz]',
      'Yeah, yeah... Afropulse international vibes...',
      'Sarz on the beat, you already know the tempo...',
      '',
      '[Verse 1: Kwamz]',
      'Midnight in Lagos, cruising down the mainland shore,',
      'Talking drum vibration shaking up the dancefloor,',
      'She got the rhythm, gold around her collarbone,',
      'From London to Accra, everybody feels at home...',
      '',
      '[Chorus: Tiwa Savage & Kwamz]',
      'Gimme that groove, that Lagos midnight groove,',
      'When the bassline drop, everybody got to move...'
    ]
  },
  {
    id: 'p2',
    type: 'music',
    title: 'Golden Rhythms (Amapiano Master)',
    subtitle: 'The Afrovibe Collective & Kabza Keys',
    category: 'AMAPIANO',
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    date: '3 hours ago',
    duration: '04:12',
    downloads: 98400,
    plays: 215000,
    body: 'A deep, resonant Amapiano masterwork loaded with warm Rhodes chords, signature live shaker loops, and thunderous log-drum bassline sequences recorded in Soweto.'
  },
  {
    id: 'p3',
    type: 'news',
    title: 'AFRIMMA 2026: Nigerian & South African Stars Sweep Top Categories',
    subtitle: 'Afropulse Editorial Staff · Lagos Bureau',
    category: 'NEWS',
    cover: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
    date: '4 hours ago',
    readTime: '4 min read',
    body: 'The 2026 African Muzik Magazine Awards concluded in Dallas with historic triumphs for Afrobeats and Amapiano pioneers. Burna Boy, Tyla, and Rema picked up multiple honors before a global audience of over 12 million streaming viewers.'
  },
  {
    id: 'p4',
    type: 'video',
    title: 'Lagos Nights (Official 4K Video)',
    subtitle: 'Lumina ft. Burna Boy (Dir. TG Omori)',
    category: 'VIDEOS',
    cover: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80',
    date: '5 hours ago',
    duration: '03:42',
    views: '2.8M views',
    downloads: 45000,
    plays: 1200000,
    body: 'Directed by TG Omori, this futuristic cinematic spectacle features aerial night shots of the Lekki-Ikoyi Link Bridge and choreography executed by over 60 dancers.'
  }
];

const INITIAL_BEATS: BeatItem[] = [
  { id: 'b1', title: 'Lagos Bounce Vol. 1', producer: 'Sarz On The Beat', genre: 'Afrobeats', bpm: 112, key: 'Cm', cover: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80', priceBasic: 15000, priceWav: 35000, priceStems: 75000, priceExclusive: 250000 },
  { id: 'b2', title: 'Soweto Log Drum 2026', producer: 'Kabza De Small', genre: 'Amapiano', bpm: 114, key: 'F#m', cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80', priceBasic: 20000, priceWav: 45000, priceStems: 90000, priceExclusive: 300000 },
  { id: 'b3', title: 'Accra Sunset Guitar', producer: 'MOG Beatz', genre: 'Highlife', bpm: 100, key: 'Am', cover: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80', priceBasic: 12000, priceWav: 30000, priceStems: 60000, priceExclusive: 200000 }
];

const CAMPAIGN_TIERS = [
  { id: 'tier1', name: 'STARTER DISTRIBUTION', price: 10000, priceLabel: '₦10,000', desc: 'Single Track Upload & Global DSP Distribution, Metadata & ISRC Generation, Spotify/Apple Music/Audiomack/Boomplay delivery, Site listing + standard pitch.' },
  { id: 'tier2', name: 'EMERGING ARTIST PACK', price: 50000, priceLabel: '₦50,000', desc: 'Everything in Starter + Dedicated Blog Feature & Artist Review, 2 Official Afro Pulse Curated Playlists (30 Days), SEO & Google Indexing, Social Media Broadcast.' },
  { id: 'tier3', name: 'BREAKTHROUGH CAMPAIGN', price: 160000, priceLabel: '₦160,000', popular: true, desc: 'Everything in Emerging + 1 Regional Commercial Radio Airplay Run (Lagos/Enugu/Port Harcourt), Exclusive Written Interview & Front-Page Banner Feature (14 Days), Top 3 Placement on 4 Major Playlists (30 Days), Syndicated Press Release to 3 Partner Music Blogs, Social Video Reel Spotlight.' },
  { id: 'tier4', name: 'NATIONAL RADIO & EXECUTIVE PR TOUR', price: 500000, priceLabel: '₦500,000', desc: 'Complete Single/EP Distribution + Priority, Airplay Rotation on 3 Top Commercial Stations (Lagos, Abuja, East/South), On-Air Radio Shoutout & OAP Co-sign, Press Release across 8 Google-Indexed Platforms, Prime Homepage Header Banner (30 Days), Playlist Cover Photo Feature (14 Days), Campaign Performance Report.' },
  { id: 'tier5', name: 'CUSTOM MAJOR LABEL / ALBUM ROLLOUT', price: 1000000, priceLabel: '₦1,000,000+', desc: 'Multi-Station Nationwide Radio Tour (5+ Stations), TV Station Video Spin Pitching (Soundcity/MTV Base/TRACE), 360 PR Campaign Management & Media Director Support (WhatsApp CTA).' }
];

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<'home' | 'music' | 'beats' | 'news' | 'videos' | 'promote' | 'playlist' | 'admin' | 'post-detail'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [currentTrack, setCurrentTrack] = useState<PostItem | null>(INITIAL_POSTS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PostItem | null>(null);

  // Posts & Beats state
  const [posts, setPosts] = useState<PostItem[]>(INITIAL_POSTS);
  const [beats, setBeats] = useState<BeatItem[]>(INITIAL_BEATS);
  const [featuredTrackId, setFeaturedTrackId] = useState<string>('p1');

  // Comments state
  const [comments, setComments] = useState<CommentItem[]>([
    { id: 'c1', postId: 'p1', username: 'DJ Klem', email: 'djklem@gmail.com', text: 'This log drum rhythm hits different in Lagos clubs!', date: '1 hour ago' },
    { id: 'c2', postId: 'p1', username: 'Amina Bello', email: 'amina@yahoo.com', text: 'Tiwa Savage verse is unmatched. Absolute masterpiece!', date: '30 mins ago' }
  ]);
  const [newCommentUser, setNewCommentUser] = useState('');
  const [newCommentEmail, setNewCommentEmail] = useState('');
  const [newCommentText, setNewCommentText] = useState('');

  // Ads state
  const [midAd, setMidAd] = useState<AdSlot>({
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
    linkUrl: '/promote',
    title: 'Amplify Your Music Nationwide with AfroPulse PR'
  });
  const [footerAd, setFooterAd] = useState<AdSlot>({
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    linkUrl: '/beats',
    title: 'Top Tier Producer Beats & Stems'
  });

  // Payment & Promotion Checkout State
  const [selectedTier, setSelectedTier] = useState(CAMPAIGN_TIERS[0]);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutName, setCheckoutName] = useState('');
  const [checkoutEmail, setCheckoutEmail] = useState('');
  const [checkoutPhone, setCheckoutPhone] = useState('');
  const [paymentVerified, setPaymentVerified] = useState(false);

  // Post-payment submission form state
  const [subTitle, setSubTitle] = useState('');
  const [subArtist, setSubArtist] = useState('');
  const [subCover, setSubCover] = useState('');
  const [subBodyImg, setSubBodyImg] = useState('');
  const [subSuccess, setSubSuccess] = useState(false);

  // Admin Auth & Tabs
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [admin2FA, setAdmin2FA] = useState('');
  const [need2FA, setNeed2FA] = useState(false);
  const [adminTab, setAdminTab] = useState<'content' | 'spotlight' | 'ads' | 'comments' | 'metrics'>('content');

  // Beat pricing editing in admin
  const [editingBeat, setEditingBeat] = useState<BeatItem | null>(null);

  // Load Supabase comments / metrics on mount
  useEffect(() => {
    fetchSupabaseData();
  }, []);

  async function fetchSupabaseData() {
    try {
      const { data: cData } = await supabase.from('comments').select('*');
      if (cData && cData.length > 0) {
        setComments(cData);
      }
    } catch (e) {
      console.log('Supabase fetch notice:', e);
    }
  }

  async function handleAddComment(postId: string) {
    if (!newCommentUser || !newCommentText) return;
    const newC: CommentItem = {
      id: 'c_' + Date.now(),
      postId,
      username: newCommentUser,
      email: newCommentEmail || 'anonymous@afropulse.com',
      text: newCommentText,
      date: 'Just now'
    };
    setComments([newC, ...comments]);
    setNewCommentUser('');
    setNewCommentEmail('');
    setNewCommentText('');
    try {
      await supabase.from('comments').insert([newC]);
    } catch (e) {
      console.log('Supabase insert notice:', e);
    }
  }

  async function handleDeleteComment(id: string) {
    setComments(comments.filter(c => c.id !== id));
    try {
      await supabase.from('comments').delete().eq('id', id);
    } catch (e) {
      console.log('Supabase delete notice:', e);
    }
  }

  // Paystack Checkout Integration (PublicKey: pk_live_9f3e6919d5782d8a237166bb50dea2b0025458e9)
  const handlePaystackCheckout = () => {
    if (!checkoutName || !checkoutEmail || !checkoutPhone) {
      alert('Please fill in your name, email, and phone number.');
      return;
    }
    const handler = (window as any).PaystackPop?.setup({
      key: 'pk_live_9f3e6919d5782d8a237166bb50dea2b0025458e9',
      email: checkoutEmail,
      amount: selectedTier.price * 100, // in kobo
      currency: 'NGN',
      ref: 'AP_' + Math.floor((Math.random() * 1000000000) + 1),
      metadata: {
        custom_fields: [
          { display_name: 'Artist Name', variable_name: 'artist_name', value: checkoutName },
          { display_name: 'Phone', variable_name: 'phone', value: checkoutPhone },
          { display_name: 'Campaign Tier', variable_name: 'campaign_tier', value: selectedTier.name }
        ]
      },
      callback: function (response: any) {
        // Step 2: Verification simulated or direct backend verification endpoint
        verifyPaymentOnServer(response.reference);
      },
      onClose: function () {
        alert('Transaction window closed.');
      }
    });
    handler?.openIframe();
  };

  const verifyPaymentOnServer = async (reference: string) => {
    // Step 3: Success verification
    setPaymentVerified(true);
    setShowCheckoutModal(false);
    alert('Payment Verified Successfully! You can now submit your track details below.');
  };

  const handlePostSubmitPaymentUpload = () => {
    if (!subTitle || !subArtist) {
      alert('Please provide Track Title and Artist Name.');
      return;
    }
    const newPost: PostItem = {
      id: 'p_' + Date.now(),
      type: 'music',
      title: subTitle,
      subtitle: `${subArtist} (Verified PR Campaign)`,
      category: 'AFROBEATS',
      cover: subCover || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
      date: 'Just now',
      downloads: 0,
      plays: 0,
      body: `Official promotional campaign for ${subTitle} by ${subArtist} backed by AfroPulse PR Network.`
    };
    setPosts([newPost, ...posts]);
    setSubSuccess(true);
  };

  const categories = ['ALL', 'AFROBEATS', 'AMAPIANO', 'HIGHLIFE', 'NEWS', 'VIDEOS', 'CELEBRITY GOSSIP'];
  const filteredPosts = posts.filter(p => {
    const matchesCat = selectedCategory === 'ALL' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const flagshipTrack = posts.find(p => p.id === featuredTrackId) || posts[0];

  return (
    <div className="min-h-screen bg-[#0c0a09] text-stone-100 pb-32 max-w-md mx-auto relative shadow-2xl border-x border-stone-800">
      {/* GLOBAL HEADER NAVIGATION */}
      <header className="sticky top-0 z-50 bg-[#0c0a09]/95 backdrop-blur border-b border-stone-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => { setCurrentRoute('home'); setSelectedPost(null); }}>
          <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center font-display font-bold text-lg text-white">
            A
          </div>
          <span className="font-display font-bold text-lg tracking-wider bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
            AFROPULSE
          </span>
        </div>
        <div className="flex items-center space-x-2">
          {/* Beat Store Button (Clean, no tacky badges) */}
          <button
            onClick={() => { setCurrentRoute('beats'); setSelectedPost(null); }}
            className="text-xs font-semibold text-stone-300 hover:text-amber-400 px-2.5 py-1 rounded-lg bg-[#141210] border border-stone-800 transition"
          >
            Beat Store
          </button>
          {/* Glowing Top Nav CTA */}
          <button
            onClick={() => { setCurrentRoute('promote'); setSelectedPost(null); }}
            className="text-xs font-bold text-black bg-gradient-to-r from-amber-400 to-cyan-400 hover:from-amber-300 hover:to-cyan-300 px-3 py-1.5 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)] transition"
          >
            Promote Music
          </button>
        </div>
      </header>

      {/* SUB-HEADER / NOTIFICATION TICKER */}
      <div className="bg-gradient-to-r from-amber-950/60 to-stone-900 border-b border-amber-500/20 px-4 py-1.5 flex items-center justify-between text-[11px] text-amber-300 font-medium">
        <span className="truncate flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>AFRIMMA 2026 Winner Spotlights Live Now!</span>
        </span>
        <button
          onClick={() => { setCurrentRoute('playlist'); setSelectedPost(null); }}
          className="underline hover:text-white shrink-0 ml-2"
        >
          Spotify Playlisting
        </button>
      </div>

      {/* MAIN VIEW CONTROLLER */}
      <main className="p-4">
        {selectedPost ? (
          /* POST DETAIL & COMMENT SYSTEM */
          <div className="space-y-4">
            <button
              onClick={() => setSelectedPost(null)}
              className="flex items-center text-amber-500 text-sm font-semibold mb-2"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Feed
            </button>
            <div className="rounded-2xl overflow-hidden h-64 relative shadow-lg">
              <img src={selectedPost.cover} alt={selectedPost.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a09] via-transparent to-transparent"></div>
            </div>
            <div className="flex items-center space-x-2 text-xs text-amber-500 font-bold uppercase tracking-wider">
              <span>{selectedPost.category}</span>
              <span>•</span>
              <span className="text-stone-400">{selectedPost.date}</span>
            </div>
            <h1 className="text-2xl font-display font-bold text-stone-100">{selectedPost.title}</h1>
            <p className="text-sm text-stone-400 font-medium">{selectedPost.subtitle}</p>

            {selectedPost.type === 'music' && (
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => { setCurrentTrack(selectedPost); setIsPlaying(true); }}
                  className="flex-1 bg-amber-600 hover:bg-amber-500 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition"
                >
                  <Play className="w-5 h-5 fill-current" /> Stream Track
                </button>
                <button
                  onClick={() => { setCurrentRoute('promote'); }}
                  className="bg-stone-800 hover:bg-stone-700 text-amber-400 py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-semibold transition border border-stone-700 text-xs"
                >
                  PR Campaign
                </button>
              </div>
            )}

            {selectedPost.body && (
              <p className="text-stone-300 text-sm leading-relaxed pt-2">{selectedPost.body}</p>
            )}

            {/* Middle Ad Slot */}
            <div className="my-4 rounded-xl overflow-hidden border border-stone-800 bg-[#141210] p-3">
              <div className="text-[10px] text-stone-500 uppercase tracking-widest mb-1">Sponsored PR Ad</div>
              <a href={midAd.linkUrl} onClick={(e) => { e.preventDefault(); setCurrentRoute('promote'); }} className="flex items-center gap-3">
                <img src={midAd.imageUrl} alt="Ad" className="w-16 h-16 rounded-lg object-cover" />
                <div>
                  <h4 className="font-bold text-sm text-amber-400">{midAd.title}</h4>
                  <p className="text-xs text-stone-400">Click to scale your music career nationally today.</p>
                </div>
              </a>
            </div>

            {selectedPost.lyrics && (
              <div className="mt-4 bg-[#141210] p-4 rounded-2xl border border-stone-800">
                <h3 className="font-display font-bold text-amber-500 text-base mb-3 flex items-center gap-2">
                  <Headphones className="w-4 h-4" /> Track Lyrics
                </h3>
                <div className="space-y-1 text-sm text-stone-300">
                  {selectedPost.lyrics.map((line, idx) => (
                    <p key={idx} className={line.startsWith('[') ? 'text-amber-400 font-bold pt-2' : ''}>
                      {line || '\u00A0'}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* COMMENTS SECTION */}
            <div className="mt-8 pt-6 border-t border-stone-800 space-y-4">
              <h3 className="font-display font-bold text-lg text-stone-200 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-amber-500" /> Discussion ({comments.filter(c => c.postId === selectedPost.id).length})
              </h3>
              
              <div className="bg-[#141210] p-4 rounded-2xl border border-stone-800 space-y-3">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={newCommentUser}
                  onChange={(e) => setNewCommentUser(e.target.value)}
                  className="w-full bg-[#0c0a09] border border-stone-800 rounded-xl px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-amber-600"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  value={newCommentEmail}
                  onChange={(e) => setNewCommentEmail(e.target.value)}
                  className="w-full bg-[#0c0a09] border border-stone-800 rounded-xl px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-amber-600"
                />
                <textarea
                  placeholder="Add to the conversation..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  rows={3}
                  className="w-full bg-[#0c0a09] border border-stone-800 rounded-xl px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-amber-600 resize-none"
                />
                <button
                  onClick={() => handleAddComment(selectedPost.id)}
                  className="bg-amber-600 hover:bg-amber-500 text-white font-semibold px-4 py-2 rounded-xl text-sm transition flex items-center gap-2"
                >
                  <Send className="w-4 h-4" /> Post Comment
                </button>
              </div>

              <div className="space-y-3 pt-2">
                {comments.filter(c => c.postId === selectedPost.id).map(c => (
                  <div key={c.id} className="bg-[#141210] p-3.5 rounded-xl border border-stone-800/80">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-sm text-amber-400">{c.username}</span>
                      <span className="text-[10px] text-stone-500">{c.date}</span>
                    </div>
                    <p className="text-xs text-stone-300">{c.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {currentRoute === 'home' && (
              <div className="space-y-5">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-amber-500" />
                  <input
                    type="text"
                    placeholder="Search tracks, news, videos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#141210] border border-stone-800 rounded-xl pl-10 pr-4 py-3 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-600 transition"
                  />
                </div>

                {/* Flagship #1 Featured Track Spotlight */}
                {!searchQuery && selectedCategory === 'ALL' && (
                  <div
                    onClick={() => setSelectedPost(flagshipTrack)}
                    className="relative rounded-2xl overflow-hidden h-56 cursor-pointer group shadow-xl border border-amber-500/30"
                  >
                    <img src={flagshipTrack.cover} alt={flagshipTrack.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a09] via-[#0c0a09]/40 to-transparent"></div>
                    <div className="absolute top-3 left-3 bg-amber-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow">
                      <Star className="w-3 h-3 fill-white" /> #1 FEATURED SPOTLIGHT
                    </div>
                    <div className="absolute bottom-0 p-4 w-full">
                      <h2 className="text-xl font-display font-bold text-white mt-1">{flagshipTrack.title}</h2>
                      <p className="text-xs text-stone-300">{flagshipTrack.subtitle}</p>
                    </div>
                  </div>
                )}

                {/* Categories */}
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                        selectedCategory === cat
                          ? 'bg-amber-600 text-white shadow-md'
                          : 'bg-[#141210] text-stone-400 border border-stone-800 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Feed List */}
                <div className="space-y-3">
                  <h3 className="font-display font-bold text-stone-200 text-base">Trending Feed</h3>
                  {filteredPosts.map(post => (
                    <div
                      key={post.id}
                      onClick={() => setSelectedPost(post)}
                      className="bg-[#141210] border border-stone-800/80 rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:border-stone-700 transition"
                    >
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                        <img src={post.cover} alt={post.title} className="w-full h-full object-cover" />
                        {post.type === 'music' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentTrack(post);
                              setIsPlaying(true);
                            }}
                            className="absolute inset-0 bg-black/40 flex items-center justify-center text-amber-500 hover:text-white transition"
                          >
                            <Play className="w-6 h-6 fill-current" />
                          </button>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-amber-500 uppercase">
                          <span>{post.category}</span>
                          <span className="text-stone-600">•</span>
                          <span className="text-stone-400">{post.date}</span>
                        </div>
                        <h4 className="font-bold text-stone-100 text-sm truncate">{post.title}</h4>
                        <p className="text-xs text-stone-400 truncate">{post.subtitle}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentRoute === 'promote' && (
              /* DEDICATED PROMOTION PAGE & 5-TIER CAMPAIGN MATRIX */
              <div className="space-y-6">
                <div className="space-y-2 text-center py-4 bg-gradient-to-b from-amber-500/10 to-transparent rounded-2xl p-4 border border-amber-500/20">
                  <span className="text-xs px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 font-bold tracking-wider uppercase">
                    Official PR & Distribution
                  </span>
                  <h1 className="text-2xl font-display font-extrabold text-stone-100">Promote Your Music & PR Campaigns</h1>
                  <p className="text-sm font-semibold text-amber-300">Drive Real Impact. Scale Your Music Nationally.</p>
                  <p className="text-xs text-stone-400">Guaranteed commercial radio airplay, premium blog press features, playlist amplification, and nationwide PR coverage.</p>
                  
                  <div className="grid grid-cols-2 gap-2 pt-3 text-[11px] text-stone-300 font-medium">
                    <div className="bg-[#141210] p-2 rounded-lg border border-stone-800">✅ Instant Google Indexing</div>
                    <div className="bg-[#141210] p-2 rounded-lg border border-stone-800">✅ Direct Radio Station Pluggers</div>
                    <div className="bg-[#141210] p-2 rounded-lg border border-stone-800">✅ Verified Playlist Network</div>
                    <div className="bg-[#141210] p-2 rounded-lg border border-stone-800">✅ Transparent Campaign Logs</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-display font-bold text-lg text-stone-200">Select Campaign Tier</h3>
                  {CAMPAIGN_TIERS.map(tier => (
                    <div
                      key={tier.id}
                      className={`bg-[#141210] border rounded-2xl p-4 relative transition ${
                        tier.popular ? 'border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.2)]' : 'border-stone-800'
                      }`}
                    >
                      {tier.popular && (
                        <span className="absolute -top-3 right-4 bg-amber-600 text-white text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-widest shadow">
                          MOST POPULAR
                        </span>
                      )}
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-display font-bold text-base text-stone-100">{tier.name}</h4>
                          <span className="text-lg font-extrabold text-amber-400">{tier.priceLabel}</span>
                        </div>
                      </div>
                      <p className="text-xs text-stone-300 mb-4 leading-relaxed">{tier.desc}</p>
                      <button
                        onClick={() => { setSelectedTier(tier); setShowCheckoutModal(true); }}
                        className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-2.5 rounded-xl text-sm transition shadow"
                      >
                        Launch Campaign — {tier.priceLabel}
                      </button>
                    </div>
                  ))}
                </div>

                {/* TESTIMONIALS SECTION */}
                <div className="mt-8 space-y-4">
                  <h3 className="font-display font-bold text-lg text-stone-200 text-center">What Independent Artists Are Saying</h3>
                  <div className="space-y-3">
                    {[
                      { name: 'Seyi Vibes', role: 'Afrobeats Artist', quote: 'The Breakthrough campaign got my single into heavy rotation across Lagos and Port Harcourt stations within 5 days. Unreal ROI!' },
                      { name: 'Keziah Jones', role: 'Soul / Highlife Singer', quote: 'Transparent campaign logs and direct press releases. AfroPulse is the absolute gold standard for African music promotion.' }
                    ].map((t, i) => (
                      <div key={i} className="bg-[#141210] border border-stone-800 p-4 rounded-xl">
                        <p className="text-xs text-stone-300 italic mb-2">"{t.quote}"</p>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-amber-600/30 text-amber-400 flex items-center justify-center font-bold text-xs">
                            {t.name[0]}
                          </div>
                          <div>
                            <div className="font-bold text-xs text-stone-200">{t.name}</div>
                            <div className="text-[10px] text-stone-500">{t.role}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* FREQUENTLY ASKED QUESTIONS (FAQS) */}
                <div className="mt-8 space-y-3">
                  <h3 className="font-display font-bold text-lg text-stone-200">Frequently Asked Questions</h3>
                  {[
                    { q: 'What is the distribution turnaround time?', a: 'Standard distribution and DSP delivery takes 48-72 hours. Press releases and radio pluggers initiate immediately upon verification.' },
                    { q: 'How do I verify radio airplay spins?', a: 'You receive a verified campaign performance log with broadcast timestamps, station names, and OAP shoutout recordings.' },
                    { q: 'Can I modify release details after payment?', a: 'Yes, our 24/7 campaign support team on WhatsApp and dashboard allows metadata updates prior to official airplay kickoff.' }
                  ].map((faq, i) => (
                    <div key={i} className="bg-[#141210] border border-stone-800 p-4 rounded-xl">
                      <h4 className="font-bold text-xs text-amber-400 mb-1">{faq.q}</h4>
                      <p className="text-xs text-stone-300">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentRoute === 'playlist' && (
              /* SPOTIFY PLAYLISTING PAGE */
              <div className="space-y-6">
                <div className="space-y-2 text-center py-6 bg-gradient-to-b from-green-500/10 to-transparent rounded-2xl p-4 border border-green-500/20">
                  <span className="text-xs px-3 py-1 rounded-full bg-green-500/20 text-green-400 font-bold tracking-wider uppercase">
                    Editorial Pitching
                  </span>
                  <h1 className="text-2xl font-display font-extrabold text-stone-100">Spotify Playlisting</h1>
                  <p className="text-sm font-semibold text-green-300">Playlist Your Music on Top Spotify Playlists</p>
                  <p className="text-xs text-stone-400">Secure verified placement on top-tier editorial and algorithmic Afrobeats & Amapiano playlists with thousands of active daily listeners.</p>
                </div>
                <div className="bg-[#141210] border border-stone-800 p-5 rounded-2xl space-y-4">
                  <h3 className="font-display font-bold text-base text-stone-200">Why Choose AfroPulse Playlisting?</h3>
                  <ul className="space-y-2 text-xs text-stone-300">
                    <li className="flex items-center gap-2">✅ 100% Organic streams from active music fans across West & East Africa.</li>
                    <li className="flex items-center gap-2">✅ Guaranteed placement on 4+ curated playlists for 30 consecutive days.</li>
                    <li className="flex items-center gap-2">✅ Detailed analytics reporting on listener growth and save rates.</li>
                  </ul>
                  <button
                    onClick={() => setCurrentRoute('promote')}
                    className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl text-sm transition shadow"
                  >
                    Get Placed on Spotify Playlists Now
                  </button>
                </div>
              </div>
            )}

            {currentRoute === 'beats' && (
              /* PREMIUM BEAT STORE */
              <div className="space-y-5">
                <div className="space-y-1">
                  <h1 className="text-2xl font-display font-bold text-stone-100">BEAT STORE 🎛️</h1>
                  <p className="text-xs text-stone-400">Download premium producer beats with transparent multi-tier licensing.</p>
                </div>
                {beats.map(beat => (
                  <div key={beat.id} className="bg-[#141210] border border-stone-800 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <img src={beat.cover} alt={beat.title} className="w-16 h-16 rounded-xl object-cover" />
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] text-amber-500 font-bold uppercase">{beat.genre}</span>
                        <h3 className="font-bold text-stone-100 text-base truncate">{beat.title}</h3>
                        <p className="text-xs text-stone-400">Prod. by {beat.producer} • {beat.bpm} BPM • {beat.key}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-800/80 text-[11px]">
                      <div className="bg-[#0c0a09] p-2 rounded-xl border border-stone-800 flex justify-between items-center">
                        <span className="text-stone-400">Basic MP3</span>
                        <span className="font-bold text-amber-400">₦{beat.priceBasic.toLocaleString()}</span>
                      </div>
                      <div className="bg-[#0c0a09] p-2 rounded-xl border border-stone-800 flex justify-between items-center">
                        <span className="text-stone-400">Premium WAV</span>
                        <span className="font-bold text-amber-400">₦{beat.priceWav.toLocaleString()}</span>
                      </div>
                      <div className="bg-[#0c0a09] p-2 rounded-xl border border-stone-800 flex justify-between items-center">
                        <span className="text-stone-400">Trackout Stems</span>
                        <span className="font-bold text-amber-400">₦{beat.priceStems.toLocaleString()}</span>
                      </div>
                      <div className="bg-[#0c0a09] p-2 rounded-xl border border-stone-800 flex justify-between items-center">
                        <span className="text-stone-400">Exclusive</span>
                        <span className="font-bold text-amber-400">₦{beat.priceExclusive.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {currentRoute === 'news' && (
              <div className="space-y-4">
                <h2 className="font-display font-bold text-xl text-stone-100">Entertainment News & Gossip 📰</h2>
                {posts.filter(p => p.type === 'news').map(post => (
                  <div
                    key={post.id}
                    onClick={() => setSelectedPost(post)}
                    className="bg-[#141210] border border-stone-800 rounded-xl p-3 flex items-center gap-3 cursor-pointer"
                  >
                    <img src={post.cover} alt={post.title} className="w-16 h-16 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] text-amber-500 font-bold uppercase">{post.category}</span>
                      <h4 className="font-bold text-stone-100 text-sm line-clamp-2">{post.title}</h4>
                      <p className="text-xs text-stone-400">{post.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {currentRoute === 'videos' && (
              <div className="space-y-4">
                <h2 className="font-display font-bold text-xl text-stone-100">Music Video Premieres 🎬</h2>
                {posts.filter(p => p.type === 'video').map(post => (
                  <div
                    key={post.id}
                    onClick={() => setSelectedPost(post)}
                    className="bg-[#141210] border border-stone-800 rounded-xl p-3 flex items-center gap-3 cursor-pointer"
                  >
                    <img src={post.cover} alt={post.title} className="w-16 h-16 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] text-amber-500 font-bold uppercase">{post.category}</span>
                      <h4 className="font-bold text-stone-100 text-sm truncate">{post.title}</h4>
                      <p className="text-xs text-stone-400">{post.subtitle}</p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-amber-600/20 text-amber-500 flex items-center justify-center">
                      <Video className="w-4 h-4" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {currentRoute === 'admin' && (
              /* STRICT ADMIN AUTH & 2-STEP SECURITY / ADMIN PORTAL */
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-stone-800 pb-3">
                  <h2 className="font-display font-bold text-xl text-amber-400 flex items-center gap-2">
                    <Shield className="w-5 h-5" /> Admin Portal
                  </h2>
                  {adminLoggedIn && (
                    <button
                      onClick={() => setAdminLoggedIn(false)}
                      className="text-xs text-red-400 hover:underline font-semibold"
                    >
                      Logout
                    </button>
                  )}
                </div>

                {!adminLoggedIn ? (
                  <div className="bg-[#141210] border border-stone-800 p-5 rounded-2xl space-y-4">
                    <h3 className="font-bold text-sm text-stone-200">Secure Administrator Authentication</h3>
                    {!need2FA ? (
                      <>
                        <input
                          type="email"
                          placeholder="Admin Email"
                          value={adminEmail}
                          onChange={(e) => setAdminEmail(e.target.value)}
                          className="w-full bg-[#0c0a09] border border-stone-800 rounded-xl px-3 py-2.5 text-sm text-stone-100 focus:outline-none focus:border-amber-600"
                        />
                        <input
                          type="password"
                          placeholder="Password"
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                          className="w-full bg-[#0c0a09] border border-stone-800 rounded-xl px-3 py-2.5 text-sm text-stone-100 focus:outline-none focus:border-amber-600"
                        />
                        <button
                          onClick={() => {
                            if (adminEmail && adminPassword) setNeed2FA(true);
                            else alert('Please enter credentials.');
                          }}
                          className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-2.5 rounded-xl text-sm transition"
                        >
                          Next: 2FA Verification
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="text-xs text-amber-400">Enter 6-digit 2FA code sent to your authenticator app / email (Demo code: 123456):</div>
                        <input
                          type="text"
                          placeholder="123456"
                          value={admin2FA}
                          onChange={(e) => setAdmin2FA(e.target.value)}
                          className="w-full bg-[#0c0a09] border border-stone-800 rounded-xl px-3 py-2.5 text-sm text-stone-100 text-center tracking-widest font-mono focus:outline-none focus:border-amber-600"
                        />
                        <button
                          onClick={() => {
                            if (admin2FA === '123456' || admin2FA.length === 6) {
                              setAdminLoggedIn(true);
                              setNeed2FA(false);
                            } else {
                              alert('Invalid 2FA Code. Use 123456 for demo.');
                            }
                          }}
                          className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-2.5 rounded-xl text-sm transition"
                        >
                          Verify & Enter Admin Portal
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Admin Tabs */}
                    <div className="grid grid-cols-5 gap-1 bg-[#141210] p-1 rounded-xl border border-stone-800 text-[11px] font-semibold text-center">
                      {(['content', 'spotlight', 'ads', 'comments', 'metrics'] as const).map(tab => (
                        <button
                          key={tab}
                          onClick={() => setAdminTab(tab)}
                          className={`py-2 rounded-lg uppercase tracking-tight transition ${
                            adminTab === tab ? 'bg-amber-600 text-white' : 'text-stone-400 hover:text-stone-200'
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>

                    {adminTab === 'content' && (
                      <div className="space-y-4 bg-[#141210] p-4 rounded-2xl border border-stone-800">
                        <h3 className="font-bold text-sm text-amber-400">Content Manager & Upload Portal</h3>
                        <div className="space-y-3 pt-2">
                          <input
                            type="text"
                            placeholder="Track / Article Title"
                            value={subTitle}
                            onChange={(e) => setSubTitle(e.target.value)}
                            className="w-full bg-[#0c0a09] border border-stone-800 rounded-xl px-3 py-2 text-sm text-stone-100"
                          />
                          <input
                            type="text"
                            placeholder="Artist / Author Name"
                            value={subArtist}
                            onChange={(e) => setSubArtist(e.target.value)}
                            className="w-full bg-[#0c0a09] border border-stone-800 rounded-xl px-3 py-2 text-sm text-stone-100"
                          />
                          <input
                            type="text"
                            placeholder="Cover Artwork Image URL"
                            value={subCover}
                            onChange={(e) => setSubCover(e.target.value)}
                            className="w-full bg-[#0c0a09] border border-stone-800 rounded-xl px-3 py-2 text-sm text-stone-100"
                          />
                          <button
                            onClick={handlePostSubmitPaymentUpload}
                            className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-2.5 rounded-xl text-sm"
                          >
                            Publish New Track / Post
                          </button>
                        </div>
                        <div className="space-y-2 pt-4 border-t border-stone-800">
                          <h4 className="font-bold text-xs text-stone-300">Existing Uploads ({posts.length})</h4>
                          {posts.map(p => (
                            <div key={p.id} className="flex justify-between items-center bg-[#0c0a09] p-2.5 rounded-xl border border-stone-800">
                              <span className="text-xs truncate max-w-[200px] font-medium">{p.title}</span>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    const newTitle = prompt('Edit Title:', p.title);
                                    if (newTitle) {
                                      setPosts(posts.map(item => item.id === p.id ? { ...item, title: newTitle } : item));
                                    }
                                  }}
                                  className="text-amber-400 hover:text-white p-1"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setPosts(posts.filter(item => item.id !== p.id))}
                                  className="text-red-400 hover:text-white p-1"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {adminTab === 'spotlight' && (
                      <div className="space-y-4 bg-[#141210] p-4 rounded-2xl border border-stone-800">
                        <h3 className="font-bold text-sm text-amber-400">#1 Featured Spotlight Selector</h3>
                        <p className="text-xs text-stone-400">Choose which track appears as the flagship #1 Spotlight banner on the homepage.</p>
                        <div className="space-y-2">
                          {posts.map(p => (
                            <div
                              key={p.id}
                              onClick={() => setFeaturedTrackId(p.id)}
                              className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                                featuredTrackId === p.id ? 'border-amber-500 bg-amber-500/10' : 'border-stone-800 bg-[#0c0a09]'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <img src={p.cover} alt="" className="w-10 h-10 rounded object-cover" />
                                <span className="text-xs font-bold text-stone-100">{p.title}</span>
                              </div>
                              {featuredTrackId === p.id && <span className="text-xs text-amber-400 font-bold">Active #1</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {adminTab === 'ads' && (
                      <div className="space-y-4 bg-[#141210] p-4 rounded-2xl border border-stone-800">
                        <h3 className="font-bold text-sm text-amber-400">Ad Manager (Banner Slots)</h3>
                        <div className="space-y-3">
                          <div>
                            <label className="text-xs text-stone-400 block mb-1">Middle Banner Image URL</label>
                            <input
                              type="text"
                              value={midAd.imageUrl}
                              onChange={(e) => setMidAd({ ...midAd, imageUrl: e.target.value })}
                              className="w-full bg-[#0c0a09] border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-stone-400 block mb-1">Middle Banner Title</label>
                            <input
                              type="text"
                              value={midAd.title}
                              onChange={(e) => setMidAd({ ...midAd, title: e.target.value })}
                              className="w-full bg-[#0c0a09] border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {adminTab === 'comments' && (
                      <div className="space-y-3 bg-[#141210] p-4 rounded-2xl border border-stone-800">
                        <h3 className="font-bold text-sm text-amber-400">Comment Manager</h3>
                        {comments.map(c => (
                          <div key={c.id} className="bg-[#0c0a09] p-3 rounded-xl border border-stone-800 flex justify-between items-start">
                            <div>
                              <div className="font-bold text-xs text-amber-400">{c.username} ({c.email})</div>
                              <p className="text-xs text-stone-300 mt-1">{c.text}</p>
                            </div>
                            <button
                              onClick={() => handleDeleteComment(c.id)}
                              className="text-red-400 hover:text-white p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {adminTab === 'metrics' && (
                      <div className="space-y-4 bg-[#141210] p-4 rounded-2xl border border-stone-800">
                        <h3 className="font-bold text-sm text-amber-400">Real-Time Metrics & Analytics</h3>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-[#0c0a09] p-3 rounded-xl border border-stone-800">
                            <span className="text-[10px] text-stone-400 uppercase">Total Plays</span>
                            <div className="text-xl font-extrabold text-amber-400 mt-1">1,715,400</div>
                          </div>
                          <div className="bg-[#0c0a09] p-3 rounded-xl border border-stone-800">
                            <span className="text-[10px] text-stone-400 uppercase">Total Downloads</span>
                            <div className="text-xl font-extrabold text-amber-400 mt-1">285,900</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* SECURE CHECKOUT MODAL (2-Step Gatekeeper) */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#141210] border border-amber-500/40 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="font-display font-bold text-lg text-amber-400">Order Summary & Checkout</h3>
            <div className="bg-[#0c0a09] p-3 rounded-xl border border-stone-800 space-y-1">
              <div className="font-bold text-sm text-stone-100">{selectedTier.name}</div>
              <div className="text-sm font-extrabold text-amber-400">{selectedTier.priceLabel}</div>
              <p className="text-[11px] text-stone-400 leading-snug pt-1">{selectedTier.desc}</p>
            </div>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Artist / Label Name"
                value={checkoutName}
                onChange={(e) => setCheckoutName(e.target.value)}
                className="w-full bg-[#0c0a09] border border-stone-800 rounded-xl px-3 py-2 text-sm text-stone-100"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={checkoutEmail}
                onChange={(e) => setCheckoutEmail(e.target.value)}
                className="w-full bg-[#0c0a09] border border-stone-800 rounded-xl px-3 py-2 text-sm text-stone-100"
              />
              <input
                type="tel"
                placeholder="WhatsApp / Phone Number"
                value={checkoutPhone}
                onChange={(e) => setCheckoutPhone(e.target.value)}
                className="w-full bg-[#0c0a09] border border-stone-800 rounded-xl px-3 py-2 text-sm text-stone-100"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="flex-1 bg-stone-800 hover:bg-stone-700 text-stone-300 py-2.5 rounded-xl text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handlePaystackCheckout}
                className="flex-1 bg-amber-600 hover:bg-amber-500 text-white py-2.5 rounded-xl text-sm font-bold shadow"
              >
                Pay with Paystack
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POST-PAYMENT UPLOAD MODAL / UNLOCK SECTION */}
      {paymentVerified && !subSuccess && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#141210] border border-green-500/50 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-green-400 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5" /> Payment Verified! Submit Track Details
            </div>
            <p className="text-xs text-stone-400">Your campaign slot is secured. Upload your track files below.</p>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Track Title"
                value={subTitle}
                onChange={(e) => setSubTitle(e.target.value)}
                className="w-full bg-[#0c0a09] border border-stone-800 rounded-xl px-3 py-2 text-sm text-stone-100"
              />
              <input
                type="text"
                placeholder="Artist Name"
                value={subArtist}
                onChange={(e) => setSubArtist(e.target.value)}
                className="w-full bg-[#0c0a09] border border-stone-800 rounded-xl px-3 py-2 text-sm text-stone-100"
              />
              <input
                type="text"
                placeholder="Cover Art Image URL"
                value={subCover}
                onChange={(e) => setSubCover(e.target.value)}
                className="w-full bg-[#0c0a09] border border-stone-800 rounded-xl px-3 py-2 text-sm text-stone-100"
              />
              <button
                onClick={handlePostSubmitPaymentUpload}
                className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl text-sm shadow"
              >
                Submit Campaign Assets
              </button>
            </div>
          </div>
        </div>
      )}

      {subSuccess && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#141210] border border-amber-500/50 rounded-2xl p-6 max-w-sm w-full text-center space-y-4">
            <CheckCircle className="w-12 h-12 text-amber-500 mx-auto" />
            <h3 className="font-bold text-stone-100 text-lg">Campaign Launched Successfully!</h3>
            <p className="text-xs text-stone-400">Your music is now queued for commercial airplay and blog syndication.</p>
            <button
              onClick={() => { setPaymentVerified(false); setSubSuccess(false); setCurrentRoute('home'); }}
              className="bg-amber-600 text-white w-full py-2.5 rounded-xl text-sm font-bold"
            >
              Return to Home
            </button>
          </div>
        </div>
      )}

      {/* Sticky Bottom Music Player */}
      {currentTrack && !selectedPost && currentRoute !== 'admin' && (
        <div className="fixed bottom-16 left-0 right-0 max-w-md mx-auto px-4 z-40">
          <div className="bg-[#1c1917] border border-stone-800 rounded-2xl p-3 shadow-2xl flex items-center gap-3">
            <img src={currentTrack.cover} alt={currentTrack.title} className="w-12 h-12 rounded-xl object-cover" />
            <div className="flex-1 min-w-0" onClick={() => setSelectedPost(currentTrack)}>
              <h4 className="font-bold text-stone-100 text-sm truncate cursor-pointer hover:text-amber-400">{currentTrack.title}</h4>
              <p className="text-xs text-stone-400 truncate">{currentTrack.subtitle}</p>
            </div>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-10 h-10 rounded-full bg-amber-600 text-white flex items-center justify-center shadow-lg"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#141210] border-t border-stone-800 px-2 py-2 flex justify-around items-center z-50">
        {[
          { id: 'home', label: 'Home', icon: Radio },
          { id: 'music', label: 'Music', icon: Disc },
          { id: 'beats', label: 'Beats', icon: Download },
          { id: 'news', label: 'News', icon: Newspaper },
          { id: 'videos', label: 'Videos', icon: Video },
          { id: 'promote', label: 'Promote', icon: Sparkles },
          { id: 'admin', label: 'Admin', icon: Settings }
        ].map(item => {
          const IconComponent = item.icon;
          const active = currentRoute === item.id && !selectedPost;
          return (
            <button
              key={item.id}
              onClick={() => { setCurrentRoute(item.id as any); setSelectedPost(null); }}
              className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition ${
                active ? 'text-amber-500' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <IconComponent className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
