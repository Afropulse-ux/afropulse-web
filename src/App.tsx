import React, { useState } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Download,
  Search,
  Upload,
  Flame,
  Radio,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  X,
  Disc,
  ShoppingCart,
  Lock,
  Newspaper,
  Video,
  Megaphone,
  FileText,
  Crown,
  Share2,
  Headphones,
  Eye,
  ShieldCheck,
  Mail,
  Sparkles,
  ExternalLink,
  Settings,
  Database,
  Users,
  DollarSign,
  Key,
  Shield,
  FileCode,
  CheckCircle2,
  Trash2,
  UserPlus,
  LogOut,
  FolderOpen,
  ListFilter,
  Phone,
  MessageCircle
} from 'lucide-react';

// Imported generated assets
import heroFeaturedImg from './assets/images/afropulse_hero_featured_1791468166470.jpg';
import trackAmapianoImg from './assets/images/afropulse_track_amapiano_1791468176706.jpg';
import gossipAwardsImg from './assets/images/afropulse_gossip_awards_1791468187604.jpg';
import beatStoreImg from './assets/images/afropulse_beat_store_1791468198172.jpg';
import musicVideoImg from './assets/images/afropulse_music_video_1_1791470524704.jpg';
import vocalistImg from './assets/images/afropulse_artist_vocalist_1791470593817.jpg';

type PostType = 'music' | 'news' | 'video';

interface PostItem {
  id: string;
  type: PostType;
  title: string;
  subtitle: string;
  category: string;
  cover: string;
  date: string;
  duration?: string;
  downloads?: string;
  views?: string;
  readTime?: string;
  body?: string;
  lyrics?: string[];
}

interface NewsItem {
  id: string;
  title: string;
  source: string;
  time: string;
  cover: string;
  category: string;
  summary: string;
}

interface VideoItem {
  id: string;
  title: string;
  artist: string;
  views: string;
  duration: string;
  cover: string;
  director: string;
}

interface BeatItem {
  id: string;
  title: string;
  producer: string;
  genre: string;
  bpm: number;
  key: string;
  cover: string;
}

// 20 Mixed Main Posts Data with Smart Card Types
const POSTS_20_DATA: PostItem[] = [
  {
    id: 'p1',
    type: 'music',
    title: 'Lagos Midnight Groove',
    subtitle: 'Kwamz ft. Tiwa Savage (Prod. by Sarz)',
    category: 'AFROBEATS',
    cover: heroFeaturedImg,
    date: '2 hours ago',
    duration: '03:44',
    downloads: '142.5K',
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
    cover: trackAmapianoImg,
    date: '3 hours ago',
    duration: '04:12',
    downloads: '98.4K',
    body: 'A deep, resonant Amapiano masterwork loaded with warm Rhodes chords, signature live shaker loops, and thunderous log-drum bassline sequences recorded in Soweto.'
  },
  {
    id: 'p3',
    type: 'news',
    title: 'AFRIMMA 2026: Nigerian & South African Stars Sweep Top Categories',
    subtitle: 'Afropulse Editorial Staff · Lagos Bureau',
    category: 'NEWS',
    cover: gossipAwardsImg,
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
    cover: musicVideoImg,
    date: '5 hours ago',
    duration: '03:42',
    views: '2.8M views',
    body: 'Directed by TG Omori, this futuristic cinematic spectacle features aerial night shots of the Lekki-Ikoyi Link Bridge and choreography executed by over 60 dancers.'
  },
  {
    id: 'p5',
    type: 'music',
    title: 'Resonance & Heritage',
    subtitle: 'Nneka Obi (Acoustic Highlife)',
    category: 'HIGHLIFE',
    cover: vocalistImg,
    date: '6 hours ago',
    duration: '03:52',
    downloads: '55.1K',
    body: 'Organic live instrumentation meets heartfelt Igbo folk idioms in this acoustic masterpiece produced with vintage brass and acoustic nylon guitars.'
  },
  {
    id: 'p6',
    type: 'news',
    title: 'Tyla Surpasses 1 Billion Spotify Streams in Historic Global Milestone',
    subtitle: 'Entertainment Wire · Johannesburg Desk',
    category: 'CELEBRITY GOSSIP',
    cover: trackAmapianoImg,
    date: '7 hours ago',
    readTime: '3 min read',
    body: 'Grammy-award winner Tyla has officially crossed the monumental one-billion stream threshold on Spotify, becoming the fastest African female artist in recorded history to achieve the feat.'
  },
  {
    id: 'p7',
    type: 'video',
    title: 'Kilimanjaro Sunset (Live Visualizer)',
    subtitle: 'Diamond Platnumz (Dir. Director Kenny)',
    category: 'VIDEOS',
    cover: heroFeaturedImg,
    date: '8 hours ago',
    duration: '03:31',
    views: '890K views',
    body: 'Bongo Flava icon Diamond Platnumz delivers an intimate outdoor sunset performance at the base of Mount Kilimanjaro, accompanied by a 6-piece Swahili band.'
  },
  {
    id: 'p8',
    type: 'music',
    title: 'Ohemaa (Ghana Highlife Wave)',
    subtitle: 'King Promise ft. Olamide',
    category: 'HIGHLIFE',
    cover: beatStoreImg,
    date: '9 hours ago',
    duration: '03:40',
    downloads: '88.3K',
    body: 'Smooth Ghanaian guitar licks cross paths with indigenous Yoruba rap bars in this cross-cultural anthem dominating airwaves across West Africa.'
  },
  {
    id: 'p9',
    type: 'news',
    title: 'Burna Boy Pan-African Stadium Tour Sells Out 6 Venues in 48 Hours',
    subtitle: 'Chinedu Eze · Tour Desk',
    category: 'NEWS',
    cover: gossipAwardsImg,
    date: '10 hours ago',
    readTime: '5 min read',
    body: 'Tickets for Burna Boy’s unprecedented 20-city stadium tour across East, West, and Central Africa have seen unprecedented demand, crashing multiple regional ticketing servers.'
  },
  {
    id: 'p10',
    type: 'music',
    title: 'Abuja Skyline (Club VIP Edit)',
    subtitle: 'Rema ft. Shallipopi (Prod. London)',
    category: 'AFROBEATS',
    cover: musicVideoImg,
    date: '12 hours ago',
    duration: '02:49',
    downloads: '165.8K',
    body: 'An infectious Benin-city rave collaboration tailored for prime-time club rotation with distorted synth bass and fast-paced pidgin cadences.'
  },
  {
    id: 'p11',
    type: 'music',
    title: 'Pretoria Metro Station',
    subtitle: 'DBN Gogo Audio & Focalistic',
    category: 'AMAPIANO',
    cover: trackAmapianoImg,
    date: '13 hours ago',
    duration: '05:04',
    downloads: '73.2K',
    body: 'Heavy 3-step Amapiano percussion combined with vintage township chants that keep the dancefloor locked in a state of endless motion.'
  },
  {
    id: 'p12',
    type: 'news',
    title: 'Funke Akindele Breaks All-Time Nollywood Box Office Record with ₦1.8B',
    subtitle: 'Cinema Desk · Lagos',
    category: 'CELEBRITY GOSSIP',
    cover: vocalistImg,
    date: '15 hours ago',
    readTime: '3 min read',
    body: 'Nollywood box office powerhouse Funke Akindele has rewritten Nigerian cinematic history once again as her newest holiday release crossed the 1.8 billion Naira mark.'
  },
  {
    id: 'p13',
    type: 'video',
    title: 'Accra Nights (Studio Session 4K)',
    subtitle: 'Black Sherif (Dir. Yaw Skyface)',
    category: 'VIDEOS',
    cover: heroFeaturedImg,
    date: '16 hours ago',
    duration: '03:15',
    views: '1.4M views',
    body: 'Raw, emotional acoustic studio session highlighting Black Sherif’s distinct vocal projection and haunting traditional Ghanaian harmonies.'
  },
  {
    id: 'p14',
    type: 'music',
    title: 'Sensational (Afro R&B Remix)',
    subtitle: 'Ayra Starr ft. Chris Brown',
    category: 'AFROBEATS',
    cover: trackAmapianoImg,
    date: '18 hours ago',
    duration: '03:22',
    downloads: '135.0K',
    body: 'Silky transatlantic R&B fusion engineered with crisp drum production and harmonious call-and-response vocal arrangements.'
  },
  {
    id: 'p15',
    type: 'news',
    title: 'Davido Hosts Star-Studded Charity Gala in Atlanta Raising $2.5M',
    subtitle: 'Philanthropy Desk · Celebrity Watch',
    category: 'NEWS',
    cover: gossipAwardsImg,
    date: '19 hours ago',
    readTime: '4 min read',
    body: 'Afrobeats superstar Davido gathered international dignitaries, tech leaders, and entertainment icons for his 4th annual charity gala benefiting educational foundations across Nigeria.'
  },
  {
    id: 'p16',
    type: 'music',
    title: 'Kpa Kpa Kpa (Street Piano)',
    subtitle: 'Zlatan ft. Seyi Vibez',
    category: 'AMAPIANO',
    cover: beatStoreImg,
    date: '20 hours ago',
    duration: '03:02',
    downloads: '94.5K',
    body: 'Aggressive street-hop verses collide with South African log drum rhythms in this energetic fusion dominating street corners and radio stations.'
  },
  {
    id: 'p17',
    type: 'video',
    title: 'Calabar Carnival Anthem (Official Premiere)',
    subtitle: 'Flavour of Africa (Dir. Clarence Peters)',
    category: 'VIDEOS',
    cover: musicVideoImg,
    date: '1 day ago',
    duration: '04:15',
    views: '2.0M views',
    body: 'A vibrant kaleidoscope of carnival costumes, brass band masquerades, and celebratory highlife dance sequences filmed along the Calabar cultural boulevard.'
  },
  {
    id: 'p18',
    type: 'news',
    title: 'Asake Sells Out London O2 Arena in Under 12 Minutes for the Third Time',
    subtitle: 'UK Music Bureau · London',
    category: 'CELEBRITY GOSSIP',
    cover: heroFeaturedImg,
    date: '1 day ago',
    readTime: '2 min read',
    body: 'Neo-Fuji maestro Asake continues his unbroken international streak, completely selling out the prestigious 20,000-capacity O2 Arena in minutes.'
  },
  {
    id: 'p19',
    type: 'music',
    title: 'Banana Island Afro-House',
    subtitle: 'Masterkraft Boy & Spinall',
    category: 'AFROBEATS',
    cover: vocalistImg,
    date: '1 day ago',
    duration: '03:36',
    downloads: '81.2K',
    body: 'Sophisticated afro-house groove powered by rich electric piano stabs, analog synth bass, and hypnotic West African percussion.'
  },
  {
    id: 'p20',
    type: 'video',
    title: 'Sensational (Choreography Video)',
    subtitle: 'Ayra Starr ft. Dancers (Dir. Meji Alabi)',
    category: 'VIDEOS',
    cover: trackAmapianoImg,
    date: '2 days ago',
    duration: '03:22',
    views: '5.2M views',
    body: 'Award-winning director Meji Alabi showcases stunning synchronization with Paris and Lagos dance troupes against striking brutalist architecture.'
  }
];

// 10 Celebrity News & Gossip Items
const NEWS_10_DATA: NewsItem[] = [
  { id: 'n1', title: 'AFRIMMA 2026: Nigerian & South African Stars Sweep Top Categories', source: 'Lagos Bureau', time: '1 hour ago', cover: gossipAwardsImg, category: 'NEWS', summary: 'Historic night in Dallas as Afrobeats and Amapiano artists claim 14 major trophies.' },
  { id: 'n2', title: 'Burna Boy Announces 20-City Pan-African Stadium Tour Beginning in Nairobi', source: 'Tour Desk', time: '3 hours ago', cover: heroFeaturedImg, category: 'NEWS', summary: 'The African Giant brings full stadium production to East Africa next month.' },
  { id: 'n3', title: 'Tyla Hits Landmark 1 Billion Streams Milestone on Global Spotify Charts', source: 'Chart Watch', time: '4 hours ago', cover: trackAmapianoImg, category: 'CELEBRITY GOSSIP', summary: 'Fastest African female artist to surpass one billion digital streams.' },
  { id: 'n4', title: 'Wizkid Drops Cryptic Video Snippet Teasing Upcoming Project "Morayo"', source: 'Music Wire', time: '5 hours ago', cover: musicVideoImg, category: 'NEWS', summary: 'Starboy teases new visual direction with high-fashion Paris runway footage.' },
  { id: 'n5', title: 'Funke Akindele Breaks All-Time Nollywood Box Office Record with ₦1.8B', source: 'Cinema News', time: '7 hours ago', cover: vocalistImg, category: 'CELEBRITY GOSSIP', summary: 'Nollywood box office record shattered in unprecedented holiday run.' },
  { id: 'n6', title: 'Davido Hosts Charity Gala in Atlanta Raising Funds for Orphanages', source: 'Philanthropy', time: '8 hours ago', cover: gossipAwardsImg, category: 'NEWS', summary: 'Over $2.5 million raised for youth educational initiatives across Nigeria.' },
  { id: 'n7', title: 'Asake Sells Out London O2 Arena in Less Than 12 Minutes', source: 'London Desk', time: '10 hours ago', cover: heroFeaturedImg, category: 'CELEBRITY GOSSIP', summary: 'Third consecutive sell-out concert at London iconic arena.' },
  { id: 'n8', title: 'Tiwa Savage Speaks on Producing Her Feature Film "Water & Garri"', source: 'Film Insight', time: '12 hours ago', cover: trackAmapianoImg, category: 'CELEBRITY GOSSIP', summary: 'African superstar reflects on scoring and starring in original cinema production.' },
  { id: 'n9', title: 'Rema and Shallipopi Spotted Filming High-Budget Video in Benin City', source: 'Street Pulse', time: '14 hours ago', cover: musicVideoImg, category: 'NEWS', summary: 'Massive crowd gathers as Edo state icons return home for blockbuster video.' },
  { id: 'n10', title: 'Ghana Music Awards Announces 2026 Nominees: Black Sherif Leads Pack', source: 'Accra Wire', time: '16 hours ago', cover: beatStoreImg, category: 'NEWS', summary: 'Official list unveiled in Accra featuring nominations across 28 categories.' }
];

// 10 Music Video Showcase Items
const VIDEOS_10_DATA: VideoItem[] = [
  { id: 'v1', title: 'Lagos Nights (Official 4K Video)', artist: 'Lumina ft. Burna Boy', views: '2.8M views', duration: '03:42', cover: musicVideoImg, director: 'TG Omori' },
  { id: 'v2', title: 'Golden Rhythms (Live Studio Session)', artist: 'The Afrovibe Collective', views: '1.4M views', duration: '04:12', cover: trackAmapianoImg, director: 'Director K' },
  { id: 'v3', title: 'Kilimanjaro Sunset (Visualizer)', artist: 'Diamond Platnumz', views: '890K views', duration: '03:31', cover: heroFeaturedImg, director: 'Director Kenny' },
  { id: 'v4', title: 'Ohemaa (Official 4K Video)', artist: 'King Promise ft. Olamide', views: '3.1M views', duration: '03:40', cover: beatStoreImg, director: 'Yaw Skyface' },
  { id: 'v5', title: 'Abuja Skyline (Directed by TG Omori)', artist: 'Rema ft. Shallipopi', views: '4.6M views', duration: '02:49', cover: musicVideoImg, director: 'TG Omori' },
  { id: 'v6', title: 'Johannesburg Midnight (Dance Video)', artist: 'Focalistic & Uncle Waffles', views: '1.9M views', duration: '05:04', cover: trackAmapianoImg, director: 'Ofentse Mwase' },
  { id: 'v7', title: 'Resonance & Heritage (Acoustic Performance)', artist: 'Nneka Obi', views: '640K views', duration: '03:52', cover: vocalistImg, director: 'Clarence Peters' },
  { id: 'v8', title: 'Sensational (Afro R&B Dance Video)', artist: 'Ayra Starr', views: '5.2M views', duration: '03:22', cover: heroFeaturedImg, director: 'Meji Alabi' },
  { id: 'v9', title: 'Kpa Kpa Kpa (Street Video)', artist: 'Zlatan ft. Seyi Vibez', views: '1.1M views', duration: '03:02', cover: beatStoreImg, director: 'Naya Effectz' },
  { id: 'v10', title: 'Calabar Carnival Live Broadcast', artist: 'Flavour of Africa', views: '2.0M views', duration: '04:15', cover: musicVideoImg, director: 'Clarence Peters' }
];

// 20 Producer Beats Dataset with Dual Currency
const BEATS_20_DATA: BeatItem[] = [
  { id: 'b1', title: 'Lekki Midnight Cruise', producer: 'Mr Sounds on the beat', genre: 'Afrobeats', bpm: 104, key: 'F# Minor', cover: beatStoreImg },
  { id: 'b2', title: 'Soweto Log Drum Fever', producer: 'Kabza Keys', genre: 'Amapiano', bpm: 113, key: 'C Minor', cover: trackAmapianoImg },
  { id: 'b3', title: 'Ogene Drill Anthem', producer: 'P-Ray on the beat', genre: 'Drill', bpm: 140, key: 'E Minor', cover: heroFeaturedImg },
  { id: 'b4', title: 'Kumasi Royal Palm', producer: 'Killbeatz Audio', genre: 'Highlife', bpm: 98, key: 'D Major', cover: vocalistImg },
  { id: 'b5', title: 'Kingston to Lagos', producer: 'Mr Sounds on the beat', genre: 'Afro-Fusion', bpm: 96, key: 'F Major', cover: musicVideoImg },
  { id: 'b6', title: 'Banana Island Afro-House', producer: 'Masterkraft Boy', genre: 'Afrobeats', bpm: 122, key: 'A Minor', cover: beatStoreImg },
  { id: 'b7', title: 'Jozi Golden Sunset', producer: 'Kelvin Momo Protégé', genre: 'Amapiano', bpm: 112, key: 'Eb Minor', cover: trackAmapianoImg },
  { id: 'b8', title: 'Enugu Street Drill', producer: 'P-Ray on the beat', genre: 'Drill', bpm: 142, key: 'G Minor', cover: heroFeaturedImg },
  { id: 'b9', title: 'Highlife Heritage Palmwine', producer: 'Masterkraft Boy', genre: 'Highlife', bpm: 94, key: 'C Major', cover: vocalistImg },
  { id: 'b10', title: 'Safari Sunrise Afrobeats', producer: 'Mr Sounds on the beat', genre: 'Afrobeats', bpm: 102, key: 'D Minor', cover: musicVideoImg },
  { id: 'b11', title: 'Durban Heavy Bass Gqom', producer: 'Major League Protégé', genre: 'Amapiano', bpm: 115, key: 'F Minor', cover: trackAmapianoImg },
  { id: 'b12', title: 'London to Ikeja Drill', producer: 'P-Ray on the beat', genre: 'Drill', bpm: 139, key: 'C# Minor', cover: beatStoreImg },
  { id: 'b13', title: 'Accra Sunset Highlife', producer: 'Killbeatz Audio', genre: 'Highlife', bpm: 100, key: 'G Major', cover: vocalistImg },
  { id: 'b14', title: 'Calabar Love Story', producer: 'Mr Sounds on the beat', genre: 'Afro-Fusion', bpm: 95, key: 'Ab Major', cover: heroFeaturedImg },
  { id: 'b15', title: 'Cape Town Sunset Beach', producer: 'Major League Protégé', genre: 'Amapiano', bpm: 112, key: 'D Minor', cover: trackAmapianoImg },
  { id: 'b16', title: 'Mainland Heavy Artillery', producer: 'P-Ray on the beat', genre: 'Drill', bpm: 138, key: 'G# Minor', cover: musicVideoImg },
  { id: 'b17', title: 'Asaba Nollywood Nostalgia', producer: 'Masterkraft Boy', genre: 'Highlife', bpm: 92, key: 'E Major', cover: beatStoreImg },
  { id: 'b18', title: 'Ibiza to Dakar', producer: 'Mr Sounds on the beat', genre: 'Afro-Fusion', bpm: 118, key: 'B Minor', cover: heroFeaturedImg },
  { id: 'b19', title: 'Pretoria Metro Station', producer: 'DBN Gogo Audio', genre: 'Amapiano', bpm: 113, key: 'A Major', cover: trackAmapianoImg },
  { id: 'b20', title: 'Zion Afro-Gospel Wave', producer: 'Cobhams Audio', genre: 'Afrobeats', bpm: 105, key: 'F Major', cover: vocalistImg }
];

export default function App() {
  const [currentView, setCurrentView] = useState<'feed' | 'beat-store' | 'detail'>('feed');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPostIndex, setSelectedPostIndex] = useState(0);
  const [selectedBeatGenre, setSelectedBeatGenre] = useState('All');
  const [beatSearchQuery, setBeatSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dynamic Ingested State with localStorage persistence
  const [postsList, setPostsList] = useState<PostItem[]>(() => {
    try {
      const saved = localStorage.getItem('afropulse_posts');
      return saved ? JSON.parse(saved) : POSTS_20_DATA;
    } catch {
      return POSTS_20_DATA;
    }
  });

  const [beatsList, setBeatsList] = useState<BeatItem[]>(() => {
    try {
      const saved = localStorage.getItem('afropulse_beats');
      return saved ? JSON.parse(saved) : BEATS_20_DATA;
    } catch {
      return BEATS_20_DATA;
    }
  });

  // Admin Security, Auth & Role State
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [adminAuthUser, setAdminAuthUser] = useState<{ email: string; role: 'owner' | 'staff'; name: string } | null>(null);
  const [adminLoginForm, setAdminLoginForm] = useState({ email: 'admin@afropulse.com', password: 'HDsounzMaster2026!' });
  const [adminLoginError, setAdminLoginError] = useState('');
  const [adminTab, setAdminTab] = useState<'publisher' | 'hero' | 'transactions' | 'contentManager' | 'team' | 'security'>('publisher');
  const [publisherSubTab, setPublisherSubTab] = useState<'beats' | 'music' | 'news'>('beats');

  // Top #1 Trending Hero Song State (managed by Admin Hero Manager)
  const [heroSong, setHeroSong] = useState<{
    title: string;
    artist: string;
    artwork: string;
    artworkFileName?: string;
    audioUrl?: string;
    audioFileName?: string;
    postId: number;
    streams: string;
  }>(() => {
    try {
      const saved = localStorage.getItem('afropulse_hero_song');
      return saved ? JSON.parse(saved) : {
        title: 'Lagos Midnight Groove',
        artist: 'Kwamz ft. Tiwa Savage (Produced by Sarz & P.Priime)',
        artwork: heroFeaturedImg,
        artworkFileName: '',
        audioUrl: '',
        audioFileName: '',
        postId: 0,
        streams: '2.4M Streams'
      };
    } catch {
      return {
        title: 'Lagos Midnight Groove',
        artist: 'Kwamz ft. Tiwa Savage (Produced by Sarz & P.Priime)',
        artwork: heroFeaturedImg,
        artworkFileName: '',
        audioUrl: '',
        audioFileName: '',
        postId: 0,
        streams: '2.4M Streams'
      };
    }
  });

  // Hero Manager Form State inside Admin Panel
  const [heroForm, setHeroForm] = useState({
    titleArtist: 'Lagos Midnight Groove - Kwamz ft. Tiwa Savage',
    artwork: heroFeaturedImg,
    artworkFileName: '',
    audioUrl: '',
    audioFileName: '',
    postId: 0,
    streams: '2.4M Streams'
  });

  // Content Manager State
  const [contentFilter, setContentFilter] = useState<'all' | 'music' | 'beats' | 'news'>('all');

  // Public Upload Music Hub State
  const [selectedUploadPkg, setSelectedUploadPkg] = useState<{ id: number; name: string; priceNgn: string; priceUsd: string }>({
    id: 1,
    name: 'Single Song Drop',
    priceNgn: '₦10,000',
    priceUsd: '$15.00'
  });
  const [uploadStep, setUploadStep] = useState<'packages' | 'intake' | 'success'>('packages');
  const [uploadIntakeForm, setUploadIntakeForm] = useState({
    title: '',
    artist: '',
    category: 'music' as 'music' | 'video',
    genreTag: 'AFROBEATS',
    cover: '',
    coverFileName: '',
    audioUrl: '',
    audioFileName: '',
    email: '',
    notes: ''
  });
  const [uploadRefId, setUploadRefId] = useState('AFRO-PAY-8821');

  // Master Security Credentials State
  const [masterPassword, setMasterPassword] = useState('HDsounzMaster2026!');
  const [securityForm, setSecurityForm] = useState({ currentPass: '', newPass: '', confirmPass: '' });

  // Team & Staff Accounts State
  const [staffAccounts, setStaffAccounts] = useState<Array<{ id: string; name: string; email: string; password: string; role: string; created: string }>>([
    { id: 'staff-1', name: 'Chinedu Eze', email: 'editor@afropulse.com', password: 'EditorPass2026!', role: 'Content Editor Only', created: 'Oct 01, 2026' },
    { id: 'staff-2', name: 'Zainab Bello', email: 'media@afropulse.com', password: 'MediaPass2026!', role: 'Content Editor Only', created: 'Oct 04, 2026' }
  ]);
  const [newStaffForm, setNewStaffForm] = useState({ name: '', email: '', password: '', role: 'Content Editor Only' });

  // Transaction History State
  const [transactionsList, setTransactionsList] = useState<Array<{
    id: string;
    date: string;
    customer: string;
    email: string;
    item: string;
    amountNgn: string;
    amountUsd: string;
    gateway: 'Paystack' | 'PayPal';
    status: string;
  }>>([
    { id: 'TXN-9841', date: '2026-10-09 14:22', customer: 'David Adeleke', email: 'david.a@gmail.com', item: 'Olamide Type Beat - WAV Lease', amountNgn: '₦42,000', amountUsd: '$47.50', gateway: 'Paystack', status: 'VERIFIED SUCCESS' },
    { id: 'TXN-9840', date: '2026-10-09 11:05', customer: 'Marcus Sterling', email: 'm.sterling@ukbeats.co', item: 'Lagos Mainland Vibe (Exclusive Rights)', amountNgn: '₦120,000', amountUsd: '$135.00', gateway: 'PayPal', status: 'VERIFIED SUCCESS' },
    { id: 'TXN-9839', date: '2026-10-08 18:40', customer: 'Tiwa Coker', email: 'tiwacoker@afrobeat.ng', item: 'Highlife Groove Stems & Trackout', amountNgn: '₦25,000', amountUsd: '$28.50', gateway: 'Paystack', status: 'VERIFIED SUCCESS' },
    { id: 'TXN-9838', date: '2026-10-08 14:15', customer: 'Kofi Mensah', email: 'kofi.m@accragroove.gh', item: 'Amapiano Log Drums Masterclass Pack', amountNgn: '₦35,000', amountUsd: '$39.50', gateway: 'PayPal', status: 'VERIFIED SUCCESS' },
    { id: 'TXN-9837', date: '2026-10-07 09:30', customer: 'Ayra Production Lab', email: 'contact@ayralab.com', item: 'Afro-Fusion Drill Trackout & WAV', amountNgn: '₦50,000', amountUsd: '$56.50', gateway: 'Paystack', status: 'VERIFIED SUCCESS' }
  ]);

  // Tab 1: Beat Store Form State (with Device Pickers)
  const [beatForm, setBeatForm] = useState({
    title: '',
    genre: 'Afrobeats',
    bpm: '112',
    key: 'C Minor',
    cover: '',
    artworkFileName: '',
    previewUrl: '',
    previewFileName: '',
    wavDownloadUrl: '',
    wavFileName: '',
    priceNgn: '₦25,000',
    priceUsd: '$28.50'
  });

  // Tab 2: Music & Video Release Form State (with Device Pickers)
  const [musicForm, setMusicForm] = useState({
    title: '',
    artist: '',
    category: 'music' as 'music' | 'video',
    genreTag: 'AFROBEATS',
    cover: '',
    artworkFileName: '',
    audioFileName: '',
    embedUrl: '',
    mp3DownloadUrl: '',
    body: ''
  });

  // Tab 3: News & Entertainment Gossip Form State (with Device Pickers)
  const [newsForm, setNewsForm] = useState({
    headline: '',
    cover: '',
    coverFileName: '',
    gossipTag: 'NEWS',
    storyText: ''
  });

  // Dynamic Floating Audio Player
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerTrack, setPlayerTrack] = useState<{ title: string; artist: string; cover: string }>({
    title: POSTS_20_DATA[0].title,
    artist: POSTS_20_DATA[0].subtitle,
    cover: POSTS_20_DATA[0].cover
  });

  // Modals
  const [spotifyModalOpen, setSpotifyModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [vipModalOpen, setVipModalOpen] = useState(false);
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const [selectedBeatIndex, setSelectedBeatIndex] = useState(0);
  const [paymentGateway, setPaymentGateway] = useState<'paystack' | 'paypal'>('paystack');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [legalModal, setLegalModal] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handlePlayMusic = (title: string, artist: string, cover: string) => {
    setPlayerTrack({ title, artist, cover });
    setIsPlayerVisible(true);
    setIsPlaying(true);
    showToast(`Now Playing: ${title}`);
  };

  const openPostDetail = (index: number) => {
    setSelectedPostIndex(index);
    setCurrentView('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openCart = (index: number) => {
    setSelectedBeatIndex(index);
    setPaymentSuccess(false);
    setCartModalOpen(true);
  };

  const handleGuestCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      showToast('Payment verified! Audio files unlocked.');
    }, 1400);
  };

  const handleSharePost = async (post: typeof POSTS_20_DATA[0]) => {
    const shareUrl = window.location.href;
    const shareTitle = `${post.title} - Afropulse`;
    const shareText = `Check out "${post.title}" by ${post.subtitle} on Afropulse - The Leader in African Entertainment.`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        showToast('Shared successfully!');
        return;
      } catch (err: unknown) {
        if ((err as Error)?.name === 'AbortError') {
          return;
        }
      }
    }

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        showToast('Link copied to clipboard! Ready to share.');
      } else {
        const tempInput = document.createElement('input');
        tempInput.value = shareUrl;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        showToast('Link copied to clipboard!');
      }
    } catch {
      showToast('Link copied to clipboard!');
    }
  };

  // ======================== ADMIN PANEL ACTIONS & SUPABASE INTEGRATION ========================
  // INSTRUCTION FOR FUTURE SUPABASE / BACKEND INTEGRATION:
  // When deploying to production or Vercel, replace localStorage sync with Supabase client calls:
  // 1. Install @supabase/supabase-js
  // 2. Initialize: const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY)
  // 3. In handlePublishBeat: await supabase.from('beats').insert([newBeat])
  // 4. In handlePublishMusic: await supabase.from('posts').insert([newPost])
  // 5. In handlePublishNews: await supabase.from('posts').insert([newPost])
  // 6. Realtime subscription: supabase.channel('afropulse_live').on('postgres_changes', ...).subscribe()

  const handlePublishBeat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!beatForm.title.trim()) {
      showToast('Please enter a beat title!');
      return;
    }

    const newBeat: BeatItem = {
      id: 'beat-' + Date.now(),
      title: beatForm.title.trim(),
      producer: 'Mr Sounds on the beat',
      genre: beatForm.genre,
      bpm: parseInt(beatForm.bpm) || 112,
      key: beatForm.key || 'C Minor',
      cover: beatForm.cover.trim() || beatStoreImg
    };

    const updatedBeats = [newBeat, ...beatsList];
    setBeatsList(updatedBeats);
    try {
      localStorage.setItem('afropulse_beats', JSON.stringify(updatedBeats));
    } catch (err) {
      console.warn('LocalStorage beat save warning:', err);
    }

    setBeatForm({
      title: '',
      genre: 'Afrobeats',
      bpm: '112',
      key: 'C Minor',
      cover: '',
      artworkFileName: '',
      previewUrl: '',
      previewFileName: '',
      wavDownloadUrl: '',
      wavFileName: '',
      priceNgn: '₦25,000',
      priceUsd: '$28.50'
    });
    setAdminModalOpen(false);
    showToast(`Published beat "${newBeat.title}" to Beat Store!`);
    setCurrentView('beat-store');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePublishMusic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!musicForm.title.trim() || !musicForm.artist.trim()) {
      showToast('Please provide track title and artist name!');
      return;
    }

    const isVideo = musicForm.category === 'video';
    const newPost: PostItem = {
      id: 'post-' + Date.now(),
      type: isVideo ? 'video' : 'music',
      title: musicForm.title.trim(),
      subtitle: musicForm.artist.trim(),
      category: musicForm.genreTag.toUpperCase(),
      cover: musicForm.cover.trim() || (isVideo ? musicVideoImg : heroFeaturedImg),
      date: 'Just now',
      duration: isVideo ? '03:45' : '03:30',
      downloads: '1.2K',
      views: '5.8K',
      body: musicForm.body.trim() || `Brand new ${isVideo ? 'official video' : 'single drop'} by ${musicForm.artist.trim()} exclusively premiered on Afropulse. Available on all streaming platforms.`
    };

    const updatedPosts = [newPost, ...postsList];
    setPostsList(updatedPosts);
    try {
      localStorage.setItem('afropulse_posts', JSON.stringify(updatedPosts));
    } catch (err) {
      console.warn('LocalStorage post save warning:', err);
    }

    setMusicForm({
      title: '',
      artist: '',
      category: 'music',
      genreTag: 'AFROBEATS',
      cover: '',
      artworkFileName: '',
      audioFileName: '',
      embedUrl: '',
      mp3DownloadUrl: '',
      body: ''
    });
    setAdminModalOpen(false);
    showToast(`Published ${isVideo ? 'video' : 'music drop'} "${newPost.title}" to feed!`);
    setCurrentView('feed');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePublishNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsForm.headline.trim()) {
      showToast('Please enter an article headline!');
      return;
    }

    const newPost: PostItem = {
      id: 'news-' + Date.now(),
      type: 'news',
      title: newsForm.headline.trim(),
      subtitle: 'Afropulse Editorial Staff · Entertainment Desk',
      category: newsForm.gossipTag.toUpperCase(),
      cover: newsForm.cover.trim() || gossipAwardsImg,
      date: 'Just now',
      body: newsForm.storyText.trim() || 'Breaking entertainment update reported by Afropulse correspondents covering African music, pop culture, and Nollywood.'
    };

    const updatedPosts = [newPost, ...postsList];
    setPostsList(updatedPosts);
    try {
      localStorage.setItem('afropulse_posts', JSON.stringify(updatedPosts));
    } catch (err) {
      console.warn('LocalStorage news save warning:', err);
    }

    setNewsForm({
      headline: '',
      cover: '',
      coverFileName: '',
      gossipTag: 'NEWS',
      storyText: ''
    });
    setAdminModalOpen(false);
    showToast(`Published article "${newPost.title}" to news feed!`);
    setCurrentView('feed');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Admin Login Handler with Strict Role Engine
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminLoginError('');
    const email = adminLoginForm.email.trim().toLowerCase();
    const password = adminLoginForm.password;

    // Check Super-Admin (Owner)
    if (email === 'admin@afropulse.com' && password === masterPassword) {
      setAdminAuthUser({
        email: 'admin@afropulse.com',
        role: 'owner',
        name: 'Super-Admin (Owner)'
      });
      setAdminTab('publisher');
      showToast('Super-Admin logged in: All control tabs unlocked.');
      return;
    }

    // Check Staff / Editor Accounts
    const matchedStaff = staffAccounts.find(
      (s) => s.email.toLowerCase() === email && s.password === password
    );

    if (matchedStaff) {
      setAdminAuthUser({
        email: matchedStaff.email,
        role: 'staff',
        name: matchedStaff.name
      });
      setAdminTab('publisher');
      showToast(`Logged in as Staff Editor (${matchedStaff.name}). Content Publisher tab active.`);
      return;
    }

    setAdminLoginError('Access Denied. Invalid email address or administrative credentials.');
  };

  const handleAdminLogout = () => {
    setAdminAuthUser(null);
    setAdminLoginForm({ email: 'admin@afropulse.com', password: masterPassword });
    setAdminLoginError('');
    showToast('Admin logged out successfully.');
  };

  // Password Manager Handler (Super-Admin Only)
  const handleUpdateMasterPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (securityForm.currentPass !== masterPassword) {
      showToast('Error: Current master password does not match.');
      return;
    }
    if (securityForm.newPass.length < 8) {
      showToast('Error: New password must be at least 8 characters long.');
      return;
    }
    if (securityForm.newPass !== securityForm.confirmPass) {
      showToast('Error: New password and confirmation do not match.');
      return;
    }
    setMasterPassword(securityForm.newPass);
    setSecurityForm({ currentPass: '', newPass: '', confirmPass: '' });
    showToast('Master credentials successfully updated!');
  };

  // Team Management: Add Worker
  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffForm.name.trim() || !newStaffForm.email.trim() || !newStaffForm.password.trim()) {
      showToast('Please fill all staff fields.');
      return;
    }
    const newStaff = {
      id: 'staff-' + Date.now(),
      name: newStaffForm.name.trim(),
      email: newStaffForm.email.trim(),
      password: newStaffForm.password,
      role: 'Content Editor Only',
      created: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    };
    setStaffAccounts([...staffAccounts, newStaff]);
    setNewStaffForm({ name: '', email: '', password: '', role: 'Content Editor Only' });
    showToast(`Staff member "${newStaff.name}" created successfully!`);
  };

  // Team Management: Revoke Access
  const handleDeleteStaff = (id: string, name: string) => {
    setStaffAccounts(staffAccounts.filter((s) => s.id !== id));
    showToast(`Revoked access for staff member: ${name}`);
  };

  // Hero Manager Form Submission Handler
  const handleHeroManagerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroForm.titleArtist.trim()) {
      showToast('Please provide Track Title and Artist Name');
      return;
    }
    let parsedTitle = heroForm.titleArtist.trim();
    let parsedArtist = 'Featured Artist';
    if (parsedTitle.includes('-')) {
      const parts = parsedTitle.split('-');
      parsedTitle = parts[0].trim();
      parsedArtist = parts.slice(1).join('-').trim();
    }
    const newHero = {
      title: parsedTitle,
      artist: parsedArtist,
      artwork: heroForm.artwork || heroFeaturedImg,
      artworkFileName: heroForm.artworkFileName,
      audioUrl: heroForm.audioUrl,
      audioFileName: heroForm.audioFileName,
      postId: heroForm.postId,
      streams: heroForm.streams || '2.4M Streams'
    };
    setHeroSong(newHero);
    try {
      localStorage.setItem('afropulse_hero_song', JSON.stringify(newHero));
    } catch (err) {
      console.warn(err);
    }
    showToast(`Set "${parsedTitle}" as #1 Trending Song on Homepage!`);
    setAdminModalOpen(false);
  };

  // Feature Post as Top #1 Trending Hero Song
  const featurePostAsHero = (post: PostItem) => {
    const postIdx = postsList.findIndex((p) => p.id === post.id);
    const newHero = {
      title: post.title,
      artist: post.subtitle || 'Afropulse Spotlight',
      artwork: post.cover,
      artworkFileName: '',
      audioUrl: '',
      audioFileName: '',
      postId: postIdx >= 0 ? postIdx : 0,
      streams: '3.1M Streams'
    };
    setHeroSong(newHero);
    setHeroForm({
      titleArtist: `${post.title} - ${post.subtitle || 'Afropulse Spotlight'}`,
      artwork: post.cover,
      artworkFileName: '',
      audioUrl: '',
      audioFileName: '',
      postId: postIdx >= 0 ? postIdx : 0,
      streams: '3.1M Streams'
    });
    try {
      localStorage.setItem('afropulse_hero_song', JSON.stringify(newHero));
    } catch (err) {
      console.warn(err);
    }
    showToast(`Set "${post.title}" as #1 Trending Song on Homepage!`);
    setAdminTab('hero');
  };

  const handleDeletePost = (id: string) => {
    const updated = postsList.filter((p) => p.id !== id);
    setPostsList(updated);
    try {
      localStorage.setItem('afropulse_posts', JSON.stringify(updated));
    } catch (err) {
      console.warn(err);
    }
    showToast(`Deleted post item from catalog.`);
  };

  const handleDeleteBeat = (id: string) => {
    const updated = beatsList.filter((b) => b.id !== id);
    setBeatsList(updated);
    try {
      localStorage.setItem('afropulse_beats', JSON.stringify(updated));
    } catch (err) {
      console.warn(err);
    }
    showToast(`Deleted beat item from Beat Store.`);
  };

  // Public Upload Music Hub Submission Handler
  const handleUploadHubSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadIntakeForm.title.trim() || !uploadIntakeForm.artist.trim()) {
      showToast('Please provide Track Title and Artist Name');
      return;
    }

    const newPost: PostItem = {
      id: 'post-' + Date.now(),
      type: uploadIntakeForm.category,
      title: uploadIntakeForm.title.trim(),
      subtitle: uploadIntakeForm.artist.trim(),
      category: uploadIntakeForm.genreTag,
      cover: uploadIntakeForm.cover || vocalistImg,
      date: 'Just now',
      duration: '03:30',
      downloads: '1.0K',
      views: '3.2K',
      body: uploadIntakeForm.notes.trim() || `Official drop by ${uploadIntakeForm.artist} submitted via Afropulse Distribution Hub.`
    };

    const updatedPosts = [newPost, ...postsList];
    setPostsList(updatedPosts);
    try {
      localStorage.setItem('afropulse_posts', JSON.stringify(updatedPosts));
    } catch (err) {
      console.warn(err);
    }

    const generatedRef = 'AFRO-PAY-' + Math.floor(1000 + Math.random() * 9000);
    setUploadRefId(generatedRef);

    const newTxn = {
      id: generatedRef,
      date: '2026-10-09 15:30',
      customer: uploadIntakeForm.artist.trim(),
      email: uploadIntakeForm.email.trim(),
      item: `${selectedUploadPkg.name} - "${uploadIntakeForm.title.trim()}"`,
      amountNgn: selectedUploadPkg.priceNgn,
      amountUsd: selectedUploadPkg.priceUsd,
      gateway: 'Paystack' as const,
      status: 'VERIFIED SUCCESS'
    };

    setTransactionsList([newTxn, ...transactionsList]);
    setUploadStep('success');
    showToast(`"${newPost.title}" ingested and published to live feed!`);
  };

  const filteredPosts20 = postsList.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return p.title.toLowerCase().includes(q) || p.subtitle.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
  });

  const filteredBeats20 = beatsList.filter((b) => {
    const matchesGenre = selectedBeatGenre === 'All' || b.genre === selectedBeatGenre;
    const q = beatSearchQuery.toLowerCase().trim();
    const matchesQuery = !q || b.title.toLowerCase().includes(q) || b.producer.toLowerCase().includes(q) || b.bpm.toString().includes(q) || b.key.toLowerCase().includes(q);
    return matchesGenre && matchesQuery;
  });

  const selectedPost = postsList[selectedPostIndex] || postsList[0];
  const related4Posts = postsList.filter((_, idx) => idx !== selectedPostIndex).slice(0, 4);

  return (
    <div className="min-h-screen bg-[#0b0d10] text-[#f3f4f6] flex flex-col overflow-x-hidden selection:bg-orange-500/30 selection:text-orange-200">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2.5 bg-gradient-to-r from-orange-600 to-amber-600 text-white font-semibold px-4 py-2.5 rounded-xl shadow-2xl border border-orange-400/40 text-xs transition-all animate-bounce">
          <CheckCircle className="w-4 h-4 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ======================== 1. REFINED HEADER & CATEGORY PILL BAR ======================== */}
      <header className="sticky top-0 z-40 bg-[#0b0d10]/95 backdrop-blur-md border-b border-stone-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 space-y-3">
          
          {/* Top Row: Brand Logo ("Afropulse") + Functional Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Logo */}
            <button
              onClick={() => {
                setCurrentView('feed');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2.5 group text-left shrink-0"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-400 flex items-center justify-center text-stone-950 font-black shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
                <Flame className="w-5 h-5 text-stone-950 fill-stone-950" />
              </div>
              <div>
                <span className="font-display font-black text-2xl sm:text-3xl tracking-tight text-white group-hover:text-orange-400 transition-colors">
                  Afropulse
                </span>
                <span className="block text-[10px] tracking-wider uppercase text-orange-500 font-bold -mt-1">
                  The Leader in African Entertainment
                </span>
              </div>
            </button>

            {/* Functional Search Bar */}
            <div className="relative w-full sm:max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search music, news, gossip, videos, beats..."
                className="w-full bg-[#12151b] text-white text-xs rounded-xl pl-9 pr-4 py-2.5 border border-stone-800 focus:outline-none focus:border-orange-500 placeholder:text-stone-500 transition-colors"
              />
            </div>
          </div>

          {/* Service & Category Block (Hero Header Alignment: Centered, evenly distributed pills) */}
          {/* Buttons: [Music] [Videos] [News] [News / Entertainment Gossip] [Playlist Your Music] [Upload Music] [Beat Store] [VIP Club] */}
          <div className="flex flex-wrap gap-2 md:gap-3 justify-center items-center w-full px-2 pb-1 pt-1 text-sm font-semibold">
            <button
              onClick={() => {
                setCurrentView('feed');
                setTimeout(() => {
                  document.getElementById('main-feed-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="flex-auto sm:flex-none px-4 py-2 text-sm font-semibold rounded-lg bg-[#141820] hover:bg-orange-500/20 text-stone-300 hover:text-orange-400 border border-stone-800 transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Headphones className="w-4 h-4 text-orange-400 shrink-0" />
              <span>Music</span>
            </button>

            <button
              onClick={() => {
                setCurrentView('feed');
                setTimeout(() => {
                  document.getElementById('music-videos-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="flex-auto sm:flex-none px-4 py-2 text-sm font-semibold rounded-lg bg-[#141820] hover:bg-orange-500/20 text-stone-300 hover:text-orange-400 border border-stone-800 transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Video className="w-4 h-4 text-orange-400 shrink-0" />
              <span>Videos</span>
            </button>

            <button
              onClick={() => {
                setCurrentView('feed');
                setTimeout(() => {
                  document.getElementById('news-gossip-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="flex-auto sm:flex-none px-4 py-2 text-sm font-semibold rounded-lg bg-[#141820] hover:bg-orange-500/20 text-stone-300 hover:text-orange-400 border border-stone-800 transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Newspaper className="w-4 h-4 text-amber-400 shrink-0" />
              <span>News</span>
            </button>

            <button
              onClick={() => {
                setCurrentView('feed');
                setTimeout(() => {
                  document.getElementById('news-gossip-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="flex-auto sm:flex-none px-4 py-2 text-sm font-semibold rounded-lg bg-[#141820] hover:bg-orange-500/20 text-stone-300 hover:text-orange-400 border border-stone-800 transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Flame className="w-4 h-4 text-rose-400 shrink-0" />
              <span>News / Entertainment Gossip</span>
            </button>

            <button
              onClick={() => setSpotifyModalOpen(true)}
              className="flex-auto sm:flex-none px-4 py-2 text-sm font-semibold rounded-lg bg-green-950/40 hover:bg-green-900/50 text-green-400 border border-green-500/30 transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Radio className="w-4 h-4 text-green-400 shrink-0" />
              <span>Playlist Your Music</span>
            </button>

            <button
              onClick={() => setUploadModalOpen(true)}
              className="flex-auto sm:flex-none px-4 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-stone-950 font-black hover:opacity-95 shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4 shrink-0 text-stone-950" />
              <span>Upload Music</span>
            </button>

            <button
              onClick={() => {
                setCurrentView('beat-store');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex-auto sm:flex-none px-4 py-2 text-sm font-semibold rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Disc className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Beat Store</span>
              <span className="text-[10px] bg-amber-500 text-stone-950 px-1.5 py-0.5 rounded font-black font-mono">
                ₦25K
              </span>
            </button>

            <button
              onClick={() => setVipModalOpen(true)}
              className="flex-auto sm:flex-none px-4 py-2 text-sm font-semibold rounded-lg bg-purple-950/40 hover:bg-purple-900/50 text-purple-300 border border-purple-500/30 transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Crown className="w-4 h-4 text-purple-400 shrink-0" />
              <span>VIP Club</span>
            </button>
          </div>

        </div>
      </header>

      {/* ======================== MAIN PORTAL VIEW ======================== */}
      {currentView === 'feed' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 space-y-10 overflow-x-hidden flex-1">
          
          {/* ======================== 2. HERO FLOW (TOP OF HOMEPAGE) ======================== */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* Top #1 Trending Song Showcase */}
            <div className="lg:col-span-7 bg-gradient-to-br from-[#161922] via-[#111319] to-[#0c0e12] border border-amber-500/40 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row items-center gap-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

              {/* Artwork */}
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-xl overflow-hidden shrink-0 border-2 border-amber-500/50 shadow-lg group">
                <img
                  src={heroSong.artwork}
                  alt={heroSong.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  onClick={() => handlePlayMusic(heroSong.title, heroSong.artist, heroSong.artwork)}
                  className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Play Trending Track Preview"
                >
                  <div className="w-10 h-10 rounded-full bg-orange-500 text-stone-950 flex items-center justify-center font-bold shadow-lg">
                    <Play className="w-5 h-5 fill-stone-950 ml-0.5" />
                  </div>
                </button>
              </div>

              {/* Details & Actions */}
              <div className="space-y-2.5 text-center sm:text-left min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-black text-[10px] uppercase px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                    <Flame className="w-3 h-3 fill-stone-950" />
                    <span>TOP #1 TRENDING SONG</span>
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400 font-bold">{heroSong.streams}</span>
                </div>

                <div>
                  <h2 className="font-display text-xl sm:text-2xl font-black text-white tracking-tight truncate">
                    {heroSong.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-300 font-medium truncate">
                    {heroSong.artist}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-1">
                  <button
                    onClick={() => handlePlayMusic(heroSong.title, heroSong.artist, heroSong.artwork)}
                    className="px-4 py-2 text-xs font-black uppercase tracking-wider text-stone-950 bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-400 rounded-xl shadow-md active:scale-95 transition-all flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-stone-950" />
                    <span>Play Preview</span>
                  </button>

                  <button
                    onClick={() => openPostDetail(heroSong.postId ?? 0)}
                    className="px-3.5 py-2 text-xs font-bold text-amber-300 hover:text-white bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl transition-all flex items-center gap-1"
                  >
                    <span>View Full Song Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Compact Promotional Banner */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#0c1a14] via-[#0d2218] to-[#09140f] border border-green-500/30 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-between relative overflow-hidden">
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-green-400 text-xs font-mono font-bold uppercase tracking-wider">
                  <Radio className="w-4 h-4 text-green-400" />
                  <span>Official Editorial Pitching</span>
                </div>
                
                <h3 className="font-display text-lg sm:text-xl font-black text-white leading-snug">
                  Playlist Your Music on Spotify - Get Pitched Today!
                </h3>

                <p className="text-xs text-stone-300 leading-relaxed">
                  Fast-track your new Afrobeat releases into Spotify curated playlists, Apple Music editorial charts, and radio broadcast syndication.
                </p>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <span className="text-[11px] font-mono text-green-300">Guaranteed Review in 48h</span>
                <button
                  onClick={() => setSpotifyModalOpen(true)}
                  className="px-4 py-2 text-xs font-black uppercase tracking-wider text-stone-950 bg-gradient-to-r from-green-400 to-emerald-400 hover:from-green-300 rounded-xl shadow-md active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <span>Learn More</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </section>

          {/* ======================== 3. MAIN CONTENT FEED (TOP UPDATES WITH SMART CARD LOGIC) ======================== */}
          <section id="main-feed-section" className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-500" />
                <h2 className="font-display text-lg sm:text-xl font-bold tracking-tight text-white uppercase">
                  Top Updates
                </h2>
              </div>
              <span className="text-xs font-mono text-stone-400">
                Fresh Releases
              </span>
            </div>

            {/* Compact, high-density listing items (Jaguda / NotJustOk style) with SMART CARD LOGIC */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredPosts20.map((post, index) => (
                <div
                  key={post.id}
                  className="group bg-[#12151b] hover:bg-[#181c24] border border-stone-800/80 hover:border-orange-500/40 rounded-xl p-3 flex items-center justify-between gap-3.5 transition-all duration-200"
                >
                  {/* Left side: Small, crisp square artwork thumbnail (80x80px) */}
                  <div
                    onClick={() => openPostDetail(index)}
                    className="flex items-center gap-3.5 min-w-0 flex-1 cursor-pointer"
                  >
                    <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-stone-900 border border-stone-800">
                      <img
                        src={post.cover}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Video duration tag overlay for video posts */}
                      {post.type === 'video' && post.duration && (
                        <div className="absolute bottom-1 right-1 bg-black/80 text-white font-mono text-[9px] px-1 rounded">
                          {post.duration}
                        </div>
                      )}
                    </div>

                    {/* Right side: Song/Article Title, Subtitle, Category badge */}
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded font-mono ${
                          post.type === 'music'
                            ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                            : post.type === 'video'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}>
                          [{post.category}]
                        </span>
                        <span className="text-[10px] text-stone-400 font-medium">{post.date}</span>
                      </div>

                      <h3 className="font-display font-bold text-xs sm:text-sm text-white group-hover:text-orange-400 transition-colors truncate">
                        {post.title}
                      </h3>
                      <p className="text-xs text-stone-400 truncate">
                        {post.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* SMART CARD ACTION BUTTON LOGIC BASED ON CONTENT TYPE */}
                  <div className="shrink-0">
                    {/* MUSIC POST: [▶ Play Preview] */}
                    {post.type === 'music' && (
                      <button
                        onClick={() => handlePlayMusic(post.title, post.subtitle, post.cover)}
                        className="px-2.5 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-400 text-stone-950 font-black text-xs flex items-center gap-1 shadow-sm transition-all"
                        title="Play Preview"
                      >
                        <Play className="w-3 h-3 fill-stone-950" />
                        <span className="hidden sm:inline">Play Preview</span>
                      </button>
                    )}

                    {/* NEWS & GOSSIP POST: [📄 Read Article] (STRICTLY NO PLAY BUTTON) */}
                    {post.type === 'news' && (
                      <button
                        onClick={() => openPostDetail(index)}
                        className="px-2.5 py-1.5 rounded-lg bg-[#181c24] hover:bg-stone-700 text-stone-300 font-bold text-xs flex items-center gap-1 border border-stone-700 transition-all"
                        title="Read Article"
                      >
                        <FileText className="w-3 h-3 text-amber-400" />
                        <span className="hidden sm:inline">Read Article</span>
                      </button>
                    )}

                    {/* VIDEO POST: [🎬 Watch Video] */}
                    {post.type === 'video' && (
                      <button
                        onClick={() => openPostDetail(index)}
                        className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-all"
                        title="Watch Video"
                      >
                        <Video className="w-3 h-3" />
                        <span className="hidden sm:inline">Watch Video</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ======================== 4. CATEGORIZED HOMEPAGE BLOCKS ======================== */}
          
          {/* SECTION A: CELEBRITY NEWS & GOSSIP ITEMS (Read Article badges only) */}
          <section id="news-gossip-section" className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <Newspaper className="w-4 h-4 text-amber-400" />
                <h3 className="font-display text-lg font-bold tracking-tight text-white uppercase">
                  News / Entertainment Gossip
                </h3>
              </div>
              <span className="text-xs font-mono text-stone-400">Trending Wire</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3">
              {NEWS_10_DATA.map((news) => (
                <div
                  key={news.id}
                  onClick={() => {
                    const matchIdx = POSTS_20_DATA.findIndex((p) => p.type === 'news');
                    openPostDetail(matchIdx >= 0 ? matchIdx : 2);
                  }}
                  className="flex items-center justify-between gap-3.5 p-3 rounded-xl bg-[#12151b] hover:bg-[#181c24] border border-stone-800 cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-stone-900 border border-stone-800">
                      <img src={news.cover} alt="News" className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2 text-[10px] text-stone-400">
                        <span className="text-amber-400 font-bold">[{news.category}]</span>
                        <span>{news.time}</span>
                      </div>
                      <h4 className="font-display text-xs font-bold text-white line-clamp-2">
                        {news.title}
                      </h4>
                    </div>
                  </div>

                  {/* Strictly Read Article action (NO PLAY BUTTON) */}
                  <span className="px-2.5 py-1 rounded bg-stone-800 text-stone-300 text-[11px] font-bold border border-stone-700 shrink-0 flex items-center gap-1">
                    <FileText className="w-3 h-3 text-amber-400" />
                    <span>Read</span>
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION B: 10 MUSIC VIDEO SHOWCASE ITEMS (Watch Video badges only) */}
          <section id="music-videos-section" className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-orange-500" />
                <h3 className="font-display text-lg font-bold tracking-tight text-white uppercase">
                  Top 10 Music Videos &amp; Premieres
                </h3>
              </div>
              <span className="text-xs font-mono text-stone-400">Official 4K Broadcasts</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
              {VIDEOS_10_DATA.map((vid) => (
                <div
                  key={vid.id}
                  onClick={() => {
                    const matchIdx = POSTS_20_DATA.findIndex((p) => p.type === 'video');
                    openPostDetail(matchIdx >= 0 ? matchIdx : 3);
                  }}
                  className="group bg-[#12151b] border border-stone-800 rounded-xl overflow-hidden hover:border-orange-500/40 transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="relative aspect-video bg-stone-900 overflow-hidden">
                    <img
                      src={vid.cover}
                      alt={vid.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <div className="w-8 h-8 rounded-full bg-orange-500 text-stone-950 flex items-center justify-center font-bold">
                        <Play className="w-4 h-4 fill-stone-950 ml-0.5" />
                      </div>
                    </div>
                    <span className="absolute bottom-1 right-1 bg-black/80 text-[10px] text-stone-300 px-1 rounded font-mono">
                      {vid.duration}
                    </span>
                  </div>

                  <div className="p-2.5 space-y-1">
                    <h4 className="font-display text-xs font-bold text-white truncate group-hover:text-orange-400 transition-colors">
                      {vid.title}
                    </h4>
                    <p className="text-[11px] text-stone-400 truncate">{vid.artist}</p>
                    <div className="flex items-center justify-between text-[10px] text-stone-500 pt-1 border-t border-stone-800">
                      <span>{vid.views}</span>
                      <span className="text-blue-400 font-bold flex items-center gap-0.5">
                        <Eye className="w-2.5 h-2.5" /> Watch
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ======================== 5. BOTTOM PROMOTIONAL BANNER ======================== */}
          <section className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 rounded-2xl p-6 sm:p-8 text-stone-950 shadow-2xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center sm:text-left">
                <span className="bg-stone-950 text-orange-400 text-[11px] font-black uppercase px-2.5 py-0.5 rounded shadow">
                  AFROPULSE PRODUCER ARCHIVE
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-black text-white tracking-tight">
                  Need Premium Afrobeat Instrumentation &amp; Custom Production?
                </h3>
                <p className="text-xs sm:text-sm text-stone-200 font-medium max-w-xl">
                  License radio-ready Afrobeats, Amapiano log drums, and Highlife stems starting at ₦25,000 ($28.50 USD) with instant Paystack checkout.
                </p>
              </div>

              {/* Button strictly titled: "Buy Premium Beats" */}
              <button
                onClick={() => {
                  setCurrentView('beat-store');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="shrink-0 px-6 py-3.5 rounded-xl bg-stone-950 hover:bg-stone-900 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all"
              >
                <Disc className="w-4 h-4 text-orange-400" />
                <span>Buy Premium Beats</span>
              </button>
            </div>
          </section>

        </main>
      )}

      {/* ======================== STANDALONE BEAT STORE VIEW (/beat-store) ======================== */}
      {currentView === 'beat-store' && (
        <main className="w-full max-w-7xl mx-auto px-3 sm:px-6 pt-6 pb-24 space-y-10 overflow-x-hidden flex-1">
          {/* Top Bar Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-800 pb-4">
            <button
              onClick={() => {
                setCurrentView('feed');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 text-xs font-bold text-orange-400 hover:text-orange-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Portal Feed</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-stone-400">BeatStars Competitor Rate:</span>
              <span className="bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded text-xs font-mono font-bold border border-orange-500/20">
                5% Below Market Rate
              </span>
            </div>
          </div>

          {/* "BEAT OF THE WEEK" HERO SECTION */}
          <section className="relative w-full max-w-full rounded-2xl overflow-hidden border border-orange-500/30 bg-gradient-to-br from-[#161922] via-[#111319] to-[#0b0d10] p-4 sm:p-6 lg:p-8 shadow-2xl">
            <div className="flex flex-col sm:flex-row items-center sm:items-start lg:items-center gap-4 sm:gap-6 lg:gap-8 max-w-full">
              <div className="shrink-0 flex justify-center">
                {/* Strictly compact responsive artwork: w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg shrink-0 */}
                <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden border-2 border-orange-500/50 shadow-xl shrink-0 group">
                  <img src={beatStoreImg} alt="Beat of the Week" className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg shrink-0" />
                  <button
                    onClick={() => handlePlayMusic('Lekki Midnight Cruise', 'Mr Sounds on the beat', beatStoreImg)}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Play Beat of the Week preview"
                  >
                    <div className="w-9 h-9 rounded-full bg-orange-500 text-stone-950 flex items-center justify-center font-bold shadow-md">
                      <Play className="w-4 h-4 fill-stone-950 ml-0.5" />
                    </div>
                  </button>
                </div>
              </div>

              <div className="min-w-0 flex-1 space-y-2 text-center sm:text-left max-w-full">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="bg-gradient-to-r from-orange-500 to-amber-400 text-stone-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow">
                    BEAT OF THE WEEK
                  </span>
                  <span className="text-xs font-mono text-stone-400">104 BPM · F# Minor</span>
                </div>

                <h1 className="font-display text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight break-words">
                  Lekki Midnight Cruise
                </h1>
                <p className="text-xs sm:text-sm text-stone-300 break-words">
                  Produced by <strong className="text-orange-400">Mr Sounds on the beat</strong> · Asake &amp; Burna Boy Style Afrobeat
                </p>

                {/* Dual Currency Price Display */}
                <div className="flex items-center justify-center sm:justify-start gap-3 pt-0.5">
                  <div className="bg-[#0b0d10] px-3 py-1.5 rounded-xl border border-stone-800">
                    <span className="text-[10px] text-stone-400 uppercase font-mono block">From</span>
                    <span className="font-display font-extrabold text-orange-400 text-sm sm:text-base">₦25,000</span>
                    <span className="text-xs text-stone-300 ml-1">($28.50 USD)</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-1">
                  <button
                    onClick={() => handlePlayMusic('Lekki Midnight Cruise', 'Mr Sounds on the beat', beatStoreImg)}
                    className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-stone-950 font-black text-xs uppercase flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-stone-950" />
                    <span>Play Tagged Preview</span>
                  </button>

                  <button
                    onClick={() => openCart(0)}
                    className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs uppercase flex items-center gap-1.5 border border-stone-700 active:scale-95 transition-all"
                  >
                    <ShoppingCart className="w-3.5 h-3.5 text-orange-400" />
                    <span>Add to Cart &amp; License</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Beat Store Search & Filter Header */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:max-w-xs">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                <input
                  type="text"
                  value={beatSearchQuery}
                  onChange={(e) => setBeatSearchQuery(e.target.value)}
                  placeholder="Filter by title, producer, BPM..."
                  className="w-full bg-[#12151b] text-white text-xs rounded-xl pl-9 pr-4 py-2 border border-stone-800 focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Genre Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none text-xs">
                {['All', 'Afrobeats', 'Amapiano', 'Drill', 'Highlife', 'Afro-Fusion'].map((genre) => (
                  <button
                    key={genre}
                    onClick={() => setSelectedBeatGenre(genre)}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
                      selectedBeatGenre === genre
                        ? 'bg-orange-500 text-stone-950 shadow-sm'
                        : 'bg-[#12151b] text-stone-400 hover:text-white border border-stone-800'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            {/* 20 Beats List with Dual-Currency Pricing */}
            <div className="space-y-3 w-full max-w-full overflow-hidden">
              {filteredBeats20.map((beat, index) => (
                <div
                  key={beat.id}
                  className="group bg-[#12151b] hover:bg-[#181c24] border border-stone-800 hover:border-orange-500/40 rounded-xl p-3 sm:p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 transition-all w-full max-w-full overflow-hidden"
                >
                  <div className="flex items-center gap-3 min-w-0 w-full sm:flex-1 overflow-hidden">
                    <div className="relative w-14 h-14 shrink-0 rounded-lg overflow-hidden bg-stone-900 border border-stone-800">
                      <img src={beat.cover} alt={beat.title} className="w-full h-full object-cover" />
                      <button
                        onClick={() => handlePlayMusic(beat.title, beat.producer, beat.cover)}
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                        aria-label="Play beat preview"
                      >
                        <Play className="w-4 h-4 fill-white" />
                      </button>
                    </div>

                    <div className="min-w-0 flex-1 space-y-1 overflow-hidden">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-stone-800 text-stone-300 shrink-0">
                          {beat.bpm} BPM · {beat.key}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-400 font-semibold shrink-0">
                          {beat.genre}
                        </span>
                      </div>
                      <h4 className="font-display font-bold text-sm text-white group-hover:text-orange-400 transition-colors truncate">
                        {beat.title}
                      </h4>
                      <p className="text-xs text-stone-400 truncate">
                        By <span className="text-stone-300 font-semibold">{beat.producer}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 w-full sm:w-auto pt-2.5 sm:pt-0 border-t sm:border-t-0 border-stone-800/80 overflow-hidden">
                    <div className="text-left sm:text-right shrink-0">
                      <span className="font-display font-extrabold text-orange-400 text-sm">₦25,000</span>
                      <span className="text-[10px] text-stone-400 block font-mono">($28.50 USD)</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handlePlayMusic(beat.title, beat.producer, beat.cover)}
                        className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#181c24] hover:bg-stone-700 text-stone-300 text-xs font-semibold flex items-center gap-1 transition-colors shrink-0"
                        title="Preview Audio"
                      >
                        <Play className="w-3 h-3 text-orange-400 fill-orange-400" />
                        <span>Preview</span>
                      </button>

                      <button
                        onClick={() => openCart(index)}
                        className="px-3 sm:px-3.5 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-400 text-stone-950 font-bold text-xs uppercase flex items-center gap-1 shadow-sm transition-all shrink-0"
                      >
                        <ShoppingCart className="w-3 h-3 text-stone-950" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      )}

      {/* ======================== SINGLE POST DETAIL VIEW ======================== */}
      {currentView === 'detail' && (
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 space-y-8 overflow-x-hidden flex-1">
          <div className="flex items-center justify-between gap-3 border-b border-stone-800 pb-4">
            <button
              onClick={() => {
                setCurrentView('feed');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 text-xs font-bold text-orange-400 hover:text-orange-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Portal Feed</span>
            </button>

            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-xs text-stone-500 hidden md:inline truncate max-w-xs">
                Home / {selectedPost.category} / <span className="text-stone-300">{selectedPost.title}</span>
              </span>
              
              {/* Top Share Icon Button */}
              <button
                onClick={() => handleSharePost(selectedPost)}
                className="px-3 py-1.5 rounded-xl bg-[#141820] hover:bg-orange-500/20 text-stone-300 hover:text-orange-400 border border-stone-800 transition-all flex items-center gap-1.5 text-xs font-bold shadow-sm active:scale-95"
                title="Share track / post"
                aria-label="Share this post"
              >
                <Share2 className="w-3.5 h-3.5 text-orange-400" />
                <span>Share</span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2.5 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-extrabold px-2.5 py-1 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30 font-mono">
                  [{selectedPost.category}]
                </span>
                <span className="text-stone-400">{selectedPost.date}</span>
                {selectedPost.downloads && (
                  <>
                    <span className="text-stone-600">·</span>
                    <span className="text-stone-400 font-semibold">{selectedPost.downloads} downloads</span>
                  </>
                )}
              </div>

              {/* Share Badge Button */}
              <button
                onClick={() => handleSharePost(selectedPost)}
                className="px-3 py-1.5 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 hover:border-orange-500/50 transition-all flex items-center gap-1.5 font-bold shadow-sm active:scale-95"
                title="Share track or story"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Release</span>
              </button>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {selectedPost.title}
            </h1>

            <p className="text-sm sm:text-base font-semibold text-stone-300">
              {selectedPost.subtitle}
            </p>
          </div>

          {/* Media / Artwork Frame */}
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-stone-800 bg-stone-900 shadow-2xl">
            <img src={selectedPost.cover} alt={selectedPost.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            {/* If video post: watch button overlay */}
            {selectedPost.type === 'video' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={() => showToast('Playing 4K Official Video Embed...')}
                  className="w-16 h-16 rounded-full bg-orange-500 hover:bg-orange-400 text-stone-950 flex items-center justify-center font-bold shadow-2xl transition-transform active:scale-95"
                >
                  <Play className="w-6 h-6 fill-stone-950 ml-1" />
                </button>
              </div>
            )}
          </div>

          {/* Action Bar (For Music: Play & Download MP3 + Share Track) */}
          {selectedPost.type === 'music' && (
            <div className="bg-[#12151b] border border-orange-500/30 rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="font-display text-base font-bold text-white">Stream Official Master Audio</h3>
                  <p className="text-xs text-stone-400">Verified 320kbps MP3 audio stream optimized for high-fidelity listening.</p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                  <button
                    onClick={() => handlePlayMusic(selectedPost.title, selectedPost.subtitle, selectedPost.cover)}
                    className="flex-1 sm:flex-initial px-4 sm:px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-stone-950 font-black text-xs uppercase flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-stone-950" />
                    <span>Play Track</span>
                  </button>
                  <button
                    onClick={() => showToast(`Downloading: ${selectedPost.title}.mp3 (320kbps)`)}
                    className="flex-1 sm:flex-initial px-4 sm:px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs uppercase flex items-center justify-center gap-2 active:scale-95 transition-all"
                  >
                    <Download className="w-3.5 h-3.5 text-orange-400" />
                    <span>Download MP3</span>
                  </button>
                  <button
                    onClick={() => handleSharePost(selectedPost)}
                    className="px-3.5 py-2.5 rounded-xl bg-[#181c24] hover:bg-orange-500/20 text-stone-300 hover:text-orange-400 font-bold text-xs uppercase flex items-center justify-center gap-1.5 border border-stone-700 active:scale-95 transition-all"
                    title="Share Track"
                  >
                    <Share2 className="w-3.5 h-3.5 text-orange-400" />
                    <span className="hidden sm:inline">Share</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Article / Editorial Body Text */}
          {selectedPost.body && (
            <div className="bg-[#12151b] border border-stone-800 rounded-2xl p-6 space-y-4">
              <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">
                Article &amp; Release Story
              </h3>
              <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
                {selectedPost.body}
              </p>
            </div>
          )}

          {/* Official Lyrics (For Music) */}
          {selectedPost.lyrics && (
            <div className="bg-[#12151b] border border-stone-800 rounded-2xl p-6 space-y-4">
              <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">
                Official Lyrics Breakdown
              </h3>
              <div className="prose prose-invert max-w-none text-stone-300 text-xs sm:text-sm font-mono leading-relaxed bg-[#0b0d10] p-4 rounded-xl border border-stone-800/80">
                {selectedPost.lyrics.map((line, i) => (
                  <p key={i} className="my-0.5">{line || '\u00A0'}</p>
                ))}
              </div>
            </div>
          )}

          {/* Quick Social & Native Share Banner */}
          <div className="bg-[#12151b] border border-stone-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-display text-sm font-bold text-white">Share "{selectedPost.title}"</h4>
                <p className="text-xs text-stone-400">Spread African music culture across your networks &amp; social channels.</p>
              </div>
            </div>

            <button
              onClick={() => handleSharePost(selectedPost)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-stone-950 font-black text-xs uppercase flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all shrink-0"
            >
              <Share2 className="w-4 h-4 fill-stone-950 text-stone-950" />
              <span>Share to Socials / Copy Link</span>
            </button>
          </div>

          {/* 4 Related Posts */}
          <div className="space-y-4 pt-4 border-t border-stone-800">
            <h3 className="font-display text-base font-bold text-white uppercase tracking-wider">
              Related Releases &amp; Stories
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {related4Posts.map((post) => {
                const origIdx = POSTS_20_DATA.findIndex((p) => p.id === post.id);
                return (
                  <div
                    key={post.id}
                    onClick={() => openPostDetail(origIdx)}
                    className="p-3 rounded-xl bg-[#12151b] border border-stone-800 hover:border-orange-500/40 flex items-center justify-between gap-3 cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <img src={post.cover} alt="Related" className="w-14 h-14 rounded-lg object-cover shrink-0 border border-stone-800" />
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <span className="text-[9px] font-mono text-orange-400">[{post.category}]</span>
                        <h4 className="font-display text-xs font-bold text-white truncate">{post.title}</h4>
                        <p className="text-[11px] text-stone-400 truncate">{post.subtitle}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      )}

      {/* ======================== 6. COMPLETE PROFESSIONAL FOOTER ======================== */}
      <footer className="mt-auto bg-[#07090c] border-t border-stone-800/90 text-stone-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Column 1: Brand & Tagline */}
            <div className="space-y-3 md:col-span-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-stone-950 font-black">
                  <Flame className="w-4 h-4 fill-stone-950" />
                </div>
                <span className="font-display font-black text-xl text-white">Afropulse</span>
              </div>
              <p className="text-[11px] text-orange-500 font-bold uppercase tracking-wider">
                The Leader in African Entertainment
              </p>
              <p className="text-xs text-stone-400 leading-relaxed">
                The premier digital platform spotlighting trending Afrobeat singles, celebrity journalism, African cinema premieres, and high-converting music producer beat stores.
              </p>
            </div>

            {/* Column 2: Service Links */}
            <div className="space-y-2.5">
              <h4 className="font-display text-xs font-bold uppercase tracking-wider text-white">
                Creator &amp; Artist Services
              </h4>
              <ul className="space-y-1.5 text-xs">
                <li>
                  <button onClick={() => setUploadModalOpen(true)} className="hover:text-orange-400 transition-colors">
                    Music Promotion Campaigns
                  </button>
                </li>
                <li>
                  <button onClick={() => setSpotifyModalOpen(true)} className="hover:text-green-400 transition-colors">
                    Spotify Playlisting &amp; Editorial Pitching
                  </button>
                </li>
                <li>
                  <button onClick={() => { setCurrentView('beat-store'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-amber-400 transition-colors">
                    Beat Store &amp; Sync Licensing
                  </button>
                </li>
                <li>
                  <button onClick={() => setVipModalOpen(true)} className="hover:text-purple-400 transition-colors">
                    VIP Executive Club Membership
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Legal & Utility Links */}
            <div className="space-y-2.5">
              <h4 className="font-display text-xs font-bold uppercase tracking-wider text-white">
                Policies &amp; Legal
              </h4>
              <ul className="space-y-1.5 text-xs">
                <li>
                  <button onClick={() => setLegalModal('dmca')} className="hover:text-white transition-colors">
                    DMCA Takedown Policy
                  </button>
                </li>
                <li>
                  <button onClick={() => setLegalModal('privacy')} className="hover:text-white transition-colors">
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button onClick={() => setLegalModal('terms')} className="hover:text-white transition-colors">
                    Terms &amp; Conditions
                  </button>
                </li>
                <li>
                  <button onClick={() => setLegalModal('contact')} className="hover:text-white transition-colors">
                    Contact Us / Music Submission
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setAdminModalOpen(true)}
                    className="text-stone-500 hover:text-orange-400 font-mono transition-colors flex items-center gap-1 mt-2 pt-2 border-t border-stone-800/60"
                  >
                    <Settings className="w-3.5 h-3.5 text-stone-500 hover:text-orange-400" />
                    <span>Admin Panel</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Newsletter & Direct Inquiry */}
            <div className="space-y-2.5">
              <h4 className="font-display text-xs font-bold uppercase tracking-wider text-white">
                Direct Submission Desk
              </h4>
              <p className="text-xs text-stone-400">
                Send songs, videos, press releases, or inquiries directly to our editorial board:
              </p>
              <div className="bg-[#12151b] p-2.5 rounded-xl border border-stone-800 text-[11px] font-mono text-orange-400">
                submissions@afropulse.com
              </div>
              <p className="text-[10px] text-stone-500">
                Lagos · London · Accra · Johannesburg · Nairobi
              </p>
            </div>

          </div>

          {/* Copyright & Disclaimer */}
          <div className="pt-6 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-stone-500">
            <p>© 2026 Afropulse Media Network. All Rights Reserved.</p>
            <div className="flex items-center gap-4">
              <p>Designed strictly for African Entertainment &amp; Global Afrobeat Culture.</p>
              <button
                onClick={() => setAdminModalOpen(true)}
                className="text-stone-500 hover:text-orange-400 transition-colors flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded border border-stone-800 bg-[#0d0f14]"
              >
                <Settings className="w-3 h-3 text-stone-500" />
                <span>Admin Login</span>
              </button>
            </div>
          </div>

        </div>
      </footer>

      {/* ======================== PERSISTENT FLOATING AUDIO PLAYER ======================== */}
      {isPlayerVisible && (
        <aside className="fixed bottom-0 left-0 right-0 z-50 bg-[#0d0f14]/95 backdrop-blur-xl border-t border-stone-800 shadow-2xl transition-all">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
            <div className="flex items-center gap-3 mb-1.5">
              <span className="text-[11px] font-mono text-stone-400 w-10 text-right tabular-nums">00:35</span>
              <div className="relative flex-1 h-1.5 bg-stone-800 rounded-full cursor-pointer group">
                <div className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full w-1/4" />
              </div>
              <span className="text-[11px] font-mono text-stone-400 w-10 tabular-nums">03:44</span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0 max-w-[260px] sm:max-w-xs">
                <img src={playerTrack.cover} alt="Cover" className="w-10 h-10 rounded-lg object-cover border border-stone-800 shrink-0" />
                <div className="truncate">
                  <h4 className="font-display text-xs font-bold text-white truncate">{playerTrack.title}</h4>
                  <p className="text-[11px] text-stone-400 truncate">{playerTrack.artist}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button onClick={() => showToast('Previous track')} className="text-stone-400 hover:text-white p-1.5 transition-colors">
                  <SkipBack className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-10 h-10 rounded-full bg-orange-500 hover:bg-orange-400 text-stone-950 flex items-center justify-center font-bold shadow-md active:scale-95 transition-all"
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-stone-950" /> : <Play className="w-4 h-4 fill-stone-950 ml-0.5" />}
                </button>
                <button onClick={() => showToast('Next track')} className="text-stone-400 hover:text-white p-1.5 transition-colors">
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => showToast(`Downloading: ${playerTrack.title}.mp3`)}
                  className="text-stone-400 hover:text-orange-400 p-1.5 transition-colors"
                  title="Download Track"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setIsPlayerVisible(false);
                    setIsPlaying(false);
                  }}
                  className="text-stone-500 hover:text-white p-1.5 transition-colors"
                  title="Close Player"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* ======================== GUEST CHECKOUT CART MODAL ======================== */}
      {cartModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#12151b] border border-orange-500/40 rounded-2xl w-full max-w-lg p-6 sm:p-7 space-y-5 relative shadow-2xl animate-in zoom-in-95 duration-200 my-8">
            <button onClick={() => setCartModalOpen(false)} className="absolute top-5 right-5 text-stone-400 hover:text-white p-1">
              <X className="w-5 h-5" />
            </button>

            {!paymentSuccess ? (
              <div className="space-y-4">
                <div className="border-b border-stone-800 pb-3">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-orange-400 mb-2">
                    <span>Official Beat Licensing · Guest Checkout</span>
                    <span className="text-green-400 font-mono text-[10px]">Instant Download</span>
                  </div>
                  <div className="flex items-center gap-3 bg-[#0b0d10] p-3 rounded-xl border border-stone-800">
                    <img src={BEATS_20_DATA[selectedBeatIndex].cover} alt="Beat" className="w-12 h-12 rounded-lg object-cover" />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-sm text-white truncate">{BEATS_20_DATA[selectedBeatIndex].title}</h4>
                      <p className="text-xs text-stone-400 truncate">{BEATS_20_DATA[selectedBeatIndex].producer}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-display font-extrabold text-orange-400 text-sm">₦25,000</div>
                      <div className="text-[10px] text-stone-400">($28.50 USD)</div>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleGuestCheckout} className="space-y-3.5 text-xs">
                  <label className="font-bold text-stone-300 uppercase tracking-wider block">Customer Information:</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-400 mb-1">Full Name</label>
                      <input type="text" required defaultValue="Adewale Davies" className="w-full bg-[#181c24] text-white px-3 py-2 rounded-lg border border-stone-700 focus:outline-none focus:border-orange-500" />
                    </div>
                    <div>
                      <label className="block text-stone-400 mb-1">Email (Instant Audio Delivery)</label>
                      <input type="email" required defaultValue="artist@afropulse.com" className="w-full bg-[#181c24] text-white px-3 py-2 rounded-lg border border-stone-700 focus:outline-none focus:border-orange-500" />
                    </div>
                  </div>

                  <div className="space-y-2 pt-1">
                    <label className="font-bold text-stone-300 uppercase tracking-wider block">Payment Gateway:</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentGateway('paystack')}
                        className={`p-2.5 rounded-lg border text-center font-bold text-xs transition-all ${
                          paymentGateway === 'paystack'
                            ? 'border-orange-500 bg-orange-500/10 text-orange-400'
                            : 'border-stone-800 bg-[#181c24] text-stone-400 hover:text-white'
                        }`}
                      >
                        Paystack (₦ Naira &amp; Cards)
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentGateway('paypal')}
                        className={`p-2.5 rounded-lg border text-center font-bold text-xs transition-all ${
                          paymentGateway === 'paypal'
                            ? 'border-orange-500 bg-orange-500/10 text-orange-400'
                            : 'border-stone-800 bg-[#181c24] text-stone-400 hover:text-white'
                        }`}
                      >
                        PayPal / USD ($28.50)
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 text-stone-950 font-black text-xs uppercase rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <span>Authorizing Secure Gateway...</span>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Pay ₦25,000 ($28.50 USD) via {paymentGateway === 'paystack' ? 'Paystack' : 'PayPal'}</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-white">Payment Verified &amp; Confirmed!</h3>
                  <p className="text-xs text-stone-400 mt-1">Receipt &amp; License delivered to artist@afropulse.com</p>
                </div>
                <button
                  onClick={() => {
                    showToast('Untagged Master WAV + License PDF downloading...');
                    setCartModalOpen(false);
                  }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-stone-950 font-black text-xs uppercase flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Untagged Master Stems (.ZIP)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================== SPOTIFY PLAYLIST PITCH MODAL ======================== */}
      {spotifyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#12151b] border border-green-500/40 rounded-2xl w-full max-w-md p-6 space-y-4 relative shadow-2xl">
            <button onClick={() => setSpotifyModalOpen(false)} className="absolute top-5 right-5 text-stone-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-green-400">
              <Radio className="w-5 h-5" />
              <h3 className="font-display text-lg font-bold text-white">Spotify Playlisting Pitch</h3>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              Submit your master track URL directly to Afropulse’s certified Spotify playlist curators across Top 50 Afrobeat, Amapiano Groove, and West African Chill.
            </p>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-400 mb-1">Spotify Track Link / ISRC</label>
                <input type="text" placeholder="https://open.spotify.com/track/..." className="w-full bg-[#181c24] text-white px-3 py-2 rounded-lg border border-stone-700 focus:outline-none focus:border-green-500" />
              </div>
              <div>
                <label className="block text-stone-400 mb-1">Artist Contact Email</label>
                <input type="email" placeholder="artist@management.com" className="w-full bg-[#181c24] text-white px-3 py-2 rounded-lg border border-stone-700 focus:outline-none focus:border-green-500" />
              </div>
              <button
                onClick={() => {
                  setSpotifyModalOpen(false);
                  showToast('Spotify submission received! Curator review in progress.');
                }}
                className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-400 text-stone-950 font-black uppercase rounded-xl tracking-wider text-xs shadow-md"
              >
                Submit Pitch to Curators
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================== PUBLIC "UPLOAD MUSIC" HUB MODAL ======================== */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#12151b] border border-orange-500/40 rounded-2xl w-full max-w-2xl p-5 sm:p-7 space-y-6 relative shadow-2xl my-auto max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => {
                setUploadModalOpen(false);
                setUploadStep('packages');
              }}
              className="absolute top-5 right-5 text-stone-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {/* STEP 1: PACKAGES & CAMPAIGN INQUIRY */}
            {uploadStep === 'packages' && (
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-orange-400">
                    <Upload className="w-5 h-5" />
                    <h3 className="font-display text-lg sm:text-xl font-bold text-white">
                      Public "Upload Music" Distribution Hub
                    </h3>
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    Fast-track your track release across the African continent and global diaspora. Select an editorial distribution package below to initiate verification and intake.
                  </p>
                </div>

                {/* 3 Packages */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Package 1 */}
                  <div
                    onClick={() => setSelectedUploadPkg({ id: 1, name: 'Single Song Drop', priceNgn: '₦10,000', priceUsd: '$15.00' })}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all relative flex flex-col justify-between ${
                      selectedUploadPkg.id === 1
                        ? 'border-orange-500 bg-orange-500/10'
                        : 'border-stone-800 bg-[#0d0f14] hover:border-orange-400'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase font-bold text-stone-400">Package 1</span>
                        {selectedUploadPkg.id === 1 && (
                          <span className="w-4 h-4 rounded-full bg-orange-500 text-stone-950 flex items-center justify-center text-[10px] font-bold">✓</span>
                        )}
                      </div>
                      <h4 className="font-bold text-white text-sm">Single Song Drop</h4>
                      <p className="text-xs text-stone-300">Homepage feed placement, verified high-speed MP3 download, and editorial indexing.</p>
                    </div>
                    <div className="pt-3 mt-2 border-t border-stone-800">
                      <div className="font-display font-extrabold text-orange-400 text-sm">₦10,000</div>
                      <div className="text-[10px] text-stone-400">($15.00 USD)</div>
                    </div>
                  </div>

                  {/* Package 2 */}
                  <div
                    onClick={() => setSelectedUploadPkg({ id: 2, name: 'VIP Feature & Spotify Playlisting', priceNgn: '₦25,000', priceUsd: '$30.00' })}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all relative flex flex-col justify-between ${
                      selectedUploadPkg.id === 2
                        ? 'border-orange-500 bg-orange-500/10'
                        : 'border-stone-800 bg-[#0d0f14] hover:border-orange-400'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase font-bold text-amber-400">★ Popular</span>
                        {selectedUploadPkg.id === 2 && (
                          <span className="w-4 h-4 rounded-full bg-orange-500 text-stone-950 flex items-center justify-center text-[10px] font-bold">✓</span>
                        )}
                      </div>
                      <h4 className="font-bold text-white text-sm">VIP &amp; Spotify</h4>
                      <p className="text-xs text-stone-300">Top Updates pinning for 7 days + pitch to Spotify Top 50 Afrobeat curators.</p>
                    </div>
                    <div className="pt-3 mt-2 border-t border-stone-800">
                      <div className="font-display font-extrabold text-amber-400 text-sm">₦25,000</div>
                      <div className="text-[10px] text-stone-400">($30.00 USD)</div>
                    </div>
                  </div>

                  {/* Package 3 */}
                  <div
                    onClick={() => setSelectedUploadPkg({ id: 3, name: 'EP / Album Release Package', priceNgn: '₦35,000', priceUsd: '$45.00' })}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all relative flex flex-col justify-between ${
                      selectedUploadPkg.id === 3
                        ? 'border-orange-500 bg-orange-500/10'
                        : 'border-stone-800 bg-[#0d0f14] hover:border-orange-400'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase font-bold text-purple-400">EP / Album</span>
                        {selectedUploadPkg.id === 3 && (
                          <span className="w-4 h-4 rounded-full bg-orange-500 text-stone-950 flex items-center justify-center text-[10px] font-bold">✓</span>
                        )}
                      </div>
                      <h4 className="font-bold text-white text-sm">Album Package</h4>
                      <p className="text-xs text-stone-300">Full project feature (up to 7 tracks), banner spotlight, and radio syndication.</p>
                    </div>
                    <div className="pt-3 mt-2 border-t border-stone-800">
                      <div className="font-display font-extrabold text-purple-400 text-sm">₦35,000</div>
                      <div className="text-[10px] text-stone-400">($45.00 USD)</div>
                    </div>
                  </div>
                </div>

                {/* Custom Campaign Inquiry Box */}
                <div className="p-3.5 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent border border-amber-500/30 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-amber-300 text-xs font-bold">
                    <Headphones className="w-4 h-4 text-amber-400" />
                    <span>Custom Major-Label &amp; Billboard Campaigns:</span>
                  </div>
                  <p className="text-[11px] text-stone-300 leading-relaxed">
                    Need customized radio syndication across Lagos/Johannesburg, highway billboard blitzes, or bespoke PR rollout? Contact our executive campaign directors directly:
                  </p>
                  <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                    <a
                      href="https://wa.me/2348000000000"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition-colors flex items-center gap-1.5 font-bold"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>WhatsApp: +234 800 000 0000</span>
                    </a>
                    <a
                      href="mailto:promo@afropulse.com"
                      className="px-3 py-1.5 rounded-lg bg-orange-500/20 text-orange-300 border border-orange-500/40 hover:bg-orange-500/30 transition-colors flex items-center gap-1.5 font-bold"
                    >
                      <Mail className="w-3.5 h-3.5 text-orange-400" />
                      <span>Email: promo@afropulse.com</span>
                    </a>
                  </div>
                </div>

                {/* Paystack Inline Payment Trigger */}
                <button
                  type="button"
                  onClick={() => {
                    setUploadStep('intake');
                    showToast(`Paystack verified for ${selectedUploadPkg.name}. Intake form unlocked.`);
                  }}
                  className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 text-stone-950 font-black uppercase rounded-xl tracking-wider text-xs shadow-lg flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Trigger Paystack Payment &amp; Proceed to Intake ({selectedUploadPkg.priceNgn} / {selectedUploadPkg.priceUsd})</span>
                </button>
              </div>
            )}

            {/* STEP 2: POST-PAYMENT SUBMISSION INTAKE FORM */}
            {uploadStep === 'intake' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Paystack Verification Verified</span>
                    </span>
                    <h4 className="font-bold text-white text-base">Package: {selectedUploadPkg.name} ({selectedUploadPkg.priceNgn})</h4>
                  </div>
                  <button
                    onClick={() => setUploadStep('packages')}
                    className="text-xs text-stone-400 hover:text-white px-2 py-1 rounded bg-stone-800"
                  >
                    Change Package
                  </button>
                </div>

                <form onSubmit={handleUploadHubSubmit} className="space-y-3.5 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-300 font-semibold mb-1">Track / Video Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Lagos to London"
                        value={uploadIntakeForm.title}
                        onChange={(e) => setUploadIntakeForm({ ...uploadIntakeForm, title: e.target.value })}
                        className="w-full bg-[#181c24] text-white px-3 py-2 rounded-lg border border-stone-700 focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-300 font-semibold mb-1">Artist Stage Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Starboy Wizzy"
                        value={uploadIntakeForm.artist}
                        onChange={(e) => setUploadIntakeForm({ ...uploadIntakeForm, artist: e.target.value })}
                        className="w-full bg-[#181c24] text-white px-3 py-2 rounded-lg border border-stone-700 focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-300 font-semibold mb-1">Category / Format</label>
                      <select
                        value={uploadIntakeForm.category}
                        onChange={(e) => setUploadIntakeForm({ ...uploadIntakeForm, category: e.target.value as 'music' | 'video' })}
                        className="w-full bg-[#181c24] text-white px-3 py-2 rounded-lg border border-stone-700"
                      >
                        <option value="music">Single Song (Audio MP3)</option>
                        <option value="video">Official Music Video (4K)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-stone-300 font-semibold mb-1">Genre Tag</label>
                      <select
                        value={uploadIntakeForm.genreTag}
                        onChange={(e) => setUploadIntakeForm({ ...uploadIntakeForm, genreTag: e.target.value })}
                        className="w-full bg-[#181c24] text-white px-3 py-2 rounded-lg border border-stone-700"
                      >
                        <option value="AFROBEATS">Afrobeats</option>
                        <option value="AMAPIANO">Amapiano</option>
                        <option value="HIGHLIFE">Highlife</option>
                        <option value="DRILL">Afro-Drill</option>
                      </select>
                    </div>
                  </div>

                  {/* Artwork File Picker */}
                  <div className="bg-[#0d0f14] p-3 rounded-xl border border-stone-800 space-y-2">
                    <label className="block text-stone-300 font-semibold">Cover Artwork (Device Image or URL)</label>
                    <div className="flex gap-2">
                      <label className="cursor-pointer px-3 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-lg border border-stone-700 flex items-center gap-2 shrink-0">
                        <FolderOpen className="w-4 h-4 text-orange-400" />
                        <span>Choose Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setUploadIntakeForm({
                                ...uploadIntakeForm,
                                coverFileName: file.name,
                                cover: URL.createObjectURL(file)
                              });
                            }
                          }}
                        />
                      </label>
                      <input
                        type="text"
                        placeholder="https://images.unsplash.com/... or choose file"
                        value={uploadIntakeForm.cover}
                        onChange={(e) => setUploadIntakeForm({ ...uploadIntakeForm, cover: e.target.value })}
                        className="flex-1 bg-[#181c24] text-white px-3 py-2 rounded-lg border border-stone-700 text-xs"
                      />
                    </div>
                    {uploadIntakeForm.coverFileName && (
                      <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{uploadIntakeForm.coverFileName}</span>
                      </p>
                    )}
                  </div>

                  {/* Audio File Picker */}
                  <div className="bg-[#0d0f14] p-3 rounded-xl border border-stone-800 space-y-2">
                    <label className="block text-stone-300 font-semibold">Master Audio MP3 / Video Link</label>
                    <div className="flex gap-2">
                      <label className="cursor-pointer px-3 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-lg border border-stone-700 flex items-center gap-2 shrink-0">
                        <FolderOpen className="w-4 h-4 text-orange-400" />
                        <span>Choose Audio</span>
                        <input
                          type="file"
                          accept="audio/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setUploadIntakeForm({
                                ...uploadIntakeForm,
                                audioFileName: file.name,
                                audioUrl: URL.createObjectURL(file)
                              });
                            }
                          }}
                        />
                      </label>
                      <input
                        type="text"
                        placeholder="Direct MP3 / Google Drive / Dropbox link"
                        value={uploadIntakeForm.audioUrl}
                        onChange={(e) => setUploadIntakeForm({ ...uploadIntakeForm, audioUrl: e.target.value })}
                        className="flex-1 bg-[#181c24] text-white px-3 py-2 rounded-lg border border-stone-700 text-xs font-mono"
                      />
                    </div>
                    {uploadIntakeForm.audioFileName && (
                      <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{uploadIntakeForm.audioFileName}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-stone-300 font-semibold mb-1">Artist Contact Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="artist@management.com"
                      value={uploadIntakeForm.email}
                      onChange={(e) => setUploadIntakeForm({ ...uploadIntakeForm, email: e.target.value })}
                      className="w-full bg-[#181c24] text-white px-3 py-2 rounded-lg border border-stone-700 focus:outline-none focus:border-orange-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-300 font-semibold mb-1">Editorial Release Notes / Lyrics</label>
                    <textarea
                      rows={2}
                      placeholder="Provide background story, credits, or social tags..."
                      value={uploadIntakeForm.notes}
                      onChange={(e) => setUploadIntakeForm({ ...uploadIntakeForm, notes: e.target.value })}
                      className="w-full bg-[#181c24] text-white px-3 py-2 rounded-lg border border-stone-700 text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 text-stone-950 font-black uppercase rounded-xl tracking-wider text-xs shadow-lg flex items-center justify-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Submit Music Drop for Immediate Publication</span>
                  </button>
                </form>
              </div>
            )}

            {/* STEP 3: SUBMISSION CONFIRMATION */}
            {uploadStep === 'success' && (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-white">Music Drop Ingested Successfully!</h3>
                  <p className="text-xs text-stone-400 mt-1">
                    "{uploadIntakeForm.title}" is published to Top Updates feed and queued for playlist pitching.
                  </p>
                </div>
                <div className="bg-[#0b0e14] p-3 rounded-xl border border-stone-800 text-[11px] font-mono text-stone-400 max-w-sm mx-auto">
                  Transaction Reference: <strong className="text-orange-400">{uploadRefId}</strong> · Status: <span className="text-emerald-400">[VERIFIED SUCCESS]</span>
                </div>
                <button
                  onClick={() => {
                    setUploadModalOpen(false);
                    setUploadStep('packages');
                    setCurrentView('feed');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-stone-950 font-black text-xs uppercase"
                >
                  View On Homepage Feed
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ======================== VIP CLUB MODAL ======================== */}
      {vipModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#12151b] border border-purple-500/40 rounded-2xl w-full max-w-md p-6 space-y-4 relative shadow-2xl">
            <button onClick={() => setVipModalOpen(false)} className="absolute top-5 right-5 text-stone-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-purple-400">
              <Crown className="w-5 h-5" />
              <h3 className="font-display text-lg font-bold text-white">Afropulse VIP Executive Club</h3>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              Exclusive industry network for managers, label executives, A&amp;R directors, and certified producers across Lagos, London, and Johannesburg.
            </p>
            <ul className="text-xs text-stone-400 space-y-1.5 list-disc pl-4">
              <li>Early access to untagged producer beat stem drops.</li>
              <li>Direct booking priority for festival showcase passes.</li>
              <li>Monthly African entertainment streaming intelligence reports.</li>
            </ul>
            <button
              onClick={() => {
                setVipModalOpen(false);
                showToast('VIP application submitted! Membership desk will contact you.');
              }}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-black uppercase rounded-xl tracking-wider text-xs shadow-md"
            >
              Apply For VIP Membership
            </button>
          </div>
        </div>
      )}

      {/* ======================== LEGAL POLICY MODAL ======================== */}
      {legalModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#12151b] border border-stone-800 rounded-2xl w-full max-w-lg p-6 space-y-4 relative shadow-2xl max-h-[80vh] overflow-y-auto">
            <button onClick={() => setLegalModal(null)} className="absolute top-5 right-5 text-stone-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            
            {legalModal === 'dmca' && (
              <div className="space-y-3">
                <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-orange-400" />
                  DMCA Takedown Policy
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Afropulse respects the intellectual property rights of creators and copyright holders. If you believe any audio file, image, or editorial content on Afropulse infringes your copyright, please notify our legal compliance team at <strong className="text-orange-400">dmca@afropulse.com</strong> with proof of ownership. We promptly remove verified infringing material within 24 business hours.
                </p>
              </div>
            )}

            {legalModal === 'privacy' && (
              <div className="space-y-3">
                <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
                  <Lock className="w-5 h-5 text-orange-400" />
                  Privacy Policy
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Afropulse does not sell, rent, or monetize your personal information. Guest checkout emails are utilized strictly for digital audio license receipts and download delivery via encrypted payment processors. Cookies are used solely to preserve audio player status and session navigation.
                </p>
              </div>
            )}

            {legalModal === 'terms' && (
              <div className="space-y-3">
                <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-orange-400" />
                  Terms &amp; Conditions
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed">
                  By utilizing Afropulse’s media stream or purchasing producer licenses, you agree to our standard non-exclusive licensing parameters. Beat licenses grant rights up to specified commercial streaming limits. Unauthorized resale or redistribution of master stem files is strictly prohibited.
                </p>
              </div>
            )}

            {legalModal === 'contact' && (
              <div className="space-y-3">
                <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
                  <Mail className="w-5 h-5 text-orange-400" />
                  Contact Us &amp; Music Submission
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed">
                  For press inquiries, artist interviews, advertising, and partnership opportunities across Africa and the diaspora:
                </p>
                <div className="bg-[#0b0d10] p-3 rounded-xl border border-stone-800 text-xs font-mono text-stone-300 space-y-1">
                  <p>General Desk: <span className="text-orange-400">info@afropulse.com</span></p>
                  <p>Music Submissions: <span className="text-orange-400">submissions@afropulse.com</span></p>
                  <p>Advertising &amp; Brand Deals: <span className="text-orange-400">ads@afropulse.com</span></p>
                </div>
              </div>
            )}

            <button
              onClick={() => setLegalModal(null)}
              className="w-full py-2.5 bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs rounded-xl"
            >
              Close Window
            </button>
          </div>
        </div>
      )}

      {/* ======================== SECURED ROLE-BASED ADMIN PORTAL MODAL ======================== */}
      {adminModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#12151b] border border-orange-500/40 rounded-2xl w-full max-w-4xl p-5 sm:p-7 space-y-6 relative shadow-2xl my-auto max-h-[92vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setAdminModalOpen(false)}
              className="absolute top-5 right-5 text-stone-400 hover:text-white transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {/* SCREEN 1: SECURE MASTER LOGIN GATEWAY (NO PUBLIC REGISTER LINK) */}
            {!adminAuthUser ? (
              <div className="max-w-md mx-auto py-4 space-y-6">
                <div className="text-center space-y-2">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-stone-950 font-black shadow-xl shadow-orange-500/20 mx-auto">
                    <Shield className="w-7 h-7 text-stone-950" />
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                    Afropulse Admin Gateway
                  </h3>
                  <p className="text-xs text-stone-400">
                    Restricted security portal. Authorized administrative personnel and verified staff only.
                  </p>
                </div>

                {adminLoginError && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-xs text-red-400 flex items-center gap-2">
                    <Shield className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{adminLoginError}</span>
                  </div>
                )}

                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div className="space-y-1.5 text-xs">
                    <label className="block text-stone-300 font-semibold">Staff / Master Email Address</label>
                    <input
                      type="email"
                      required
                      value={adminLoginForm.email}
                      onChange={(e) => setAdminLoginForm({ ...adminLoginForm, email: e.target.value })}
                      placeholder="admin@afropulse.com"
                      className="w-full bg-[#181c24] text-white px-3.5 py-2.5 rounded-xl border border-stone-700 focus:outline-none focus:border-orange-500 text-xs font-mono"
                    />
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <label className="block text-stone-300 font-semibold">Security Password</label>
                    <input
                      type="password"
                      required
                      value={adminLoginForm.password}
                      onChange={(e) => setAdminLoginForm({ ...adminLoginForm, password: e.target.value })}
                      placeholder="••••••••••••••••"
                      className="w-full bg-[#181c24] text-white px-3.5 py-2.5 rounded-xl border border-stone-700 focus:outline-none focus:border-orange-500 text-xs font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 text-stone-950 font-black text-xs uppercase rounded-xl shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Key className="w-4 h-4" />
                    <span>Authenticate &amp; Access Dashboard</span>
                  </button>
                </form>

                <p className="text-center text-[11px] text-stone-600 font-mono">
                  Strict Security: Public registration disabled. Access logs encrypted.
                </p>
              </div>
            ) : (
              /* SCREEN 2: AUTHENTICATED ROLE-BASED DASHBOARD */
              <div className="space-y-6">
                {/* Header with User Info and Logout */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800/80 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-stone-950 font-black shadow-lg shadow-orange-500/20">
                      <Settings className="w-5 h-5 fill-stone-950" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-lg font-bold text-white">
                          Afropulse Control Center
                        </h3>
                        <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold border ${
                          adminAuthUser.role === 'owner'
                            ? 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                            : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                        }`}>
                          {adminAuthUser.role === 'owner' ? '★ Super-Admin (Owner)' : 'Staff Editor'}
                        </span>
                      </div>
                      <p className="text-xs text-stone-400">
                        Signed in as <strong className="text-stone-200">{adminAuthUser.email}</strong>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleAdminLogout}
                    className="px-3 py-1.5 bg-[#181c24] hover:bg-stone-800 border border-stone-700 text-stone-300 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors self-start sm:self-center"
                  >
                    <LogOut className="w-3.5 h-3.5 text-stone-400" />
                    <span>Log Out</span>
                  </button>
                </div>

                {/* Role-Based Main Navigation Tabs */}
                <div className="flex flex-wrap gap-2 bg-[#0a0c0f] p-1.5 rounded-xl border border-stone-800 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setAdminTab('publisher')}
                    className={`py-2 px-3.5 rounded-lg flex items-center gap-2 transition-all ${
                      adminTab === 'publisher'
                        ? 'bg-orange-500 text-stone-950 shadow-md font-black'
                        : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    <Upload className="w-4 h-4 shrink-0" />
                    <span>Content Publisher</span>
                  </button>

                  {/* Super-Admin Only Tabs */}
                  {adminAuthUser.role === 'owner' && (
                    <>
                      <button
                        type="button"
                        onClick={() => setAdminTab('hero')}
                        className={`py-2 px-3.5 rounded-lg flex items-center gap-2 transition-all ${
                          adminTab === 'hero'
                            ? 'bg-orange-500 text-stone-950 shadow-md font-black'
                            : 'text-stone-400 hover:text-white'
                        }`}
                      >
                        <Flame className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>Hero Manager</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setAdminTab('transactions')}
                        className={`py-2 px-3.5 rounded-lg flex items-center gap-2 transition-all ${
                          adminTab === 'transactions'
                            ? 'bg-orange-500 text-stone-950 shadow-md font-black'
                            : 'text-stone-400 hover:text-white'
                        }`}
                      >
                        <DollarSign className="w-4 h-4 shrink-0" />
                        <span>Transactions &amp; Sales</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setAdminTab('contentManager')}
                        className={`py-2 px-3.5 rounded-lg flex items-center gap-2 transition-all ${
                          adminTab === 'contentManager'
                            ? 'bg-orange-500 text-stone-950 shadow-md font-black'
                            : 'text-stone-400 hover:text-white'
                        }`}
                      >
                        <ListFilter className="w-4 h-4 shrink-0" />
                        <span>Content Manager (Edit/Delete)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setAdminTab('team')}
                        className={`py-2 px-3.5 rounded-lg flex items-center gap-2 transition-all ${
                          adminTab === 'team'
                            ? 'bg-orange-500 text-stone-950 shadow-md font-black'
                            : 'text-stone-400 hover:text-white'
                        }`}
                      >
                        <Users className="w-4 h-4 shrink-0" />
                        <span>Team Access</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setAdminTab('security')}
                        className={`py-2 px-3.5 rounded-lg flex items-center gap-2 transition-all ${
                          adminTab === 'security'
                            ? 'bg-orange-500 text-stone-950 shadow-md font-black'
                            : 'text-stone-400 hover:text-white'
                        }`}
                      >
                        <Shield className="w-4 h-4 shrink-0" />
                        <span>Master Security</span>
                      </button>
                    </>
                  )}
                </div>

                {/* TAB CONTENT 1: CONTENT PUBLISHER (ALL ADMINS) */}
                {adminTab === 'publisher' && (
                  <div className="space-y-5">
                    {/* Sub-tabs for Beats / Music / News */}
                    <div className="grid grid-cols-3 gap-2 bg-[#12151b] p-1 rounded-xl border border-stone-800 text-xs font-semibold">
                      <button
                        type="button"
                        onClick={() => setPublisherSubTab('beats')}
                        className={`py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
                          publisherSubTab === 'beats'
                            ? 'bg-stone-800 text-orange-400 font-bold border border-orange-500/30'
                            : 'text-stone-400 hover:text-white'
                        }`}
                      >
                        <Disc className="w-4 h-4" />
                        <span>1. Beat Store</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPublisherSubTab('music')}
                        className={`py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
                          publisherSubTab === 'music'
                            ? 'bg-stone-800 text-orange-400 font-bold border border-orange-500/30'
                            : 'text-stone-400 hover:text-white'
                        }`}
                      >
                        <Radio className="w-4 h-4" />
                        <span>2. Music &amp; Video</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPublisherSubTab('news')}
                        className={`py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
                          publisherSubTab === 'news'
                            ? 'bg-stone-800 text-orange-400 font-bold border border-orange-500/30'
                            : 'text-stone-400 hover:text-white'
                        }`}
                      >
                        <Newspaper className="w-4 h-4" />
                        <span>3. News &amp; Gossip</span>
                      </button>
                    </div>

                    {/* SUB-TAB 1: BEAT STORE UPLOAD (WITH DEVICE FILE PICKERS) */}
                    {publisherSubTab === 'beats' && (
                      <form onSubmit={handlePublishBeat} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                          <div className="sm:col-span-2">
                            <label className="block text-stone-300 font-medium mb-1">Beat Title *</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Lagos Mainland Vibe"
                              value={beatForm.title}
                              onChange={(e) => setBeatForm({ ...beatForm, title: e.target.value })}
                              className="w-full bg-[#181c24] text-white px-3 py-2.5 rounded-xl border border-stone-700 focus:outline-none focus:border-orange-500"
                            />
                          </div>

                          <div>
                            <label className="block text-stone-300 font-medium mb-1">Genre</label>
                            <select
                              value={beatForm.genre}
                              onChange={(e) => setBeatForm({ ...beatForm, genre: e.target.value })}
                              className="w-full bg-[#181c24] text-white px-3 py-2.5 rounded-xl border border-stone-700 focus:outline-none focus:border-orange-500"
                            >
                              <option value="Afrobeats">Afrobeats</option>
                              <option value="Amapiano">Amapiano</option>
                              <option value="Drill">Drill</option>
                              <option value="Highlife">Highlife</option>
                              <option value="Afro-Fusion">Afro-Fusion</option>
                              <option value="Reggae">Reggae</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-stone-300 font-medium mb-1">BPM &amp; Musical Key</label>
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                placeholder="112 BPM"
                                value={beatForm.bpm}
                                onChange={(e) => setBeatForm({ ...beatForm, bpm: e.target.value })}
                                className="w-full bg-[#181c24] text-white px-3 py-2.5 rounded-xl border border-stone-700 focus:outline-none focus:border-orange-500 font-mono"
                              />
                              <input
                                type="text"
                                placeholder="C Minor"
                                value={beatForm.key}
                                onChange={(e) => setBeatForm({ ...beatForm, key: e.target.value })}
                                className="w-full bg-[#181c24] text-white px-3 py-2.5 rounded-xl border border-stone-700 focus:outline-none focus:border-orange-500 font-mono"
                              />
                            </div>
                          </div>

                          {/* Device File Picker: Artwork */}
                          <div className="sm:col-span-2 bg-[#0d0f14] p-3 rounded-xl border border-stone-800 space-y-2">
                            <label className="block text-stone-300 font-semibold">
                              Artwork Image (Device File Picker or Remote URL)
                            </label>
                            <div className="flex flex-col sm:flex-row gap-2">
                              <label className="cursor-pointer px-3 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-lg border border-stone-700 flex items-center gap-2 shrink-0">
                                <FolderOpen className="w-4 h-4 text-orange-400" />
                                <span>Choose File</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      setBeatForm({
                                        ...beatForm,
                                        artworkFileName: file.name,
                                        cover: URL.createObjectURL(file)
                                      });
                                    }
                                  }}
                                />
                              </label>
                              <input
                                type="text"
                                placeholder="Or enter artwork URL (https://...)"
                                value={beatForm.cover}
                                onChange={(e) => setBeatForm({ ...beatForm, cover: e.target.value })}
                                className="flex-1 bg-[#181c24] text-white px-3 py-2 rounded-lg border border-stone-700 focus:outline-none focus:border-orange-500"
                              />
                            </div>
                            {beatForm.artworkFileName && (
                              <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Selected device file: <strong>{beatForm.artworkFileName}</strong></span>
                              </p>
                            )}
                          </div>

                          {/* Device File Picker: Tagged Preview */}
                          <div className="bg-[#0d0f14] p-3 rounded-xl border border-stone-800 space-y-2">
                            <label className="block text-stone-300 font-semibold">
                              Tagged Audio Preview (Device File or URL)
                            </label>
                            <div className="flex gap-2">
                              <label className="cursor-pointer px-3 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-lg border border-stone-700 flex items-center gap-2 shrink-0">
                                <FolderOpen className="w-4 h-4 text-orange-400" />
                                <span>Choose Audio</span>
                                <input
                                  type="file"
                                  accept="audio/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      setBeatForm({
                                        ...beatForm,
                                        previewFileName: file.name,
                                        previewUrl: URL.createObjectURL(file)
                                      });
                                    }
                                  }}
                                />
                              </label>
                              <input
                                type="text"
                                placeholder="https://cdn...preview.mp3"
                                value={beatForm.previewUrl}
                                onChange={(e) => setBeatForm({ ...beatForm, previewUrl: e.target.value })}
                                className="flex-1 bg-[#181c24] text-white px-3 py-2 rounded-lg border border-stone-700 font-mono text-[11px]"
                              />
                            </div>
                            {beatForm.previewFileName && (
                              <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Selected audio: {beatForm.previewFileName}</span>
                              </p>
                            )}
                          </div>

                          {/* Device File Picker: Untagged WAV / Stems */}
                          <div className="bg-[#0d0f14] p-3 rounded-xl border border-stone-800 space-y-2">
                            <label className="block text-stone-300 font-semibold">
                              Untagged WAV / Stems (.wav, .zip, .mp3)
                            </label>
                            <div className="flex gap-2">
                              <label className="cursor-pointer px-3 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-lg border border-stone-700 flex items-center gap-2 shrink-0">
                                <FolderOpen className="w-4 h-4 text-orange-400" />
                                <span>Choose Master</span>
                                <input
                                  type="file"
                                  accept=".wav,.zip,.mp3,audio/wav,application/zip"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      setBeatForm({
                                        ...beatForm,
                                        wavFileName: file.name,
                                        wavDownloadUrl: URL.createObjectURL(file)
                                      });
                                    }
                                  }}
                                />
                              </label>
                              <input
                                type="text"
                                placeholder="https://cdn...stems.zip"
                                value={beatForm.wavDownloadUrl}
                                onChange={(e) => setBeatForm({ ...beatForm, wavDownloadUrl: e.target.value })}
                                className="flex-1 bg-[#181c24] text-white px-3 py-2 rounded-lg border border-stone-700 font-mono text-[11px]"
                              />
                            </div>
                            {beatForm.wavFileName && (
                              <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Selected master: {beatForm.wavFileName}</span>
                              </p>
                            )}
                          </div>

                          {/* Dual Price Input */}
                          <div className="sm:col-span-2 grid grid-cols-2 gap-3 bg-[#0a0c0f] p-3 rounded-xl border border-stone-800">
                            <div>
                              <span className="text-[10px] uppercase font-mono text-stone-400 block mb-1">Dual Price (NGN)</span>
                              <input
                                type="text"
                                value={beatForm.priceNgn}
                                onChange={(e) => setBeatForm({ ...beatForm, priceNgn: e.target.value })}
                                className="w-full bg-[#12151b] text-orange-400 font-bold px-3 py-1.5 rounded-lg border border-stone-700 text-xs"
                              />
                            </div>
                            <div>
                              <span className="text-[10px] uppercase font-mono text-stone-400 block mb-1">Dual Price (USD)</span>
                              <input
                                type="text"
                                value={beatForm.priceUsd}
                                onChange={(e) => setBeatForm({ ...beatForm, priceUsd: e.target.value })}
                                className="w-full bg-[#12151b] text-white font-bold px-3 py-1.5 rounded-lg border border-stone-700 text-xs"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                          <button
                            type="submit"
                            className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 text-stone-950 font-black text-xs uppercase rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                          >
                            <Disc className="w-4 h-4 fill-stone-950" />
                            <span>Publish Beat to Beat Store</span>
                          </button>
                        </div>
                      </form>
                    )}

                    {/* SUB-TAB 2: MUSIC & VIDEO RELEASE (WITH DEVICE FILE PICKERS) */}
                    {publisherSubTab === 'music' && (
                      <form onSubmit={handlePublishMusic} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                          <div>
                            <label className="block text-stone-300 font-medium mb-1">Track / Video Title *</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Abuja Sunrise (Radio Edit)"
                              value={musicForm.title}
                              onChange={(e) => setMusicForm({ ...musicForm, title: e.target.value })}
                              className="w-full bg-[#181c24] text-white px-3 py-2.5 rounded-xl border border-stone-700 focus:outline-none focus:border-orange-500"
                            />
                          </div>

                          <div>
                            <label className="block text-stone-300 font-medium mb-1">Artist Name *</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Asake ft. Ayra Starr"
                              value={musicForm.artist}
                              onChange={(e) => setMusicForm({ ...musicForm, artist: e.target.value })}
                              className="w-full bg-[#181c24] text-white px-3 py-2.5 rounded-xl border border-stone-700 focus:outline-none focus:border-orange-500"
                            />
                          </div>

                          <div>
                            <label className="block text-stone-300 font-medium mb-1">Release Category</label>
                            <select
                              value={musicForm.category}
                              onChange={(e) => setMusicForm({ ...musicForm, category: e.target.value as 'music' | 'video' })}
                              className="w-full bg-[#181c24] text-white px-3 py-2.5 rounded-xl border border-stone-700 focus:outline-none focus:border-orange-500"
                            >
                              <option value="music">Music Audio Drop</option>
                              <option value="video">Official Video Premiere</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-stone-300 font-medium mb-1">Genre Tag</label>
                            <input
                              type="text"
                              placeholder="AFROBEATS, AMAPIANO, HIGHLIFE..."
                              value={musicForm.genreTag}
                              onChange={(e) => setMusicForm({ ...musicForm, genreTag: e.target.value })}
                              className="w-full bg-[#181c24] text-white px-3 py-2.5 rounded-xl border border-stone-700 focus:outline-none focus:border-orange-500 font-mono uppercase"
                            />
                          </div>

                          {/* Device File Picker: Artwork */}
                          <div className="sm:col-span-2 bg-[#0d0f14] p-3 rounded-xl border border-stone-800 space-y-2">
                            <label className="block text-stone-300 font-semibold">
                              Artwork File Picker (Device image/* or URL)
                            </label>
                            <div className="flex gap-2">
                              <label className="cursor-pointer px-3 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-lg border border-stone-700 flex items-center gap-2 shrink-0">
                                <FolderOpen className="w-4 h-4 text-orange-400" />
                                <span>Choose Artwork</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      setMusicForm({
                                        ...musicForm,
                                        artworkFileName: file.name,
                                        cover: URL.createObjectURL(file)
                                      });
                                    }
                                  }}
                                />
                              </label>
                              <input
                                type="text"
                                placeholder="https://images.unsplash.com/... (Optional)"
                                value={musicForm.cover}
                                onChange={(e) => setMusicForm({ ...musicForm, cover: e.target.value })}
                                className="flex-1 bg-[#181c24] text-white px-3 py-2 rounded-lg border border-stone-700"
                              />
                            </div>
                            {musicForm.artworkFileName && (
                              <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Artwork loaded: {musicForm.artworkFileName}</span>
                              </p>
                            )}
                          </div>

                          {/* Device File Picker: Audio MP3 */}
                          <div className="bg-[#0d0f14] p-3 rounded-xl border border-stone-800 space-y-2">
                            <label className="block text-stone-300 font-semibold">
                              Audio MP3 File (Device audio/* or URL)
                            </label>
                            <div className="flex gap-2">
                              <label className="cursor-pointer px-3 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-lg border border-stone-700 flex items-center gap-2 shrink-0">
                                <FolderOpen className="w-4 h-4 text-orange-400" />
                                <span>Choose MP3</span>
                                <input
                                  type="file"
                                  accept="audio/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      setMusicForm({
                                        ...musicForm,
                                        audioFileName: file.name,
                                        mp3DownloadUrl: URL.createObjectURL(file)
                                      });
                                    }
                                  }}
                                />
                              </label>
                              <input
                                type="text"
                                placeholder="https://cdn...track.mp3"
                                value={musicForm.mp3DownloadUrl}
                                onChange={(e) => setMusicForm({ ...musicForm, mp3DownloadUrl: e.target.value })}
                                className="flex-1 bg-[#181c24] text-white px-3 py-2 rounded-lg border border-stone-700 font-mono text-[11px]"
                              />
                            </div>
                            {musicForm.audioFileName && (
                              <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Audio loaded: {musicForm.audioFileName}</span>
                              </p>
                            )}
                          </div>

                          {/* Video Streaming URL */}
                          <div className="space-y-2">
                            <label className="block text-stone-300 font-medium">Video URL / Embed Link</label>
                            <input
                              type="text"
                              placeholder="https://www.youtube.com/embed/..."
                              value={musicForm.embedUrl}
                              onChange={(e) => setMusicForm({ ...musicForm, embedUrl: e.target.value })}
                              className="w-full bg-[#181c24] text-white px-3 py-2.5 rounded-xl border border-stone-700 focus:outline-none focus:border-orange-500 font-mono text-xs"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-stone-300 font-medium mb-1">Editorial Description / Lyrics</label>
                            <textarea
                              rows={2}
                              placeholder="Write a brief overview of the single or video release..."
                              value={musicForm.body}
                              onChange={(e) => setMusicForm({ ...musicForm, body: e.target.value })}
                              className="w-full bg-[#181c24] text-white px-3 py-2.5 rounded-xl border border-stone-700 focus:outline-none focus:border-orange-500 text-xs"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                          <button
                            type="submit"
                            className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 text-stone-950 font-black text-xs uppercase rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                          >
                            <Upload className="w-4 h-4" />
                            <span>Publish Music / Video Drop</span>
                          </button>
                        </div>
                      </form>
                    )}

                    {/* SUB-TAB 3: NEWS & ENTERTAINMENT GOSSIP (WITH DEVICE FILE PICKERS) */}
                    {publisherSubTab === 'news' && (
                      <form onSubmit={handlePublishNews} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                          <div className="sm:col-span-2">
                            <label className="block text-stone-300 font-medium mb-1">Article Headline *</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Burna Boy and Wizkid Announce Surprise Joint EP for Summer 2026"
                              value={newsForm.headline}
                              onChange={(e) => setNewsForm({ ...newsForm, headline: e.target.value })}
                              className="w-full bg-[#181c24] text-white px-3 py-2.5 rounded-xl border border-stone-700 focus:outline-none focus:border-orange-500"
                            />
                          </div>

                          <div>
                            <label className="block text-stone-300 font-medium mb-1">Gossip / News Tag</label>
                            <select
                              value={newsForm.gossipTag}
                              onChange={(e) => setNewsForm({ ...newsForm, gossipTag: e.target.value })}
                              className="w-full bg-[#181c24] text-white px-3 py-2.5 rounded-xl border border-stone-700 focus:outline-none focus:border-orange-500 font-mono"
                            >
                              <option value="NEWS">NEWS</option>
                              <option value="CELEBRITY GOSSIP">CELEBRITY GOSSIP</option>
                              <option value="NOLLYWOOD">NOLLYWOOD</option>
                              <option value="INDUSTRY">INDUSTRY</option>
                            </select>
                          </div>

                          {/* Device File Picker: Featured Image */}
                          <div className="bg-[#0d0f14] p-3 rounded-xl border border-stone-800 space-y-2">
                            <label className="block text-stone-300 font-semibold">
                              Featured Image (Device File image/* or URL)
                            </label>
                            <div className="flex gap-2">
                              <label className="cursor-pointer px-3 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-lg border border-stone-700 flex items-center gap-2 shrink-0">
                                <FolderOpen className="w-4 h-4 text-orange-400" />
                                <span>Pick Image</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      setNewsForm({
                                        ...newsForm,
                                        coverFileName: file.name,
                                        cover: URL.createObjectURL(file)
                                      });
                                    }
                                  }}
                                />
                              </label>
                              <input
                                type="text"
                                placeholder="https://images.unsplash.com/... (Optional)"
                                value={newsForm.cover}
                                onChange={(e) => setNewsForm({ ...newsForm, cover: e.target.value })}
                                className="flex-1 bg-[#181c24] text-white px-3 py-2 rounded-lg border border-stone-700 text-xs"
                              />
                            </div>
                            {newsForm.coverFileName && (
                              <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Image selected: {newsForm.coverFileName}</span>
                              </p>
                            )}
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-stone-300 font-medium mb-1">Full Article Story Editor</label>
                            <textarea
                              rows={4}
                              placeholder="Type the full article scoop, interview excerpts, or entertainment news reporting..."
                              value={newsForm.storyText}
                              onChange={(e) => setNewsForm({ ...newsForm, storyText: e.target.value })}
                              className="w-full bg-[#181c24] text-white px-3 py-2.5 rounded-xl border border-stone-700 focus:outline-none focus:border-orange-500 text-xs leading-relaxed"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                          <button
                            type="submit"
                            className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 text-stone-950 font-black text-xs uppercase rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                          >
                            <Newspaper className="w-4 h-4" />
                            <span>Publish Article</span>
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}

                {/* TAB CONTENT 2: TRANSACTIONS & REVENUE DASHBOARD (SUPER-ADMIN ONLY) */}
                {adminTab === 'transactions' && adminAuthUser.role === 'owner' && (
                  <div className="space-y-5">
                    {/* Top 4 Metrics Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="bg-[#0e1117] p-3.5 rounded-xl border border-stone-800 space-y-1">
                        <span className="text-[10px] uppercase font-mono text-stone-400">Total Naira Revenue</span>
                        <div className="font-display text-lg sm:text-xl font-extrabold text-orange-400">₦272,000</div>
                        <span className="text-[10px] text-emerald-400 font-mono">+18.4% this month</span>
                      </div>

                      <div className="bg-[#0e1117] p-3.5 rounded-xl border border-stone-800 space-y-1">
                        <span className="text-[10px] uppercase font-mono text-stone-400">Total USD Revenue</span>
                        <div className="font-display text-lg sm:text-xl font-extrabold text-white">$307.00</div>
                        <span className="text-[10px] text-emerald-400 font-mono">PayPal International</span>
                      </div>

                      <div className="bg-[#0e1117] p-3.5 rounded-xl border border-stone-800 space-y-1">
                        <span className="text-[10px] uppercase font-mono text-stone-400">Total Beats Sold</span>
                        <div className="font-display text-lg sm:text-xl font-extrabold text-white">48 Leases</div>
                        <span className="text-[10px] text-stone-400 font-mono">Instant STEM delivery</span>
                      </div>

                      <div className="bg-[#0e1117] p-3.5 rounded-xl border border-stone-800 space-y-1">
                        <span className="text-[10px] uppercase font-mono text-stone-400">Paid Submissions</span>
                        <div className="font-display text-lg sm:text-xl font-extrabold text-amber-400">32 Orders</div>
                        <span className="text-[10px] text-stone-400 font-mono">Editorial Reviews</span>
                      </div>
                    </div>

                    {/* Transaction History Table */}
                    <div className="bg-[#0e1117] rounded-xl border border-stone-800 overflow-hidden">
                      <div className="p-3 bg-[#12151b] border-b border-stone-800 flex items-center justify-between">
                        <h4 className="font-display text-xs font-bold text-white uppercase tracking-wider">
                          Live Transaction History &amp; Settlement Log
                        </h4>
                        <span className="text-[10px] font-mono text-stone-400">5 Recent Records</span>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-[#0a0c0f] text-stone-400 uppercase text-[10px] font-mono border-b border-stone-800">
                            <tr>
                              <th className="p-3">Date &amp; Time</th>
                              <th className="p-3">Customer</th>
                              <th className="p-3">Item Purchased</th>
                              <th className="p-3">Amount</th>
                              <th className="p-3">Gateway</th>
                              <th className="p-3 text-right">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-stone-800/60 font-mono">
                            {transactionsList.map((t) => (
                              <tr key={t.id} className="hover:bg-stone-800/30 transition-colors">
                                <td className="p-3 text-stone-400 whitespace-nowrap">{t.date}</td>
                                <td className="p-3 whitespace-nowrap">
                                  <div className="font-bold text-white">{t.customer}</div>
                                  <div className="text-[10px] text-stone-500">{t.email}</div>
                                </td>
                                <td className="p-3 text-stone-300 max-w-[200px] truncate">{t.item}</td>
                                <td className="p-3 whitespace-nowrap">
                                  <span className="text-orange-400 font-bold">{t.amountNgn}</span>
                                  <span className="text-stone-500 block text-[10px]">({t.amountUsd})</span>
                                </td>
                                <td className="p-3 whitespace-nowrap">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    t.gateway === 'Paystack' ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400'
                                  }`}>
                                    {t.gateway}
                                  </span>
                                </td>
                                <td className="p-3 text-right whitespace-nowrap">
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                    [{t.status}]
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB CONTENT 3: TEAM & STAFF MANAGEMENT (SUPER-ADMIN ONLY) */}
                {adminTab === 'team' && adminAuthUser.role === 'owner' && (
                  <div className="space-y-5">
                    {/* Active Staff List */}
                    <div className="bg-[#0e1117] rounded-xl border border-stone-800 overflow-hidden">
                      <div className="p-3 bg-[#12151b] border-b border-stone-800 flex items-center justify-between">
                        <h4 className="font-display text-xs font-bold text-white uppercase tracking-wider">
                          Active Staff Accounts ({staffAccounts.length})
                        </h4>
                        <span className="text-[10px] text-stone-400">Content Editors Restricted to Publishing</span>
                      </div>

                      <div className="divide-y divide-stone-800/80">
                        {staffAccounts.map((staff) => (
                          <div key={staff.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-stone-800/30 transition-colors">
                            <div className="space-y-1 text-xs">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white text-sm">{staff.name}</span>
                                <span className="text-[10px] font-mono bg-blue-500/20 text-blue-400 px-2 py-0.2 rounded border border-blue-500/30">
                                  [{staff.role}]
                                </span>
                              </div>
                              <p className="text-stone-400 font-mono text-[11px]">
                                Email: <span className="text-stone-300">{staff.email}</span> · Created: {staff.created}
                              </p>
                              <p className="text-[10px] text-stone-500 font-mono">
                                Password: <code className="text-stone-400">••••••••</code>
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleDeleteStaff(staff.id, staff.name)}
                              className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors self-start sm:self-center"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Revoke Access</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Add Worker Form */}
                    <form onSubmit={handleCreateStaff} className="bg-[#0e1117] p-4 rounded-xl border border-stone-800 space-y-3">
                      <h4 className="font-display text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                        <UserPlus className="w-4 h-4 text-orange-400" />
                        <span>Add New Staff Account</span>
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div>
                          <label className="block text-stone-300 mb-1">Worker Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Samuel Okon"
                            value={newStaffForm.name}
                            onChange={(e) => setNewStaffForm({ ...newStaffForm, name: e.target.value })}
                            className="w-full bg-[#181c24] text-white px-3 py-2 rounded-lg border border-stone-700"
                          />
                        </div>

                        <div>
                          <label className="block text-stone-300 mb-1">Assigned Email *</label>
                          <input
                            type="email"
                            required
                            placeholder="samuel@afropulse.com"
                            value={newStaffForm.email}
                            onChange={(e) => setNewStaffForm({ ...newStaffForm, email: e.target.value })}
                            className="w-full bg-[#181c24] text-white px-3 py-2 rounded-lg border border-stone-700"
                          />
                        </div>

                        <div>
                          <label className="block text-stone-300 mb-1">Assigned Password *</label>
                          <input
                            type="password"
                            required
                            placeholder="Temporary password"
                            value={newStaffForm.password}
                            onChange={(e) => setNewStaffForm({ ...newStaffForm, password: e.target.value })}
                            className="w-full bg-[#181c24] text-white px-3 py-2 rounded-lg border border-stone-700 font-mono"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-stone-400">
                          Role: <strong className="text-orange-400">Content Editor Only</strong> (No access to revenue or security)
                        </span>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-orange-500 hover:bg-orange-400 text-stone-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-md"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>Create Staff Login</span>
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* TAB CONTENT 4: MASTER SECURITY & PASSWORD MANAGER (SUPER-ADMIN ONLY) */}
                {adminTab === 'security' && adminAuthUser.role === 'owner' && (
                  <form onSubmit={handleUpdateMasterPassword} className="bg-[#0e1117] p-5 rounded-xl border border-stone-800 space-y-4 max-w-lg">
                    <div className="space-y-1">
                      <h4 className="font-display text-sm font-bold text-white flex items-center gap-2">
                        <Key className="w-4 h-4 text-orange-400" />
                        <span>Update Super-Admin Master Password</span>
                      </h4>
                      <p className="text-xs text-stone-400">
                        Changes the primary cryptographic master password protecting full administrative privileges.
                      </p>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-stone-300 font-medium mb-1">Current Master Password *</label>
                        <input
                          type="password"
                          required
                          value={securityForm.currentPass}
                          onChange={(e) => setSecurityForm({ ...securityForm, currentPass: e.target.value })}
                          placeholder="Current password"
                          className="w-full bg-[#181c24] text-white px-3 py-2.5 rounded-xl border border-stone-700 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-stone-300 font-medium mb-1">New Master Password *</label>
                        <input
                          type="password"
                          required
                          value={securityForm.newPass}
                          onChange={(e) => setSecurityForm({ ...securityForm, newPass: e.target.value })}
                          placeholder="At least 8 characters"
                          className="w-full bg-[#181c24] text-white px-3 py-2.5 rounded-xl border border-stone-700 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-stone-300 font-medium mb-1">Confirm New Password *</label>
                        <input
                          type="password"
                          required
                          value={securityForm.confirmPass}
                          onChange={(e) => setSecurityForm({ ...securityForm, confirmPass: e.target.value })}
                          placeholder="Repeat new password"
                          className="w-full bg-[#181c24] text-white px-3 py-2.5 rounded-xl border border-stone-700 font-mono"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 text-stone-950 font-black text-xs uppercase rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Update Master Credentials</span>
                    </button>
                  </form>
                )}

                {/* Backend / Supabase Status Banner */}
                <div className="bg-[#0a0c0f] p-3 rounded-xl border border-stone-800 text-[11px] text-stone-400 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Database className="w-3.5 h-3.5 text-emerald-400" />
                    <span>
                      Storage Engine: <strong className="text-white">Active (Client + LocalStorage Ingestion)</strong>
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-stone-500">
                    Ready for Supabase Vercel Sync
                  </span>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
