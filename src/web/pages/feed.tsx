import { Link } from "wouter";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { authClient } from "../lib/auth";
import { useCustomer } from "autumn-js/react";

interface Post {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  tier: string;
  ppvPrice: number | null;
  likes: number;
  category: string;
}

const CARD_COLORS = ["#c0395a", "#7b2d8b", "#1a6b8a", "#d4a853", "#2d8b4a"];

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<{ id: string } | null>(null);
  const { data: customer } = useCustomer();

  const isSubscriber =
    customer?.subscriptions?.some((s) => s.planId === "subscriber" || s.planId === "vip") ?? false;

  useEffect(() => {
    authClient.getSession().then((s) => setUser(s.data?.user ?? null));
    fetch("/api/posts")
      .then((r) => r.json())
      .then((d) => setPosts(d.posts || []));
  }, []);

  const isUnlocked = (post: Post) => {
    if (post.tier === "free") return true;
    if (!user) return false;
    if (post.tier === "subscriber") return isSubscriber;
    return false; // PPV needs individual unlock
  };

  return (
    <div className="min-h-screen" style={{ background: "#0a0508" }}>
      <Navbar />
      <div className="pt-28 pb-20 max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12 animate-fade-in-up stagger-1">
          <p className="text-xs tracking-[0.3em] uppercase mb-2" style={{ color: "#9a7080" }}>All Content</p>
          <h1 className="text-6xl font-black" style={{ fontFamily: "'Playfair Display', serif", color: "#f5e8ed" }}>
            THE <span style={{ color: "#c0395a" }}>FEED</span>
          </h1>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-3 mb-10 flex-wrap">
          {["All", "Photos", "Exclusive", "Free"].map((f) => (
            <button key={f} className="text-xs px-4 py-2 rounded-full border transition-all hover:border-[#c0395a] hover:text-[#f5e8ed]"
              style={{ borderColor: "#3a1528", color: "#9a7080" }}>
              {f}
            </button>
          ))}
          {!isSubscriber && (
            <Link href="/pricing">
              <button className="text-xs px-5 py-2 rounded-full font-semibold transition-all"
                style={{ background: "linear-gradient(135deg, #c0395a, #9a2040)", color: "#f5e8ed" }}>
                🔓 Unlock All — $9.99/mo
              </button>
            </Link>
          )}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {posts.map((post, i) => {
            const unlocked = isUnlocked(post);
            const color = CARD_COLORS[i % CARD_COLORS.length];

            return (
              <Link key={post.id} href={`/post/${post.id}`}>
                <div className="relative rounded-xl overflow-hidden cursor-pointer group transition-transform hover:scale-[1.02]"
                  style={{ height: "320px", background: "#130b0f" }}>
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${!unlocked ? "blur-lock" : ""}`}
                  />
                  <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${color}bb 0%, transparent 60%)` }} />

                  {!unlocked && (
                    <div className="absolute inset-0 flex items-center justify-center flex-col gap-2">
                      <span className="text-4xl">🔒</span>
                      {post.tier === "ppv" ? (
                        <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: "#d4a853", color: "#0a0508" }}>
                          PPV · ${post.ppvPrice}
                        </span>
                      ) : (
                        <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: "#c0395a", color: "#fff" }}>
                          Subscribe to Unlock
                        </span>
                      )}
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="text-[10px] tracking-widest uppercase opacity-70 mb-1" style={{ color: "#fff" }}>
                      {post.category} · ❤️ {post.likes?.toLocaleString()}
                    </div>
                    <h3 className="font-black text-lg leading-tight" style={{ fontFamily: "'Playfair Display', serif", color: "#fff" }}>
                      {post.title}
                    </h3>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Load more placeholder */}
        <div className="text-center mt-12">
          <button className="px-8 py-3 rounded-full border text-sm transition-all hover:border-[#c0395a] hover:text-[#f5e8ed]"
            style={{ borderColor: "#3a1528", color: "#9a7080" }}>
            Load More
          </button>
        </div>
      </div>
    </div>
  );
}
