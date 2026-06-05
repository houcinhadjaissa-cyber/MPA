"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, Zap } from "lucide-react";

import ChatPanel, { type ChatMessage } from "@/components/mpa/ChatPanel";
import SettingsPanel from "@/components/mpa/SettingsPanel";
import LayerPanel from "@/components/mpa/LayerPanel";
import OutputViewer from "@/components/mpa/OutputViewer";
import DynamicIsland from "@/components/mpa/DynamicIsland";
import MobileNav, { type MobileTab } from "@/components/mpa/MobileNav";
import TemplateSelector from "@/components/mpa/TemplateSelector";
import ProjectVault, { type SavedProject } from "@/components/mpa/ProjectVault";

import { buildSystemPrompt, INITIAL_LAYERS, type LayerState, type LayerKey } from "@/lib/mpa/layers";
import { type IndustryTemplate } from "@/lib/mpa/templates";
import { lsGet, lsSet, lsGetJSON, lsSetJSON, LS_KEYS } from "@/lib/mpa/storage";

type IslandMode = "idle" | "generating" | "success" | "error";

export default function Dashboard() {
  // ── API / Model ───────────────────────────────────────────────────────────
  const [apiKey, setApiKey] = useState("");
  const [apiProvider, setApiProvider] = useState<"groq" | "openai">("groq");
  const [model, setModel] = useState("llama3-70b-8192");
  const [showKey, setShowKey] = useState(false);

  // ── Target Config ────────────────────────────────────────────────────────
  const [masterObjective, setMasterObjective] = useState("");
  const [targetEntity, setTargetEntity] = useState("");
  const [targetContext, setTargetContext] = useState("");
  const [protocol, setProtocol] = useState("rest");
  const [customDirectives, setCustomDirectives] = useState("");
  const [temperature, setTemperature] = useState(0.7);

  // ── Layers ───────────────────────────────────────────────────────────────
  const [layers, setLayers] = useState<LayerState>(INITIAL_LAYERS);

  // ── Output / State ───────────────────────────────────────────────────────
  const [payload, setPayload] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [islandMode, setIslandMode] = useState<IslandMode>("idle");
  const [islandError, setIslandError] = useState("");
  const [tokensUsed, setTokensUsed] = useState<number | undefined>();
  const [durationMs, setDurationMs] = useState<number | undefined>();
  const [usedModel, setUsedModel] = useState<string | undefined>();
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // ── Projects ─────────────────────────────────────────────────────────────
  const [projects, setProjects] = useState<SavedProject[]>([]);

  // ── UI ───────────────────────────────────────────────────────────────────
  const [mobileTab, setMobileTab] = useState<MobileTab>("settings");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Hydrate from localStorage ─────────────────────────────────────────────
  useEffect(() => {
    setApiKey(lsGet(LS_KEYS.API_KEY));
    setApiProvider(lsGet(LS_KEYS.API_PROVIDER, "groq") as "groq" | "openai");
    setModel(lsGet(LS_KEYS.MODEL, "llama3-70b-8192"));
    setMasterObjective(lsGet(LS_KEYS.MASTER_OBJECTIVE));
    setTargetEntity(lsGet(LS_KEYS.TARGET_ENTITY));
    setTargetContext(lsGet(LS_KEYS.TARGET_CONTEXT));
    setProtocol(lsGet(LS_KEYS.PROTOCOL, "rest"));
    setCustomDirectives(lsGet(LS_KEYS.CUSTOM_DIRECTIVES));
    setTemperature(parseFloat(lsGet(LS_KEYS.TEMPERATURE, "0.7")));
    setLayers(lsGetJSON(LS_KEYS.LAYERS, INITIAL_LAYERS));
    setChatMessages(lsGetJSON(LS_KEYS.CHAT_HISTORY, []));
    setProjects(lsGetJSON(LS_KEYS.PROJECTS, []));
    setHydrated(true);
  }, []);

  // ── Persist changes ───────────────────────────────────────────────────────
  useEffect(() => { if (hydrated) lsSet(LS_KEYS.API_KEY, apiKey); }, [hydrated, apiKey]);
  useEffect(() => { if (hydrated) lsSet(LS_KEYS.API_PROVIDER, apiProvider); }, [hydrated, apiProvider]);
  useEffect(() => { if (hydrated) lsSet(LS_KEYS.MODEL, model); }, [hydrated, model]);
  useEffect(() => { if (hydrated) lsSet(LS_KEYS.MASTER_OBJECTIVE, masterObjective); }, [hydrated, masterObjective]);
  useEffect(() => { if (hydrated) lsSet(LS_KEYS.TARGET_ENTITY, targetEntity); }, [hydrated, targetEntity]);
  useEffect(() => { if (hydrated) lsSet(LS_KEYS.TARGET_CONTEXT, targetContext); }, [hydrated, targetContext]);
  useEffect(() => { if (hydrated) lsSet(LS_KEYS.PROTOCOL, protocol); }, [hydrated, protocol]);
  useEffect(() => { if (hydrated) lsSet(LS_KEYS.CUSTOM_DIRECTIVES, customDirectives); }, [hydrated, customDirectives]);
  useEffect(() => { if (hydrated) lsSet(LS_KEYS.TEMPERATURE, String(temperature)); }, [hydrated, temperature]);
  useEffect(() => { if (hydrated) lsSetJSON(LS_KEYS.LAYERS, layers); }, [hydrated, layers]);
  useEffect(() => { if (hydrated) lsSetJSON(LS_KEYS.CHAT_HISTORY, chatMessages); }, [hydrated, chatMessages]);
  useEffect(() => { if (hydrated) lsSetJSON(LS_KEYS.PROJECTS, projects); }, [hydrated, projects]);

  // ── Layer toggle ──────────────────────────────────────────────────────────
  const toggleLayer = useCallback((key: LayerKey) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  // ── Template load ─────────────────────────────────────────────────────────
  const handleTemplateSelect = useCallback((t: IndustryTemplate) => {
    setTargetEntity(t.entity);
    setTargetContext(t.context);
    setMasterObjective(t.masterObjective);
    setProtocol(t.protocol);
    setLayers((prev) => ({ ...prev, ...t.layers }));
    setMobileTab("settings");
  }, []);

  // ── Core: call AI ─────────────────────────────────────────────────────────
  const callAI = useCallback(
    async (userMessage: string, history: ChatMessage[]): Promise<{ message: string; tokens?: number }> => {
      const systemPrompt = buildSystemPrompt({
        masterObjective,
        targetEntity,
        targetContext,
        protocol,
        customDirectives,
        layers,
      });

      const endpoint = apiProvider === "openai" ? "/api/chat" : "/api/groq";

      const body =
        apiProvider === "openai"
          ? {
              messages: [
                ...history
                  .filter((m) => m.role === "user" || m.role === "assistant")
                  .map((m) => ({ role: m.role, content: m.content })),
                { role: "user", content: userMessage },
              ],
              systemPrompt,
              model,
              temperature,
            }
          : {
              apiKey,
              message: userMessage,
              systemPrompt,
              history: history
                .filter((m) => m.role === "user" || m.role === "assistant")
                .map((m) => ({ role: m.role, content: m.content })),
              model,
              temperature,
            };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Request failed");
      }

      return { message: data.message, tokens: data.tokensUsed };
    },
    [apiKey, apiProvider, model, temperature, masterObjective, targetEntity, targetContext, protocol, customDirectives, layers]
  );

  // ── Generate (button) ────────────────────────────────────────────────────
  const handleGenerate = useCallback(async () => {
    if (isLoading) return;

    if (!apiKey.trim()) {
      setIslandMode("error");
      setIslandError("API key required — enter it in Settings");
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
      successTimerRef.current = setTimeout(() => setIslandMode("idle"), 3500);
      return;
    }
    if (!targetEntity.trim() || !targetContext.trim()) {
      setIslandMode("error");
      setIslandError("Target Entity and Context are required");
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
      successTimerRef.current = setTimeout(() => setIslandMode("idle"), 3500);
      return;
    }

    setIsLoading(true);
    setIslandMode("generating");
    setPayload("");
    setTokensUsed(undefined);
    setDurationMs(undefined);

    const t0 = Date.now();

    try {
      const userMessage =
        masterObjective.trim() ||
        `Generate a comprehensive MACH enterprise prompt for: ${targetEntity}. Context: ${targetContext}`;

      const { message: reply, tokens } = await callAI(userMessage, chatMessages);
      const elapsed = Date.now() - t0;

      setPayload(reply);
      setDurationMs(elapsed);
      setUsedModel(model);
      if (tokens) setTokensUsed(tokens);

      const userMsg: ChatMessage = {
        id: `${Date.now()}-u`,
        role: "user",
        content: userMessage,
        timestamp: Date.now(),
      };
      const assistantMsg: ChatMessage = {
        id: `${Date.now()}-a`,
        role: "assistant",
        content: reply,
        timestamp: Date.now(),
      };
      setChatMessages((prev) => [...prev, userMsg, assistantMsg]);

      setIslandMode("success");
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
      successTimerRef.current = setTimeout(() => setIslandMode("idle"), 3000);
      setMobileTab("output");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Generation failed";
      setIslandMode("error");
      setIslandError(msg);
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
      successTimerRef.current = setTimeout(() => setIslandMode("idle"), 5000);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, apiKey, targetEntity, targetContext, masterObjective, callAI, model, chatMessages]);

  // ── Chat: send message ────────────────────────────────────────────────────
  const handleChatSend = useCallback(
    async (message: string): Promise<string | null> => {
      setIsLoading(true);
      setIslandMode("generating");
      try {
        const { message: reply, tokens } = await callAI(message, chatMessages);
        setIslandMode("success");
        if (successTimerRef.current) clearTimeout(successTimerRef.current);
        successTimerRef.current = setTimeout(() => setIslandMode("idle"), 3000);
        setPayload(reply);
        setUsedModel(model);
        if (tokens) setTokensUsed(tokens);
        return reply;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Chat failed";
        setIslandMode("error");
        setIslandError(msg);
        if (successTimerRef.current) clearTimeout(successTimerRef.current);
        successTimerRef.current = setTimeout(() => setIslandMode("idle"), 5000);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [callAI, model, chatMessages]
  );

  // ── Project Vault ─────────────────────────────────────────────────────────
  const handleSaveProject = useCallback(
    (label: string) => {
      const project: SavedProject = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        label: label || targetEntity,
        entity: targetEntity,
        context: targetContext,
        masterObjective,
        protocol,
        createdAt: Date.now(),
      };
      setProjects((prev) => [project, ...prev].slice(0, 20));
    },
    [targetEntity, targetContext, masterObjective, protocol]
  );

  const handleLoadProject = useCallback((p: SavedProject) => {
    setTargetEntity(p.entity);
    setTargetContext(p.context);
    setMasterObjective(p.masterObjective);
    setProtocol(p.protocol);
    setMobileTab("settings");
  }, []);

  const handleDeleteProject = useCallback((id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }, []);

  // ── Cleanup ───────────────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
    };
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  // Sidebar content (Settings + Templates + Layers + Vault)
  // ─────────────────────────────────────────────────────────────────────────
  const canGenerate = !!(apiKey.trim() && targetEntity.trim() && targetContext.trim());

  const sidebarContent = (
    <div className="space-y-6 pb-8">
      <TemplateSelector onSelect={handleTemplateSelect} />
      <SettingsPanel
        apiKey={apiKey}                         setApiKey={setApiKey}
        apiProvider={apiProvider}               setApiProvider={setApiProvider}
        model={model}                           setModel={setModel}
        masterObjective={masterObjective}       setMasterObjective={setMasterObjective}
        targetEntity={targetEntity}             setTargetEntity={setTargetEntity}
        targetContext={targetContext}            setTargetContext={setTargetContext}
        protocol={protocol}                     setProtocol={setProtocol}
        customDirectives={customDirectives}     setCustomDirectives={setCustomDirectives}
        temperature={temperature}               setTemperature={setTemperature}
        showKey={showKey}                       setShowKey={setShowKey}
        onGenerate={handleGenerate}
        isLoading={isLoading}
        canGenerate={canGenerate}
      />
      <LayerPanel layers={layers} onToggle={toggleLayer} />
      <ProjectVault
        projects={projects}
        onSave={handleSaveProject}
        onLoad={handleLoadProject}
        onDelete={handleDeleteProject}
        currentEntity={targetEntity}
      />
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a] overflow-hidden">

      {/* ── Top Bar ─────────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-[#0d0d0d] shrink-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="hidden md:flex items-center justify-center w-7 h-7 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-all"
            title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-emerald-400" />
            <span className="text-white font-bold text-sm tracking-wider font-mono">MPA</span>
            <span className="text-gray-600 text-xs font-mono hidden sm:inline">
              Master Plan Architect
            </span>
          </div>
        </div>

        <DynamicIsland mode={islandMode} errorMsg={islandError} />

        <div className="w-20 md:w-24" />
      </header>

      {/* ── Main Layout ─────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Desktop Sidebar */}
        {sidebarOpen && (
          <aside className="hidden md:flex flex-col w-72 border-r border-white/10 bg-[#0d0d0d] overflow-y-auto shrink-0">
            <div className="px-4 py-4">{sidebarContent}</div>
          </aside>
        )}

        {/* Desktop Center: Chat */}
        <main className="hidden md:flex flex-col flex-1 overflow-hidden border-r border-white/10">
          <ChatPanel
            onSendMessage={handleChatSend}
            isLoading={isLoading}
            initialMessages={chatMessages}
            onMessagesChange={setChatMessages}
          />
        </main>

        {/* Desktop Right: Output */}
        <section className="hidden md:flex flex-col w-[42%] max-w-2xl overflow-hidden">
          <OutputViewer
            payload={payload}
            tokensUsed={tokensUsed}
            durationMs={durationMs}
            model={usedModel}
          />
        </section>

        {/* Mobile: Tabbed Content */}
        <div className="flex md:hidden flex-col flex-1 overflow-hidden">
          {mobileTab === "settings" && (
            <div className="flex-1 overflow-y-auto px-4 py-4">{sidebarContent}</div>
          )}
          {mobileTab === "layers" && (
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <LayerPanel layers={layers} onToggle={toggleLayer} />
            </div>
          )}
          {mobileTab === "chat" && (
            <div className="flex-1 overflow-hidden">
              <ChatPanel
                onSendMessage={handleChatSend}
                isLoading={isLoading}
                initialMessages={chatMessages}
                onMessagesChange={setChatMessages}
              />
            </div>
          )}
          {mobileTab === "output" && (
            <div className="flex-1 overflow-hidden">
              <OutputViewer
                payload={payload}
                tokensUsed={tokensUsed}
                durationMs={durationMs}
                model={usedModel}
              />
            </div>
          )}
        </div>

      </div>

      {/* ── Mobile Bottom Nav ────────────────────────────────────────────── */}
      <div className="md:hidden shrink-0">
        <MobileNav
          activeTab={mobileTab}
          onTabChange={setMobileTab}
          hasOutput={!!payload}
        />
      </div>
    </div>
  );
}
