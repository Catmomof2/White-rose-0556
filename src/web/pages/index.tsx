import { Link } from "wouter";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

interface Post {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  tier: string;
  ppvPrice: number | null;
  likes: number;
  category: string;
  locked?: boolean;
}

const CARD_COLORS = ["#c0395a", "#7b2d8b", "#1a6b8a", "#d4a853", "#2d8b4a", "#c0395a"];

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [seeded, setSeeded] = useState(false);

  useEffect(() => {
    fetch("/api/posts/seed", { method: "POST" }).then(() => setSeeded(true));
  }, []);

  useEffect(() => {
    if (!seeded) return;
    fetch("/api/posts")
      .then((r) => r.json())
      .then((d) => setPosts(d.posts || []));
  }, [seeded]);

  const stats = [
    { label: "Fans", value: "24.8K" },
    { label: "Posts", value: "312" },
    { label: "Photos", value: "287" },
    { label: "Videos", value: "25" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#0a0508" }}>
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-end pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/model-hero.png"
            alt="Little White Rose"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0" style={{
            background: "linear-gradient(to bottom, rgba(10,5,8,0.3) 0%, rgba(10,5,8,0.1) 40%, rgba(10,5,8,0.85) 75%, #0a0508 100%)"
          }} />
          {/* Rose glow overlay */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl opacity-30"
            style={{ background: "radial-gradient(circle, #c0395a, transparent)" }} />
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto px-6">
          <div className="animate-fade-in-up stagger-1">
            <p className="text-sm tracking-[0.4em] uppercase mb-3" style={{ color: "#e8678a", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}>
              exclusive creator
            </p>
            <h1 className="text-7xl md:text-9xl font-black leading-none mb-2" style={{ fontFamily: "'Playfair Display', serif", color: "#f5e8ed" }}>
              LITTLE
            </h1>
            <h1 className="text-7xl md:text-9xl font-black leading-none mb-6" style={{ fontFamily: "'Playfair Display', serif", color: "#c0395a" }}>
              WHITE ROSE
            </h1>
          </div>

          <p className="text-lg max-w-xl mb-8 animate-fade-in-up stagger-2" style={{ color: "#9a7080", fontWeight: 300, lineHeight: 1.8 }}>
            Your sweetest escape. Exclusive photos, intimate moments, and personal chats — available only to my most devoted fans.
          </p>

          {/* Stats */}
          <div className="flex gap-8 mb-10 animate-fade-in-up stagger-3">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: "#f5e8ed" }}>{s.value}</div>
                <div className="text-xs tracking-widest uppercase" style={{ color: "#9a7080" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex gap-4 flex-wrap animate-fade-in-up stagger-4">
            <Link href="/pricing">
              <button className="px-8 py-4 rounded-full text-sm font-bold tracking-widest uppercase transition-all animate-glow-pulse"
                style={{ background: "linear-gradient(135deg, #c0395a, #9a2040)", color: "#f5e8ed", letterSpacing: "0.2em" }}>
                Subscribe — $9.99/mo
              </button>
            </Link>
            <Link href="/chat">
              <button className="px-8 py-4 rounded-full text-sm font-semibold tracking-widest uppercase transition-all border"
                style={{ borderColor: "#3a1528", color: "#f2b8cb", background: "rgba(192,57,90,0.1)" }}>
                Chat With Me 💬
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Strip */}
      <section className="py-10 border-y" style={{ borderColor: "#1e1018", background: "#0d070a" }}>
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between flex-wrap gap-6">
          <div className="flex items-center gap-4">
            <img src="/model-avatar.png" alt="Rose" className="w-16 h-16 rounded-full object-cover border-2" style={{ borderColor: "#c0395a" }} />
            <div>
              <div className="font-bold text-lg" style={{ fontFamily: "'Playfair Display', serif", color: "#f5e8ed" }}>Little White Rose</div>
              <div className="text-sm" style={{ color: "#9a7080" }}>Your favorite digital sweetheart 🌹</div>
            </div>
          </div>
          <p className="text-sm max-w-md leading-relaxed" style={{ color: "#9a7080" }}>
            "I love making my fans feel special, desired, and totally obsessed 💋 Subscribe for full access to everything — exclusive photos, videos, and personal chats just for you, darling."
          </p>
          <div className="flex gap-3">
            {["🌹 Daily Posts", "💬 Personal Chat", "🔒 Exclusive Content"].map((tag) => (
              <span key={tag} className="text-xs px-3 py-1 rounded-full border" style={{ borderColor: "#3a1528", color: "#f2b8cb", background: "rgba(192,57,90,0.08)" }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Content Grid — Vesper-style bold cards */}
      <section className="py-20 max-w-6xl mx-auto px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase mb-2" style={{ color: "#9a7080" }}>Latest Content</p>
            <h2 className="text-5xl font-black" style={{ fontFamily: "'Playfair Display', serif", color: "#f5e8ed" }}>
              RECENT <span style={{ color: "#c0395a" }}>POSTS</span>
            </h2>
          </div>
          <Link href="/feed">
            <button className="text-sm px-6 py-2 rounded-full border transition-all hover:border-[#c0395a] hover:text-[#f5e8ed]"
              style={{ borderColor: "#3a1528", color: "#9a7080" }}>
              View All →
            </button>
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`rounded-2xl overflow-hidden animate-pulse ${i === 0 ? "md:col-span-2 md:row-span-2" : ""}`}
                style={{ background: "#130b0f", height: i === 0 ? "500px" : "240px" }} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {posts.map((post, i) => {
              const isLarge = i === 0;
              const color = CARD_COLORS[i % CARD_COLORS.length];
              const isLocked = post.tier !== "free";

              return (
                <Link key={post.id} href={`/post/${post.id}`}>
                  <div
                    className={`relative rounded-2xl overflow-hidden cursor-pointer group transition-transform hover:scale-[1.02] ${isLarge ? "md:col-span-2" : ""}`}
                    style={{ height: isLarge ? "420px" : "280px", background: "#130b0f" }}
                  >
                    {/* Image */}
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${isLocked ? "blur-lock" : ""}`}
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${color}cc 0%, transparent 50%)` }} />

                    {/* Lock icon for gated content */}
                    {isLocked && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-5xl mb-2">🔒</div>
                          {post.tier === "ppv" && (
                            <div className="text-sm font-bold px-4 py-2 rounded-full"
                              style={{ background: "#d4a853", color: "#0a0508" }}>
                              Unlock for ${post.ppvPrice}
                            </div>
                          )}
                          {post.tier === "subscriber" && (
                            <div className="text-sm font-bold px-4 py-2 rounded-full"
                              style={{ background: "#c0395a", color: "#f5e8ed" }}>
                              Subscribers Only
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Content label */}
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <div className="text-xs tracking-widest uppercase mb-1" style={{ color: "rgba(255,255,255,0.6)" }}>
                        {post.category} • {post.likes?.toLocaleString()} likes
                      </div>
                      <h3 className="font-black text-2xl leading-tight" style={{ fontFamily: "'Playfair Display', serif", color: "#fff" }}>
                        {post.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Subscribe CTA Banner */}
      <section className="py-24" style={{ background: "linear-gradient(135deg, #1e1018, #0a0508)" }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-sm tracking-[0.4em] uppercase mb-4" style={{ color: "#e8678a", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}>
            Don't miss a thing
          </p>
          <h2 className="text-5xl md:text-7xl font-black mb-6" style={{ fontFamily: "'Playfair Display', serif", color: "#f5e8ed" }}>
            BECOME A <span style={{ color: "#c0395a" }}>FAN</span>
          </h2>
          <p className="text-lg mb-10 max-w-xl mx-auto" style={{ color: "#9a7080", fontWeight: 300 }}>
            Get unlimited access to all my content, exclusive behind-the-scenes photos, and personal chat — starting at just $9.99/month 🌹
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/pricing">
              <button className="px-10 py-5 rounded-full text-base font-bold tracking-wider uppercase rose-glow rose-glow-hover"
                style={{ background: "linear-gradient(135deg, #c0395a, #9a2040)", color: "#f5e8ed" }}>
                See All Plans
              </button>
            </Link>
            <Link href="/chat">
              <button className="px-10 py-5 rounded-full text-base font-semibold tracking-wider"
                style={{ border: "1px solid #d4a853", color: "#d4a853", background: "transparent" }}>
                Free Chat Preview
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-10" style={{ borderColor: "#1e1018", background: "#0a0508" }}>
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between flex-wrap gap-4">
          <span className="text-xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: "#c0395a" }}>🌹 Little White Rose</span>
          <div className="flex gap-6 text-sm" style={{ color: "#9a7080" }}>
            <Link href="/pricing"><span className="hover:text-[#f5e8ed] cursor-pointer transition-colors">Subscribe</span></Link>
            <Link href="/chat"><span className="hover:text-[#f5e8ed] cursor-pointer transition-colors">Chat</span></Link>
            <Link href="/sign-up"><span className="hover:text-[#f5e8ed] cursor-pointer transition-colors">Join</span></Link>
          </div>
          <p className="text-xs" style={{ color: "#3a1528" }}>© 2025 Little White Rose. 18+ Only.</p>
        </div>
      </footer>
    </div>
  );
}
