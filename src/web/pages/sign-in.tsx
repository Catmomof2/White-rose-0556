import { useState } from "react";
import { Link, useLocation } from "wouter";
import { authClient } from "../lib/auth";

export default function SignIn() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await authClient.signIn.email({ email, password });
    if (result.error) {
      setError(result.error.message || "Invalid credentials");
    } else {
      navigate("/feed");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#0a0508" }}>
      {/* Left — Image */}
      <div className="hidden md:block md:w-1/2 relative overflow-hidden">
        <img src="/model-hero.png" alt="Little White Rose" className="w-full h-full object-cover object-top" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, transparent, #0a0508)" }} />
        <div className="absolute bottom-10 left-10">
          <h1 className="text-5xl font-black" style={{ fontFamily: "'Playfair Display', serif", color: "#f5e8ed" }}>
            LITTLE<br /><span style={{ color: "#c0395a" }}>WHITE ROSE</span>
          </h1>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-16">
        <div className="w-full max-w-sm">
          <Link href="/">
            <span className="text-sm mb-8 inline-block cursor-pointer hover:text-[#e8678a] transition-colors" style={{ color: "#9a7080" }}>
              ← Back
            </span>
          </Link>

          <div className="mb-8">
            <p className="text-xs tracking-[0.3em] uppercase mb-2" style={{ color: "#9a7080" }}>Welcome back</p>
            <h2 className="text-4xl font-black" style={{ fontFamily: "'Playfair Display', serif", color: "#f5e8ed" }}>
              Sign In
            </h2>
          </div>

          {error && (
            <div className="rounded-xl p-3 mb-4 text-sm" style={{ background: "rgba(192,57,90,0.15)", border: "1px solid #c0395a", color: "#f2b8cb" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs tracking-widest uppercase mb-2 block" style={{ color: "#9a7080" }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-3 rounded-xl outline-none text-sm transition-all"
                style={{ background: "#130b0f", border: "1px solid #3a1528", color: "#f5e8ed" }}
                onFocus={(e) => (e.target.style.borderColor = "#c0395a")}
                onBlur={(e) => (e.target.style.borderColor = "#3a1528")}
              />
            </div>
            <div>
              <label className="text-xs tracking-widest uppercase mb-2 block" style={{ color: "#9a7080" }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-xl outline-none text-sm transition-all"
                style={{ background: "#130b0f", border: "1px solid #3a1528", color: "#f5e8ed" }}
                onFocus={(e) => (e.target.style.borderColor = "#c0395a")}
                onBlur={(e) => (e.target.style.borderColor = "#3a1528")}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-full font-bold text-sm tracking-wider uppercase transition-all mt-2"
              style={{ background: "linear-gradient(135deg, #c0395a, #9a2040)", color: "#f5e8ed", opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Signing in..." : "Sign In 🌹"}
            </button>
          </form>

          <p className="text-center mt-6 text-sm" style={{ color: "#9a7080" }}>
            New here?{" "}
            <Link href="/sign-up">
              <span className="cursor-pointer hover:text-[#f5e8ed] transition-colors" style={{ color: "#e8678a" }}>
                Create an account
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
