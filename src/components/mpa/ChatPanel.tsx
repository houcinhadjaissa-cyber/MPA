"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Send, Copy, Download, Trash2, Check, Play } from "lucide-react";
import ReactMarkdown from "react-markdown";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  copied?: boolean;
}

interface ChatPanelProps {
  onSendMessage: (message: string) => Promise<string | null>;
  onGenerate?: () => void;
  isLoading: boolean;
  initialMessages?: ChatMessage[];
  onMessagesChange?: (messages: ChatMessage[]) => void;
  placeholder?: string;
}

export default function ChatPanel({
  onSendMessage,
  onGenerate,
  isLoading,
  initialMessages,
  onMessagesChange,
  placeholder = 'Type a message… e.g. "add quantum security"',
}: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => initialMessages || []);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const prevLenRef = useRef(0);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isLoading]);

  useEffect(() => {
    if (messages.length !== prevLenRef.current) {
      prevLenRef.current = messages.length;
      onMessagesChange?.(messages);
    }
  }, [messages, onMessagesChange]);

  // Sync when session changes
  useEffect(() => {
    if (initialMessages) {
      setMessages(initialMessages);
      prevLenRef.current = initialMessages.length;
    }
  }, [initialMessages]);

  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    setError(null);
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    const userMsg: ChatMessage = {
      id: `${Date.now()}-u-${Math.random().toString(36).slice(2)}`,
      role: "user",
      content: text,
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);

    const reply = await onSendMessage(text);
    if (reply) {
      const assistantMsg: ChatMessage = {
        id: `${Date.now()}-a-${Math.random().toString(36).slice(2)}`,
        role: "assistant",
        content: reply,
        timestamp: Date.now(),
      };
      setMessages([...newMessages, assistantMsg]);
    } else {
      setError("Generation failed. Check your API key and try again.");
    }
  }, [input, isLoading, messages, onSendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyToClipboard = async (content: string, id: string) => {
    void id;
    try {
      await navigator.clipboard.writeText(content);
    } catch {
      try {
        const ta = document.createElement("textarea");
        ta.value = content;
        ta.style.cssText = "position:fixed;left:-9999px;opacity:0;";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      } catch { return; }
    }
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, copied: true } : m)));
    setTimeout(() => {
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, copied: false } : m)));
    }, 2000);
  };

  const downloadMd = (content: string) => {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mpa-prompt-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearChat = () => { setMessages([]); setError(null); };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/8 bg-[#0f0f0f] shrink-0">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full shrink-0 transition-colors ${isLoading ? "bg-amber-400 animate-pulse" : "bg-[#00ff88]"}`} />
          <span className="text-[#00ff88] font-bold text-sm tracking-wider font-mono uppercase">MPA Prompt Studio</span>
          {messages.filter((m) => m.role === "assistant").length > 0 && (
            <span className="text-gray-600 text-[10px] font-mono">
              · {messages.filter((m) => m.role === "assistant").length} prompt{messages.filter((m) => m.role === "assistant").length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
        {messages.length > 0 && (
          <button onClick={clearChat} className="p-1.5 text-gray-600 hover:text-red-400 transition-colors rounded-lg" title="Clear chat">
            <Trash2 size={13} />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 && !isLoading && !error ? (
          <div className="flex flex-col items-center justify-center h-full text-center gap-4 px-6 py-12">
            <div className="w-16 h-16 rounded-2xl bg-[#1a1a1a] border border-white/8 flex items-center justify-center">
              <Play size={24} className="text-[#00ff88] ml-1" fill="#00ff88" fillOpacity={0.8} />
            </div>
            <div className="space-y-1.5">
              <p className="text-white text-base font-medium">
                Start building your <span className="text-[#00ff88]">master prompt</span>
              </p>
              <p className="text-gray-500 text-xs font-mono">
                Type to chat · <kbd className="bg-white/5 px-1.5 py-0.5 rounded text-gray-400">Enter</kbd> to send
              </p>
              <p className="text-gray-600 text-xs">
                Fill objective → hit <span className="text-[#00ff88] font-semibold">GENERATE</span> for a full master prompt
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`text-[9px] font-mono uppercase tracking-wider ${msg.role === "user" ? "text-gray-500" : "text-[#00ff88]/70"}`}>
                    {msg.role === "user" ? "You" : "MPA Architect"}
                  </span>
                  <span className="text-gray-700 text-[9px] font-mono">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <div className={`max-w-[92%] rounded-2xl px-4 py-3 text-sm leading-relaxed break-words ${
                  msg.role === "user"
                    ? "bg-[#1a2a1a] border border-[#00ff88]/20 text-gray-200 whitespace-pre-wrap rounded-tr-sm"
                    : "bg-[#141414] border border-white/6 text-gray-300 rounded-tl-sm"
                }`}>
                  {msg.role === "assistant" ? (
                    <div className="prose prose-invert prose-sm max-w-none">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : msg.content}
                </div>
                {msg.role === "assistant" && (
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => copyToClipboard(msg.content, msg.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono transition-all ${
                        msg.copied
                          ? "bg-[#00ff88]/15 text-[#00ff88] border border-[#00ff88]/30"
                          : "bg-[#1a1a1a] text-gray-500 hover:text-white border border-white/5"
                      }`}
                    >
                      {msg.copied ? <Check size={10} /> : <Copy size={10} />}
                      {msg.copied ? "Copied!" : "Copy"}
                    </button>
                    <button
                      onClick={() => downloadMd(msg.content)}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono bg-[#1a1a1a] text-gray-500 hover:text-white border border-white/5 transition-all"
                    >
                      <Download size={10} /> .md
                    </button>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start">
                <div className="bg-[#141414] border border-white/6 rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-500/8 border border-red-500/20 text-red-400 text-xs font-mono">
                ⚠ {error}
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-3 pb-3 pt-2 bg-[#0a0a0a] shrink-0 border-t border-white/5">
        <div className="flex items-end gap-2 bg-[#141414] border border-white/10 rounded-2xl px-3 py-2.5 focus-within:border-[#00ff88]/30 transition-colors">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => { setInput(e.target.value); autoResize(); }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={1}
            disabled={isLoading}
            className="flex-1 bg-transparent text-white text-sm placeholder:text-gray-600 outline-none resize-none font-mono leading-relaxed min-h-[24px] max-h-[120px]"
            style={{ scrollbarWidth: "none" }}
          />
          <div className="flex items-center gap-2 shrink-0 pb-0.5">
            {onGenerate && (
              <button
                onClick={onGenerate}
                disabled={isLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00ff88] text-black text-xs font-bold font-mono hover:bg-[#00e57a] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              >
                <span className="text-base leading-none">⚡</span>
                GENERATE
              </button>
            )}
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#00ff88]/20 text-[#00ff88] hover:bg-[#00ff88]/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
