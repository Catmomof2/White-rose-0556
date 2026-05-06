import { Link, useRoute } from "wouter";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useCustomer } from "autumn-js/react";
import { authClient } from "../lib/auth";

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

export default function PostPage() {
  const [, params] = useRoute("/post/:id");
  const [post, setPost] = useState<Post | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tipAmount, setTipAmount] = useState("");
  const [tipMessage, setTipMessage] = useState("");
  const [tipping, setTipping] = useState(false);

  const { data: customer, attach } = useCustomer();
  const isSubscriber =
    customer?.subscriptions?.some((s) => s.planId === "subscriber" || s.planId === "vip") ?? false;

  useEffect(() => {
    if (!params?.id) return;
    fetch(`/api/posts/${params.id}`)
      .then((r) => r.json())
      .then((d) => {
        setPost(d.post);
        setUnlocked(d.unlocked);
        setLoading(false);
      });
  }, [params?.id]);

  const handleSubscribe = async () => {
    await attach({ planId: "subscriber", successUrl: window.location.href });
  };

  const handlePPVUnlock = async () => {
    await attach({ planId: "subscriber", successUrl: window.location.href });
  };

  const handleTip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tipAmount) return;
    setTipping(true);
    // In production: trigger Stripe payment for tip
    // For demo, we just show success
    setTimeout(() => {
      setTipping(false);
      setTipAmount("");
      setTipMessage("");
      alert("Thank you for your tip, darling! 💋");
    }, 1500);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0508" }}>
        <Navbar />
        <div className="w-12 h-12 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "#c0395a", borderTopColor: "transparent" }} />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0508" }}>
        <Navbar />
        <p style={{ color: "#9a7080" }}>Post not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#0a0508" }}>
      <Navbar />
      <div className="pt-24 pb-20 max-w-5xl mx-auto px-6">
        <Link href="/feed">
          <span className="text-sm mb-8 inline-block cursor-pointer hover:text-[#e8678a] transition-colors" style={{ color: "#9a7080" }}>
            ← Back to Feed
          </span>
        </Link>

        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* Image */}
          <div className="relative rounded-2xl overflow-hidden" style={{ background: "#130b0f" }}>
            <img
              src={post.imageUrl}
              alt={post.title}
              className={`w-full object-cover ${!unlocked ? "blur-lock" : ""}`}
              style={{ maxHeight: "600px" }}
            />
            {!unlocked && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <div className="text-6xl">🔒</div>
                <p className="text-lg font-bold" style={{ color: "#f5e8ed", fontFamily: "'Playfair Display', serif" }}>
                  Exclusive Content
                </p>
                {post.tier === "ppv" && (
                  <button
                    onClick={handlePPVUnlock}
                    className="px-8 py-3 rounded-full font-bold transition-all rose-glow"
                    style={{ background: "#d4a853", color: "#0a0508" }}
                  >
                    Unlock for ${post.ppvPrice}
                  </button>
                )}
                {post.tier === "subscriber" && !isSubscriber && (
                  <button
                    onClick={handleSubscribe}
                    className="px-8 py-3 rounded-full font-bold transition-all rose-glow"
                    style={{ background: "linear-gradient(135deg, #c0395a, #9a2040)", color: "#f5e8ed" }}
                  >
                    Subscribe — $9.99/mo
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <span className="text-xs tracking-widest uppercase" style={{ color: "#9a7080" }}>{post.category}</span>
              <h1 className="text-4xl font-black mt-1" style={{ fontFamily: "'Playfair Display', serif", color: "#f5e8ed" }}>
                {post.title}
              </h1>
            </div>

            <p className="text-base leading-relaxed" style={{ color: "#9a7080" }}>{post.description}</p>

            <div className="flex items-center gap-4">
              <img src="/model-avatar.png" alt="Rose" className="w-10 h-10 rounded-full object-cover border" style={{ borderColor: "#c0395a" }} />
              <div>
                <div className="text-sm font-semibold" style={{ color: "#f5e8ed" }}>Little White Rose</div>
                <div className="text-xs" style={{ color: "#9a7080" }}>❤️ {post.likes?.toLocaleString()} likes</div>
              </div>
            </div>

            {/* Tip Section */}
            {unlocked && (
              <div className="rounded-2xl p-6 space-y-4" style={{ background: "#130b0f", border: "1px solid #3a1528" }}>
                <h3 className="text-lg font-bold" style={{ fontFamily: "'Playfair Display', serif", color: "#f5e8ed" }}>
                  💰 Send a Tip
                </h3>
                <p className="text-sm" style={{ color: "#9a7080" }}>Show some love and she'll personally respond 💋</p>

                {/* Quick tip amounts */}
                <div className="flex gap-2 flex-wrap">
                  {["5", "10", "20", "50", "100"].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setTipAmount(amt)}
                      className="px-4 py-2 rounded-full text-sm font-semibold transition-all border"
                      style={{
                        borderColor: tipAmount === amt ? "#c0395a" : "#3a1528",
                        background: tipAmount === amt ? "rgba(192,57,90,0.2)" : "transparent",
                        color: tipAmount === amt ? "#f5e8ed" : "#9a7080",
                      }}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>

                <textarea
                  value={tipMessage}
                  onChange={(e) => setTipMessage(e.target.value)}
                  placeholder="Send a sweet message with your tip... 🌹"
                  rows={3}
                  className="w-full rounded-xl px-4 py-3 text-sm resize-none outline-none"
                  style={{ background: "#1e1018", border: "1px solid #3a1528", color: "#f5e8ed" }}
                />

                <button
                  onClick={handleTip}
                  disabled={!tipAmount || tipping}
                  className="w-full py-3 rounded-full font-bold transition-all"
                  style={{
                    background: tipAmount ? "linear-gradient(135deg, #d4a853, #b8922f)" : "#1e1018",
                    color: tipAmount ? "#0a0508" : "#9a7080",
                    cursor: tipAmount ? "pointer" : "not-allowed",
                  }}
                >
                  {tipping ? "Sending..." : `Send ${tipAmount ? `$${tipAmount}` : ""} Tip`}
                </button>
              </div>
            )}

            {/* Chat CTA */}
            <div className="rounded-2xl p-6 text-center" style={{ background: "linear-gradient(135deg, #1e1018, #130b0f)", border: "1px solid #3a1528" }}>
              <p className="text-sm mb-3" style={{ color: "#9a7080" }}>Want to chat with me personally?</p>
              <Link href="/chat">
                <button className="px-8 py-3 rounded-full font-semibold text-sm transition-all rose-glow-hover"
                  style={{ background: "linear-gradient(135deg, #c0395a, #9a2040)", color: "#f5e8ed" }}>
                  Chat With Little White Rose 💋
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
