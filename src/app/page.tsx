"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, ChevronLeft, ChevronRight } from "lucide-react";
import ChatPanel from "@/components/mpa/ChatPanel";
import type { ChatMessage } from "@/components/mpa/ChatPanel";
import OutputViewer from "@/components/mpa/OutputViewer";
import LayerPanel from "@/components/mpa/LayerPanel";
import SettingsPanel from "@/components/mpa/SettingsPanel";
import TemplateSelector from "@/components/mpa/TemplateSelector";
import ProjectVault from "@/components/mpa/ProjectVault";
import type { SavedProject } from "@/components/mpa/ProjectVault";
import DynamicIsland from "@/components/mpa/DynamicIsland";
import MobileNav from "@/components/mpa/MobileNav";
import type { MobileTab } from "@/components/mpa/MobileNav";
import { buildSystemPrompt, INITIAL_LAYERS, type LayerState, type LayerKey } from "@/lib/mpa/layers";
import { type IndustryTemplate } from "@/lib/mpa/templates";
import { lsGet, lsSet, lsGetJSON, lsSetJSON, LS_KEYS } from "@/lib/mpa/storage";

export default function Home() {
  const [apiKey, setApiKey] = useState("");
  const [apiProvider, setApiProvider] = useState<"groq" | "openai">("groq");
  const [model, setModel] = useState("llama3-70b-8192");
  const [masterObjective, setMasterObjective] = useState("");
  const [targetEntity, setTargetEntity] = useState("");
  const [targetContext, setTargetContext] = useState("");
  const [protocol, setProtocol] = useState("rest");
  const [customDirectives, setCustomDirectives] = useState("");
  const [temperature, setTemperature] = useState(0.7);
  const [showKey, setShowKey] = useState(false);
  const [layers, setLayers] = useState<LayerState>({ ...INITIAL_LAYERS });
  const [payload, setPayload] = useState("");
  const [tokensUsed, setTokensUsed] = useState(0);
  const [durationMs, setDurationMs] = useState(0);
  const [activeModel, setActiveModel] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [islandMode, setIslandMode] = useState<"idle" | "generating" | "success" | "error">("idle");
  const [islandError, setIslandError] = useState<string | undefined>();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileTab, setMobileTab] = useState<MobileTab>("chat");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const islandTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const chatMessagesRef = useRef<ChatMessage[]>([]);

  useEffect(() => { chatMessagesRef.current = chatMessages; }, [chatMessages]);

  const scheduleIslandReset = useCallback((ms: number) => {
    if (islandTimer.current) clearTimeout(islandTimer.current);
    islandTimer.current = setTimeout(() => setIslandMode("idle"), ms);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setApiKey(lsGet(LS_KEYS.API_KEY));
    setApiProvider(lsGet(LS_KEYS.API_PROVIDER, "groq") as "groq" | "openai");
    setModel(lsGet(LS_KEYS.MODEL, "llama3-70b-8192"));
    setMasterObjective(lsGet(LS_KEYS.MASTER_OBJECTIVE));
    setTargetEntity(lsGet(LS_KEYS.TARGET_ENTITY));
    setTargetContext(lsGet(LS_KEYS.TARGET_CONTEXT));
    setProtocol(lsGet(LS_KEYS.PROTOCOL, "rest"));
    setCustomDirectives(lsGet(LS_KEYS.CUSTOM_DIRECTIVES));
    setTemperature(parseFloat(lsGet(LS_KEYS.TEMPERATURE, "0.7")));
    setLayers(lsGetJSON<LayerState>(LS_KEYS.LAYERS, { ...INITIAL_LAYERS }));
    setChatMessages(lsGetJSON<ChatMessage[]>(LS_KEYS.CHAT_HISTORY, []));
    setProjects(lsGetJSON<SavedProject[]>(LS_KEYS.PROJECTS, []));
  }, []);

  useEffect(() => { lsSet(LS_KEYS.API_KEY, apiKey); }, [apiKey]);
  useEffect(() => { lsSet(LS_KEYS.API_PROVIDER, apiProvider); }, [apiProvider]);
  useEffect(() => { lsSet(LS_KEYS.MODEL, model); }, [model]);
  useEffect(() => { lsSet(LS_KEYS.MASTER_OBJECTIVE, masterObjective); }, [masterObjective]);
  useEffect(() => { lsSet(LS_KEYS.TARGET_ENTITY, targetEntity); }, [targetEntity]);
  useEffect(() => { lsSet(LS_KEYS.TARGET_CONTEXT, targetContext); }, [targetContext]);
  useEffect(() => { lsSet(LS_KEYS.PROTOCOL, protocol); }, [protocol]);
  useEffect(() => { lsSet(LS_KEYS.CUSTOM_DIRECTIVES, customDirectives); }, [customDirectives]);
  useEffect(() => { lsSet(LS_KEYS.TEMPERATURE, temperature.toString()); }, [temperature]);
  useEffect(() => { lsSetJSON(LS_KEYS.LAYERS, layers); }, [layers]);
  useEffect(() => { lsSetJSON(LS_KEYS.CHAT_HISTORY, chatMessages.slice(-100)); }, [chatMessages]);
  useEffect(() => { lsSetJSON(LS_KEYS.PROJECTS, projects); }, [projects]);

  const handleLayerToggle = useCallback((key: LayerKey) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleSendMessage = useCallback(async (text: string): Promise<string | null> => {
    const systemPrompt = buildSystemPrompt({ masterObjective, targetEntity, targetContext, protocol, customDirectives, layers });
    const historyForApi = chatMessagesRef.current.slice(-20).map((m) => ({ role: m.role, content: m.content }));
    try {
      const endpoint = apiProvider === "openai" ? "/api/chat" : "/api/groq";
      const body: Record<string, unknown> = {
        messages: [...historyForApi, { role: "user" as const, content: text }],
        systemPrompt, model, temperature, history: historyForApi, message: text,
      };
      if (apiProvider === "groq") body.apiKey = apiKey;
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
      if (!data.success && !data.message) throw new Error(data.error || "No response generated.");
      return data.message || data.reply || null;
    } catch (err: unknown) {
      console.error("[MPA Chat Error]", err);
      return null;
    }
  }, [apiProvider, apiKey, model, temperature, masterObjective, targetEntity, targetContext, protocol, customDirectives, layers]);

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setIsStreaming(true);
    setIslandMode("generating");
    setPayload("");
    const systemPrompt = buildSystemPrompt({ masterObjective, targetEntity, targetContext, protocol, customDirectives, layers });
    const userMessage = `Generate a comprehensive MACH Enterprise Prompt for: ${targetEntity || "a new project"}. Context: ${targetContext || "As described"}. Protocol: ${protocol || "REST"}.${masterObjective ? ` Objective: ${masterObjective}.` : ""}${customDirectives ? ` Directives: ${customDirectives}.` : ""}`;
    const t0 = Date.now();
    try {
      const endpoint = apiProvider === "openai" ? "/api/chat" : "/api/groq";
      const body: Record<string, unknown> = {
        messages: [{ role: "user", content: userMessage }],
        systemPrompt, model, temperature, message: userMessage,
      };
      if (apiProvider === "groq") body.apiKey = apiKey;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        let errMsg = "Generation failed. Try again.";
        try { const d = await res.json(); errMsg = d.error || errMsg; } catch {}
        throw new Error(errMsg);
      }
      const data = await res.json();
      const reply = data.message || data.reply || "";
      if (!reply.trim()) throw new Error("AI returned an empty response. Try again.");
      const elapsed = Date.now() - t0;
      setPayload(reply);
      setTokensUsed(data.tokensUsed || Math.round(reply.length / 4));
      setDurationMs(elapsed);
      setActiveModel(model);
      setIslandMode("success");
      scheduleIslandReset(2500);
      const userMsg: ChatMessage = { id: `${Date.now()}-u`, role: "user", content: userMessage, timestamp: Date.now() };
      const assistantMsg: ChatMessage = { id: `${Date.now()}-a`, role: "assistant", content: reply, timestamp: Date.now() };
      setChatMessages((prev) => [...prev, userMsg, assistantMsg]);
      setMobileTab("output");
    } catch (err: unknown) {
      const raw = err instanceof Error ? err.message : "Unknown error.";
      let msg = raw;
      if (/401|invalid|auth|key/i.test(raw)) msg = "Invalid API key. Check and re-enter.";
      else if (/429|rate/i.test(raw)) msg = "Rate limit reached. Wait 60 seconds.";
      else if (/fetch|network|ECONNREFUSED/i.test(raw)) msg = "Network error. Check connection.";
      setIslandMode("error");
      setIslandError(msg);
      scheduleIslandReset(6000);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  }, [apiProvider, apiKey, model, temperature, masterObjective, targetEntity, targetContext, protocol, customDirectives, layers, scheduleIslandReset]);

  const applyTemplate = useCallback((t: IndustryTemplate) => {
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

  const saveProject = useCallback((label: string) => {
    if (!targetEntity.trim()) return;
    const entry: SavedProject = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      label: label.trim() || targetEntity,
      entity: targetEntity,
      context: targetContext,
      masterObjective,
      protocol,
      createdAt: Date.now(),
    };
    setProjects((prev) => [entry, ...prev].slice(0, 20));
  }, [targetEntity, targetContext, masterObjective, protocol]);

  const loadProject = useCallback((p: SavedProject) => {
    setTargetEntity(p.entity);
    setTargetContext(p.context);
    setMasterObjective(p.masterObjective);
    setProtocol(p.protocol);
  }, []);

  const deleteProject = useCallback((id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const canGenerate = !isLoading && !!targetEntity.trim() && !!targetContext.trim();
  const activeLayerCount = Object.values(layers).filter(Boolean).length;
  const hasOutput = payload.length > 0;
  const handleChatMessagesChange = useCallback((msgs: ChatMessage[]) => { setChatMessages(msgs); }, []);

  return (
    <div className="h-screen flex flex-col bg-[#0a0a0a] text-white overflow-hidden">
      <header className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-[#0f0f0f] shrink-0 z-20">
        <div className="flex items-center gap-3">
          <Shield size={16} className="text-emerald-400" />
          <div>
            <h1 className="text-sm font-semibold tracking-tight font-mono">MPA Terminal</h1>
            <p className="text-[9px] text-emerald-400 font-mono uppercase tracking-[0.2em]">Master Plan Architect</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <DynamicIsland mode={islandMode} errorMsg={islandError} />
          {activeLayerCount > 0 && (
            <span className="hidden md:inline text-[10px] font-mono px-2 py-0.5 rounded-full text-emerald-400 border border-emerald-500/30 bg-emerald-500/10">
              {activeLayerCount} layers
            </span>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden md:flex items-center justify-center w-7 h-7 rounded-lg hover:bg-white/5 transition-colors text-gray-500"
          >
            {sidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
          </button>
        </div>
      </header>

      {/* Desktop Layout */}
      <div className="hidden md:flex flex-1 overflow-hidden">
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              key="sidebar"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-r border-white/10 bg-[#0f0f0f] overflow-y-auto overflow-x-hidden shrink-0"
              style={{ scrollbarWidth: "thin" }}
            >
              <div className="p-3 space-y-3">
                <TemplateSelector onSelect={applyTemplate} />
                <SettingsPanel
                  apiKey={apiKey}                     setApiKey={setApiKey}
                  apiProvider={apiProvider}           setApiProvider={setApiProvider}
                  model={model}                       setModel={setModel}
                  masterObjective={masterObjective}   setMasterObjective={setMasterObjective}
                  targetEntity={targetEntity}         setTargetEntity={setTargetEntity}
                  targetContext={targetContext}        setTargetContext={setTargetContext}
                  protocol={protocol}                 setProtocol={setProtocol}
                  customDirectives={customDirectives} setCustomDirectives={setCustomDirectives}
                  temperature={temperature}           setTemperature={setTemperature}
                  showKey={showKey}                   setShowKey={setShowKey}
                  onGenerate={handleGenerate}
                  isLoading={isLoading}
                  canGenerate={canGenerate}
                />
                <ProjectVault
                  projects={projects}
                  onSave={saveProject}
                  onLoad={loadProject}
                  onDelete={deleteProject}
                  currentEntity={targetEntity}
                />
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        <main className="flex-1 flex overflow-hidden">
          <div className="w-[60%] border-r border-white/10 flex flex-col">
            <ChatPanel
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              initialMessages={chatMessages}
              onMessagesChange={handleChatMessagesChange}
            />
          </div>
          <div className="w-[40%] flex flex-col bg-[#0a0a0a]">
            <OutputViewer
              payload={payload}
              tokensUsed={tokensUsed}
              durationMs={durationMs}
              model={activeModel}
              isStreaming={isStreaming}
            />
          </div>
        </main>
      </div>

      {/* Mobile Layout — default tab: "chat" */}
      <div className="md:hidden flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-hidden">
          {mobileTab === "chat" && (
            <ChatPanel
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              initialMessages={chatMessages}
              onMessagesChange={handleChatMessagesChange}
            />
          )}
          {mobileTab === "layers" && (
            <div className="h-full overflow-y-auto p-4">
              <LayerPanel layers={layers} onToggle={handleLayerToggle} />
            </div>
          )}
          {mobileTab === "output" && (
            <OutputViewer
              payload={payload}
              tokensUsed={tokensUsed}
              durationMs={durationMs}
              model={activeModel}
              isStreaming={isStreaming}
            />
          )}
          {mobileTab === "settings" && (
            <div className="h-full overflow-y-auto p-4 space-y-4">
              <TemplateSelector onSelect={applyTemplate} />
              <SettingsPanel
                apiKey={apiKey}                     setApiKey={setApiKey}
                apiProvider={apiProvider}           setApiProvider={setApiProvider}
                model={model}                       setModel={setModel}
                masterObjective={masterObjective}   setMasterObjective={setMasterObjective}
                targetEntity={targetEntity}         setTargetEntity={setTargetEntity}
                targetContext={targetContext}        setTargetContext={setTargetContext}
                protocol={protocol}                 setProtocol={setProtocol}
                customDirectives={customDirectives} setCustomDirectives={setCustomDirectives}
                temperature={temperature}           setTemperature={setTemperature}
                showKey={showKey}                   setShowKey={setShowKey}
                onGenerate={handleGenerate}
                isLoading={isLoading}
                canGenerate={canGenerate}
              />
              <ProjectVault
                projects={projects}
                onSave={saveProject}
                onLoad={loadProject}
                onDelete={deleteProject}
                currentEntity={targetEntity}
              />
            </div>
          )}
        </div>
        <MobileNav activeTab={mobileTab} onTabChange={setMobileTab} hasOutput={hasOutput} />
      </div>
    </div>
  );
}
