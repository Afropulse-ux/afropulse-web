import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase Client securely using Vite's correct import.meta.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

// Core Jaguda / MusicHub Style Service Categories
const SERVICES = [
  { name: "Music", href: "/category/music" },
  { name: "News & Gossip", href: "/category/news" },
  { name: "Beat Store", href: "/beats" },
  { name: "Spotify Playlisting", href: "/services/spotify" },
  { name: "Music PR & Promotion", href: "/services/pr" },
  { name: "Radio & TikTok Promo", href: "/services/promo" },
];

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [heroTrack, setHeroTrack] = useState<any>(null);
  const [musicFeed, setMusicFeed] = useState<any[]>([]);
  const [newsFeed, setNewsFeed] = useState<any[]>([]);
  const [beatsList, setBeatsList] = useState<any[]>([]);
  const [headerAd, setHeaderAd] = useState<any>(null);
  const [selectedBeat, setSelectedBeat] = useState<any>(null);

  // Load Real Supabase Data
  useEffect(() => {
    async function loadData() {
      try {
        // Fetch Top Ad Slot
        const { data: adData } = await supabase
          .from("ads")
          .select("*")
          .eq("active", true)
          .eq("position", "header")
          .limit(1)
          .maybeSingle();
        if (adData) setHeaderAd(adData);

        // Fetch Hero / #1 Trending Track
        const { data: heroData } = await supabase
          .from("hero_tracks")
          .select("*, music(*)")
          .eq("active", true)
          .limit(1)
          .maybeSingle();
        if (heroData?.music) setHeroTrack(heroData.music);

        // Fetch Latest 10 Music Releases
        const { data: musicData } = await supabase
          .from("music")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(10);
        if (musicData) setMusicFeed(musicData);

        // Fetch Latest 10 News Posts
        const { data: newsData } = await supabase
          .from("posts")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(10);
        if (newsData) setNewsFeed(newsData);

        // Fetch Beats
        const { data: beatsData } = await supabase
          .from("beats")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5);
        if (beatsData) setBeatsList(beatsData);
      } catch (err) {
        console.error("Supabase load error:", err);
      }
    }
    loadData();
  }, []);

  // Paystack Redirect Action
  const handlePaystackCheckout = (beat: any, licenseType: string, price: number) => {
    if (typeof window !== "undefined") {
      window.location.href = `/checkout/paystack?beat_id=${beat.id}&license=${encodeURIComponent(licenseType)}&amount=${price}`;
    }
  };

  return (
    <main className="w-full min-h-screen bg-[#0d0d0d] text-white overflow-x-hidden max-w-full font-sans">
      {/* 1. TOP HEADER & SEARCH BAR */}
      <header className="w-full border-b border-gray-800 bg-[#121212] sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
          <a href="/" className="text-2xl font-black tracking-wider text-emerald-500 uppercase">
            Afro<span className="text-white">Pulse</span>
          </a>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
            }}
            className="w-full md:w-80 relative"
          >
            <input
              type="text"
              placeholder="Search music, news, beats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1e1e1e] border border-gray-700 rounded-full py-2 px-4 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </form>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 w-full py-4 space-y-6">
        {/* DYNAMIC HEADER AD */}
        {headerAd && (
          <div className="w-full bg-[#141414] border border-gray-800 rounded-lg p-2 text-center overflow-hidden">
            <a href={headerAd.target_url || "#"} target="_blank" rel="noopener noreferrer">
              <img src={headerAd.image_url} alt="Ad" className="max-h-24 mx-auto object-contain rounded" />
            </a>
          </div>
        )}

        {/* 2. PADDED BRAND SERVICE CATEGORY BOXES */}
        <nav className="w-full overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center gap-2 min-w-max">
            {SERVICES.map((srv, idx) => (
              <a
                key={idx}
                href={srv.href}
                className="px-4 py-2.5 bg-[#181818] border border-gray-800 hover:border-emerald-500 hover:text-emerald-400 rounded-lg text-xs md:text-sm font-semibold transition text-center shadow-sm whitespace-nowrap"
              >
                {srv.name}
              </a>
            ))}
          </div>
        </nav>

        {/* 3. COMPACT #1 TRENDING TRACK (HERO MANAGER) */}
        {heroTrack && (
          <section className="w-full bg-gradient-to-r from-[#181818] to-[#121212] border border-emerald-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <img
                src={heroTrack.cover_url || "/placeholder-cover.jpg"}
                alt={heroTrack.title}
                className="w-20 h-20 object-cover rounded-lg shrink-0 border border-gray-700"
              />
              <div className="min-w-0 flex-1">
                <span className="inline-block px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold tracking-wide rounded uppercase border border-emerald-500/20 mb-1">
                  #1 Trending Release
                </span>
                <h2 className="text-base font-bold text-white truncate">{heroTrack.title}</h2>
                <p className="text-xs text-gray-400 truncate">{heroTrack.artist}</p>
              </div>
            </div>
            <a
              href={`/music/${heroTrack.slug || heroTrack.id}`}
              className="w-full sm:w-auto text-center px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shrink-0 transition"
            >
              Listen / Download
            </a>
          </section>
        )}

        {/* 4. MAIN CONTENT & SIDEBAR GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT 2 COLUMNS: MUSIC & NEWS FEEDS */}
          <div className="lg:col-span-2 space-y-8">
            {/* LATEST MUSIC & VIDEOS (10 ITEMS) */}
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                <h3 className="text-lg font-bold text-white border-l-4 border-emerald-500 pl-3">Latest Music & Videos</h3>
              </div>
              <div className="space-y-3">
                {musicFeed.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-2.5 bg-[#141414] border border-gray-800/80 rounded-lg hover:border-gray-700 transition">
                    <img
                      src={item.cover_url || "/placeholder-cover.jpg"}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] text-emerald-400 font-semibold uppercase">{item.genre || "Music"}</span>
                      <h4 className="text-sm font-semibold text-white truncate">{item.title}</h4>
                      <p className="text-xs text-gray-400 truncate">{item.artist}</p>
                    </div>
                    <a
                      href={`/music/${item.slug || item.id}`}
                      className="px-3 py-1.5 bg-gray-800 hover:bg-emerald-600 text-white text-xs rounded transition shrink-0"
                    >
                      Listen
                    </a>
                  </div>
                ))}
              </div>
              <div className="text-center pt-2">
                <a
                  href="/category/music"
                  className="inline-block px-6 py-2 bg-[#181818] border border-gray-800 hover:border-emerald-500 text-xs font-semibold rounded-lg text-gray-300 hover:text-white transition"
                >
                  View More Music & Videos
                </a>
              </div>
            </section>

            {/* LATEST NEWS & GOSSIP (10 ITEMS) */}
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                <h3 className="text-lg font-bold text-white border-l-4 border-emerald-500 pl-3">Latest News & Gossip</h3>
              </div>
              <div className="space-y-3">
                {newsFeed.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-2.5 bg-[#141414] border border-gray-800/80 rounded-lg hover:border-gray-700 transition">
                    <img
                      src={item.featured_image || "/placeholder-news.jpg"}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] text-gray-400 uppercase">{item.category || "News"}</span>
                      <h4 className="text-sm font-semibold text-white truncate">{item.title}</h4>
                      <p className="text-xs text-gray-500 truncate">
                        {item.created_at ? new Date(item.created_at).toLocaleDateString() : "Recent"}
                      </p>
                    </div>
                    <a
                      href={`/news/${item.slug || item.id}`}
                      className="px-3 py-1.5 bg-gray-800 hover:bg-emerald-600 text-white text-xs rounded transition shrink-0"
                    >
                      Read
                    </a>
                  </div>
                ))}
              </div>
              <div className="text-center pt-2">
                <a
                  href="/category/news"
                  className="inline-block px-6 py-2 bg-[#181818] border border-gray-800 hover:border-emerald-500 text-xs font-semibold rounded-lg text-gray-300 hover:text-white transition"
                >
                  View More News
                </a>
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: SIDEBAR & BEAT STORE */}
          <div className="space-y-6">
            {/* BEAT STORE PREVIEW */}
            <section className="p-4 bg-[#141414] border border-gray-800 rounded-xl space-y-4">
              <h3 className="text-base font-bold text-white border-b border-gray-800 pb-2">Beat Store (Licensing)</h3>
              <div className="space-y-3">
                {beatsList.map((beat) => (
                  <div key={beat.id} className="p-3 bg-[#1a1a1a] border border-gray-800 rounded-lg flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{beat.title}</p>
                      <p className="text-[10px] text-emerald-400 font-semibold">From ₦{beat.price_mp3 || "15,000"}</p>
                    </div>
                    <button
                      onClick={() => setSelectedBeat(beat)}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded transition shrink-0"
                    >
                      Buy License
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* TOP 10 SONGS SIDEBAR */}
            <section className="p-4 bg-[#141414] border border-gray-800 rounded-xl space-y-3">
              <h3 className="text-base font-bold text-white border-b border-gray-800 pb-2">Top 10 Songs</h3>
              <div className="space-y-2">
                {musicFeed.slice(0, 10).map((track, idx) => (
                  <div key={track.id || idx} className="flex items-center gap-3 text-xs">
                    <span className="font-bold text-emerald-400 w-4">{idx + 1}.</span>
                    <a href={`/music/${track.slug || track.id}`} className="text-gray-200 hover:text-emerald-400 truncate flex-1">
                      {track.title} - {track.artist}
                    </a>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* BEAT LICENSING & PAYSTACK MODAL */}
      {selectedBeat && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#181818] border border-gray-800 rounded-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-2">
              <h3 className="text-base font-bold text-white">Select License: {selectedBeat.title}</h3>
              <button onClick={() => setSelectedBeat(null)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#121212] border border-gray-800 rounded flex justify-between items-center">
                <div>
                  <p className="font-bold text-white">Basic MP3 Lease</p>
                  <p className="text-gray-400">Untagged MP3 • Standard Usage</p>
                </div>
                <button
                  onClick={() => handlePaystackCheckout(selectedBeat, "mp3", selectedBeat.price_mp3 || 15000)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold"
                >
                  ₦{selectedBeat.price_mp3 || "15,000"}
                </button>
              </div>
              <div className="p-3 bg-[#121212] border border-gray-800 rounded flex justify-between items-center">
                <div>
                  <p className="font-bold text-white">Premium WAV Lease</p>
                  <p className="text-gray-400">WAV + MP3 • Commercial Usage</p>
                </div>
                <button
                  onClick={() => handlePaystackCheckout(selectedBeat, "wav", selectedBeat.price_wav || 35000)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold"
                >
                  ₦{selectedBeat.price_wav || "35,000"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
