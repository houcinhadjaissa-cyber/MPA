"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useCallback,
} from "react";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  copied?: boolean;
}

export interface ChatInterfaceHandle {
  sendMessage: (text: string) => void;
}

interface ChatInterfaceProps {
  apiKey: string;
  selectedModel: string;
  masterObjective: string;
  targetEntity: string;
  targetContext: string;
  selectedProtocol: string;
  customDirectives: string;
  creativityValue: number;
  activeLayers: Record<string, boolean>;
}

const LS_CHAT = "mpa_chat_history";

const ChatInterface = forwardRef<ChatInterfaceHandle, ChatInterfaceProps>(
  function ChatInterface(
    {
      apiKey,
      selectedModel,
      masterObjective,
      targetEntity,
      targetContext,
      selectedProtocol,
      customDirectives,
      creativityValue,
      activeLayers,
    },
    ref
  ) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const loadingRef = useRef(false);

    useEffect(() => {
      try {
        const saved = localStorage.getItem(LS_CHAT);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) setMessages(parsed);
        }
      } catch {}
    }, []);

    useEffect(() => {
      try {
        localStorage.setItem(LS_CHAT, JSON.stringify(messages.slice(-100)));
      } catch {}
    }, [messages]);

    useEffect(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    const sendMessage = useCallback(
      async (messageText?: string) => {
        const text = (messageText ?? input).trim();
        if (!text || loadingRef.current) return;

        const key = apiKey?.trim();
        if (!key) {
          setError("Please add your Groq API key first.");
          return;
        }

        setInput("");
        setError(null);
        loadingRef.current = true;

        const userMsg: ChatMessage = {
          id: crypto.randomUUID(),
          role: "user",
          content: text,
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, userMsg]);
        setIsLoading(true);

        try {
          const historyForApi = messages.map((m) => ({
            role: m.role,
            content: m.content,
          }));

          const res = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              apiKey: key,
              model: selectedModel || "llama3-70b-8192",
              masterObjective: masterObjective || text,
              targetEntity: targetEntity || "",
              targetContext: targetContext || "",
              dominanceProtocol: selectedProtocol || "Standard REST (Passive)",
              customDirectives: customDirectives || "",
              creativity: creativityValue ?? 0.7,
              intelligenceLayers: activeLayers || {},
              message: text,
              history: historyForApi,
            }),
          });

          if (!res.ok) {
            let errMsg = `Server error (${res.status})`;
            try {
              const d = await res.json();
              errMsg = d.error || errMsg;
            } catch {}
            throw new Error(errMsg);
          }

          const data = await res.json();
          if (!data.success || !data.message) {
            throw new Error(data.error || "No response generated. Please try again.");
          }

          const assistantMsg: ChatMessage = {
            id: crypto.randomUUID(),
            role: "assistant",
            content: data.message,
            timestamp: new Date().toISOString(),
          };

          setMessages((prev) => [...prev, assistantMsg]);
        } catch (err: unknown) {
          const raw = err instanceof Error ? err.message : String(err);
          let msg = "Generation failed. ";
          if (/invalid|401|auth|key/i.test(raw)) {
            msg += "Your API key is invalid. Check and re-enter it.";
          } else if (/rate|429/i.test(raw)) {
            msg += "Rate limit reached. Wait 60 seconds and try again.";
          } else if (/fetch|network|ECONNREFUSED/i.test(raw)) {
            msg += "Network error. Check your connection.";
          } else {
            msg += raw || "Please try again.";
          }
          setError(msg);
        } finally {
          setIsLoading(false);
          loadingRef.current = false;
          inputRef.current?.focus();
        }
      },
      [
        input,
        messages,
        apiKey,
        selectedModel,
        masterObjective,
        targetEntity,
        targetContext,
        selectedProtocol,
        customDirectives,
        creativityValue,
        activeLayers,
      ]
    );

    useImperativeHandle(ref, () => ({
      sendMessage: (text: string) => {
        if (!loadingRef.current) sendMessage(text);
      },
    }));

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
          alert("Long-press the text to copy manually.");
          return;
        }
      }
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, copied: true } : m))
      );
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, copied: false } : m))
        );
      }, 2500);
    };

    const downloadPrompt = (content: string) => {
      try {
        const blob = new Blob([content], { type: "text/markdown" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `mpa-prompt-${Date.now()}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch {}
    };

    const clearChat = () => {
      setMessages([]);
      setError(null);
      try {
        localStorage.removeItem(LS_CHAT);
      } catch {}
    };

    const wordCount = (text: string) =>
      text
        .trim()
        .split(/\s+/)
        .filter(Boolean).length;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "70vh",
          minHeight: 400,
          background: "#0A0A0A",
          borderRadius: 16,
          border: "1px solid rgba(255,255,255,0.08)",
          overflow: "hidden",
          fontFamily: "monospace",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "0.75rem 1rem",
            background: "#111",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: isLoading ? "#F59E0B" : "#30D158",
                display: "inline-block",
                boxShadow: isLoading
                  ? "0 0 6px #F59E0B"
                  : "0 0 6px #30D158",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                color: "#30D158",
                fontWeight: "bold",
                fontSize: "0.85rem",
                letterSpacing: "0.05em",
              }}
            >
              MPA Prompt Studio
            </span>
            {messages.length > 0 && (
              <span
                style={{
                  color: "#555",
                  fontSize: "0.7rem",
                  marginLeft: 4,
                }}
              >
                {messages.filter((m) => m.role === "assistant").length} prompt
                {messages.filter((m) => m.role === "assistant").length !== 1
                  ? "s"
                  : ""}
              </span>
            )}
          </div>
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              style={{
                padding: "0.35rem 0.75rem",
                background: "transparent",
                color: "#EF4444",
                border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: 8,
                cursor: "pointer",
                fontSize: "0.7rem",
                fontFamily: "monospace",
              }}
            >
              Clear
            </button>
          )}
        </div>

        {/* Messages */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {messages.length === 0 && !isLoading && !error && (
            <div
              style={{
                textAlign: "center",
                color: "#444",
                padding: "3rem 1rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.75rem",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  border: "1px solid #333",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#30D158",
                  fontSize: "1.2rem",
                }}
              >
                ▶
              </div>
              <p style={{ fontSize: "0.875rem", color: "#555" }}>
                Click <strong style={{ color: "#30D158" }}>Generate</strong> above, or type a
                message below
              </p>
              <p style={{ fontSize: "0.75rem", color: "#333" }}>
                Follow-up prompts refine your output
              </p>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: msg.role === "user" ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  maxWidth: "92%",
                  padding: "0.75rem 1rem",
                  borderRadius: 14,
                  background: msg.role === "user" ? "#162616" : "#141414",
                  border:
                    msg.role === "user"
                      ? "1px solid rgba(48,209,88,0.25)"
                      : "1px solid rgba(255,255,255,0.06)",
                  color: "#E5E5E5",
                  fontSize: "0.875rem",
                  lineHeight: 1.75,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  userSelect: "text",
                  WebkitUserSelect: "text",
                }}
              >
                <div
                  style={{
                    fontSize: "0.65rem",
                    marginBottom: "0.5rem",
                    color: msg.role === "user" ? "#30D158" : "#666",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  {msg.role === "user" ? "You" : "MPA Architect"}
                </div>

                <div>{msg.content}</div>

                {msg.role === "assistant" && (
                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      marginTop: "0.75rem",
                      paddingTop: "0.5rem",
                      borderTop: "1px solid rgba(255,255,255,0.06)",
                      flexWrap: "wrap",
                      alignItems: "center",
                    }}
                  >
                    <button
                      onClick={() => copyToClipboard(msg.content, msg.id)}
                      style={{
                        padding: "0.4rem 0.9rem",
                        background: msg.copied
                          ? "rgba(48,209,88,0.15)"
                          : "#30D158",
                        color: msg.copied ? "#30D158" : "#000",
                        border: msg.copied
                          ? "1px solid rgba(48,209,88,0.4)"
                          : "none",
                        borderRadius: 8,
                        cursor: "pointer",
                        fontSize: "0.75rem",
                        fontWeight: "bold",
                        fontFamily: "monospace",
                        minHeight: 36,
                        transition: "all 0.2s",
                      }}
                    >
                      {msg.copied ? "✓ Copied!" : "Copy Prompt"}
                    </button>
                    <button
                      onClick={() => downloadPrompt(msg.content)}
                      style={{
                        padding: "0.4rem 0.9rem",
                        background: "transparent",
                        color: "#999",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 8,
                        cursor: "pointer",
                        fontSize: "0.75rem",
                        fontFamily: "monospace",
                        minHeight: 36,
                      }}
                    >
                      Download .md
                    </button>
                    <span
                      style={{
                        fontSize: "0.65rem",
                        color: "#444",
                        marginLeft: "auto",
                      }}
                    >
                      {wordCount(msg.content).toLocaleString()} words
                    </span>
                  </div>
                )}
              </div>

              <span
                style={{
                  fontSize: "0.6rem",
                  color: "#333",
                  marginTop: "0.25rem",
                  padding: "0 0.5rem",
                }}
              >
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}

          {isLoading && (
            <div style={{ display: "flex", alignItems: "flex-start" }}>
              <div
                style={{
                  padding: "0.75rem 1rem",
                  borderRadius: 14,
                  background: "#141414",
                  border: "1px solid rgba(255,255,255,0.06)",
                  color: "#30D158",
                  fontSize: "0.875rem",
                  fontFamily: "monospace",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#30D158",
                    animation: "mpaPulse 1s ease-in-out infinite",
                  }}
                />
                Generating prompt…
              </div>
            </div>
          )}

          {error && (
            <div
              style={{
                padding: "0.75rem 1rem",
                borderRadius: 12,
                background: "rgba(239,68,68,0.06)",
                border: "1px solid rgba(239,68,68,0.25)",
                color: "#F87171",
                fontSize: "0.825rem",
                fontFamily: "monospace",
              }}
            >
              ⚠ {error}
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div
          style={{
            padding: "0.75rem",
            background: "#111",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            gap: "0.5rem",
            alignItems: "flex-end",
            flexShrink: 0,
          }}
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder={'Ask to refine\u2026 e.g. "add more security details" or "focus on FinTech"'}
            rows={1}
            style={{
              flex: 1,
              background: "#0A0A0A",
              color: "#E5E5E5",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10,
              padding: "0.75rem",
              fontSize: "0.875rem",
              fontFamily: "monospace",
              resize: "none",
              minHeight: 44,
              maxHeight: 120,
              outline: "none",
              lineHeight: 1.5,
              WebkitAppearance: "none",
            }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={isLoading || !input.trim()}
            style={{
              padding: "0 1rem",
              height: 44,
              minWidth: 44,
              background:
                isLoading || !input.trim() ? "#222" : "#30D158",
              color: isLoading || !input.trim() ? "#555" : "#000",
              border: "none",
              borderRadius: 10,
              cursor:
                isLoading || !input.trim() ? "not-allowed" : "pointer",
              fontWeight: "bold",
              fontSize: "1rem",
              fontFamily: "monospace",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "background 0.2s",
            }}
          >
            {isLoading ? (
              <span
                style={{
                  width: 16,
                  height: 16,
                  border: "2px solid rgba(255,255,255,0.15)",
                  borderTopColor: "#fff",
                  borderRadius: "50%",
                  display: "inline-block",
                  animation: "mpaSpin 0.7s linear infinite",
                }}
              />
            ) : (
              "↑"
            )}
          </button>
        </div>

        <style>{`
          @keyframes mpaPulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.4; transform: scale(0.8); }
          }
          @keyframes mpaSpin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }
);

ChatInterface.displayName = "ChatInterface";
export default ChatInterface;
