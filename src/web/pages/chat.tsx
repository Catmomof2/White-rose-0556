import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import Navbar from "../components/Navbar";
import { authClient } from "../lib/auth";
import { useCustomer } from "autumn-js/react";

function MessagePart({ part }: { part: UIMessage["parts"][number] }) {
  if (part.type === "text") {
    return <span style={{ whiteSpace: "pre-wrap" }}>{part.text}</span>;
  }
  return null;
}

const SUGGESTED_MESSAGES = [
  "Hey Rose, how are you today? 🌹",
  "What kind of content do you post?",
  "You're so beautiful! 💋",
  "Tell me something naughty...",
  "What's your favorite thing to wear?",
];

export default function ChatPage() {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [guestMessages, setGuestMessages] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { data: customer, attach } = useCustomer();

  const isSubscriber =
    customer?.subscriptions?.some((s) => s.planId === "subscriber" || s.planId === "vip") ?? false;
  const freeLimit = 5;
  const atLimit = !isSubscriber && guestMessages >= freeLimit;

  useEffect(() => {
    authClient.getSession().then((s) => setUser(s.data?.user ?? null));
  }, []);

  const { messages: chatMessages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/agent/messages" }),
  });

  const introMessage: UIMessage = {
    id: "intro",
    role: "assistant",
    parts: [{ type: "text", text: "Hey baby, I'm so happy you're here 🌹 I've been waiting for someone like you... What's on your mind? 💋" }],
    createdAt: new Date(),
  };

  const messages = [introMessage, ...chatMessages];

  const [input, setInput] = useState("");
  const isLoading = status === "streaming" || status === "submitted";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || atLimit) return;
    setGuestMessages((n) => n + 1);
    sendMessage({ text: input });
    setInput("");
  };

  const handleSuggestion = (msg: string) => {
    if (atLimit) return;
    setGuestMessages((n) => n + 1);
    sendMessage({ text: msg });
  };

  const handleUpgrade = async () => {
    await attach({ planId: "subscriber", successUrl: window.location.href });
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#0a0508" }}>
      <Navbar />

      <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full pt-24 pb-0 px-4">
        {/* Chat Header */}
        <div className="flex items-center gap-4 pb-6 border-b mb-6" style={{ borderColor: "#1e1018" }}>
          <div className="relative">
            <img src="/model-avatar.png" alt="Rose" className="w-14 h-14 rounded-full object-cover border-2" style={{ borderColor: "#c0395a" }} />
            <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2" style={{ background: "#22c55e", borderColor: "#0a0508" }} />
          </div>
          <div>
            <div className="font-bold text-lg" style={{ fontFamily: "'Playfair Display', serif", color: "#f5e8ed" }}>Little White Rose</div>
            <div className="text-sm" style={{ color: "#4ade80" }}>● Online now</div>
          </div>
          {isSubscriber && (
            <span className="ml-auto text-xs px-3 py-1 rounded-full font-semibold"
              style={{ background: "rgba(212,168,83,0.2)", color: "#d4a853", border: "1px solid #d4a853" }}>
              ✨ Subscriber
            </span>
          )}
          {!isSubscriber && (
            <span className="ml-auto text-xs px-3 py-1 rounded-full" style={{ background: "#1e1018", color: "#9a7080", border: "1px solid #3a1528" }}>
              {freeLimit - guestMessages} free messages left
            </span>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 pb-4" style={{ minHeight: "400px", maxHeight: "60vh" }}>
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} gap-3`}>
              {message.role === "assistant" && (
                <img src="/model-avatar.png" alt="Rose" className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-1" style={{ border: "1px solid #c0395a" }} />
              )}
              <div
                className={`max-w-xs md:max-w-md rounded-2xl px-4 py-3 text-sm leading-relaxed ${message.role === "user" ? "chat-bubble-user rounded-br-sm" : "chat-bubble-ai rounded-bl-sm"}`}
                style={{ color: "#f5e8ed" }}
              >
                {message.parts.map((part, i) => (
                  <MessagePart key={i} part={part} />
                ))}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start gap-3">
              <img src="/model-avatar.png" alt="Rose" className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-1" style={{ border: "1px solid #c0395a" }} />
              <div className="chat-bubble-ai rounded-2xl rounded-bl-sm px-4 py-3">
                <div className="flex gap-1 items-center">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="w-2 h-2 rounded-full animate-bounce" style={{ background: "#e8678a", animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggested messages */}
        {messages.length < 3 && !atLimit && (
          <div className="flex gap-2 flex-wrap pb-3">
            {SUGGESTED_MESSAGES.map((msg) => (
              <button
                key={msg}
                onClick={() => handleSuggestion(msg)}
                className="text-xs px-3 py-2 rounded-full border transition-all hover:border-[#c0395a] hover:text-[#f5e8ed]"
                style={{ borderColor: "#3a1528", color: "#9a7080" }}
              >
                {msg}
              </button>
            ))}
          </div>
        )}

        {/* Limit reached banner */}
        {atLimit && (
          <div className="rounded-2xl p-5 mb-4 text-center" style={{ background: "linear-gradient(135deg, #1e1018, #130b0f)", border: "1px solid #c0395a" }}>
            <p className="text-base font-bold mb-1" style={{ fontFamily: "'Playfair Display', serif", color: "#f5e8ed" }}>
              You've reached your free messages 🥀
            </p>
            <p className="text-sm mb-4" style={{ color: "#9a7080" }}>
              Subscribe to keep chatting with me, darling... I don't want you to go 💋
            </p>
            <button
              onClick={handleUpgrade}
              className="px-8 py-3 rounded-full font-bold text-sm rose-glow animate-glow-pulse"
              style={{ background: "linear-gradient(135deg, #c0395a, #9a2040)", color: "#f5e8ed" }}
            >
              Subscribe — $9.99/mo
            </button>
          </div>
        )}

        {/* Input */}
        <form onSubmit={handleSubmit} className="pb-6 pt-2 flex gap-3 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e as unknown as React.FormEvent);
              }
            }}
            placeholder={atLimit ? "Subscribe to keep chatting..." : "Say something sweet... 🌹"}
            rows={1}
            disabled={atLimit}
            className="flex-1 rounded-2xl px-4 py-3 text-sm resize-none outline-none transition-all"
            style={{
              background: "#130b0f",
              border: `1px solid ${atLimit ? "#3a1528" : "#3a1528"}`,
              color: "#f5e8ed",
              maxHeight: "120px",
            }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading || atLimit}
            className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
            style={{
              background: input.trim() && !atLimit ? "linear-gradient(135deg, #c0395a, #9a2040)" : "#1e1018",
              color: input.trim() && !atLimit ? "#f5e8ed" : "#3a1528",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
