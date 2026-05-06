import Navbar from "../components/Navbar";
import { Link } from "wouter";
import { useCustomer } from "autumn-js/react";

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    color: "#3a1528",
    textColor: "#9a7080",
    features: [
      "Browse free preview posts",
      "5 chat messages/month",
      "See blurred exclusive content",
    ],
    cta: "Current Plan",
    ctaDisabled: true,
  },
  {
    id: "subscriber",
    name: "Subscriber",
    price: "$9.99",
    period: "/month",
    color: "#c0395a",
    textColor: "#f5e8ed",
    badge: "Most Popular 🌹",
    features: [
      "Full access to all subscriber posts",
      "100 personal chat messages/month",
      "Exclusive behind-the-scenes photos",
      "Early access to new content",
      "Direct tip messages",
    ],
    cta: "Subscribe Now",
    ctaDisabled: false,
  },
  {
    id: "vip",
    name: "VIP",
    price: "$24.99",
    period: "/month",
    color: "#d4a853",
    textColor: "#0a0508",
    badge: "Ultimate Access ✨",
    features: [
      "Everything in Subscriber",
      "Unlimited chat messages",
      "5 free PPV unlocks/month",
      "Custom content requests",
      "Priority responses",
      "Exclusive VIP-only content",
    ],
    cta: "Go VIP",
    ctaDisabled: false,
  },
];

export default function Pricing() {
  const { attach, data: customer } = useCustomer();

  const currentPlan = customer?.subscriptions?.[0]?.planId ?? "free";

  const handleSubscribe = async (planId: string) => {
    if (planId === "free") return;
    await attach({ planId, successUrl: window.location.origin + "/feed" });
  };

  return (
    <div className="min-h-screen" style={{ background: "#0a0508" }}>
      <Navbar />
      <div className="pt-28 pb-20 max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up stagger-1">
          <p className="text-sm tracking-[0.4em] uppercase mb-4" style={{ color: "#e8678a", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}>
            Choose Your Experience
          </p>
          <h1 className="text-6xl md:text-7xl font-black mb-6" style={{ fontFamily: "'Playfair Display', serif", color: "#f5e8ed" }}>
            SUBSCRIBE TO <br /><span style={{ color: "#c0395a" }}>LITTLE WHITE ROSE</span>
          </h1>
          <p className="text-lg max-w-lg mx-auto" style={{ color: "#9a7080", fontWeight: 300 }}>
            Join thousands of devoted fans and unlock everything I have to offer 💋
          </p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => {
            const isCurrent = currentPlan === plan.id;
            const isGold = plan.id === "vip";

            return (
              <div
                key={plan.id}
                className={`rounded-3xl p-8 flex flex-col gap-6 animate-fade-in-up transition-transform hover:scale-[1.02] ${isGold ? "gold-glow" : ""} ${plan.id === "subscriber" ? "rose-glow" : ""}`}
                style={{
                  background: plan.id === "vip" ? "linear-gradient(135deg, #1e1810, #130f08)" : "#130b0f",
                  border: `1.5px solid ${plan.color}`,
                  animationDelay: `${(i + 1) * 0.15}s`,
                  opacity: 0,
                }}
              >
                {plan.badge && (
                  <div className="text-center">
                    <span className="text-xs font-bold px-4 py-1 rounded-full"
                      style={{ background: plan.color, color: isGold ? "#0a0508" : "#f5e8ed" }}>
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div>
                  <div className="text-xs tracking-widest uppercase mb-2" style={{ color: plan.color }}>
                    {plan.name}
                  </div>
                  <div className="flex items-end gap-1">
                    <span className="text-5xl font-black" style={{ fontFamily: "'Playfair Display', serif", color: "#f5e8ed" }}>
                      {plan.price}
                    </span>
                    <span className="text-sm pb-2" style={{ color: "#9a7080" }}>{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm" style={{ color: "#9a7080" }}>
                      <span style={{ color: plan.color, flexShrink: 0 }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  disabled={plan.ctaDisabled || isCurrent}
                  onClick={() => handleSubscribe(plan.id)}
                  className="w-full py-4 rounded-full font-bold text-sm tracking-wider uppercase transition-all"
                  style={{
                    background: isCurrent ? "transparent" : isGold ? "#d4a853" : plan.id === "subscriber" ? "linear-gradient(135deg, #c0395a, #9a2040)" : "#1e1018",
                    color: isCurrent ? "#9a7080" : isGold ? "#0a0508" : "#f5e8ed",
                    border: isCurrent ? `1px solid ${plan.color}` : "none",
                    cursor: plan.ctaDisabled || isCurrent ? "default" : "pointer",
                  }}
                >
                  {isCurrent ? "Current Plan" : plan.cta}
                </button>
              </div>
            );
          })}
        </div>

        {/* PPV Section */}
        <div className="mt-20 rounded-3xl p-10 text-center" style={{ background: "#130b0f", border: "1px solid #3a1528" }}>
          <div className="text-4xl mb-4">🎁</div>
          <h2 className="text-3xl font-black mb-3" style={{ fontFamily: "'Playfair Display', serif", color: "#f5e8ed" }}>
            Pay-Per-View Content
          </h2>
          <p className="text-base mb-6 max-w-md mx-auto" style={{ color: "#9a7080" }}>
            Even without a subscription, you can unlock individual exclusive posts. Each piece of content is priced individually — starting at just $3.99.
          </p>
          <Link href="/feed">
            <button className="px-8 py-3 rounded-full font-semibold text-sm"
              style={{ background: "rgba(212,168,83,0.15)", color: "#d4a853", border: "1px solid #d4a853" }}>
              Browse PPV Content →
            </button>
          </Link>
        </div>

        {/* Tips Section */}
        <div className="mt-8 rounded-3xl p-10 text-center" style={{ background: "#130b0f", border: "1px solid #3a1528" }}>
          <div className="text-4xl mb-4">💰</div>
          <h2 className="text-3xl font-black mb-3" style={{ fontFamily: "'Playfair Display', serif", color: "#f5e8ed" }}>
            Send a Tip
          </h2>
          <p className="text-base mb-6 max-w-md mx-auto" style={{ color: "#9a7080" }}>
            Make me feel special and I'll personally respond to your message. Tips of any amount are always appreciated, darling 🌹
          </p>
          <Link href="/chat">
            <button className="px-8 py-3 rounded-full font-semibold text-sm"
              style={{ background: "rgba(192,57,90,0.15)", color: "#e8678a", border: "1px solid #c0395a" }}>
              Chat & Tip Now →
            </button>
          </Link>
        </div>

        {/* FAQ */}
        <div className="mt-20">
          <h2 className="text-3xl font-black mb-8 text-center" style={{ fontFamily: "'Playfair Display', serif", color: "#f5e8ed" }}>
            FAQ
          </h2>
          <div className="space-y-4 max-w-2xl mx-auto">
            {[
              { q: "How does the subscription work?", a: "You'll be billed monthly. Cancel anytime — no questions asked." },
              { q: "Is Little White Rose a real person?", a: "Yes — Little White Rose is a real person. All content is personally created by her." },
              { q: "Can I talk to her personally?", a: "Yes! Little White Rose personally engages in chat. Subscribers get 100 messages/month; VIP members get unlimited." },
              { q: "How do PPV unlocks work?", a: "Some exclusive posts require a one-time payment to unlock. You keep access forever after paying." },
            ].map(({ q, a }) => (
              <div key={q} className="rounded-2xl p-6" style={{ background: "#130b0f", border: "1px solid #1e1018" }}>
                <div className="font-semibold mb-2" style={{ color: "#f5e8ed" }}>{q}</div>
                <div className="text-sm" style={{ color: "#9a7080" }}>{a}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
