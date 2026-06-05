"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Send, Copy, Download, Trash2, Loader2, Bot, User, Check } from "lucide-react";
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
  isLoading: boolean;
  initialMessages?: ChatMessage[];
  onMessagesChange?: (messages: ChatMessage[]) => void;
}

export default function ChatPanel({
  onSendMessage,
  isLoading,
  initialMessages,
  onMessagesChange,
}: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => initialMessages || []);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
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

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    setInput("");
    setError(null);

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
        ta.setSelectionRange(0, ta.value.length);
        document.execCommand("copy");
        document.body.removeChild(ta);
      } catch {
        alert("Long-press to copy manually.");
        return;
      }
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

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#111] shrink-0">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              isLoading ? "bg-amber-400 animate-pulse" : "bg-emerald-400"
            }`}
          />
          <span className="text-emerald-400 font-bold text-sm tracking-wider font-mono">
            MPA Prompt Studio
          </span>
          {messages.filter((m) => m.role === "assistant").length > 0 && (
            <span className="text-gray-600 text-xs font-mono ml-1">
              {messages.filter((m) => m.role === "assistant").length} prompt
              {messages.filter((m) => m.role === "assistant").length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
        {messages.length > 0 && (
          <button
            onClick={clearChat}
            className="text-gray-600 hover:text-red-400 transition-colors p-1"
            title="Clear chat"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !isLoading && !error && (
          <div className="flex flex-col items-center justify-center h-full text-center gap-3 py-8">
            <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-emerald-400">
              <Bot size={20} />
            </div>
            <p className="text-gray-500 text-sm">
              Type a message or click{" "}
              <strong className="text-emerald-400">Generate</strong> to create a prompt
            </p>
            <p className="text-gray-700 text-xs">Follow-up messages refine your output</p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
          >
            <div className="flex items-center gap-2 mb-1">
              {msg.role === "assistant" ? (
                <Bot size={11} className="text-emerald-500" />
              ) : (
                <User size={11} className="text-cyan-500" />
              )}
              <span className="text-[10px] font-mono uppercase tracking-wider text-gray-600">
                {msg.role === "user" ? "You" : "MPA Architect"}
              </span>
            </div>

            <div
              className={`max-w-[90%] rounded-xl px-4 py-3 text-sm leading-relaxed break-words ${
                msg.role === "user"
                  ? "bg-emerald-950/30 border border-emerald-500/20 text-gray-200 whitespace-pre-wrap"
                  : "bg-[#141414] border border-white/5 text-gray-300"
              }`}
            >
              {msg.role === "assistant" ? (
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                msg.content
              )}
            </div>

            {msg.role === "assistant" && (
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <button
                  onClick={() => copyToClipboard(msg.content, msg.id)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                    msg.copied
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-[#1a1a1a] text-gray-400 hover:text-white border border-white/5 hover:border-white/20"
                  }`}
                >
                  {msg.copied ? <Check size={10} /> : <Copy size={10} />}
                  {msg.copied ? "Copied!" : "Copy"}
                </button>
                <button
                  onClick={() => downloadMd(msg.content)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono bg-[#1a1a1a] text-gray-400 hover:text-white border border-white/5 hover:border-white/20 transition-all"
                >
                  <Download size={10} /> .md
                </button>
                <span className="text-gray-700 text-[10px] font-mono">
                  {msg.content.trim().split(/\s+/).filter(Boolean).length.toLocaleString()} words
                </span>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start">
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#141414] border border-white/5">
              <Loader2 size={14} className="text-emerald-400 animate-spin" />
              <span className="text-emerald-400 text-sm font-mono">Generating prompt…</span>
            </div>
          </div>
        )}

        {error && (
          <div className="px-4 py-3 rounded-xl bg-red-950/20 border border-red-500/20 text-red-400 text-sm font-mono">
            ⚠ {error}
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="px-3 py-3 border-t border-white/10 bg-[#111] shrink-0">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={'Type a message\u2026 e.g. "add security layer" or "focus on FinTech"'}
            rows={1}
            className="flex-1 bg-[#0a0a0a] text-gray-200 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono resize-none min-h-[44px] max-h-[120px] outline-none focus:border-emerald-500/40 transition-colors placeholder:text-gray-600"
            style={{ lineHeight: "1.5" }}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 transition-all ${
              isLoading || !input.trim()
                ? "bg-[#1a1a1a] text-gray-600 cursor-not-allowed"
                : "bg-emerald-500 text-black hover:bg-emerald-400"
            }`}
          >
            {isLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
