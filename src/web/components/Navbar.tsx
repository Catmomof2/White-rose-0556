import { Link, useLocation } from "wouter";
import { authClient } from "../lib/auth";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [location] = useLocation();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authClient.getSession().then((s) => {
      setUser(s.data?.user ?? null);
      setLoading(false);
    });
  }, [location]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
      style={{ background: "linear-gradient(to bottom, rgba(10,5,8,0.95), transparent)" }}>
      <Link href="/">
        <span className="font-['Playfair_Display'] text-xl font-bold tracking-wide" style={{ color: "#f5e8ed" }}>
          🌹 Little White Rose
        </span>
      </Link>
      <div className="flex items-center gap-6">
        <Link href="/feed">
          <span className={`text-sm tracking-widest uppercase font-light cursor-pointer transition-colors hover:text-[#e8678a] ${location === "/feed" ? "text-[#e8678a]" : "text-[#9a7080]"}`}>
            Feed
          </span>
        </Link>
        <Link href="/chat">
          <span className={`text-sm tracking-widest uppercase font-light cursor-pointer transition-colors hover:text-[#e8678a] ${location === "/chat" ? "text-[#e8678a]" : "text-[#9a7080]"}`}>
            Chat
          </span>
        </Link>
        <Link href="/pricing">
          <span className={`text-sm tracking-widest uppercase font-light cursor-pointer transition-colors hover:text-[#d4a853] ${location === "/pricing" ? "text-[#d4a853]" : "text-[#9a7080]"}`}>
            Subscribe
          </span>
        </Link>
        {!loading && (
          user ? (
            <button
              onClick={() => authClient.signOut().then(() => setUser(null))}
              className="text-sm px-4 py-2 rounded-full border border-[#3a1528] text-[#9a7080] hover:text-[#f5e8ed] hover:border-[#c0395a] transition-all"
            >
              Sign Out
            </button>
          ) : (
            <Link href="/sign-in">
              <span className="text-sm px-5 py-2 rounded-full cursor-pointer transition-all font-medium"
                style={{ background: "linear-gradient(135deg, #c0395a, #9a2040)", color: "#f5e8ed" }}>
                Sign In
              </span>
            </Link>
          )
        )}
      </div>
    </nav>
  );
}
