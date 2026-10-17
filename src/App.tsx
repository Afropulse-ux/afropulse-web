import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- SUPABASE CLIENT SETUP ---
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || '';
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- TYPES ---
export interface Post {
  id: string;
  title: string;
  content: string;
  category?: string;
  image_url?: string;
  created_at?: string;
  author?: string;
}

export interface Beat {
  id: string;
  title: string;
  genre: string;
  price: number;
  bpm: number;
  audio_url: string;
  cover_url?: string;
}

export default function App() {
  // --- STATES ---
  const [posts, setPosts] = useState<Post[]>([]);
  const [beats, setBeats] = useState<Beat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'news' | 'beats' | 'admin'>('news');

  // Form states for Admin Upload
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('News');
  const [newContent, setNewContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Player state
  const [currentTrack, setCurrentTrack] = useState<Beat | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // --- INITIAL DATA FETCH ---
  useEffect(() => {
    fetchPosts();
    fetchBeats();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching posts:', error.message);
      } else {
        setPosts(data || []);
      }
    } catch (err) {
      console.error('Unexpected error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBeats = async () => {
    try {
      const { data, error } = await supabase
        .from('beats')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setBeats(data);
      }
    } catch (err) {
      console.error('Error fetching beats:', err);
    }
  };

  // --- PERSISTENT IMAGE UPLOAD TO SUPABASE STORAGE ---
  const uploadArtworkToStorage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `posts/${fileName}`;

      // Upload file to 'artworks' public bucket
      const { error: uploadError } = await supabase.storage
        .from('artworks')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (uploadError) {
        throw uploadError;
      }

      // Retrieve permanent public URL
      const { data } = supabase.storage
        .from('artworks')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (err: any) {
      console.error('Storage upload error:', err.message || err);
      return null;
    }
  };

  // --- HANDLE CREATING A NEW POST ---
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent) {
      setStatusMessage('Please fill in required fields.');
      return;
    }

    setUploading(true);
    setStatusMessage('Uploading post and artwork...');

    let publicImageUrl = '';

    if (selectedFile) {
      const uploadedUrl = await uploadArtworkToStorage(selectedFile);
      if (uploadedUrl) {
        publicImageUrl = uploadedUrl;
      } else {
        setStatusMessage('Image upload failed. Post creation canceled.');
        setUploading(false);
        return;
      }
    }

    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([
          {
            title: newTitle,
            category: newCategory,
            content: newContent,
            image_url: publicImageUrl,
            created_at: new Date().toISOString()
          }
        ])
        .select();

      if (error) {
        throw error;
      }

      setStatusMessage('Post created successfully!');
      setNewTitle('');
      setNewContent('');
      setSelectedFile(null);
      fetchPosts(); // Refresh list
    } catch (err: any) {
      setStatusMessage(`Error creating post: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  // --- PAYSTACK CHECKOUT INTEGRATION ---
  const handlePaystackCheckout = (beat: Beat) => {
    const paystack = (window as any).PaystackPop;
    if (!paystack) {
      alert('Paystack SDK failed to load. Please check your connection.');
      return;
    }

    const handler = paystack.setup({
      key: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY || 'pk_test_sample_key',
      email: 'customer@afropulse.com',
      amount: beat.price * 100, // Amount in Kobo / Cents
      currency: 'NGN',
      ref: 'AP_' + Math.floor(Math.random() * 1000000000 + 1),
      onClose: function () {
        alert('Transaction canceled.');
      },
      callback: function (response: any) {
        alert(`Payment successful! Reference: ${response.reference}`);
        // Handle post-purchase fulfillment / download logic here
      }
    });

    handler.openIframe();
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans">
      {/* HEADER / NAVIGATION */}
      <header className="border-b border-neutral-800 bg-neutral-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setActiveTab('news')}>
            <span className="text-2xl font-black tracking-widest text-orange-500">AFROPULSE</span>
            <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full font-bold">ENT</span>
          </div>

          <nav className="flex space-x-6 text-sm font-semibold">
            <button
              onClick={() => setActiveTab('news')}
              className={`hover:text-orange-400 transition ${activeTab === 'news' ? 'text-orange-500 underline underline-offset-8' : 'text-neutral-400'}`}
            >
              Trending & News
            </button>
            <button
              onClick={() => setActiveTab('beats')}
              className={`hover:text-orange-400 transition ${activeTab === 'beats' ? 'text-orange-500 underline underline-offset-8' : 'text-neutral-400'}`}
            >
              Beat Store
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`hover:text-orange-400 transition ${activeTab === 'admin' ? 'text-orange-500 underline underline-offset-8' : 'text-neutral-400'}`}
            >
              Admin Dashboard
            </button>
          </nav>
        </div>
      </header>

      {/* MAIN CONTENT CONTAINERS */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* --- NEWS & TRENDING SECTION --- */}
        {activeTab === 'news' && (
          <section>
            <h1 className="text-3xl font-extrabold mb-6 tracking-tight">Latest Entertainment & Media</h1>
            
            {loading ? (
              <div className="py-20 text-center text-neutral-500">Loading posts from AfroPulse...</div>
            ) : posts.length === 0 ? (
              <div className="py-20 text-center text-neutral-500 border border-dashed border-neutral-800 rounded-xl">
                No posts available yet. Head to the Admin tab to publish news!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <article key={post.id} className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden hover:border-neutral-700 transition flex flex-col">
                    {post.image_url ? (
                      <img
                        src={post.image_url}
                        alt={post.title}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          // Fallback on broken image load
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x400?text=AfroPulse+Media';
                        }}
                      />
                    ) : (
                      <div className="w-full h-48 bg-neutral-800 flex items-center justify-center text-neutral-600 font-bold">
                        AFROPULSE MEDIA
                      </div>
                    )}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-xs font-bold text-orange-500 uppercase tracking-wider">
                          {post.category || 'General'}
                        </span>
                        <h2 className="text-xl font-bold mt-1 text-neutral-100 line-clamp-2">{post.title}</h2>
                        <p className="text-neutral-400 text-sm mt-2 line-clamp-3">{post.content}</p>
                      </div>
                      <div className="mt-4 pt-4 border-t border-neutral-800/60 text-xs text-neutral-500 flex justify-between">
                        <span>{post.created_at ? new Date(post.created_at).toLocaleDateString() : 'Recent'}</span>
                        <span>AfroPulse Studio</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {/* --- BEAT STORE SECTION --- */}
        {activeTab === 'beats' && (
          <section>
            <h1 className="text-3xl font-extrabold mb-6 tracking-tight">AfroPulse Beat Marketplace</h1>
            
            {beats.length === 0 ? (
              <div className="py-20 text-center text-neutral-500 border border-dashed border-neutral-800 rounded-xl">
                No beats currently available in the catalog.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {beats.map((beat) => (
                  <div key={beat.id} className="bg-neutral-900 border border-neutral-800 p-5 rounded-xl flex flex-col justify-between">
                    <div>
                      <div className="w-full h-40 bg-neutral-800 rounded-lg overflow-hidden mb-4 relative group">
                        {beat.cover_url ? (
                          <img src={beat.cover_url} alt={beat.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-600">No Art</div>
                        )}
                        <button
                          onClick={() => {
                            setCurrentTrack(beat);
                            setIsPlaying(true);
                          }}
                          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center font-bold text-white"
                        >
                          ▶ Play Preview
                        </button>
                      </div>
                      <h3 className="text-lg font-bold text-white">{beat.title}</h3>
                      <p className="text-sm text-neutral-400">{beat.genre} • {beat.bpm} BPM</p>
                    </div>

                    <div className="mt-6 flex justify-between items-center pt-4 border-t border-neutral-800">
                      <span className="text-xl font-black text-orange-500">₦{beat.price.toLocaleString()}</span>
                      <button
                        onClick={() => handlePaystackCheckout(beat)}
                        className="bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs px-4 py-2 rounded-lg transition"
                      >
                        Buy License
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* --- ADMIN DASHBOARD SECTION --- */}
        {activeTab === 'admin' && (
          <section className="max-w-2xl mx-auto bg-neutral-900 border border-neutral-800 p-6 rounded-2xl">
            <h1 className="text-2xl font-bold mb-4">Publish New Media Post</h1>
            
            {statusMessage && (
              <div className="mb-4 p-3 bg-neutral-800 border border-neutral-700 text-sm rounded-lg text-orange-400">
                {statusMessage}
              </div>
            )}

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Post Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Enter track or news title"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-sm focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-sm focus:outline-none focus:border-orange-500"
                >
                  <option value="News">News</option>
                  <option value="Afrobeats">Afrobeats</option>
                  <option value="Amapiano">Amapiano</option>
                  <option value="Highlife">Highlife</option>
                  <option value="Review">Song Review</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Artwork / Cover Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                  className="w-full text-xs text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-orange-500/10 file:text-orange-400 hover:file:bg-orange-500/20"
                />
                <p className="text-[11px] text-neutral-500 mt-1">Uploads directly to Supabase Public Bucket to prevent loss on redeploy.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Content / Description *</label>
                <textarea
                  rows={5}
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Write post content or track details..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-sm focus:outline-none focus:border-orange-500"
                />
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition"
              >
                {uploading ? 'Publishing Post...' : 'Publish to AfroPulse'}
              </button>
            </form>
          </section>
        )}
      </main>

      {/* FOOTER AUDIO PLAYER BAR */}
      {currentTrack && (
        <div className="fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-800 p-4 z-50 flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-neutral-800 rounded overflow-hidden">
              {currentTrack.cover_url && <img src={currentTrack.cover_url} alt="" className="w-full h-full object-cover" />}
            </div>
            <div>
              <p className="text-sm font-bold text-white">{currentTrack.title}</p>
              <p className="text-xs text-neutral-400">{currentTrack.genre}</p>
            </div>
          </div>

          <audio
            controls
            autoPlay={isPlaying}
            src={currentTrack.audio_url}
            className="h-10 w-full max-w-md"
          />

          <button
            onClick={() => setCurrentTrack(null)}
            className="text-neutral-500 hover:text-white text-xs font-bold"
          >
            ✕ Close
          </button>
        </div>
      )}
    </div>
  );
}
