'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Bot, User, RefreshCw, Zap, WifiOff, Mic, MicOff } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  ts: number;
  provider?: string;
  error?: boolean;
}

const QUICK_ACTIONS = [
  {
    icon: '🍄',
    label: 'Ganoderma',
    query: 'Quels sont les symptômes du Ganoderma boninense et le protocole de traitement PALMCI ?',
  },
  {
    icon: '💧',
    label: 'Phytophthora',
    query: 'Comment identifier et traiter Phytophthora palmivora sur palmier à huile ?',
  },
  {
    icon: '🪲',
    label: 'Oryctes',
    query: 'Protocole de lutte biologique contre Oryctes rhinoceros conforme RSPO ?',
  },
  {
    icon: '🐛',
    label: 'Coelaenomenodera',
    query: 'Seuils et traitement de Coelaenomenodera lameensis — quand intervenir ?',
  },
  {
    icon: '🌡️',
    label: 'Capteurs IoT',
    query:
      'Comment interpréter les données capteurs PhytoBox : température 34°C, humidité sol 78%, COV 420 ppm ?',
  },
  {
    icon: '💀',
    label: 'Jaunissement mortel',
    query: "Protocole d'urgence jaunissement mortel (MLO) — actions immédiates ?",
  },
];

function parseMarkdown(text: string) {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    if (!line.trim()) return <br key={i} />;
    const parts = line.split(/(\*\*.*?\*\*)/g);
    return (
      <p key={i} className="leading-relaxed">
        {parts.map((part, j) =>
          part.startsWith('**') && part.endsWith('**') ? (
            <strong key={j} className="font-semibold text-primary">
              {part.slice(2, -2)}
            </strong>
          ) : (
            <span key={j}>{part}</span>
          )
        )}
      </p>
    );
  });
}

export default function AssistantScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "Bonjour, je suis **PALM'AI** — votre assistant phytosanitaire PALMCI.\n\nJe connais les protocoles de détection et traitement des 7 maladies principales du palmier à huile, l'interprétation des capteurs **PhytoBox**, et les exigences **RSPO**.\n\nComment puis-je vous aider ?",
      ts: Date.now(),
      provider: 'system',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamText, setStreamText] = useState('');
  const [provider, setProvider] = useState<string>('');
  const [isListening, setIsListening] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<unknown>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamText]);

  const sendMessage = useCallback(
    async (text?: string) => {
      const userText = (text || input).trim();
      if (!userText || isLoading) return;

      setInput('');
      const newMessages: Message[] = [
        ...messages,
        { role: 'user', content: userText, ts: Date.now() },
      ];
      setMessages(newMessages);
      setIsLoading(true);
      setStreamText('');

      const apiMessages = newMessages.map((m) => ({ role: m.role, content: m.content }));

      try {
        const response = await fetch('/api/palm-ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: apiMessages }),
        });

        // If the API route is missing (typical on static hosts like GitHub Pages)
        if (response.status === 404) {
          throw new Error('API_NOT_FOUND');
        }

        const aiProvider = response.headers.get('X-AI-Provider') || 'unknown';
        setProvider(aiProvider);

        if (!response.body) throw new Error('No response body');

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let full = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const text = decoder.decode(value);
          const lines = text.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ') && line !== 'data: [DONE]') {
              try {
                const data = JSON.parse(line.slice(6));
                const chunk = data.choices?.[0]?.delta?.content || '';
                if (chunk) {
                  full += chunk;
                  setStreamText(full);
                }
              } catch {
                /* skip */
              }
            }
          }
        }

        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: full, ts: Date.now(), provider: aiProvider },
        ]);
      } catch (err) {
        // Fallback to client-side engine if API is missing or fails
        const { findOfflineResponse } = await import('@/lib/palmAiEngine');
        const offlineText = findOfflineResponse(userText);
        
        setProvider('offline');
        setStreamText('');
        
        // Simulate streaming for the offline response
        let current = '';
        const chars = offlineText.split('');
        for (const char of chars) {
          current += char;
          setStreamText(current);
          await new Promise(r => setTimeout(r, 5));
        }

        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: offlineText,
            ts: Date.now(),
            provider: 'offline',
          },
        ]);
      } finally {
        setIsLoading(false);
        setStreamText('');
      }
    },
    [messages, input, isLoading]
  );

  const startVoice = () => {
    const SpeechRecognition =
      (window as unknown as Record<string, unknown>).SpeechRecognition ||
      (window as unknown as Record<string, unknown>).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error('Reconnaissance vocale non supportée');
      return;
    }

    const recognition = new (SpeechRecognition as new () => {
      lang: string;
      continuous: boolean;
      interimResults: boolean;
      onresult: ((e: unknown) => void) | null;
      onerror: ((e: unknown) => void) | null;
      onend: (() => void) | null;
      start: () => void;
      stop: () => void;
    })();
    recognition.lang = 'fr-FR';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (e: unknown) => {
      const event = e as { results: { [0]: { [0]: { transcript: string } } } };
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
    recognition.onerror = () => {
      setIsListening(false);
      toast.error('Erreur microphone');
    };
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: 'Nouvelle session démarrée. Comment puis-je vous aider ?',
        ts: Date.now(),
        provider: 'system',
      },
    ]);
  };

  const providerLabel: Record<string, string> = {
    deepseek: 'DeepSeek-V3',
    anthropic: 'Claude Sonnet',
    offline: 'Règles hors ligne',
    system: 'Système',
  };
  const providerColor: Record<string, string> = {
    deepseek: 'text-cyan-400',
    anthropic: 'text-gold-400',
    offline: 'text-palm-400',
    system: 'text-muted-foreground',
  };

  return (
    <div className="flex flex-col h-full bg-palm-950">
      {/* Header */}
      <div
        className="flex-shrink-0 px-4 py-3 flex items-center justify-between"
        style={{
          background: 'rgba(10,15,12,0.95)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(34,197,94,0.1)',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #D4A017, #E8B82A)',
              boxShadow: '0 0 16px rgba(212,160,23,0.3)',
            }}
          >
            <Bot size={20} className="text-palm-950" />
          </div>
          <div>
            <h1 className="font-bold text-foreground">PALM&apos;AI</h1>
            <div className="flex items-center gap-1.5">
              {provider ? (
                <>
                  <Zap size={9} className={providerColor[provider] || 'text-muted-foreground'} />
                  <span
                    className={`text-[10px] font-medium ${providerColor[provider] || 'text-muted-foreground'}`}
                  >
                    {providerLabel[provider] || provider}
                  </span>
                </>
              ) : (
                <>
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] text-muted-foreground">
                    Assistant phytosanitaire
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="p-2 rounded-xl text-muted-foreground hover:text-primary transition-colors"
          style={{ background: 'var(--surface-1)' }}
          title="Nouvelle conversation"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-dark">
        {/* Quick actions — only on first message */}
        {messages.length === 1 && (
          <div>
            <p className="text-[11px] text-muted-foreground mb-2 font-medium">
              Questions fréquentes :
            </p>
            <div className="grid grid-cols-2 gap-2">
              {QUICK_ACTIONS.map((qa, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(qa.query)}
                  className="text-left p-3 rounded-xl transition-all duration-150 hover:border-primary/40 group"
                  style={{
                    background: 'rgba(17,28,20,0.7)',
                    border: '1px solid rgba(34,197,94,0.1)',
                  }}
                >
                  <div className="text-base mb-1">{qa.icon}</div>
                  <div className="text-[11px] font-semibold text-palm-300 group-hover:text-primary leading-tight">
                    {qa.label}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-2.5 fade-in ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-1"
              style={
                msg.role === 'user'
                  ? { background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.2)' }
                  : { background: 'linear-gradient(135deg, #D4A017, #E8B82A)' }
              }
            >
              {msg.role === 'user' ? (
                <User size={13} className="text-primary" />
              ) : (
                <Bot size={13} className="text-palm-950" />
              )}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm ${
                msg.role === 'user' ? 'rounded-tr-sm' : 'rounded-tl-sm'
              } ${msg.error ? 'border-red-800/30' : ''}`}
              style={
                msg.role === 'user'
                  ? {
                      background: 'rgba(34,197,94,0.12)',
                      border: '1px solid rgba(34,197,94,0.2)',
                      color: 'var(--foreground)',
                    }
                  : {
                      background: 'rgba(212,160,23,0.07)',
                      border: '1px solid rgba(212,160,23,0.12)',
                      color: 'var(--foreground)',
                    }
              }
            >
              <div className="space-y-0.5">{parseMarkdown(msg.content)}</div>
              <div className="flex items-center justify-between mt-2 gap-2">
                <span className="text-[9px] text-muted-foreground">
                  {new Date(msg.ts).toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
                {msg.provider && msg.provider !== 'system' && (
                  <span
                    className={`text-[9px] ${providerColor[msg.provider] || 'text-muted-foreground'}`}
                  >
                    {providerLabel[msg.provider] || msg.provider}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Streaming */}
        {isLoading && (
          <div className="flex gap-2.5 fade-in">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-1"
              style={{ background: 'linear-gradient(135deg, #D4A017, #E8B82A)' }}
            >
              <Bot size={13} className="text-palm-950" />
            </div>
            <div
              className="max-w-[88%] rounded-2xl rounded-tl-sm px-4 py-3 text-sm"
              style={{
                background: 'rgba(212,160,23,0.07)',
                border: '1px solid rgba(212,160,23,0.12)',
                color: 'var(--foreground)',
              }}
            >
              {streamText ? (
                <div className="space-y-0.5">
                  {parseMarkdown(streamText)}
                  <span className="inline-block w-0.5 h-4 bg-primary ml-0.5 animate-pulse" />
                </div>
              ) : (
                <div className="flex items-center gap-1.5 py-1">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className={`typing-dot w-2 h-2 rounded-full bg-gold-400`} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div
        className="flex-shrink-0 px-4 py-3"
        style={{
          background: 'rgba(10,15,12,0.95)',
          backdropFilter: 'blur(16px)',
          borderTop: '1px solid rgba(34,197,94,0.1)',
        }}
      >
        <div className="flex items-end gap-2">
          <div
            className="flex-1 rounded-2xl overflow-hidden transition-all"
            style={{
              background: 'var(--input)',
              border: '1px solid var(--border)',
            }}
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Question phytosanitaire, symptômes, capteurs..."
              className="w-full bg-transparent text-sm px-4 py-3 resize-none outline-none text-foreground placeholder:text-muted-foreground"
              rows={1}
              disabled={isLoading}
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
          </div>

          <button
            onClick={startVoice}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all flex-shrink-0 ${
              isListening ? 'bg-red-600 animate-pulse' : ''
            }`}
            style={
              !isListening
                ? { background: 'var(--surface-1)', border: '1px solid var(--border)' }
                : {}
            }
          >
            {isListening ? (
              <MicOff size={16} className="text-white" />
            ) : (
              <Mic size={16} className="text-muted-foreground" />
            )}
          </button>

          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isLoading}
            className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-40 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #D4A017, #E8B82A)',
              boxShadow: '0 4px 12px rgba(212,160,23,0.3)',
            }}
          >
            {isLoading ? (
              <RefreshCw size={16} className="text-palm-950 animate-spin" />
            ) : (
              <Send size={16} className="text-palm-950" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
