"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import ChatPanel, { type ChatMessage } from "@/components/mpa/ChatPanel";
import OutputViewer from "@/components/mpa/OutputViewer";
import LayerPanel from "@/components/mpa/LayerPanel";
import ConfigPanel from "@/components/mpa/ConfigPanel";
import SessionsPanel, { type Session } from "@/components/mpa/SessionsPanel";
import HistoryPanel, { type PromptHistoryItem } from "@/components/mpa/HistoryPanel";
import MobileNav, { type MobileTab } from "@/components/mpa/MobileNav";

import { buildSystemPrompt, INITIAL_LAYERS, type LayerState, type LayerKey } from "@/lib/mpa/layers";
import { assemblePayload, scoreOutput, getModelDisplayName } from "@/lib/mpa/payloadGenerator";
import { type IndustryTemplate } from "@/lib/mpa/templates";
import { lsGet, lsSet, lsGetJSON, lsSetJSON, LS_KEYS } from "@/lib/mpa/storage";
import { generateSyncId } from "@/lib/mpa/crypto";

// ─── Session full data ────────────────────────────────────────────────────────
interface SessionData {
  id: string;
  name: string;
  objective: string;
  messages: ChatMessage[];
  layers: LayerState;
  payload: string;
  tokensUsed: number;
  durationMs: number;
  activeModel: string;
  createdAt: number;
  lastUsed: number;
}

function newSessionData(name = "Default Session", objective = ""): SessionData {
  return {
    id: generateSyncId(),
    name,
    objective,
    messages: [],
    layers: { ...INITIAL_LAYERS },
    payload: "",
    tokensUsed: 0,
    durationMs: 0,
    activeModel: "",
    createdAt: Date.now(),
    lastUsed: Date.now(),
  };
}

function toSessionMeta(sd: SessionData): Session {
  return {
    id: sd.id,
    name: sd.name,
    objective: sd.objective,
    messageCount: sd.messages.length,
    activeLayerCount: Object.values(sd.layers).filter(Boolean).length,
    createdAt: sd.createdAt,
    lastUsed: sd.lastUsed,
  };
}

export default function Home() {
  // ── Global config (shared across sessions) ─────────────────────────────────
  const [apiKey, setApiKey] = useState("");
  const [apiProvider, setApiProvider] = useState<"groq" | "openai">("groq");
  const [model, setModel] = useState("llama-3.3-70b-versatile");
  const [masterObjective, setMasterObjective] = useState("");
  const [targetEntity, setTargetEntity] = useState("");
  const [targetContext, setTargetContext] = useState("");
  const [protocol, setProtocol] = useState("rest");
  const [customDirectives, setCustomDirectives] = useState("");
  const [temperature, setTemperature] = useState(0.7);

  // ── Session store ──────────────────────────────────────────────────────────
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>("");

  // ── Active session state ───────────────────────────────────────────────────
  const [layers, setLayers] = useState<LayerState>({ ...INITIAL_LAYERS });
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [payload, setPayload] = useState("");
  const [tokensUsed, setTokensUsed] = useState(0);
  const [durationMs, setDurationMs] = useState(0);
  const [activeModel, setActiveModel] = useState("");

  // ── Prompt History ─────────────────────────────────────────────────────────
  const [promptHistory, setPromptHistory] = useState<PromptHistoryItem[]>([]);

  // ── UI state ───────────────────────────────────────────────────────────────
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [islandMode, setIslandMode] = useState<"idle" | "generating" | "success" | "error">("idle");
  const [islandError, setIslandError] = useState<string | undefined>();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileTab, setMobileTab] = useState<MobileTab>("chat");
  const [outputSubTab, setOutputSubTab] = useState<"output" | "history">("output");

  const islandTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const chatMessagesRef = useRef<ChatMessage[]>([]);
  const saveDebouncerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipSaveRef = useRef(false); // suppress save during session load

  useEffect(() => { chatMessagesRef.current = chatMessages; }, [chatMessages]);

  const scheduleIslandReset = useCallback((ms: number) => {
    if (islandTimer.current) clearTimeout(islandTimer.current);
    islandTimer.current = setTimeout(() => setIslandMode("idle"), ms);
  }, []);

  // ── Persist sessions (debounced 600ms) ───────────────────────────────────
  const debouncedSave = useCallback((updated: SessionData[]) => {
    if (saveDebouncerRef.current) clearTimeout(saveDebouncerRef.current);
    saveDebouncerRef.current = setTimeout(() => {
      lsSetJSON(LS_KEYS.SESSIONS, updated);
    }, 600);
  }, []);

  // ── Bootstrap ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;

    setApiKey(lsGet(LS_KEYS.API_KEY));
    setApiProvider(lsGet(LS_KEYS.API_PROVIDER, "groq") as "groq" | "openai");
    setModel(lsGet(LS_KEYS.MODEL, "llama-3.3-70b-versatile"));
    setMasterObjective(lsGet(LS_KEYS.MASTER_OBJECTIVE));
    setTargetEntity(lsGet(LS_KEYS.TARGET_ENTITY));
    setTargetContext(lsGet(LS_KEYS.TARGET_CONTEXT));
    setProtocol(lsGet(LS_KEYS.PROTOCOL, "rest"));
    setCustomDirectives(lsGet(LS_KEYS.CUSTOM_DIRECTIVES));
    setTemperature(parseFloat(lsGet(LS_KEYS.TEMPERATURE, "0.7")));

    const storedHistory = lsGetJSON<PromptHistoryItem[]>(LS_KEYS.PROMPT_HISTORY, []);
    setPromptHistory(storedHistory);

    const stored = lsGetJSON<SessionData[]>(LS_KEYS.SESSIONS, []);
    const storedActiveId = lsGet(LS_KEYS.ACTIVE_SESSION, "");

    skipSaveRef.current = true;

    if (stored.length === 0) {
      const def = newSessionData("Default Session");
      setSessions([def]);
      setActiveSessionId(def.id);
      applySessionData(def);
    } else {
      setSessions(stored);
      const targetId = storedActiveId && stored.find((s) => s.id === storedActiveId)
        ? storedActiveId
        : stored[0].id;
      setActiveSessionId(targetId);
      applySessionData(stored.find((s) => s.id === targetId)!);
    }

    setTimeout(() => { skipSaveRef.current = false; }, 100);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function applySessionData(sd: SessionData) {
    setLayers(sd.layers ?? { ...INITIAL_LAYERS });
    setChatMessages(sd.messages ?? []);
    setPayload(sd.payload ?? "");
    setTokensUsed(sd.tokensUsed ?? 0);
    setDurationMs(sd.durationMs ?? 0);
    setActiveModel(sd.activeModel ?? "");
  }

  // ── Persist global config ────────────────────────────────────────────────
  useEffect(() => { lsSet(LS_KEYS.API_KEY, apiKey); }, [apiKey]);
  useEffect(() => { lsSet(LS_KEYS.API_PROVIDER, apiProvider); }, [apiProvider]);
  useEffect(() => { lsSet(LS_KEYS.MODEL, model); }, [model]);
  useEffect(() => { lsSet(LS_KEYS.MASTER_OBJECTIVE, masterObjective); }, [masterObjective]);
  useEffect(() => { lsSet(LS_KEYS.TARGET_ENTITY, targetEntity); }, [targetEntity]);
  useEffect(() => { lsSet(LS_KEYS.TARGET_CONTEXT, targetContext); }, [targetContext]);
  useEffect(() => { lsSet(LS_KEYS.PROTOCOL, protocol); }, [protocol]);
  useEffect(() => { lsSet(LS_KEYS.CUSTOM_DIRECTIVES, customDirectives); }, [customDirectives]);
  useEffect(() => { lsSet(LS_KEYS.TEMPERATURE, temperature.toString()); }, [temperature]);
  useEffect(() => { if (activeSessionId) lsSet(LS_KEYS.ACTIVE_SESSION, activeSessionId); }, [activeSessionId]);
  useEffect(() => { lsSetJSON(LS_KEYS.PROMPT_HISTORY, promptHistory); }, [promptHistory]);

  // ── Save active session on state changes ─────────────────────────────────
  useEffect(() => {
    if (!activeSessionId || skipSaveRef.current) return;
    setSessions((prev) => {
      const updated = prev.map((s) =>
        s.id === activeSessionId
          ? {
              ...s,
              layers,
              messages: chatMessages,
              payload,
              tokensUsed,
              durationMs,
              activeModel,
              objective: masterObjective,
              lastUsed: Date.now(),
            }
          : s
      );
      debouncedSave(updated);
      return updated;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layers, chatMessages, payload, tokensUsed, durationMs, activeModel]);

  // ── Session CRUD ──────────────────────────────────────────────────────────
  const handleNewSession = useCallback(() => {
    const sd = newSessionData(`Session ${Date.now().toString(36).slice(-4).toUpperCase()}`, masterObjective);
    setSessions((prev) => {
      const updated = [sd, ...prev];
      debouncedSave(updated);
      return updated;
    });
    skipSaveRef.current = true;
    setActiveSessionId(sd.id);
    applySessionData(sd);
    setTimeout(() => { skipSaveRef.current = false; }, 100);
    setMobileTab("chat");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [masterObjective, debouncedSave]);

  const handleSelectSession = useCallback((id: string) => {
    if (id === activeSessionId) return;
    const sd = sessions.find((s) => s.id === id);
    if (!sd) return;
    skipSaveRef.current = true;
    setActiveSessionId(id);
    applySessionData(sd);
    setTimeout(() => { skipSaveRef.current = false; }, 100);
    setMobileTab("chat");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessions, activeSessionId]);

  const handleDeleteSession = useCallback((id: string) => {
    setSessions((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      if (updated.length === 0) {
        const def = newSessionData();
        skipSaveRef.current = true;
        setActiveSessionId(def.id);
        applySessionData(def);
        setTimeout(() => { skipSaveRef.current = false; }, 100);
        debouncedSave([def]);
        return [def];
      }
      debouncedSave(updated);
      if (id === activeSessionId) {
        skipSaveRef.current = true;
        setActiveSessionId(updated[0].id);
        applySessionData(updated[0]);
        setTimeout(() => { skipSaveRef.current = false; }, 100);
      }
      return updated;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSessionId, debouncedSave]);

  const handleRenameSession = useCallback((id: string, name: string) => {
    setSessions((prev) => {
      const updated = prev.map((s) => s.id === id ? { ...s, name } : s);
      debouncedSave(updated);
      return updated;
    });
  }, [debouncedSave]);

  // ── Prompt History CRUD ───────────────────────────────────────────────────
  const handleSaveToHistory = useCallback((content: string) => {
    if (!content.trim()) return;
    const activeSession = sessions.find((s) => s.id === activeSessionId);
    const { score, label: scoreLabel, wordCount } = scoreOutput(content);
    const activeLayerCount = Object.values(layers).filter(Boolean).length;
    const item: PromptHistoryItem = {
      id: generateSyncId(),
      title: content.replace(/#{1,6}\s?/g, "").trim().slice(0, 80) || "Untitled Prompt",
      content,
      model: getModelDisplayName(activeModel || model),
      score,
      scoreLabel,
      wordCount,
      createdAt: Date.now(),
      starred: false,
      sessionName: activeSession?.name || "Default",
      activeLayerCount,
    };
    setPromptHistory((prev) => {
      const updated = [item, ...prev].slice(0, 50);
      return updated;
    });
  }, [sessions, activeSessionId, layers, activeModel, model]);

  const handleDeleteHistory = useCallback((id: string) => {
    setPromptHistory((prev) => prev.filter((h) => h.id !== id));
  }, []);

  const handleToggleStar = useCallback((id: string) => {
    setPromptHistory((prev) => prev.map((h) => h.id === id ? { ...h, starred: !h.starred } : h));
  }, []);

  const handleLoadHistory = useCallback((item: PromptHistoryItem) => {
    setPayload(item.content);
    setOutputSubTab("output");
    setMobileTab("output");
  }, []);

  // ── Layer toggle ──────────────────────────────────────────────────────────
  const handleLayerToggle = useCallback((key: LayerKey) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  // ── Shared API call ───────────────────────────────────────────────────────
  const callApi = useCallback(async (
    body: Record<string, unknown>
  ): Promise<{ message: string; tokensUsed: number }> => {
    const endpoint = apiProvider === "openai" ? "/api/chat" : "/api/groq";
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      let errMsg = `Server error (${res.status})`;
      try { const d = await res.json(); errMsg = d.error || errMsg; } catch {}
      throw new Error(errMsg);
    }
    const data = await res.json();
    if (!data.success && !data.message) throw new Error(data.error || "No response.");
    return { message: data.message || data.reply || "", tokensUsed: data.tokensUsed ?? 0 };
  }, [apiProvider]);

  // ── Chat send ─────────────────────────────────────────────────────────────
  const handleSendMessage = useCallback(async (text: string): Promise<string | null> => {
    const systemPrompt = buildSystemPrompt({ masterObjective, targetEntity, targetContext, protocol, customDirectives, layers });
    const history = chatMessagesRef.current.slice(-20).map((m) => ({ role: m.role, content: m.content }));
    try {
      const body: Record<string, unknown> = {
        messages: [...history, { role: "user", content: text }],
        systemPrompt, model, temperature, history, message: text,
      };
      if (apiProvider === "groq") body.apiKey = apiKey;
      const result = await callApi(body);
      return result.message || null;
    } catch (err) {
      console.error("[MPA Chat]", err);
      return null;
    }
  }, [apiProvider, apiKey, model, temperature, masterObjective, targetEntity, targetContext, protocol, customDirectives, layers, callApi]);

  // ── Generate full prompt ──────────────────────────────────────────────────
  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setIsStreaming(true);
    setIslandMode("generating");
    setPayload("");

    const assembled = assemblePayload({ masterObjective, targetEntity, targetContext, protocol, customDirectives, layers, model, temperature });
    const t0 = Date.now();

    try {
      const body: Record<string, unknown> = {
        messages: [{ role: "user", content: assembled.userMessage }],
        systemPrompt: assembled.systemPrompt,
        model, temperature,
        message: assembled.userMessage,
      };
      if (apiProvider === "groq") body.apiKey = apiKey;

      const result = await callApi(body);
      if (!result.message.trim()) throw new Error("AI returned an empty response. Try again.");

      const elapsed = Date.now() - t0;
      setPayload(result.message);
      setTokensUsed(result.tokensUsed || Math.round(result.message.length / 4));
      setDurationMs(elapsed);
      setActiveModel(model);
      setIslandMode("success");
      scheduleIslandReset(2500);

      const userMsg: ChatMessage = { id: `${Date.now()}-u`, role: "user", content: assembled.userMessage, timestamp: Date.now() };
      const asstMsg: ChatMessage = { id: `${Date.now()}-a`, role: "assistant", content: result.message, timestamp: Date.now() };
      setChatMessages((prev) => [...prev, userMsg, asstMsg]);
      setMobileTab("output");
    } catch (err) {
      const raw = err instanceof Error ? err.message : "Unknown error.";
      let msg = raw;
      if (/401|invalid|auth|key/i.test(raw)) msg = "Invalid API key. Check settings.";
      else if (/429|rate/i.test(raw)) msg = "Rate limit hit. Wait 60 seconds.";
      else if (/fetch|network|ECONNREFUSED/i.test(raw)) msg = "Network error. Check connection.";
      setIslandMode("error");
      setIslandError(msg);
      scheduleIslandReset(6000);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  }, [apiProvider, apiKey, model, temperature, masterObjective, targetEntity, targetContext, protocol, customDirectives, layers, callApi, scheduleIslandReset]);

  const handleTemplateSelect = useCallback((t: IndustryTemplate) => {
    setTargetEntity(t.entity);
    setTargetContext(t.context);
    if (t.masterObjective) setMasterObjective(t.masterObjective);
    setProtocol(t.protocol);
    if (t.layers) {
      setLayers(() => {
        const next = { ...INITIAL_LAYERS };
        for (const [k, v] of Object.entries(t.layers)) {
          if (k in next) (next as Record<string, boolean>)[k] = v;
        }
        return next;
      });
    }
  }, []);

  const handleChatMessagesChange = useCallback((msgs: ChatMessage[]) => {
    setChatMessages(msgs);
  }, []);

  // ── Derived ───────────────────────────────────────────────────────────────
  const canGenerate = !isLoading && !!targetEntity.trim() && !!targetContext.trim();
  const activeLayerCount = Object.values(layers).filter(Boolean).length;
  const hasOutput = payload.length > 0;
  const sessionMetas = sessions.map(toSessionMeta);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="h-screen flex flex-col bg-[#0a0a0a] text-white overflow-hidden">

      {/* ─── Header ─── */}
      <header className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.07] bg-[#0f0f0f] shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 28 28" fill="none" className="w-7 h-7">
              <polygon points="14,2 25,8 25,20 14,26 3,20 3,8" fill="none" stroke="#00ff88" strokeWidth="1.5" />
              <polygon points="14,6 21,10 21,18 14,22 7,18 7,10" fill="#00ff88" fillOpacity="0.15" />
              <polygon points="14,9 18.5,11.5 18.5,16.5 14,19 9.5,16.5 9.5,11.5" fill="#00ff88" fillOpacity="0.08" />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight font-mono text-white leading-none">MPA Terminal</h1>
            <p className="text-[9px] text-[#00ff88]/60 font-mono uppercase tracking-[0.18em] leading-none mt-0.5">Master Plan Architect</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {islandMode !== "idle" && (
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
              islandMode === "generating" ? "text-amber-400 border-amber-500/30 bg-amber-500/8" :
              islandMode === "success"    ? "text-[#00ff88] border-[#00ff88]/30 bg-[#00ff88]/8" :
                                           "text-red-400 border-red-500/30 bg-red-500/8"
            }`}>
              {islandMode === "generating" && "⟳ Generating…"}
              {islandMode === "success"    && "✓ Prompt Ready"}
              {islandMode === "error"      && `⚠ ${(islandError ?? "Error").slice(0, 30)}`}
            </span>
          )}
          <span className="text-[10px] font-mono px-2.5 py-1 rounded-full border border-[#00ff88]/25 text-[#00ff88] bg-[#00ff88]/8 font-bold tracking-wide">
            MPA v2.0
          </span>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden md:flex items-center justify-center w-7 h-7 rounded-lg hover:bg-white/5 transition-colors text-gray-600"
          >
            {sidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
          </button>
        </div>
      </header>

      {/* ─── Desktop ─── */}
      <div className="hidden md:flex flex-1 overflow-hidden">
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              key="sidebar"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 300, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="border-r border-white/[0.07] bg-[#0d0d0d] overflow-hidden shrink-0"
            >
              <div className="h-full overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
                <ConfigPanel
                  apiKey={apiKey}                     setApiKey={setApiKey}
                  apiProvider={apiProvider}           setApiProvider={setApiProvider}
                  model={model}                       setModel={setModel}
                  masterObjective={masterObjective}   setMasterObjective={setMasterObjective}
                  targetEntity={targetEntity}         setTargetEntity={setTargetEntity}
                  targetContext={targetContext}        setTargetContext={setTargetContext}
                  protocol={protocol}                 setProtocol={setProtocol}
                  customDirectives={customDirectives} setCustomDirectives={setCustomDirectives}
                  temperature={temperature}           setTemperature={setTemperature}
                  onTemplateSelect={handleTemplateSelect}
                  onGenerate={handleGenerate}
                  isLoading={isLoading}
                  canGenerate={canGenerate}
                />
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        <main className="flex-1 flex overflow-hidden min-w-0">
          {/* Chat */}
          <div className="flex-1 border-r border-white/[0.07] flex flex-col min-w-0">
            <ChatPanel
              key={activeSessionId}
              onSendMessage={handleSendMessage}
              onGenerate={handleGenerate}
              isLoading={isLoading}
              initialMessages={chatMessages}
              onMessagesChange={handleChatMessagesChange}
            />
          </div>

          {/* Layers + Output + History */}
          <div className="w-[320px] flex flex-col bg-[#0a0a0a] shrink-0">
            <div className="h-[42%] border-b border-white/[0.07] overflow-hidden">
              <LayerPanel layers={layers} onToggle={handleLayerToggle} />
            </div>
            {/* Output / History sub-tabs */}
            <div className="flex border-b border-white/[0.07] shrink-0">
              <button
                onClick={() => setOutputSubTab("output")}
                className={`flex-1 py-2 text-[10px] font-mono uppercase tracking-[0.15em] font-semibold transition-colors ${
                  outputSubTab === "output"
                    ? "text-[#00ff88] border-b-2 border-[#00ff88]"
                    : "text-gray-600 hover:text-gray-400"
                }`}
              >
                Output
              </button>
              <button
                onClick={() => setOutputSubTab("history")}
                className={`flex-1 py-2 text-[10px] font-mono uppercase tracking-[0.15em] font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                  outputSubTab === "history"
                    ? "text-[#00ff88] border-b-2 border-[#00ff88]"
                    : "text-gray-600 hover:text-gray-400"
                }`}
              >
                History
                {promptHistory.length > 0 && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[8px] font-bold ${
                    outputSubTab === "history" ? "bg-[#00ff88]/15 text-[#00ff88]" : "bg-white/8 text-gray-500"
                  }`}>
                    {promptHistory.length}
                  </span>
                )}
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              {outputSubTab === "output" ? (
                <OutputViewer
                  payload={payload}
                  tokensUsed={tokensUsed}
                  durationMs={durationMs}
                  model={activeModel}
                  isStreaming={isStreaming}
                  onGenerateNow={handleGenerate}
                  onSaveToHistory={handleSaveToHistory}
                />
              ) : (
                <HistoryPanel
                  history={promptHistory}
                  onDelete={handleDeleteHistory}
                  onToggleStar={handleToggleStar}
                  onLoad={handleLoadHistory}
                />
              )}
            </div>
          </div>
        </main>
      </div>

      {/* ─── Mobile ─── */}
      <div className="md:hidden flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-hidden">
          {mobileTab === "chat" && (
            <ChatPanel
              key={activeSessionId}
              onSendMessage={handleSendMessage}
              onGenerate={handleGenerate}
              isLoading={isLoading}
              initialMessages={chatMessages}
              onMessagesChange={handleChatMessagesChange}
              placeholder={'Type a message… e.g. "add quantum security"'}
            />
          )}
          {mobileTab === "layers" && (
            <div className="h-full overflow-y-auto">
              <LayerPanel layers={layers} onToggle={handleLayerToggle} />
            </div>
          )}
          {mobileTab === "output" && (
            <div className="flex flex-col h-full">
              {/* Output / History sub-tabs (mobile) */}
              <div className="flex border-b border-white/[0.07] shrink-0 bg-[#0d0d0d]">
                <button
                  onClick={() => setOutputSubTab("output")}
                  className={`flex-1 py-2.5 text-[10px] font-mono uppercase tracking-[0.15em] font-semibold transition-colors ${
                    outputSubTab === "output"
                      ? "text-[#00ff88] border-b-2 border-[#00ff88]"
                      : "text-gray-600 hover:text-gray-400"
                  }`}
                >
                  Output
                </button>
                <button
                  onClick={() => setOutputSubTab("history")}
                  className={`flex-1 py-2.5 text-[10px] font-mono uppercase tracking-[0.15em] font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                    outputSubTab === "history"
                      ? "text-[#00ff88] border-b-2 border-[#00ff88]"
                      : "text-gray-600 hover:text-gray-400"
                  }`}
                >
                  History
                  {promptHistory.length > 0 && (
                    <span className={`px-1.5 py-0.5 rounded-full text-[8px] font-bold ${
                      outputSubTab === "history" ? "bg-[#00ff88]/15 text-[#00ff88]" : "bg-white/8 text-gray-500"
                    }`}>
                      {promptHistory.length}
                    </span>
                  )}
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                {outputSubTab === "output" ? (
                  <OutputViewer
                    payload={payload}
                    tokensUsed={tokensUsed}
                    durationMs={durationMs}
                    model={activeModel}
                    isStreaming={isStreaming}
                    onGenerateNow={handleGenerate}
                    onSaveToHistory={handleSaveToHistory}
                  />
                ) : (
                  <HistoryPanel
                    history={promptHistory}
                    onDelete={handleDeleteHistory}
                    onToggleStar={handleToggleStar}
                    onLoad={handleLoadHistory}
                  />
                )}
              </div>
            </div>
          )}
          {mobileTab === "sessions" && (
            <SessionsPanel
              sessions={sessionMetas}
              activeSessionId={activeSessionId}
              onNewSession={handleNewSession}
              onSelectSession={handleSelectSession}
              onDeleteSession={handleDeleteSession}
              onRenameSession={handleRenameSession}
              activeLayerCount={activeLayerCount}
            />
          )}
          {mobileTab === "config" && (
            <ConfigPanel
              apiKey={apiKey}                     setApiKey={setApiKey}
              apiProvider={apiProvider}           setApiProvider={setApiProvider}
              model={model}                       setModel={setModel}
              masterObjective={masterObjective}   setMasterObjective={setMasterObjective}
              targetEntity={targetEntity}         setTargetEntity={setTargetEntity}
              targetContext={targetContext}        setTargetContext={setTargetContext}
              protocol={protocol}                 setProtocol={setProtocol}
              customDirectives={customDirectives} setCustomDirectives={setCustomDirectives}
              temperature={temperature}           setTemperature={setTemperature}
              onTemplateSelect={handleTemplateSelect}
              onGenerate={handleGenerate}
              isLoading={isLoading}
              canGenerate={canGenerate}
            />
          )}
        </div>

        <MobileNav
          activeTab={mobileTab}
          onTabChange={setMobileTab}
          hasOutput={hasOutput}
          activeLayerCount={activeLayerCount}
        />
      </div>
    </div>
  );
}
