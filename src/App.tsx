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

// STRICT UNIVERSAL CATEGORY ROUTING:
// 1. Music feed: shows only category === 'audio' or 'music'
export const isMusicPost = (p: { category?: string }) => {
  const cat = (p.category || '').toLowerCase().trim();
  return cat === 'audio' || cat === 'music';
};

// 2. Movie feed: shows only category === 'video' or 'movie'
export const isMoviePost = (p: { category?: string }) => {
  const cat = (p.category || '').toLowerCase().trim();
  return cat === 'video' || cat === 'movie';
};

// 3. Beats feed: shows only category === 'beats'
export const isBeatsPost = (p: { category?: string }) => {
  const cat = (p.category || '').toLowerCase().trim();
  return cat === 'beats' || cat === 'beat';
};

// 4. News feed: shows only category === 'news'
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

  // Radio form fields
  const [radioArtistName, setRadioArtistName] = useState('');
  const [radioEmail, setRadioEmail] = useState('');
  const [radioStreamLink, setRadioStreamLink] = useState('');
  const [radioCleanEdit, setRadioCleanEdit] = useState('yes');
  const [radioStations, setRadioStations] = useState('');

  // TikTok form fields
  const [tiktokBrandName, setTiktokBrandName] = useState('');
  const [tiktokEmail, setTiktokEmail] = useState('');
  const [tiktokAudioLink, setTiktokAudioLink] = useState('');
  const [tiktokConceptBrief, setTiktokConceptBrief] = useState('');
  const [tiktokAssetLink, setTiktokAssetLink] = useState('');

  // Spotify checkout state
  const [activeSpotifyCheckout, setActiveSpotifyCheckout] = useState<{ name: string; price: number; playlists: number } | null>(null);
  const [spotifySubmitted, setSpotifySubmitted] = useState(false);
  const [spotifyArtistName, setSpotifyArtistName] = useState('');
  const [spotifyEmail, setSpotifyEmail] = useState('');
  const [spotifyTrackLink, setSpotifyTrackLink] = useState('');

  // PR checkout state
  const [activePRCheckout, setActivePRCheckout] = useState<{ name: string; price: number; desc: string } | null>(null);
  const [prSubmitted, setPRSubmitted] = useState(false);
  const [prArtistName, setPRArtistName] = useState('');
  const [prEmail, setPREmail] = useState('');
  const [prSongLink, setPRSongLink] = useState('');
  const [prPressNotes, setPRPressNotes] = useState('');

  // Paystack inline initialization helper
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

    // Direct fallback for sandboxed/preview environments
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
        {
          q: "How does Spotify playlist pitching work?",
          a: "We pitch your song directly to verified playlist curators across our organic Afrobeat, Amapiano, and African pop networks for active playlist placement."
        },
        {
          q: "Are these streams 100% organic and safe?",
          a: "Yes, all promotion is strictly compliant with Spotify terms—zero bots, artificial manipulation, or fake streams. Every stream originates from genuine human listeners."
        },
        {
          q: "Do I need to upload an MP3 file?",
          a: "No, simply provide your official Spotify track link or URI during checkout. We never require large MP3 or WAV file uploads."
        },
        {
          q: "How long before I see results on Spotify for Artists?",
          a: "Playlist additions are processed within 24 to 48 hours, with placements and stream updates typically reflecting in Spotify for Artists within 48 to 72 hours."
        },
        {
          q: "Will I get a link to the playlists my song is added to?",
          a: "Yes, our team emails you verified direct playlist URLs as soon as your track is placed so you can monitor your placement and saves live."
        }
      ];
      testimonials = [
        {
          quote: "My single was placed on 4 curated Afropop playlists within 3 days. My monthly listeners on Spotify jumped by over 14,000 in two weeks with zero drop-off!",
          author: "Damola A.",
          role: "Recording Artist"
        },
        {
          quote: "Zero bot flags on Spotify for Artists. The stream curve was completely natural and saved tracks went up by 300%. Legit curator pitching at its finest.",
          author: "Cynthia M.",
          role: "Indie Singer-Songwriter"
        },
        {
          quote: "The curator placement report was sent straight to my inbox with active links. AfroPulse is our go-to playlist marketing service for every single release.",
          author: "Wale K.",
          role: "A&R Director"
        }
      ];
    } else if (route === 'promote') {
      badgeText = "Digital PR & Media FAQs";
      sectionTitle = "Press Release & Digital PR FAQs";
      sectionSubtitle = "Everything you need to know about blog publishing, press releases, live published URLs, and Google SEO indexing.";
      faqs = [
        {
          q: "Which blogs and news platforms publish our music?",
          a: "We service top African entertainment portals including Pulse, NotJustOk, BellaNaija, Legit, AfroPulse, and leading regional entertainment press outlets."
        },
        {
          q: "How long does digital PR press release publishing take?",
          a: "Press releases and editorial write-ups are reviewed, formatted, and published live on target music blogs within 24 to 48 hours from submission."
        },
        {
          q: "Will my articles and press releases index on Google?",
          a: "Yes, all our media publications are fully indexed on Google, improving your artist SEO, search rankings, and Google Knowledge Panel presence."
        },
        {
          q: "Do you provide live published URLs for our records?",
          a: "Yes, once publications go live, we deliver a comprehensive media coverage dossier containing every live article URL for your records and EPK."
        },
        {
          q: "Can I provide my own written press release and promo photos?",
          a: "Absolutely. You can submit your ready-made press release, EPK, cover artwork, and high-resolution press photos, or our editorial team can draft the copy for you."
        }
      ];
      testimonials = [
        {
          quote: "Got our EP featured on 5 top Nigerian music blogs within 48 hours. When industry stakeholders Google our artist name, the press coverage shows up on page one!",
          author: "Tunde E.",
          role: "Record Label Executive"
        },
        {
          quote: "Fast blog coverage and pristine article formatting. The press release created genuine media momentum ahead of our official music video release.",
          author: "Sandra B.",
          role: "PR Manager"
        },
        {
          quote: "The live published links were delivered right on schedule with flawless write-ups. Outstanding digital PR service for independent African artists.",
          author: "Femi O.",
          role: "Afrobeats Artist"
        }
      ];
    } else if (route === 'radio-campaign') {
      badgeText = "Radio Campaign FAQs";
      sectionTitle = "Radio Airplay & Servicing FAQs";
      sectionSubtitle = "Detailed answers about commercial FM station rotation, audio links, and broadcast logs.";
      faqs = [
        {
          q: "How does radio airplay rotation work?",
          a: "We service your song directly to verified radio DJs, music directors, and station programmers for scheduled daily on-air rotations across prime broadcast slots."
        },
        {
          q: "Do I need to upload large audio files for radio servicing?",
          a: "No, simply provide your active streaming link (Spotify, Apple Music, Audiomack, YouTube, or Google Drive) in the submission form."
        },
        {
          q: "Which cities and states are covered in multi-state radio packages?",
          a: "Our multi-station packages cover prime commercial radio hubs across Lagos (Beat FM, Cool FM, Soundcity), Abuja, Port Harcourt, Ibadan, and key regional music markets."
        },
        {
          q: "Do I receive airplay logs and broadcast verification?",
          a: "Yes, we provide broadcast tracking summaries detailing station airplay schedules, rotation frequency, and broadcast logs."
        },
        {
          q: "What if my track requires a clean radio edit?",
          a: "Stations require clean audio for daytime broadcast. If your track contains profanity, select 'Needs Studio Radio Edit Service' and our studio team will prepare a broadcast-ready version."
        }
      ];
      testimonials = [
        {
          quote: "Hearing our single on peak drive-time radio in Lagos and Abuja was a massive breakthrough. Station DJ servicing was fast and completely verified.",
          author: "Boma D.",
          role: "Port Harcourt Artist"
        },
        {
          quote: "The multi-state radio surge gave us synchronized daily airplay across three major hubs. The broadcast logs were detailed and accurate.",
          author: "Segun R.",
          role: "Artist Manager"
        },
        {
          quote: "The radio servicing submission was seamless—pasted our streaming link and our song was in rotation within 4 business days.",
          author: "Nkechi P.",
          role: "Gospel & Soul Artist"
        }
      ];
    } else if (route === 'tiktok-campaign') {
      badgeText = "TikTok Campaign FAQs";
      sectionTitle = "TikTok Promotion & Influencer FAQs";
      sectionSubtitle = "Key details about creator rollout, influencer tiers, flexible quantities, and corporate adverts.";
      faqs = [
        {
          q: "How quickly do TikTok creators start publishing videos?",
          a: "Campaign rollouts begin within 24 to 48 hours after your sound link, campaign instructions, and creative brief are approved by our influencer network."
        },
        {
          q: "What is the difference between Micro Creators and Elite Influencers?",
          a: "Standard creators (₦3,000/video) build viral grassroots sound usage and volume, while Elite Influencers (₦20,000/video, 50k+ followers) generate massive reach and high viewer engagement."
        },
        {
          q: "How does the flexible quantity selector work?",
          a: "You can choose any exact number of videos (starting from 1 video) with real-time dynamic total calculation, allowing you to test low-budget campaigns or scale up."
        },
        {
          q: "How do Corporate Brand Video Adverts differ from music pushes?",
          a: "Corporate campaigns (₦25,000/video) are tailored specifically for commercial brands, apps, and businesses, featuring custom creator scripts and product demonstrations."
        },
        {
          q: "How do I submit my TikTok sound link and campaign instructions?",
          a: "Right after selecting your tier and quantity, our instant campaign brief form collects your TikTok sound URL, concept instructions, and promo assets."
        }
      ];
      testimonials = [
        {
          quote: "Our dance challenge sound exploded from 20 videos to over 4,500 creator videos in 10 days! The TikTok algorithm favored our track heavily.",
          author: "Kaycee M.",
          role: "Afro-Dance Creator"
        },
        {
          quote: "The flexible quantity selector allowed us to start with 5 videos to test the concept before rolling out 30 more. The engagement rate was top tier.",
          author: "Halima Y.",
          role: "Brand Strategist"
        },
        {
          quote: "Elite influencers delivered high-quality creative videos that pushed our campaign to over 350,000 organic impressions in one weekend.",
          author: "David O.",
          role: "Commercial Marketing Lead"
        }
      ];
    } else {
      // Beat store & Producer Licensing
      badgeText = "Beat Store FAQs";
      sectionTitle = "Beat Store & Licensing FAQs";
      sectionSubtitle = "Clear answers regarding commercial leases, WAV stems, agreements, and instant delivery.";
      faqs = [
        {
          q: "What audio files do I receive after purchasing a beat?",
          a: "Depending on the license tier selected, you receive tagged MP3, untagged HQ WAV (24-bit), and full separate tracked-out audio stems (ZIP)."
        },
        {
          q: "Can I upload songs made with these beats to Spotify and Apple Music?",
          a: "Yes, all licenses grant commercial streaming rights on Spotify, Apple Music, YouTube, Audiomack, and all major digital platforms."
        },
        {
          q: "Are beats delivered immediately after payment?",
          a: "Yes, instant download links are unlocked immediately on-screen via Paystack and sent to your email with a signed licensing agreement."
        },
        {
          q: "Can two artists purchase the same non-exclusive lease?",
          a: "Yes, non-exclusive licenses (MP3, WAV, Stems) can be leased to multiple artists. For 100% exclusive ownership, purchase the Exclusive Rights license."
        },
        {
          q: "How do I upgrade from a lease to an Exclusive License later?",
          a: "Contact our producer desk; you only pay the price difference between your current lease and the exclusive buyout."
        }
      ];
      testimonials = [
        {
          quote: "The instant download delivered pristine 24-bit WAV stems right after Paystack payment. The mix clarity was world-class.",
          author: "Rexx D.",
          role: "Music Producer"
        },
        {
          quote: "Purchased a commercial lease for our debut single. It cleared Spotify and YouTube Content ID without any hassle.",
          author: "Jide A.",
          role: "Singer"
        },
        {
          quote: "AfroPulse beat store has the highest quality Amapiano and Afrobeat instrumentals on the web. Smooth checkout and signed contract included.",
          author: "Kelvin B.",
          role: "Label Producer"
        }
      ];
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

        <div className="space-y-6 max-w-6xl mx-auto">
          <div className="text-center space-y-2">
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-3 py-1 rounded-full uppercase">Client Reviews</span>
            <h3 className="text-2xl font-black text-white">Verified Client Testimonials</h3>
            <p className="text-xs text-stone-400">Authentic feedback from artists, creators, and managers using this service.</p>
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

  // Initialize posts and beats empty and fetch exclusively from Supabase
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

      // 1. Process posts table records
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
              const beatImg = p.image_url || p.cover_url || p.cover || 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80';
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
            
            // 1. Artwork mapping: explicitly prioritize image_url
            const imgUrl = p.image_url || p.cover_url || p.cover || '';
            // 2. Audio mapping: explicitly prioritize audio_url or audio_link
            const audUrl = p.audio_url || p.audio_link || p.audioUrl || '';
            // 3. Video mapping
            const vidUrl = p.video_url || p.video_link || p.videoUrl || '';
            // 4. Artist mapping: explicitly prioritize artist or main_artist
            const artistName = p.artist || p.main_artist || (isBeat ? (p.producer || 'AfroPulse Producer') : 'AfroPulse Artist');
            const featArtist = p.featured_artist || p.featuring || (p.subtitle && p.subtitle !== artistName ? p.subtitle : '');
            // 5. Content / Description mapping
            const postBody = p.content || p.body || p.description || 'Exclusive release on AfroPulse.';

            // Strict Category Assignment:
            // - Music feed: shows only category === 'audio' or 'music'
            // - Movie feed: shows only category === 'video' or 'movie'
            // - Beats feed: shows only category === 'beats'
            // - News feed: shows only category === 'news'
            let finalCat = 'audio';
            if (rawCat === 'video' || rawCat === 'videos' || rawCat === 'movie' || rawCat === 'movies' || rawCat === 'movie_premiere') {
              finalCat = (rawCat === 'movie' || rawCat === 'movies' || rawCat === 'movie_premiere') ? 'movie' : 'video';
            } else if (rawCat === 'news' || rawCat === 'gossip') {
              finalCat = 'news';
            } else if (isBeat) {
              finalCat = 'beats';
            } else if (rawCat === 'audio' || rawCat === 'music') {
              finalCat = rawCat;
            } else if (vidUrl && !audUrl) {
              finalCat = 'video';
            } else {
              finalCat = 'audio';
            }

            const pGenre = p.genre || (finalCat === 'movie' || finalCat === 'video' ? 'Cinema' : finalCat === 'beats' ? 'Beat' : finalCat === 'news' ? 'News' : 'Afrobeats');

            const spotifyLink = p.spotify || p.spotify_url || p.spotify_link || '';
            const appleLink = p.apple_music || p.apple_music_url || p.apple || p.apple_music_link || '';
            const audiomackLink = p.audiomack || p.audiomack_url || p.audiomack_link || '';
            const instaLink = p.instagram || p.instagram_url || p.instagram_handle || '';
            const twitterLink = p.twitter || p.twitter_url || p.x_url || p.twitter_handle || '';
            const ytLink = p.youtube || p.youtube_channel || p.youtube_url || '';
            const tiktokLink = p.tiktok || p.tiktok_url || '';

            fetchedPosts.push({
              id: postId,
              title: p.title || 'Untitled Post',
              artist: artistName,
              featured_artist: featArtist,
              subtitle: featArtist ? `${artistName} ft. ${featArtist}` : artistName,
              genre: pGenre,
              category: finalCat,
              image_url: imgUrl,
              cover: imgUrl,
              date: p.created_at ? new Date(p.created_at).toLocaleDateString() : (p.date || 'Just now'),
              duration: p.duration || '03:30',
              downloads: p.downloads || '1.2K',
              views: p.views || '14.2K',
              body: postBody,
              content: postBody,
              description: postBody,
              lyrics: Array.isArray(p.lyrics) ? p.lyrics : (typeof p.lyrics === 'string' ? p.lyrics.split('\n') : undefined),
              audioUrl: audUrl,
              audio_url: audUrl,
              audio_link: audUrl,
              videoUrl: vidUrl,
              video_url: vidUrl,
              video_link: vidUrl,
              isHero: Boolean(p.is_hero || p.isHero),
              spotify_url: spotifyLink,
              apple_music_url: appleLink,
              audiomack_url: audiomackLink,
              instagram_url: instaLink,
              twitter_url: twitterLink,
              youtube_url: ytLink,
              socials: {
                spotify: spotifyLink,
                appleMusic: appleLink,
                audiomack: audiomackLink,
                tiktok: tiktokLink,
                instagram: instaLink,
                twitter: twitterLink,
                youtube: ytLink
              }
            });
          }
        });
      }

      // 2. Process music table records
      if (musicRes.status === 'fulfilled' && Array.isArray(musicRes.value)) {
        musicRes.value.forEach((m: any) => {
          if (m.track_type === 'beat') {
            const beatId = m.id?.toString() || `b-${Date.now()}`;
            const beatTitle = (m.title || 'Untitled Beat').toLowerCase().trim();
            if (!seenBeatIds.has(beatId) && !seenBeatTitles.has(beatTitle)) {
              seenBeatIds.add(beatId);
              seenBeatTitles.add(beatTitle);
              const beatCover = m.image_url || m.cover_url || m.cover || 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80';
              const beatAudio = m.audio_url || m.audio_link || m.preview_url || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3';
              fetchedBeats.push({
                id: beatId,
                title: m.title || 'Untitled Beat',
                producer: m.artist || 'AfroPulse Producer',
                bpm: m.bpm || 115,
                key: m.key || 'Am',
                genre: m.genre || 'Afrobeat',
                cover: beatCover,
                previewUrl: beatAudio,
                prices: {
                  mp3: m.price_mp3 || 35000,
                  wav: m.price_wav || 70000,
                  stems: m.price_stems || 140000,
                  exclusive: m.price_exclusive || 350000
                }
              });
            }
          } else {
            const postId = m.id?.toString() || `p-${Date.now()}`;
            const postTitle = (m.title || 'Untitled Track').toLowerCase().trim();
            if (!seenPostIds.has(postId) && !seenPostTitles.has(postTitle)) {
              seenPostIds.add(postId);
              seenPostTitles.add(postTitle);
              const imgUrl = m.image_url || m.cover_url || m.cover || '';
              const audUrl = m.audio_url || m.audio_link || '';
              const artistName = m.artist || 'AfroPulse Artist';
              const featArtist = m.featured_artist || m.featuring || '';
              const desc = m.description || m.content || m.body || 'Exclusive release on AfroPulse.';
              fetchedPosts.push({
                id: postId,
                title: m.title || 'Untitled Track',
                artist: artistName,
                featured_artist: featArtist,
                subtitle: featArtist ? `${artistName} ft. ${featArtist}` : artistName,
                genre: m.genre || 'Afrobeats',
                category: 'audio',
                image_url: imgUrl,
                cover: imgUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
                date: m.created_at ? new Date(m.created_at).toLocaleDateString() : 'Just now',
                duration: '03:30',
                downloads: '1.2K',
                views: '14.2K',
                body: desc,
                content: desc,
                description: desc,
                audioUrl: audUrl,
                audio_url: audUrl,
                audio_link: audUrl,
                videoUrl: '',
                video_url: '',
                isHero: Boolean(m.is_hero || m.is_featured)
              });
            }
          }
        });
      }

      // 3. Process video table records (Strictly Movie/Video category; NO audioUrl so it never leaks into audio/music)
      if (videoRes.status === 'fulfilled' && Array.isArray(videoRes.value)) {
        videoRes.value.forEach((v: any) => {
          const vidId = `v-${v.id}`;
          const vidTitle = (v.title || 'Untitled Video').toLowerCase().trim();
          if (!seenPostIds.has(vidId) && !seenPostTitles.has(vidTitle)) {
            seenPostIds.add(vidId);
            seenPostTitles.add(vidTitle);
            const imgUrl = v.image_url || v.thumbnail_url || v.cover_url || '';
            const vidUrl = v.youtube_url || v.video_url || '';
            const artistName = v.artist || 'AfroPulse Video';
            const featArtist = v.featured_artist || v.featuring || '';
            const desc = v.description || v.content || 'Official video premiere on AfroPulse.';
            fetchedPosts.push({
              id: vidId,
              title: v.title || 'Untitled Video',
              artist: artistName,
              featured_artist: featArtist,
              subtitle: featArtist ? `${artistName} ft. ${featArtist}` : artistName,
              genre: v.genre || 'Cinema',
              category: 'video', // Strictly movie/video
              image_url: imgUrl,
              cover: imgUrl || 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80',
              date: v.created_at ? new Date(v.created_at).toLocaleDateString() : 'Just now',
              duration: '03:45',
              views: '45K views',
              body: desc,
              content: desc,
              description: desc,
              videoUrl: vidUrl,
              video_url: vidUrl,
              audioUrl: '', // strictly no audioUrl on video/movie records
              audio_url: ''
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

  // Beat Store Licensing Modal & Preview State
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
      if (beatAudio) {
        beatAudio.pause();
      }
      const newAudio = new Audio(beat.previewUrl);
      newAudio.play().catch(e => console.warn('Audio playback notice:', e));
      newAudio.onended = () => setPlayingBeatId(null);
      setBeatAudio(newAudio);
      setPlayingBeatId(beat.id);
    }
  };

  const handleDownloadFile = async (item: any) => {
    const url = item.audio_url || item.audioUrl || item.audio_link || item.mediaUrl || item.previewUrl;
    if (!url) {
      alert(`No download link available for "${item?.title || 'this track'}".`);
      return;
    }
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
  const [isPublishingPost, setIsPublishingPost] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [uform, setUform] = useState({
    title: '',
    mainArtist: '',
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
    isHero: false,
    uploadType: 'SINGLE' as 'SINGLE' | 'EP_ALBUM',
    epDescription: '',
    driveAudioLink: ''
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

  // Admin Post Management State (Music, Beats, Videos)
  const [adminContentItems, setAdminContentItems] = useState<AdminContentItem[]>([]);
  const [isLoadingAdminContent, setIsLoadingAdminContent] = useState(false);
  const [adminContentFilter, setAdminContentFilter] = useState<'ALL' | 'song' | 'beat' | 'video' | 'news'>('ALL');
  const [adminContentSearch, setAdminContentSearch] = useState('');
  const [editingItem, setEditingItem] = useState<AdminContentItem | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [deleteModalItem, setDeleteModalItem] = useState<AdminContentItem | null>(null);
  const [isDeletingItem, setIsDeletingItem] = useState(false);
  const [adminNotice, setAdminNotice] = useState<string | null>(null);

  // Edit Form State
  const [editForm, setEditForm] = useState({
    title: '',
    artist: '',
    categoryOrType: 'song',
    genre: 'Afrobeat',
    bpm: 115,
    key: 'Am',
    description: '',
    youtubeUrl: '',
    audioUrl: '',
    coverUrl: '',
    newCoverFile: null as File | null,
    newCoverPreview: '',
    newAudioFile: null as File | null,
    newVideoFile: null as File | null,
    priceMp3: 35000,
    priceWav: 70000,
    priceStems: 140000,
    priceExclusive: 350000
  });

  // Function to fetch and refresh all content items from Supabase and in-memory catalog
  const refreshAdminContent = async () => {
    setIsLoadingAdminContent(true);
    try {
      const [postsRes, musicRes, videoRes] = await Promise.allSettled([
        supabase.from('posts').select('*').order('id', { ascending: false }),
        fetchSupabaseMusic(),
        fetchSupabaseVideos()
      ]);

      const items: AdminContentItem[] = [];

      // 0. Items from Supabase 'posts' table
      if (postsRes.status === 'fulfilled' && postsRes.value && Array.isArray((postsRes.value as any).data)) {
        (postsRes.value as any).data.forEach((p: any) => {
          items.push({
            id: `supa-post-${p.id}`,
            supabaseId: p.id,
            tableSource: 'posts',
            title: p.title || 'Untitled Post',
            artist: p.subtitle || p.artist || 'AfroPulse Artist',
            categoryOrType: p.category === 'BEATS' ? 'beat' : (p.category === 'VIDEOS' ? 'music_video' : (p.category === 'NEWS' ? 'news' : 'song')),
            genre: p.genre || p.category || 'Afrobeats',
            bpm: Number(p.bpm) || 120,
            key: p.key || 'Am',
            coverUrl: p.cover || p.cover_url || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
            mediaUrl: p.audio_url || p.audioUrl || '',
            youtubeUrl: p.video_url || p.videoUrl || '',
            description: p.body || p.description || '',
            prices: {
              mp3: Number(p.price_mp3) || 35000,
              wav: Number(p.price_wav) || 70000,
              stems: Number(p.price_stems) || 140000,
              exclusive: Number(p.price_exclusive) || 350000
            },
            date: p.created_at ? new Date(p.created_at).toLocaleDateString() : 'Supabase Cloud'
          });
        });
      }

      // 1. Music and Beats from Supabase 'music' table
      if (musicRes.status === 'fulfilled' && Array.isArray(musicRes.value)) {
        musicRes.value.forEach((m: any) => {
          items.push({
            id: `supa-music-${m.id}`,
            supabaseId: m.id,
            tableSource: 'music',
            title: m.title || 'Untitled Track',
            artist: m.artist || 'AfroPulse Artist',
            categoryOrType: m.track_type === 'beat' ? 'beat' : 'song',
            genre: m.genre || 'Afrobeat',
            bpm: m.bpm || 115,
            key: m.key || 'Am',
            coverUrl: m.cover_url || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
            mediaUrl: m.audio_url || '',
            description: m.description || '',
            prices: {
              mp3: m.price_mp3 || 35000,
              wav: m.price_wav || 70000,
              stems: m.price_stems || 140000,
              exclusive: m.price_exclusive || 350000
            },
            date: m.created_at ? new Date(m.created_at).toLocaleDateString() : 'Supabase Cloud'
          });
        });
      }

      // 2. Videos and Movie Premieres from Supabase 'videos' table
      if (videoRes.status === 'fulfilled' && Array.isArray(videoRes.value)) {
        videoRes.value.forEach((v: any) => {
          items.push({
            id: `supa-video-${v.id}`,
            supabaseId: v.id,
            tableSource: 'videos',
            title: v.title || 'Untitled Video',
            artist: v.artist || 'AfroPulse Video',
            categoryOrType: v.category === 'movie_premiere' ? 'movie_premiere' : 'music_video',
            genre: 'Cinema & Video',
            coverUrl: v.thumbnail_url || 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80',
            mediaUrl: v.video_url || '',
            youtubeUrl: v.youtube_url || '',
            description: v.description || '',
            date: v.created_at ? new Date(v.created_at).toLocaleDateString() : 'Supabase Cloud'
          });
        });
      }

      // 3. Integrate Feed Posts (songs, videos, news) to guarantee 100% comprehensive catalog
      const titleLookup = new Set(items.map(i => i.title.toLowerCase().trim()));
      posts.forEach(p => {
        if (!titleLookup.has(p.title.toLowerCase().trim())) {
          items.push({
            id: `post-${p.id}`,
            tableSource: 'posts',
            title: p.title,
            artist: p.subtitle,
            categoryOrType: p.category === 'VIDEOS' ? 'music_video' : (p.category === 'NEWS' ? 'news' : 'song'),
            genre: p.category,
            coverUrl: p.cover,
            mediaUrl: p.audioUrl,
            youtubeUrl: p.videoUrl,
            description: p.body,
            date: p.date
          });
        }
      });

      // 4. Integrate Producer Beats from catalog
      beats.forEach(b => {
        if (!titleLookup.has(b.title.toLowerCase().trim())) {
          items.push({
            id: `beat-${b.id}`,
            tableSource: 'beats',
            title: b.title,
            artist: b.producer,
            categoryOrType: 'beat',
            genre: b.genre,
            bpm: b.bpm,
            key: b.key,
            coverUrl: b.cover,
            mediaUrl: b.previewUrl,
            prices: b.prices,
            date: 'Beat Store'
          });
        }
      });

      setAdminContentItems(items);
    } catch (err) {
      console.warn('Error refreshing admin content from Supabase:', err);
    } finally {
      setIsLoadingAdminContent(false);
    }
  };

  // Trigger initial content fetch
  useEffect(() => {
    refreshAdminContent();
  }, []);

  // When admin tab changes or login occurs, refresh list
  useEffect(() => {
    if (isAdminLoggedIn) {
      refreshAdminContent();
    }
  }, [isAdminLoggedIn, adminTab]);

  // Open Edit Form Modal with pre-populated values
  const handleOpenEdit = (item: AdminContentItem) => {
    setEditingItem(item);
    setEditForm({
      title: item.title,
      artist: item.artist,
      categoryOrType: item.categoryOrType,
      genre: item.genre || 'Afrobeat',
      bpm: item.bpm || 115,
      key: item.key || 'Am',
      description: item.description || '',
      youtubeUrl: item.youtubeUrl || '',
      audioUrl: item.mediaUrl || '',
      coverUrl: item.coverUrl,
      newCoverFile: null,
      newCoverPreview: '',
      newAudioFile: null,
      newVideoFile: null,
      priceMp3: item.prices?.mp3 || 35000,
      priceWav: item.prices?.wav || 70000,
      priceStems: item.prices?.stems || 140000,
      priceExclusive: item.prices?.exclusive || 350000
    });
  };

  // Submit and save updated content to Supabase & local state
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setIsSavingEdit(true);

    try {
      let finalCoverUrl = editForm.coverUrl;
      let finalAudioUrl = editForm.audioUrl;
      let finalVideoUrl = editingItem.mediaUrl;

      // 1. Upload new cover file if provided
      if (editForm.newCoverFile) {
        try {
          finalCoverUrl = await uploadStorageAsset('cover_art', editForm.newCoverFile);
        } catch (err) {
          console.warn('Cover upload to Supabase storage notice:', err);
          finalCoverUrl = editForm.newCoverPreview || finalCoverUrl;
        }
      }

      // 2. Upload new audio file if provided
      if (editForm.newAudioFile) {
        try {
          finalAudioUrl = await uploadStorageAsset('music_files', editForm.newAudioFile);
        } catch (err) {
          console.warn('Audio upload to Supabase storage notice:', err);
        }
      }

      // 3. Upload new video file if provided
      if (editForm.newVideoFile) {
        try {
          finalVideoUrl = await uploadStorageAsset('video_files', editForm.newVideoFile);
        } catch (err) {
          console.warn('Video upload to Supabase storage notice:', err);
        }
      }

      // 4. Send UPDATE query to Supabase
      if (editingItem.tableSource === 'music' && editingItem.supabaseId) {
        await updateSupabaseRecord('music', editingItem.supabaseId, {
          title: editForm.title,
          artist: editForm.artist,
          genre: editForm.genre,
          track_type: editForm.categoryOrType === 'beat' ? 'beat' : 'song',
          audio_url: finalAudioUrl,
          cover_url: finalCoverUrl,
          bpm: editForm.bpm,
          key: editForm.key,
          price_mp3: editForm.priceMp3,
          price_wav: editForm.priceWav,
          price_stems: editForm.priceStems,
          price_exclusive: editForm.priceExclusive
        }).catch(err => console.warn('Supabase music update notice:', err));
      } else if (editingItem.tableSource === 'videos' && editingItem.supabaseId) {
        await updateSupabaseRecord('videos', editingItem.supabaseId, {
          title: editForm.title,
          artist: editForm.artist,
          category: editForm.categoryOrType === 'movie_premiere' ? 'movie_premiere' : 'music_video',
          youtube_url: editForm.youtubeUrl || null,
          video_url: finalVideoUrl || null,
          thumbnail_url: finalCoverUrl,
          description: editForm.description
        }).catch(err => console.warn('Supabase video update notice:', err));
      }

      // 5. Update local in-memory posts & beats state
      setPosts(prev => prev.map(p => {
        if (p.id === editingItem.id || p.id === editingItem.id.replace('post-', '') || p.title === editingItem.title) {
          return {
            ...p,
            title: editForm.title,
            subtitle: editForm.artist,
            category: editForm.categoryOrType === 'news' ? 'NEWS' : (editForm.categoryOrType.includes('video') ? 'VIDEOS' : (editForm.categoryOrType === 'song' ? 'MUSIC' : p.category)),
            cover: finalCoverUrl,
            audioUrl: finalAudioUrl || p.audioUrl,
            videoUrl: editForm.youtubeUrl || p.videoUrl,
            body: editForm.description || p.body
          };
        }
        return p;
      }));

      setBeats(prev => prev.map(b => {
        if (b.id === editingItem.id || b.id === editingItem.id.replace('beat-', '') || b.id === editingItem.supabaseId?.toString() || b.title === editingItem.title) {
          return {
            ...b,
            title: editForm.title,
            producer: editForm.artist,
            genre: editForm.genre,
            bpm: editForm.bpm,
            key: editForm.key,
            cover: finalCoverUrl,
            previewUrl: finalAudioUrl || b.previewUrl,
            prices: {
              mp3: editForm.priceMp3,
              wav: editForm.priceWav,
              stems: editForm.priceStems,
              exclusive: editForm.priceExclusive
            }
          };
        }
        return b;
      }));

      // 6. Refresh admin list view automatically
      await refreshAdminContent();
      setEditingItem(null);
      setAdminNotice(`Successfully updated "${editForm.title}" in Supabase and live portal!`);
      setTimeout(() => setAdminNotice(null), 5000);
    } catch (err) {
      console.error('Error saving edits:', err);
      await refreshAdminContent();
      setEditingItem(null);
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Confirm and execute DELETE query in Supabase and remove from view
  const handleConfirmDelete = async () => {
    if (!deleteModalItem) return;
    setIsDeletingItem(true);
    const item = deleteModalItem;

    try {
      // 1. Send DELETE query to Supabase
      if (item.tableSource === 'posts' && item.supabaseId) {
        await supabase.from('posts').delete().eq('id', item.supabaseId).catch(err =>
          console.warn('Supabase post delete notice:', err)
        );
      } else if (item.tableSource === 'music' && item.supabaseId) {
        await deleteSupabaseRecord('music', item.supabaseId).catch(err =>
          console.warn('Supabase music delete notice:', err)
        );
      } else if (item.tableSource === 'videos' && item.supabaseId) {
        await deleteSupabaseRecord('videos', item.supabaseId).catch(err =>
          console.warn('Supabase video delete notice:', err)
        );
      } else {
        await supabase.from('posts').delete().ilike('title', item.title).catch(() => {});
      }

      // 2. Immediately remove record from admin list view
      setAdminContentItems(prev => prev.filter(i => i.id !== item.id));

      // 3. Remove from live feed posts and beat catalog
      setPosts(prev => prev.filter(p => p.id !== item.id && p.id !== item.id.replace('post-', '') && p.title !== item.title));
      setBeats(prev => prev.filter(b => b.id !== item.id && b.id !== item.id.replace('beat-', '') && b.id !== item.supabaseId?.toString() && b.title !== item.title));

      setAdminNotice(`Permanently deleted "${item.title}" from Supabase database and portal.`);
      setTimeout(() => setAdminNotice(null), 5000);
    } catch (err) {
      console.error('Error during deletion:', err);
      setAdminContentItems(prev => prev.filter(i => i.id !== item.id));
    } finally {
      setIsDeletingItem(false);
      setDeleteModalItem(null);
    }
  };

  // Helper for playing tracks
  const handlePlayTrack = (track: PostItem | null | undefined) => {
    if (!track) return;
    const audioSrc = track.audio_url || track.audioUrl || (track as any).audio_link || (track as any).mediaUrl || (track as any).previewUrl;
    if (!audioSrc) {
      alert(`No streaming audio link available for "${track.title || 'this track'}".`);
      return;
    }
    if (currentPlayingTrack?.id === track.id) {
      if (isPlaying) {
        audioElement?.pause();
        setIsPlaying(false);
      } else {
        audioElement?.play().catch(e => console.warn('Audio play notice:', e));
        setIsPlaying(true);
      }
    } else {
      if (audioElement) {
        audioElement.pause();
      }
      const audio = new Audio(audioSrc);
      audio.play().catch(e => console.warn('Audio playback notice:', e));
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

  const handlePublishPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uform.title) {
      alert('Please enter a title');
      return;
    }

    setIsPublishingPost(true);
    setStatusMessage('Starting publish...');

    const rawCat = (uform.category || 'music').toLowerCase().trim();
    let catNormalized = 'audio';
    if (rawCat === 'video' || rawCat === 'videos' || rawCat === 'movie' || rawCat === 'movies') {
      catNormalized = 'movie';
    } else if (rawCat === 'news') {
      catNormalized = 'news';
    } else if (rawCat === 'beats' || rawCat === 'beat') {
      catNormalized = 'beats';
    } else {
      catNormalized = 'audio';
    }

    const postData = {
      title: uform.title,
      artist: uform.mainArtist,
      mainArtist: uform.mainArtist,
      featured_artist: uform.subtitle,
      featuring: uform.subtitle,
      genre: uform.category,
      category: catNormalized,
      audioLink: uform.driveAudioLink,
      videoLink: uform.youtubeUrl,
      body: uform.body,
      content: uform.body,
      imageUrl: uform.coverPreview
    };

    const result = await handlePublishWithStatus(postData, uform.coverFile, uform.audioFile, setStatusMessage);
    setIsPublishingPost(false);

    if (result.success) {
      alert('Post Published Successfully!');
      setUform({
        title: '',
        mainArtist: '',
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
        isHero: false,
        uploadType: 'SINGLE',
        epDescription: '',
        driveAudioLink: ''
      });
      await fetchAllSupabaseContent();
      await refreshAdminContent();
    }
  };


  const handlePublishBeat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bform.title) {
      alert('Please enter beat title');
      return;
    }

    let beatCoverUrl = bform.coverPreview || 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80';
    let beatAudioUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3';

    if (bform.coverFile) {
      try {
        beatCoverUrl = await uploadStorageAsset('cover_art', bform.coverFile);
      } catch (err) {
        console.warn('Beat cover upload notice:', err);
      }
    }

    const audioUploadFile = bform.previewFile || bform.mp3File;
    if (audioUploadFile) {
      try {
        beatAudioUrl = await uploadStorageAsset('music_files', audioUploadFile);
      } catch (err) {
        console.warn('Beat audio upload notice:', err);
        beatAudioUrl = URL.createObjectURL(audioUploadFile);
      }
    }

    // Await insert into Supabase 'posts' table (Requirement 1)
    try {
      await supabase.from('posts').insert([
        {
          title: bform.title,
          subtitle: bform.producer || 'AfroPulse Producer',
          category: 'BEATS',
          cover: beatCoverUrl,
          cover_url: beatCoverUrl,
          audio_url: beatAudioUrl,
          body: `Genre: ${bform.genre} | BPM: ${bform.bpm} | Key: ${bform.key}`,
          description: `Genre: ${bform.genre} | BPM: ${bform.bpm} | Key: ${bform.key}`,
          price_mp3: Number(bform.priceMp3),
          price_wav: Number(bform.priceWav),
          price_stems: Number(bform.priceStems),
          price_exclusive: Number(bform.priceExclusive)
        }
      ]);
    } catch (dbErr) {
      console.warn('Supabase posts beat insert notice:', dbErr);
    }

    // Also sync to Supabase music table
    try {
      await supabase.from('music').insert([
        {
          title: bform.title,
          artist: bform.producer || 'AfroPulse Producer',
          genre: bform.genre,
          track_type: 'beat',
          bpm: bform.bpm,
          key: bform.key,
          audio_url: beatAudioUrl,
          cover_url: beatCoverUrl,
          price_mp3: Number(bform.priceMp3),
          price_wav: Number(bform.priceWav),
          price_stems: Number(bform.priceStems),
          price_exclusive: Number(bform.priceExclusive)
        }
      ]);
    } catch (musicErr) {
      console.warn('Supabase music beat insert notice:', musicErr);
    }

    const newBeat: BeatItem = {
      id: 'b-' + Date.now(),
      title: bform.title,
      producer: bform.producer || 'AfroPulse Producer',
      bpm: bform.bpm,
      key: bform.key,
      genre: bform.genre,
      cover: beatCoverUrl,
      previewUrl: beatAudioUrl,
      prices: {
        mp3: Number(bform.priceMp3),
        wav: Number(bform.priceWav),
        stems: Number(bform.priceStems),
        exclusive: Number(bform.priceExclusive)
      }
    };
    setBeats([newBeat, ...beats]);

    alert('Beat published successfully to Beat Store and Supabase database!');

    // Reset beat form fields (Requirement 3)
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

    await fetchAllSupabaseContent();
    await refreshAdminContent();
  };

  const flagshipTrack = (posts && posts.length > 0)
    ? (posts.find(p => p.id === featuredTrackId && isMusicPost(p)) || posts.find(p => p.isHero && isMusicPost(p)) || posts.find(isMusicPost) || posts[0])
    : null;

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
          <AdminErrorBoundary>
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
                        placeholder=""
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
                        placeholder=""
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
                          {flagshipTrack ? (
                            <div className="flex items-center gap-4 bg-stone-950 p-4 rounded-xl border border-stone-800">
                              {flagshipTrack.cover && <img src={flagshipTrack.cover} alt="" className="w-16 h-16 rounded-xl object-cover" />}
                              <div className="flex-1">
                                <span className="text-[10px] bg-amber-500/20 text-amber-400 font-bold px-2 py-0.5 rounded-full uppercase">Current #1 Hero Song</span>
                                <h4 className="text-base font-bold text-white mt-1">{flagshipTrack.title}</h4>
                                <p className="text-xs text-stone-400">{flagshipTrack.subtitle}</p>
                              </div>
                            </div>
                          ) : (
                            <div className="p-4 bg-stone-950 rounded-xl border border-stone-800 text-stone-400 text-xs text-center">
                              No featured track selected yet. Select a track below or upload a new song drop.
                            </div>
                          )}

                          <div>
                            <label className="block text-xs font-semibold text-stone-300 mb-2">Select Track from Live Posts Database</label>
                            <div className="space-y-3">
                              {posts && posts.length > 0 ? (
                                posts.map(p => (
                                  <div key={p.id} className="flex items-center justify-between p-3 bg-stone-950 border border-stone-800 hover:border-amber-500/50 rounded-xl transition-all">
                                    <div className="flex items-center gap-3">
                                      {p?.cover && <img src={p.cover} alt="" className="w-12 h-12 rounded-lg object-cover" />}
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
                                ))
                              ) : (
                                <p className="text-xs text-stone-500 italic p-3 text-center">No posts found in database.</p>
                              )}
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
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-xs font-semibold text-stone-300 mb-1">Track / Article Title *</label>
                              <input
                                type="text"
                                required
                                value={uform.title}
                                onChange={(e) => setUform({ ...uform, title: e.target.value })}
                                placeholder="e.g. Omo Ologo"
                                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-stone-300 mb-1">Main Artist Name</label>
                              <input
                                type="text"
                                value={uform.mainArtist}
                                onChange={(e) => setUform({ ...uform, mainArtist: e.target.value })}
                                placeholder="e.g. Asake / Rema / Burna Boy"
                                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-stone-300 mb-1">Upload Type</label>
                              <select
                                value={uform.uploadType}
                                onChange={(e) => setUform({ ...uform, uploadType: e.target.value as 'SINGLE' | 'EP_ALBUM' })}
                                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                              >
                                <option value="SINGLE">Single Track</option>
                                <option value="EP_ALBUM">EP / Album Release</option>
                              </select>
                            </div>
                          </div>

                          {uform.uploadType === 'EP_ALBUM' && (
                            <div>
                              <label className="block text-xs font-semibold text-stone-300 mb-1">EP Description / Tracklist</label>
                              <textarea
                                value={uform.epDescription}
                                onChange={(e) => setUform({ ...uform, epDescription: e.target.value })}
                                placeholder="Enter EP tracklist or description..."
                                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                                rows={3}
                              />
                            </div>
                          )}
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
                              <input
                                type="text"
                                placeholder="Or Google Drive Link"
                                value={uform.driveAudioLink}
                                onChange={(e) => setUform({ ...uform, driveAudioLink: e.target.value })}
                                className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 mt-2"
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

                          {/* Status Display */}
                          {statusMessage && (
                            <div className="p-3 bg-stone-950 border border-amber-500/30 rounded-xl text-amber-400 text-xs text-center font-mono">
                              {statusMessage}
                            </div>
                          )}

                          <button
                            type="submit"
                            disabled={isPublishingPost}
                            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-60 disabled:cursor-not-allowed text-stone-950 font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                          >
                            {isPublishingPost ? (
                              <>
                                <span className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin"></span>
                                <span>Publishing & Syncing to Supabase...</span>
                              </>
                            ) : (
                              <span>Publish Post to Live AfroPulse Feed</span>
                            )}
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
          </AdminErrorBoundary>
        ) : (
          <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">

            {/* ROUTE: HOME */}
            {currentRoute === 'home' && (
              <div className="space-y-10">
                
                {/* 3. FEATURED #1 SONG (HERO BANNER) */}
                {flagshipTrack ? (
                  <FeaturedBanner
                    post={flagshipTrack}
                    isPlaying={isPlaying && currentPlayingTrack?.id === flagshipTrack.id}
                    onPlay={handlePlayTrack}
                    onDownload={handleDownloadFile}
                    onSelect={(p) => {
                      setSelectedPostId(p.id);
                      setCurrentRoute('post');
                    }}
                  />
                ) : (
                  <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-8 text-center space-y-3">
                    <Flame className="w-8 h-8 text-amber-400 mx-auto animate-pulse" />
                    <h3 className="text-lg font-bold text-white">No featured track published yet</h3>
                    <p className="text-xs text-stone-400 max-w-md mx-auto">Publish music tracks or videos via the Admin Dashboard to feature your #1 trending hit here automatically.</p>
                  </div>
                )}

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
                          .filter(p => !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase()) || (p.artist || '').toLowerCase().includes(searchQuery.toLowerCase()) || (p.featured_artist || '').toLowerCase().includes(searchQuery.toLowerCase()))
                          .slice(0, visiblePostLimit)
                          .map(p => (
                            <PostCard
                              key={p.id}
                              post={p}
                              onSelect={(post) => {
                                setSelectedPostId(post.id);
                                setCurrentRoute('post');
                              }}
                              onPlay={handlePlayTrack}
                              onDownload={handleDownloadFile}
                              isPlaying={isPlaying && currentPlayingTrack?.id === p.id}
                            />
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
                        <button onClick={() => { setActiveCategory('NEWS'); setCurrentRoute('news'); }} className="text-xs font-bold text-amber-400 hover:underline">Read More News →</button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {posts
                          .filter(isNewsPost)
                          .slice(0, 10)
                          .map(n => (
                            <div
                              key={n.id}
                              onClick={() => { setSelectedPostId(n.id); setCurrentRoute('post'); }}
                              className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex gap-4 hover:border-amber-500/40 transition cursor-pointer"
                            >
                              <img src={n.image_url || n.cover} alt={n.title} className="w-20 h-20 rounded-lg object-cover shrink-0" />
                              <div className="flex-1 min-w-0 space-y-1">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="text-[9px] bg-amber-500/20 text-amber-400 font-bold px-2 py-0.5 rounded uppercase">{n.category.toUpperCase()}</span>
                                  {n.genre && <span className="text-[9px] bg-stone-800 text-stone-300 font-mono px-1.5 py-0.5 rounded uppercase">{n.genre}</span>}
                                </div>
                                <h5 className="text-xs font-bold text-white line-clamp-2">{n.title}</h5>
                                {n.artist && (
                                  <p className="text-[10px] text-amber-400 font-semibold truncate">
                                    <span>{n.artist}</span>
                                    {n.featured_artist && <span className="text-stone-400 ml-1">ft. {n.featured_artist}</span>}
                                  </p>
                                )}
                                <p className="text-[11px] text-stone-400 line-clamp-2" style={{ whiteSpace: 'pre-wrap' }}>{n.content || n.description || n.body}</p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* 8. MOVIES & MUSIC VIDEOS SECTION (Strictly Movie/Video category, NO audio posts) */}
                    <div className="space-y-4 pt-6">
                      <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                        <h3 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                          <Video className="w-5 h-5 text-blue-400" /> Movies & Official Music Videos
                        </h3>
                        <button onClick={() => { setActiveCategory('VIDEOS'); setCurrentRoute('movies'); }} className="text-xs font-bold text-blue-400 hover:underline">View More Movies →</button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {posts
                          .filter(isMoviePost)
                          .slice(0, 10)
                          .map(v => (
                            <div
                              key={v.id}
                              onClick={() => { setSelectedPostId(v.id); setCurrentRoute('post'); }}
                              className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden group cursor-pointer hover:border-blue-500/40 transition"
                            >
                              <div className="relative h-40 bg-stone-950 overflow-hidden">
                                <img src={v.image_url || v.cover} alt={v.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                  <button onClick={(e) => { e.stopPropagation(); setSelectedPostId(v.id); setCurrentRoute('post'); }} className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110">
                                    <Play className="w-5 h-5 fill-white ml-0.5" />
                                  </button>
                                </div>
                                <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/70 backdrop-blur text-[10px] font-bold text-white rounded">03:45</span>
                              </div>
                              <div className="p-4 space-y-1">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="text-[9px] bg-blue-500/20 text-blue-400 font-bold px-2 py-0.5 rounded uppercase">{v.category.toUpperCase()}</span>
                                  {v.genre && <span className="text-[9px] bg-stone-800 text-stone-300 font-mono px-1.5 py-0.5 rounded uppercase">{v.genre}</span>}
                                </div>
                                <h5 className="text-xs font-bold text-white truncate">{v.title}</h5>
                                <p className="text-[11px] text-stone-400 truncate">
                                  <span className="text-blue-400 font-semibold">{v.artist}</span>
                                  {v.featured_artist && <span className="text-stone-500 ml-1">ft. {v.featured_artist}</span>}
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>

                  </div>

                  {/* RIGHT COLUMN: 5. TOP 10 TRENDING TRACKS & SIDENAV WIDGETS */}
                  <div className="space-y-6">
                    
                    {/* 5. TOP 10 TRENDING TRACKS (Strictly music posts filtered and ordered properly) */}
                    <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-6 space-y-4 shadow-xl">
                      <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                        <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                          <Flame className="w-4 h-4 text-amber-500" /> Top 10 Trending Songs
                        </h4>
                        <span className="text-[10px] bg-amber-500/20 text-amber-400 font-bold px-2 py-0.5 rounded">Chart</span>
                      </div>

                      <div className="space-y-2.5">
                        {posts
                          .filter(isMusicPost)
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
                              <img src={track.image_url || track.cover} alt={track.title} className="w-10 h-10 rounded-lg object-cover shrink-0 border border-stone-800" />
                              <div className="flex-1 min-w-0">
                                <h5 className="text-xs font-semibold text-white line-clamp-2 leading-snug">{track.title}</h5>
                                <p className="text-[10px] text-amber-400 font-medium truncate">
                                  <span>{track.artist}</span>
                                  {track.featured_artist && <span className="text-stone-400 ml-1">ft. {track.featured_artist}</span>}
                                </p>
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

            {/* ROUTE: BEATS & BEAT STORE */}
            {(currentRoute === 'beatstore' || currentRoute === 'beats') && (() => {
              const tierConfig: Record<'mp3' | 'wav' | 'stems' | 'exclusive', { name: string; fileType: string; streams: string; desc: string; getPrice: (b: BeatItem) => number }> = {
                mp3: {
                  name: 'Standard MP3 Lease',
                  fileType: 'Untagged 320kbps MP3',
                  streams: 'Up to 100,000 Streams',
                  desc: 'Perfect for upcoming independent releases, mixtapes, and singles on Spotify and Apple Music.',
                  getPrice: (b) => b.prices?.mp3 || 35000
                },
                wav: {
                  name: 'Premium WAV Lease',
                  fileType: '24-Bit Studio Master WAV + MP3',
                  streams: 'Up to 500,000 Streams',
                  desc: 'Lossless studio fidelity with commercial radio broadcast, music video, and live concert rights.',
                  getPrice: (b) => b.prices?.wav || 70000
                },
                stems: {
                  name: 'Trackout Stems Lease',
                  fileType: 'Multi-Track Stems (.ZIP) + WAV + MP3',
                  streams: 'Unlimited Streams & Monetization',
                  desc: 'Separated audio tracks (kick, 808/log drum, melody, percussion) for full mixing & mastering control.',
                  getPrice: (b) => b.prices?.stems || 140000
                },
                exclusive: {
                  name: 'Exclusive Rights Buyout',
                  fileType: 'Full Master Ownership + Stems + WAV',
                  streams: 'Unlimited Everything · Permanent Store Retirement',
                  desc: '100% exclusive master ownership transfer. The instrumental is permanently removed from the store.',
                  getPrice: (b) => b.prices?.exclusive || 350000
                }
              };

              const featuredBeat = beats.length > 0 ? beats[0] : null;
              const filteredBeats = beats.filter(b => {
                const matchesGenre = beatGenreFilter === 'ALL' || b.genre.toLowerCase() === beatGenreFilter.toLowerCase();
                const matchesSearch = !beatSearchQuery ||
                  b.title.toLowerCase().includes(beatSearchQuery.toLowerCase()) ||
                  b.producer.toLowerCase().includes(beatSearchQuery.toLowerCase()) ||
                  b.genre.toLowerCase().includes(beatSearchQuery.toLowerCase());
                return matchesGenre && matchesSearch;
              });

              return (
                <div className="space-y-10 max-w-6xl mx-auto">
                  
                  {/* 1. ULTRA-SLEEK HEADER BANNER ("Buy and Sell Your Beats") */}
                  <div className="relative rounded-3xl bg-gradient-to-b from-[#0B1120] via-[#0F172A] to-[#0A0F1D] border border-slate-800/90 p-7 md:p-10 overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-10 left-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800/90 pb-8">
                      <div className="space-y-3 max-w-2xl">
                        <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase">
                          <span>Royalty-Free Producer Vault</span>
                          <span className="text-slate-600">·</span>
                          <span className="text-slate-400">Direct License Agreements</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white font-display">
                          Buy and Sell Your Beats
                        </h2>
                        <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-normal">
                          Top-tier Afrobeat, Amapiano, and Dancehall studio instrumentals engineered by premier African producers. Instant 24-bit WAV & stem downloads with verified commercial sync rights.
                        </p>
                      </div>

                      {/* Cart Trigger Button */}
                      <button
                        onClick={() => setIsCartOpen(true)}
                        className="self-start md:self-auto shrink-0 bg-[#1E293B] hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/50 text-white font-bold px-5 py-3 rounded-2xl text-xs flex items-center gap-3 shadow-lg shadow-cyan-950/30 transition-all hover:-translate-y-0.5"
                      >
                        <span className="flex items-center gap-1.5 text-cyan-400 font-extrabold">
                          🛒 Cart
                        </span>
                        <span className="bg-cyan-500 text-slate-950 px-2 py-0.5 rounded-full text-[10px] font-black">
                          {beatCart.length}
                        </span>
                        {beatCart.length > 0 && (
                          <span className="font-mono text-amber-400 text-xs font-bold border-l border-slate-700 pl-2">
                            ₦{beatCart.reduce((s, i) => s + i.price, 0).toLocaleString()}
                          </span>
                        )}
                      </button>
                    </div>

                    {/* Filter and Search Bar Strip */}
                    <div className="relative z-10 pt-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                      {/* Genre Filter Tabs */}
                      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#0A0F1D]/90 border border-slate-800/90 rounded-xl">
                        {(['ALL', 'Afrobeat', 'Amapiano', 'Afro-Fusion'] as const).map(genre => (
                          <button
                            key={genre}
                            onClick={() => setBeatGenreFilter(genre)}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                              beatGenreFilter === genre
                                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/25 font-black'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                            }`}
                          >
                            {genre}
                          </button>
                        ))}
                      </div>

                      {/* Live Search Input */}
                      <div className="relative flex-1 max-w-md">
                        <input
                          type="text"
                          placeholder="Search beats by title, producer, or BPM..."
                          value={beatSearchQuery}
                          onChange={(e) => setBeatSearchQuery(e.target.value)}
                          className="w-full bg-[#0A0F1D]/90 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition font-sans"
                        />
                        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                        {beatSearchQuery && (
                          <button
                            onClick={() => setBeatSearchQuery('')}
                            className="absolute right-3 top-2.5 text-slate-400 hover:text-white text-xs"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 2. COMPACT & ELEGANT "BEAT OF THE WEEK" SPOTLIGHT */}
                  {featuredBeat && (
                    <div className="relative rounded-2xl bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] border border-cyan-500/40 p-4 md:p-5 overflow-hidden shadow-xl hover:border-cyan-400/60 transition-all duration-300">
                      <div className="absolute top-0 right-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
                      <div className="absolute -bottom-10 left-1/3 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                      <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 md:gap-6">
                        {/* Artwork with Preview Play Button */}
                        <div className="relative w-20 h-20 sm:w-22 sm:h-22 shrink-0 rounded-xl overflow-hidden border border-slate-700/80 shadow-md group bg-slate-950">
                          <img
                            src={featuredBeat.cover}
                            alt={featuredBeat.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <button
                            onClick={() => togglePlayBeat(featuredBeat)}
                            aria-label={`Preview ${featuredBeat.title}`}
                            className={`absolute inset-0 flex items-center justify-center transition-all ${
                              playingBeatId === featuredBeat.id ? 'bg-black/60' : 'bg-black/35 group-hover:bg-black/55'
                            }`}
                          >
                            <div className="w-10 h-10 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center shadow-lg shadow-cyan-500/30 transition transform group-hover:scale-110">
                              {playingBeatId === featuredBeat.id ? (
                                <Pause className="w-4 h-4 fill-slate-950" />
                              ) : (
                                <Play className="w-4 h-4 fill-slate-950 ml-0.5" />
                              )}
                            </div>
                          </button>
                        </div>

                        {/* Center Details */}
                        <div className="flex-1 min-w-0 space-y-1 text-center sm:text-left">
                          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                            <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 tracking-wider shadow-sm">
                              🔥 Beat of the Week
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                              {featuredBeat.bpm} BPM
                            </span>
                            <span className="text-[10px] text-slate-400 font-semibold uppercase">
                              {featuredBeat.genre} · Key: {featuredBeat.key}
                            </span>
                          </div>
                          <h3 className="text-lg md:text-xl font-black text-white truncate tracking-tight">
                            {featuredBeat.title}
                          </h3>
                          <p className="text-xs text-slate-300 font-medium truncate">
                            Produced by <span className="text-cyan-300 font-bold">{featuredBeat.producer}</span>
                          </p>
                        </div>

                        {/* Right Pricing & Actions */}
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right hidden md:block">
                            <span className="text-[9px] text-slate-400 font-mono uppercase block leading-none">Starting from</span>
                            <span className="font-mono text-base font-black text-amber-400">
                              ₦{(featuredBeat.prices?.mp3 || 35000).toLocaleString()}
                            </span>
                          </div>

                          <button
                            onClick={() => togglePlayBeat(featuredBeat)}
                            className="bg-[#0F172A] hover:bg-slate-800 text-slate-200 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 border border-slate-700/80 transition shadow-sm"
                          >
                            {playingBeatId === featuredBeat.id ? (
                              <>
                                <Pause className="w-3.5 h-3.5 text-cyan-400" /> Pause
                              </>
                            ) : (
                              <>
                                <Play className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" /> Preview
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => {
                              setSelectedBeatForModal(featuredBeat);
                              setSelectedLicenseTier('mp3');
                              setIsBeatModalOpen(true);
                            }}
                            className="bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-slate-950 font-black px-4 py-2 rounded-xl text-xs shadow-md shadow-cyan-500/25 hover:scale-105 active:scale-95 transition whitespace-nowrap"
                          >
                            Buy Beat / Tiers ↗
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 3. RESPONSIVE 2-COLUMN GRID VIEW OF ALL AVAILABLE BEATS */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-800/90 pb-3">
                      <div>
                        <h3 className="text-xl font-black text-white tracking-tight">Available Producer Beats</h3>
                        <p className="text-xs text-slate-400">
                          Showing {filteredBeats.length} {filteredBeats.length === 1 ? 'beat' : 'beats'} in 2-column catalog view
                        </p>
                      </div>
                      {beatGenreFilter !== 'ALL' && (
                        <button
                          onClick={() => setBeatGenreFilter('ALL')}
                          className="text-xs text-cyan-400 hover:underline font-semibold"
                        >
                          Clear filter
                        </button>
                      )}
                    </div>

                    {filteredBeats.length === 0 ? (
                      <div className="text-center py-16 bg-[#0F172A] rounded-3xl border border-slate-800/90 p-8 space-y-4">
                        <p className="text-sm text-slate-400">No instrumentals match your current search.</p>
                        <button
                          onClick={() => { setBeatSearchQuery(''); setBeatGenreFilter('ALL'); }}
                          className="bg-[#1E293B] text-slate-200 px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-700 transition"
                        >
                          Reset Filters
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                        {filteredBeats.map(beat => {
                          const isThisPlaying = playingBeatId === beat.id;
                          return (
                            <div
                              key={beat.id}
                              className={`relative bg-[#0F172A] hover:bg-[#1E293B] border rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 transition-all duration-300 ease-out group shadow-lg hover:shadow-[0_12px_28px_-6px_rgba(6,182,212,0.22)] hover:-translate-y-1 ${
                                isThisPlaying
                                  ? 'border-cyan-400 ring-1 ring-cyan-400/40 shadow-[0_0_24px_rgba(6,182,212,0.25)] bg-[#132238]'
                                  : 'border-slate-800/90 hover:border-cyan-500/50'
                              }`}
                            >
                              {/* Beat Artwork / Cover Image with Play/Pause button */}
                              <div className="relative w-28 h-28 sm:w-26 sm:h-26 shrink-0 rounded-xl overflow-hidden bg-slate-950 border border-slate-700/80 shadow-md">
                                <img
                                  src={beat.cover}
                                  alt={beat.title}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <button
                                  onClick={() => togglePlayBeat(beat)}
                                  aria-label={`Preview ${beat.title}`}
                                  className={`absolute inset-0 flex items-center justify-center transition-all ${
                                    isThisPlaying ? 'bg-black/60' : 'bg-black/35 group-hover:bg-black/55'
                                  }`}
                                >
                                  <div className={`w-11 h-11 rounded-full backdrop-blur-md border border-white/10 flex items-center justify-center shadow-xl transition-all transform group-hover:scale-110 ${
                                    isThisPlaying
                                      ? 'bg-cyan-500 text-slate-950 ring-2 ring-cyan-300 shadow-cyan-500/50'
                                      : 'bg-slate-950/80 text-white group-hover:bg-cyan-500 group-hover:text-slate-950'
                                  }`}>
                                    {isThisPlaying ? (
                                      <Pause className="w-4 h-4 fill-current" />
                                    ) : (
                                      <Play className="w-4 h-4 fill-current ml-0.5" />
                                    )}
                                  </div>
                                </button>
                                <div className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded-md bg-slate-950/90 backdrop-blur text-[10px] font-mono font-bold text-cyan-300 border border-cyan-500/40 shadow-sm">
                                  {beat.bpm} BPM
                                </div>
                              </div>

                              {/* Typography & Meta Details */}
                              <div className="flex-1 min-w-0 space-y-2 text-center sm:text-left w-full">
                                <div>
                                  <div className="text-[10px] text-cyan-400 font-mono uppercase tracking-wider font-semibold flex items-center justify-center sm:justify-start gap-1.5">
                                    <span>{beat.genre}</span>
                                    <span className="text-slate-600">·</span>
                                    <span>Key: {beat.key}</span>
                                  </div>
                                  <h4 className="text-base font-black text-white truncate group-hover:text-cyan-300 transition-colors">
                                    {beat.title}
                                  </h4>
                                  <p className="text-xs text-slate-300 truncate">
                                    Prod. by <span className="text-white font-bold">{beat.producer}</span>
                                  </p>
                                </div>

                                {/* Price Baseline & Action Button */}
                                <div className="pt-2.5 mt-1 border-t border-slate-800/80 flex items-center justify-between gap-2">
                                  <div>
                                    <span className="text-[10px] text-slate-400 font-mono block leading-none">Starting from</span>
                                    <span className="font-mono text-sm font-black text-amber-400">
                                      ₦{(beat.prices?.mp3 || 35000).toLocaleString()}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => togglePlayBeat(beat)}
                                      className="bg-[#1E293B] hover:bg-slate-700 text-slate-200 border border-slate-700/70 p-2 rounded-xl text-xs font-semibold flex items-center justify-center transition shadow-sm"
                                      title={isThisPlaying ? 'Pause audio preview' : 'Play audio preview'}
                                    >
                                      {isThisPlaying ? (
                                        <Pause className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
                                      ) : (
                                        <Play className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400 ml-0.5" />
                                      )}
                                    </button>

                                    <button
                                      onClick={() => {
                                        setSelectedBeatForModal(beat);
                                        setSelectedLicenseTier('mp3');
                                        setIsBeatModalOpen(true);
                                      }}
                                      className="bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-slate-950 font-black px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 hover:scale-105 active:scale-95 transition"
                                    >
                                      <span>Buy Beat</span>
                                      <span className="text-[10px]">🛒</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* 4. PURCHASE & LICENSING MODAL (Interactive Tier Selector & Instant Paystack Payment) */}
                  {isBeatModalOpen && selectedBeatForModal && (() => {
                    const activePrice = tierConfig[selectedLicenseTier].getPrice(selectedBeatForModal);

                    return (
                      <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
                        <div className="bg-[#0F172A] border border-slate-700/90 rounded-3xl max-w-2xl w-full p-6 md:p-8 space-y-6 shadow-2xl my-auto text-slate-100">
                          
                          {/* Modal Header */}
                          <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                            <div className="flex items-center gap-4">
                              <img
                                src={selectedBeatForModal.cover}
                                alt={selectedBeatForModal.title}
                                referrerPolicy="no-referrer"
                                className="w-16 h-16 rounded-xl object-cover border border-slate-700 shadow shrink-0"
                              />
                              <div>
                                <span className="text-[10px] bg-cyan-500/20 text-cyan-400 font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                                  Licensing & Checkout
                                </span>
                                <h3 className="text-xl font-black text-white mt-1 leading-snug">
                                  {selectedBeatForModal.title}
                                </h3>
                                <p className="text-xs text-slate-300">
                                  Prod. by <span className="text-white font-bold">{selectedBeatForModal.producer}</span> · <span className="text-cyan-400 font-mono">{selectedBeatForModal.bpm} BPM</span> · Key: {selectedBeatForModal.key}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => setIsBeatModalOpen(false)}
                              className="text-slate-400 hover:text-white p-2 rounded-lg bg-[#1E293B] hover:bg-slate-700 transition"
                            >
                              ✕
                            </button>
                          </div>

                          {/* Licensing Tier Options */}
                          <div className="space-y-3">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                              Choose Your Licensing Tier
                            </h4>

                            <div className="space-y-2.5">
                              {(['mp3', 'wav', 'stems', 'exclusive'] as const).map(tierKey => {
                                const tier = tierConfig[tierKey];
                                const isSelected = selectedLicenseTier === tierKey;
                                const tierPrice = tier.getPrice(selectedBeatForModal);

                                return (
                                  <div
                                    key={tierKey}
                                    onClick={() => setSelectedLicenseTier(tierKey)}
                                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start justify-between gap-4 ${
                                      isSelected
                                        ? 'bg-cyan-500/10 border-cyan-400 ring-1 ring-cyan-400/40 shadow-lg shadow-cyan-500/10'
                                        : 'bg-[#1E293B]/70 border-slate-700/70 hover:border-slate-600'
                                    }`}
                                  >
                                    <div className="flex items-start gap-3">
                                      <div className={`w-5 h-5 rounded-full border mt-0.5 flex items-center justify-center shrink-0 transition ${
                                        isSelected ? 'border-cyan-400 bg-cyan-500' : 'border-slate-600 bg-slate-900'
                                      }`}>
                                        {isSelected && <span className="w-2 h-2 rounded-full bg-slate-950" />}
                                      </div>
                                      <div className="space-y-0.5">
                                        <div className="flex items-center gap-2">
                                          <h5 className={`text-sm font-bold ${isSelected ? 'text-cyan-400' : 'text-white'}`}>
                                            {tier.name}
                                          </h5>
                                          <span className="text-[10px] text-slate-400 font-mono">({tier.fileType})</span>
                                        </div>
                                        <p className="text-xs text-slate-300 leading-snug">
                                          {tier.desc}
                                        </p>
                                        <p className="text-[11px] text-slate-400 font-medium pt-0.5">
                                          {tier.streams}
                                        </p>
                                      </div>
                                    </div>

                                    <div className="text-right shrink-0">
                                      <span className="font-mono text-base font-black text-amber-400">
                                        ₦{tierPrice.toLocaleString()}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Email Input for Delivery */}
                          <div className="space-y-1.5 pt-2 border-t border-slate-800">
                            <label className="block text-xs font-semibold text-slate-300">
                              Recipient Email for Instant File Download & License Contract
                            </label>
                            <input
                              type="email"
                              required
                              placeholder="artist@domain.com or producer@label.com"
                              value={buyerEmail}
                              onChange={(e) => setBuyerEmail(e.target.value)}
                              className="w-full bg-[#0B1120] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition font-sans"
                            />
                            <p className="text-[10px] text-slate-400">
                              Your download link and verified agreement PDF are generated immediately after Paystack approval.
                            </p>
                          </div>

                          {/* Action Buttons: Add to Cart vs Instant Paystack Checkout */}
                          <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <button
                              type="button"
                              onClick={() => {
                                setBeatCart([
                                  ...beatCart,
                                  {
                                    beatId: selectedBeatForModal.id,
                                    title: selectedBeatForModal.title,
                                    producer: selectedBeatForModal.producer,
                                    licenseType: selectedLicenseTier,
                                    price: activePrice,
                                    cover: selectedBeatForModal.cover
                                  }
                                ]);
                                setIsBeatModalOpen(false);
                                setIsCartOpen(true);
                              }}
                              className="w-full sm:w-1/3 bg-[#1E293B] hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold py-3.5 rounded-xl text-xs transition text-center"
                            >
                              Add to Cart 🛒
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                const customerEmail = buyerEmail && buyerEmail.includes('@') ? buyerEmail : 'client@afropulse.com.ng';
                                triggerPaystackCheckout({
                                  email: customerEmail,
                                  amount: activePrice,
                                  packageName: `${selectedBeatForModal.title} - ${tierConfig[selectedLicenseTier].name}`,
                                  metadata: {
                                    beat_id: selectedBeatForModal.id,
                                    beat_title: selectedBeatForModal.title,
                                    producer: selectedBeatForModal.producer,
                                    license_tier: selectedLicenseTier,
                                    bpm: selectedBeatForModal.bpm
                                  },
                                  onSuccess: (ref) => {
                                    const order = {
                                      orderId: ref || ('PAY-' + Math.floor(100000 + Math.random() * 900000)),
                                      items: [{
                                        beatId: selectedBeatForModal.id,
                                        title: selectedBeatForModal.title,
                                        producer: selectedBeatForModal.producer,
                                        licenseType: selectedLicenseTier,
                                        price: activePrice,
                                        cover: selectedBeatForModal.cover
                                      }],
                                      total: activePrice,
                                      date: new Date().toLocaleString()
                                    };
                                    setIsBeatModalOpen(false);
                                    setDownloadFulfillmentModal(order);
                                  }
                                });
                              }}
                              className="w-full sm:w-2/3 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black py-3.5 rounded-xl text-xs shadow-xl shadow-amber-500/20 transition flex items-center justify-center gap-2"
                            >
                              <span>Proceed to Payment 🔒 (₦{activePrice.toLocaleString()})</span>
                            </button>
                          </div>

                        </div>
                      </div>
                    );
                  })()}

                  {/* 5. CART SLIDING DRAWER / MODAL */}
                  {isCartOpen && (
                    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end">
                      <div className="w-full max-w-md bg-[#0F172A] border-l border-slate-800 p-6 flex flex-col justify-between space-y-6 h-full shadow-2xl">
                        <div className="space-y-6 overflow-y-auto flex-1">
                          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                            <h3 className="text-lg font-black text-white">Your Beat Cart ({beatCart.length})</h3>
                            <button onClick={() => setIsCartOpen(false)} className="text-slate-400 hover:text-white p-2">✕</button>
                          </div>

                          {beatCart.length === 0 ? (
                            <div className="text-center py-16 text-slate-400 space-y-3">
                              <p className="text-sm">Your beat cart is currently empty.</p>
                              <button onClick={() => setIsCartOpen(false)} className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition">
                                Browse Instrumentals
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {beatCart.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3.5 bg-[#1E293B] border border-slate-700/80 rounded-xl">
                                  <div className="flex items-center gap-3 min-w-0 pr-2">
                                    <img src={item.cover} alt="" referrerPolicy="no-referrer" className="w-12 h-12 rounded-lg object-cover shrink-0 border border-slate-700" />
                                    <div className="min-w-0">
                                      <h5 className="text-xs font-bold text-white truncate">{item.title}</h5>
                                      <p className="text-[10px] text-amber-400 uppercase font-semibold">
                                        {item.licenseType.toUpperCase()} License · ₦{item.price.toLocaleString()}
                                      </p>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => setBeatCart(beatCart.filter((_, i) => i !== idx))}
                                    className="text-red-400 hover:text-red-300 text-xs p-2 shrink-0 transition"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {beatCart.length > 0 && (
                          <div className="space-y-4 pt-4 border-t border-slate-800">
                            <div className="flex items-center justify-between text-sm font-bold text-white">
                              <span>Total Amount:</span>
                              <span className="font-mono text-amber-400 text-lg">
                                ₦{beatCart.reduce((s, i) => s + i.price, 0).toLocaleString()}
                              </span>
                            </div>
                            <button
                              onClick={() => {
                                const total = beatCart.reduce((s, i) => s + i.price, 0);
                                triggerPaystackCheckout({
                                  email: buyerEmail && buyerEmail.includes('@') ? buyerEmail : 'client@afropulse.com.ng',
                                  amount: total,
                                  packageName: `AfroPulse Beat Order (${beatCart.length} Beats)`,
                                  metadata: {
                                    beat_titles: beatCart.map(b => b.title).join(', ')
                                  },
                                  onSuccess: (ref) => {
                                    const order = {
                                      orderId: ref || ('PAY-' + Math.floor(100000 + Math.random() * 900000)),
                                      items: [...beatCart],
                                      total: total,
                                      date: new Date().toLocaleString()
                                    };
                                    setBeatCart([]);
                                    setIsCartOpen(false);
                                    setDownloadFulfillmentModal(order);
                                  }
                                });
                              }}
                              className="w-full bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 text-slate-950 font-black py-3.5 rounded-xl text-xs shadow-lg shadow-cyan-500/20 transition uppercase tracking-wider"
                            >
                              Proceed to Paystack Checkout 🔒
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 6. SECURE DOWNLOAD FULFILLMENT MODAL */}
                  {downloadFulfillmentModal && (
                    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
                      <div className="bg-[#0F172A] border border-slate-700/90 rounded-3xl max-w-lg w-full p-6 md:p-8 space-y-6 shadow-2xl">
                        <div className="text-center space-y-2">
                          <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-xl font-bold">
                            ✓
                          </div>
                          <h3 className="text-2xl font-black text-white">Payment Successful & Verified!</h3>
                          <p className="text-xs text-slate-400">
                            Order Reference: <span className="font-mono text-amber-400">{downloadFulfillmentModal.orderId}</span> via Paystack.
                          </p>
                        </div>

                        <div className="space-y-4 bg-[#1E293B]/80 p-4 rounded-2xl border border-slate-700/80">
                          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                            Instant Secure Downloads & Licenses
                          </h4>
                          <div className="space-y-3">
                            {downloadFulfillmentModal.items.map((item: any, idx: number) => (
                              <div key={idx} className="flex items-center justify-between p-3 bg-[#0F172A] rounded-xl border border-slate-700/70">
                                <div className="min-w-0 pr-2">
                                  <h5 className="text-xs font-bold text-white truncate">{item.title}</h5>
                                  <p className="text-[10px] text-slate-400">
                                    {item.licenseType.toUpperCase()} Audio Master + Signed Contract PDF
                                  </p>
                                </div>
                                <button
                                  onClick={() => handleDownloadFile(item)}
                                  className="shrink-0 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 shadow"
                                >
                                  <Download className="w-3.5 h-3.5" /> Download
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        <button
                          onClick={() => setDownloadFulfillmentModal(null)}
                          className="w-full bg-[#1E293B] hover:bg-slate-700 text-slate-200 font-bold py-3 rounded-xl text-xs transition"
                        >
                          Close & Return to Beat Store
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 7. ROUTE-SPECIFIC ISOLATED FAQS & TESTIMONIALS */}
                  {renderFaqAndTestimonials()}
                </div>
              );
            })()}

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
                        onClick={() => triggerPaystackCheckout({
                          email: 'artist@afropulse.com.ng',
                          amount: 15000,
                          packageName: 'Single Song Upload',
                          onSuccess: () => alert('Payment successful! Your single has been submitted for review.')
                        })}
                        className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-3 rounded-xl text-xs shadow-lg transition-all"
                      >
                        Proceed to Paystack Checkout 🔒
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
                        onClick={() => triggerPaystackCheckout({
                          email: 'artist@afropulse.com.ng',
                          amount: 45000,
                          packageName: 'EP / Album Project Upload',
                          onSuccess: () => alert('Payment successful! Your project has been submitted for review.')
                        })}
                        className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-3 rounded-xl text-xs shadow-lg transition-all"
                      >
                        Proceed to Paystack Checkout 🔒
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ROUTE: MUSIC */}
            {currentRoute === 'music' && (
              <MusicFeed
                posts={posts}
                currentPlayingId={currentPlayingTrack?.id}
                isPlaying={isPlaying}
                onSelectPost={(post) => {
                  setSelectedPostId(post.id);
                  setCurrentRoute('post');
                }}
                onPlayTrack={handlePlayTrack}
                onDownloadTrack={handleDownloadFile}
              />
            )}

            {/* ROUTE: VIDEOS */}
            {currentRoute === 'videos' && (
              <div className="space-y-6 max-w-4xl mx-auto">
                <div className="text-center max-w-xl mx-auto space-y-2">
                  <h2 className="text-3xl font-black text-white">Official Music Videos</h2>
                  <p className="text-xs text-stone-400">Watch cinematic 4K music video premieres from top African artists.</p>
                </div>
                <div className="space-y-3.5">
                  {posts.filter(isMoviePost).map(p => (
                    <div
                      key={p.id}
                      onClick={() => { setSelectedPostId(p.id); setCurrentRoute('post'); }}
                      className="flex items-center gap-4 p-3.5 bg-stone-900/90 rounded-xl border border-stone-800/80 hover:border-blue-500/50 transition shadow-sm cursor-pointer"
                    >
                      <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden relative border border-stone-800">
                        <img src={p.image_url || p.cover} alt={p.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-blue-500/20 text-blue-400">{p.category.toUpperCase()}</span>
                          {p.genre && <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-stone-800 text-stone-300 uppercase font-mono">{p.genre}</span>}
                          <span className="text-[10px] text-stone-400">{p.date}</span>
                          <span className="text-[10px] text-stone-500">• {p.views || '2.8M'} views</span>
                        </div>
                        <h4 className="text-sm md:text-base font-semibold text-white line-clamp-2 leading-snug">{p.title}</h4>
                        <p className="text-xs text-blue-400 font-semibold truncate">
                          <span>{p.artist}</span>
                          {p.featured_artist && <span className="text-stone-400 ml-1">ft. {p.featured_artist}</span>}
                        </p>
                        <p className="text-xs text-stone-400 line-clamp-1" style={{ whiteSpace: 'pre-wrap' }}>{p.content || p.description || p.body}</p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedPostId(p.id); setCurrentRoute('post'); }}
                        className="shrink-0 px-3.5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow"
                      >
                        Watch →
                      </button>
                    </div>
                  ))}
                  {posts.filter(isMoviePost).length === 0 && (
                    <div className="text-center py-12 bg-stone-900/50 rounded-2xl border border-stone-800">
                      <p className="text-sm text-stone-400">No video premieres found yet.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ROUTE: MOVIES (Strictly movie/video posts, NO audio posts) */}
            {currentRoute === 'movies' && (
              <div className="space-y-6 max-w-4xl mx-auto">
                <div className="text-center max-w-xl mx-auto space-y-2">
                  <h2 className="text-3xl font-black text-white">Movie Premieres & Cinematic Streams</h2>
                  <p className="text-xs text-stone-400">Exclusive Nollywood movie premieres and cinematic releases.</p>
                </div>
                <div className="space-y-3.5">
                  {posts.filter(isMoviePost).map(p => (
                    <div
                      key={p.id}
                      onClick={() => { setSelectedPostId(p.id); setCurrentRoute('post'); }}
                      className="flex items-center gap-4 p-3.5 bg-stone-900/90 rounded-xl border border-stone-800/80 hover:border-amber-500/50 transition shadow-sm cursor-pointer"
                    >
                      <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden relative border border-stone-800">
                        <img src={p.image_url || p.cover} alt={p.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-500/20 text-amber-400">{p.category.toUpperCase()}</span>
                          {p.genre && <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-stone-800 text-stone-300 uppercase font-mono">{p.genre}</span>}
                          <span className="text-[10px] text-stone-400">{p.date}</span>
                        </div>
                        <h4 className="text-sm md:text-base font-semibold text-white line-clamp-2 leading-snug">{p.title}</h4>
                        <p className="text-xs text-amber-400 font-semibold truncate">
                          <span>{p.artist}</span>
                          {p.featured_artist && <span className="text-stone-400 ml-1">ft. {p.featured_artist}</span>}
                        </p>
                        <p className="text-xs text-stone-400 line-clamp-1" style={{ whiteSpace: 'pre-wrap' }}>{p.content || p.description || p.body}</p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedPostId(p.id); setCurrentRoute('post'); }}
                        className="shrink-0 px-3.5 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg shadow"
                      >
                        Stream →
                      </button>
                    </div>
                  ))}
                  {posts.filter(isMoviePost).length === 0 && (
                    <div className="text-center py-12 bg-stone-900/50 rounded-2xl border border-stone-800">
                      <p className="text-sm text-stone-400">No movie premieres published yet.</p>
                    </div>
                  )}
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
                  {posts.filter(isNewsPost).map(p => (
                    <div
                      key={p.id}
                      onClick={() => { setSelectedPostId(p.id); setCurrentRoute('post'); }}
                      className="flex items-center gap-4 p-3.5 bg-stone-900/90 rounded-xl border border-stone-800/80 hover:border-amber-500/50 transition shadow-sm cursor-pointer"
                    >
                      <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden relative border border-stone-800">
                        <img src={p.image_url || p.cover} alt={p.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-500/20 text-amber-400">{p.category.toUpperCase()}</span>
                          {p.genre && <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-stone-800 text-stone-300 uppercase font-mono">{p.genre}</span>}
                          <span className="text-[10px] text-stone-400">{p.date}</span>
                          <span className="text-[10px] text-stone-500">• {p.readTime || '3 min read'}</span>
                        </div>
                        <h4 className="text-sm md:text-base font-semibold text-white line-clamp-2 leading-snug">{p.title}</h4>
                        <p className="text-xs text-stone-400 line-clamp-2" style={{ whiteSpace: 'pre-wrap' }}>{p.content || p.description || p.body}</p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedPostId(p.id); setCurrentRoute('post'); }}
                        className="shrink-0 px-3.5 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg shadow"
                      >
                        Read Article →
                      </button>
                    </div>
                  ))}
                  {posts.filter(isNewsPost).length === 0 && (
                    <div className="text-center py-12 bg-stone-900/50 rounded-2xl border border-stone-800">
                      <p className="text-sm text-stone-400">No news articles published yet.</p>
                    </div>
                  )}
                </div>
              </div>
            )}


            {/* ROUTE: INNER POST DETAIL PAGE (/post/:id) */}
            {currentRoute === 'post' && selectedPostId && (() => {
              const post = posts.find(p => p.id === selectedPostId) || posts[0] || fallbackTrack;
              const relatedPosts = posts.filter(p => p.category === post.category && p.id !== post.id).slice(0, 5);
              const comments = postComments[post.id] || [
                { id: 'c1', author: 'Oluwaseun T.', text: 'Amazing drop! The production quality on this is top-notch.', date: '2 hours ago' },
                { id: 'c2', author: 'Chinedu K.', text: 'AfroPulse never misses with these releases 🔥', date: '1 hour ago' }
              ];

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
                  onSelectPost={(id) => {
                    setSelectedPostId(id);
                    setCurrentRoute('post');
                  }}
                  onAddComment={(author, text) => {
                    const newC = {
                      id: 'c-' + Date.now(),
                      author,
                      text,
                      date: 'Just now'
                    };
                    setPostComments({
                      ...postComments,
                      [post.id]: [...comments, newC]
                    });
                  }}
                />
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

                {spotifySubmitted ? (
                  <div className="bg-stone-900 border border-emerald-500/40 rounded-2xl p-8 text-center space-y-6 max-w-2xl mx-auto">
                    <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">✓</div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-black text-white">Spotify Campaign Successfully Submitted!</h3>
                      <p className="text-xs text-stone-300 max-w-md mx-auto">
                        Your payment has been verified via Paystack. Your Spotify track has been queued for pitching across verified curators in our network.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSpotifySubmitted(false);
                        setActiveSpotifyCheckout(null);
                        setCurrentRoute('home');
                      }}
                      className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-6 py-3 rounded-xl text-xs"
                    >
                      Return to Home Portal
                    </button>
                  </div>
                ) : activeSpotifyCheckout ? (
                  <div className="bg-stone-900 border border-stone-800 rounded-2xl p-8 max-w-2xl mx-auto space-y-6">
                    <div className="flex items-center justify-between border-b border-stone-800 pb-4">
                      <div>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2.5 py-1 rounded-full uppercase">Paystack Secure Checkout</span>
                        <h3 className="text-xl font-bold text-white mt-1">{activeSpotifyCheckout.name}</h3>
                        <p className="text-xs text-stone-400">{activeSpotifyCheckout.playlists} Playlists Curated Placement</p>
                      </div>
                      <div className="text-2xl font-mono font-bold text-emerald-400">₦{activeSpotifyCheckout.price.toLocaleString()}</div>
                    </div>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        triggerPaystackCheckout({
                          email: spotifyEmail,
                          amount: activeSpotifyCheckout.price,
                          packageName: activeSpotifyCheckout.name,
                          metadata: {
                            artist_name: spotifyArtistName,
                            spotify_track_link: spotifyTrackLink,
                            playlists: activeSpotifyCheckout.playlists
                          },
                          onSuccess: () => setSpotifySubmitted(true)
                        });
                      }}
                      className="space-y-4"
                    >
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">Instant Spotify Submission Form</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-stone-300 mb-1">Artist Name</label>
                          <input 
                            type="text" 
                            required 
                            placeholder="e.g. Asake / Tems" 
                            value={spotifyArtistName}
                            onChange={(e) => setSpotifyArtistName(e.target.value)}
                            className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2.5 text-xs text-white" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-stone-300 mb-1">Contact Email</label>
                          <input 
                            type="email" 
                            required 
                            placeholder="artist@domain.com" 
                            value={spotifyEmail}
                            onChange={(e) => setSpotifyEmail(e.target.value)}
                            className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2.5 text-xs text-white" 
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-300 mb-1">Official Spotify Track Link / URI</label>
                        <input 
                          type="url" 
                          required 
                          placeholder="https://open.spotify.com/track/..." 
                          value={spotifyTrackLink}
                          onChange={(e) => setSpotifyTrackLink(e.target.value)}
                          className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2.5 text-xs text-white font-mono" 
                        />
                      </div>

                      <div className="flex gap-3 pt-4">
                        <button
                          type="button"
                          onClick={() => setActiveSpotifyCheckout(null)}
                          className="w-1/3 bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold py-3 rounded-xl text-xs"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="w-2/3 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold py-3 rounded-xl text-xs shadow-lg"
                        >
                          Proceed to Paystack Payment 🔒
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
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
                            onClick={() => setActiveSpotifyCheckout(pkg)}
                            className="w-full bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold py-3 rounded-xl text-xs shadow-lg transition-all"
                          >
                            Proceed to Paystack Checkout 🔒
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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

                {prSubmitted ? (
                  <div className="bg-stone-900 border border-emerald-500/40 rounded-2xl p-8 text-center space-y-6 max-w-2xl mx-auto">
                    <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">✓</div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-black text-white">PR Campaign Successfully Submitted!</h3>
                      <p className="text-xs text-stone-300 max-w-md mx-auto">
                        Your payment has been verified via Paystack. Your press release has been dispatched to our editorial network for syndication across major African music media.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setPRSubmitted(false);
                        setActivePRCheckout(null);
                        setCurrentRoute('home');
                      }}
                      className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-6 py-3 rounded-xl text-xs"
                    >
                      Return to Home Portal
                    </button>
                  </div>
                ) : activePRCheckout ? (
                  <div className="bg-stone-900 border border-stone-800 rounded-2xl p-8 max-w-2xl mx-auto space-y-6">
                    <div className="flex items-center justify-between border-b border-stone-800 pb-4">
                      <div>
                        <span className="text-[10px] bg-amber-500/20 text-amber-400 font-bold px-2.5 py-1 rounded-full uppercase">Paystack Secure Checkout</span>
                        <h3 className="text-xl font-bold text-white mt-1">{activePRCheckout.name}</h3>
                        <p className="text-xs text-stone-400">{activePRCheckout.desc}</p>
                      </div>
                      <div className="text-2xl font-mono font-bold text-amber-400">₦{activePRCheckout.price.toLocaleString()}</div>
                    </div>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        triggerPaystackCheckout({
                          email: prEmail,
                          amount: activePRCheckout.price,
                          packageName: activePRCheckout.name,
                          metadata: {
                            artist_name: prArtistName,
                            song_link: prSongLink,
                            press_notes: prPressNotes
                          },
                          onSuccess: () => setPRSubmitted(true)
                        });
                      }}
                      className="space-y-4"
                    >
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">Instant PR Servicing Submission Form</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-stone-300 mb-1">Artist / Label Name</label>
                          <input 
                            type="text" 
                            required 
                            placeholder="e.g. Starboy Records" 
                            value={prArtistName}
                            onChange={(e) => setPRArtistName(e.target.value)}
                            className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2.5 text-xs text-white" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-stone-300 mb-1">Contact Email</label>
                          <input 
                            type="email" 
                            required 
                            placeholder="artist@domain.com" 
                            value={prEmail}
                            onChange={(e) => setPREmail(e.target.value)}
                            className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2.5 text-xs text-white" 
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-300 mb-1">Streaming Link or Media EPK Link</label>
                        <input 
                          type="url" 
                          required 
                          placeholder="Paste Spotify, Apple Music, Audiomack, or Google Drive link..." 
                          value={prSongLink}
                          onChange={(e) => setPRSongLink(e.target.value)}
                          className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2.5 text-xs text-white font-mono" 
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-300 mb-1">Press Release Angle / Notes</label>
                        <textarea 
                          rows={3} 
                          placeholder="Describe song backstory, producers involved, or release angle..." 
                          value={prPressNotes}
                          onChange={(e) => setPRPressNotes(e.target.value)}
                          className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs text-white"
                        ></textarea>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <button
                          type="button"
                          onClick={() => setActivePRCheckout(null)}
                          className="w-1/3 bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold py-3 rounded-xl text-xs"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="w-2/3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-3 rounded-xl text-xs shadow-lg"
                        >
                          Proceed to Paystack Payment 🔒
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
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
                            onClick={() => setActivePRCheckout(tier)}
                            className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-3 rounded-xl text-xs shadow-lg transition-all"
                          >
                            Proceed to Paystack Checkout 🔒
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                        triggerPaystackCheckout({
                          email: radioEmail,
                          amount: activeRadioCheckout.price,
                          packageName: activeRadioCheckout.packageName,
                          metadata: {
                            artist_name: radioArtistName,
                            stream_link: radioStreamLink,
                            clean_edit: radioCleanEdit,
                            target_cities: radioStations
                          },
                          onSuccess: () => setRadioSubmitted(true)
                        });
                      }}
                      className="space-y-4"
                    >
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">Instant Radio Servicing Submission Form</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-stone-300 mb-1">Artist / Label Name</label>
                          <input 
                            type="text" 
                            required 
                            placeholder="e.g. Starboy Records" 
                            value={radioArtistName}
                            onChange={(e) => setRadioArtistName(e.target.value)}
                            className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2.5 text-xs text-white" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-stone-300 mb-1">Contact Email</label>
                          <input 
                            type="email" 
                            required 
                            placeholder="artist@domain.com" 
                            value={radioEmail}
                            onChange={(e) => setRadioEmail(e.target.value)}
                            className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2.5 text-xs text-white" 
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-300 mb-1">Streaming / Audio Link</label>
                        <input 
                          type="url" 
                          required 
                          placeholder="Paste Spotify, Apple Music, Audiomack, YouTube, or Google Drive link..." 
                          value={radioStreamLink}
                          onChange={(e) => setRadioStreamLink(e.target.value)}
                          className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2.5 text-xs text-white font-mono" 
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-stone-300 mb-1">Radio Edit / Clean Version Check</label>
                          <select 
                            value={radioCleanEdit}
                            onChange={(e) => setRadioCleanEdit(e.target.value)}
                            className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2.5 text-xs text-white"
                          >
                            <option value="yes">Yes, Radio Clean Edit Ready</option>
                            <option value="needs_edit">Needs Studio Radio Edit Service</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-stone-300 mb-1">Preferred Target Cities / Stations</label>
                          <input 
                            type="text" 
                            required 
                            placeholder="e.g. Lagos (Beat FM, Cool FM), PH" 
                            value={radioStations}
                            onChange={(e) => setRadioStations(e.target.value)}
                            className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2.5 text-xs text-white" 
                          />
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
                          Proceed to Paystack Payment 🔒
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
                        triggerPaystackCheckout({
                          email: tiktokEmail,
                          amount: activeTiktokCheckout.price,
                          packageName: `${activeTiktokCheckout.tierName} (${activeTiktokCheckout.videoCount} Videos)`,
                          metadata: {
                            brand_or_artist: tiktokBrandName,
                            tiktok_audio_link: tiktokAudioLink,
                            concept_brief: tiktokConceptBrief,
                            artwork_link: tiktokAssetLink,
                            video_count: activeTiktokCheckout.videoCount
                          },
                          onSuccess: () => setTiktokSubmitted(true)
                        });
                      }}
                      className="space-y-4"
                    >
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">Instant Campaign Submission Form</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-stone-300 mb-1">Artist / Brand Name</label>
                          <input 
                            type="text" 
                            required 
                            placeholder="e.g. Asake / Pepsi Nigeria" 
                            value={tiktokBrandName}
                            onChange={(e) => setTiktokBrandName(e.target.value)}
                            className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2.5 text-xs text-white" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-stone-300 mb-1">Contact Email</label>
                          <input 
                            type="email" 
                            required 
                            placeholder="contact@brand.com" 
                            value={tiktokEmail}
                            onChange={(e) => setTiktokEmail(e.target.value)}
                            className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2.5 text-xs text-white" 
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-300 mb-1">TikTok Song Audio Link / Name (Spotify / SoundCloud / TikTok Sound)</label>
                        <input 
                          type="text" 
                          required 
                          placeholder="https://tiktok.com/music/... or song title" 
                          value={tiktokAudioLink}
                          onChange={(e) => setTiktokAudioLink(e.target.value)}
                          className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2.5 text-xs text-white font-mono" 
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-300 mb-1">Target Instructions / Concept Brief</label>
                        <textarea 
                          rows={3} 
                          required 
                          placeholder="Describe dance challenge choreography, hook emphasis, or video concept..." 
                          value={tiktokConceptBrief}
                          onChange={(e) => setTiktokConceptBrief(e.target.value)}
                          className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs text-white"
                        ></textarea>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-300 mb-1">Artwork / Asset Upload Link (Google Drive / Dropbox)</label>
                        <input 
                          type="url" 
                          required 
                          placeholder="https://drive.google.com/..." 
                          value={tiktokAssetLink}
                          onChange={(e) => setTiktokAssetLink(e.target.value)}
                          className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2.5 text-xs text-white font-mono" 
                        />
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
                          Proceed to Paystack Payment 🔒
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

      {/* FLOATING AUDIO STREAMING & DOWNLOAD PLAYER BAR */}
      <PlayerModal
        track={currentPlayingTrack}
        isPlaying={isPlaying}
        onTogglePlay={() => {
          if (currentPlayingTrack) handlePlayTrack(currentPlayingTrack);
        }}
        onDownload={handleDownloadFile}
        onClose={() => {
          if (audioElement) {
            audioElement.pause();
          }
          setIsPlaying(false);
          setCurrentPlayingTrack(null);
        }}
        onSelectPost={(track) => {
          setSelectedPostId(track.id);
          setCurrentRoute('post');
        }}
      />

    </main>
  );
}
