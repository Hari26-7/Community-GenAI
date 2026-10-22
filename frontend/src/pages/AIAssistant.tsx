import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { aiService } from '../lib/services';
import { AIChatMessage } from '../types/community';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import {
  Bot,
  Send,
  RotateCcw,
  Copy,
  Trash2,
  PlusCircle,
  Sparkles,
  Check,
  AlertCircle,
  Search,
  Megaphone,
  TrendingUp,
  CornerDownRight,
  User
} from 'lucide-react';

const SUGGESTED_QUICK_ACTIONS = [
  { label: 'Analyze a Community Problem', prompt: 'Our community is facing frequent waste collection delays. How can we resolve this systematically?' },
  { label: 'Generate a Solution', prompt: 'Generate 3 practical community-driven solutions for irregular drinking water supply.' },
  { label: 'Create an Announcement', prompt: 'Draft an urgent public notice for upcoming road resurfacing and water pipeline maintenance.' },
  { label: 'Summarize Community Feedback', prompt: 'Provide a structured summary of resident concerns regarding evening street lighting and pedestrian safety.' },
  { label: 'Find Possible Causes', prompt: 'What are the main root causes for urban stormwater drain blockages during monsoon?' },
  { label: 'Generate Action Plan', prompt: 'Draft a 30-day civic action plan for organizing a decentralized neighbourhood composting drive.' },
];

export const AIAssistant: React.FC = () => {
  const { profile } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [conversationId, setConversationId] = useState<string>(() => `conv-${Date.now().toString(36)}`);
  const [messages, setMessages] = useState<AIChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Load recent history if available
    const loadHistory = async () => {
      try {
        const history = await aiService.getHistory(20);
        if (history && history.length > 0) {
          const formatted: AIChatMessage[] = history.map((h: any) => ({
            id: h.id || `msg-${Math.random()}`,
            conversation_id: h.conversation_id || conversationId,
            user_message: h.user_message || '',
            ai_response: h.ai_response || '',
            created_at: h.created_at || new Date().toISOString()
          }));
          setMessages(formatted);
        }
      } catch (err) {
        console.warn('Could not load history:', err);
      }
    };
    loadHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Handle passed state prompt from navigation
  useEffect(() => {
    const state = location.state as { initialPrompt?: string } | null;
    if (state?.initialPrompt) {
      setInputMessage(state.initialPrompt);
    }
  }, [location.state]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || loading) return;

    setError(null);
    setInputMessage('');
    const tempUserMsgId = `temp-${Date.now()}`;
    const userMsgObj: AIChatMessage = {
      id: tempUserMsgId,
      conversation_id: conversationId,
      user_message: text,
      ai_response: '',
      created_at: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMsgObj]);
    setLoading(true);

    try {
      const res = await aiService.sendMessage(text, conversationId, profile?.full_name || 'Community Leader');
      setMessages((prev) =>
        prev.map((m) =>
          m.id === tempUserMsgId
            ? {
                ...m,
                id: res.id || m.id,
                ai_response: res.ai_response || 'Assessment generated successfully.',
                suggested_actions: res.suggested_actions
              }
            : m
        )
      );
      showToast('AI response received', 'success');
    } catch (err: any) {
      setError('We could not complete the request. Please verify connection and try again.');
      showToast('Failed to reach AI assistant', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Response copied to clipboard', 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRegenerate = (userMsg: string) => {
    handleSendMessage(userMsg);
  };

  const handleNewConversation = () => {
    setConversationId(`conv-${Date.now().toString(36)}`);
    setMessages([]);
    setError(null);
    showToast('Started new conversation session', 'info');
  };

  const handleClearHistory = async () => {
    if (window.confirm('Are you sure you want to clear your conversation history?')) {
      try {
        await aiService.clearHistory();
        setMessages([]);
        showToast('Conversation history cleared', 'info');
      } catch (err) {
        showToast('Failed to clear history', 'error');
      }
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] max-w-5xl mx-auto">
      {/* Page Header */}
      <PageHeader
        title="AI Assistant"
        subtitle="Your intelligent community copilot for rapid civic triage, problem diagnosis, and citizen communication."
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleNewConversation}>
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New Chat</span>
            </Button>
            {messages.length > 0 && (
              <Button variant="ghost" size="sm" onClick={handleClearHistory} title="Clear history">
                <Trash2 className="w-3.5 h-3.5 text-slate-500 hover:text-red-600" />
              </Button>
            )}
          </div>
        }
      />

      {/* Main Conversation Container */}
      <Card noPadding className="flex-1 flex flex-col overflow-hidden min-h-0 border-slate-200 dark:border-slate-800">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar">
          {messages.length === 0 ? (
            <div className="py-8">
              <EmptyState
                icon={<Bot className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
                title="Start a conversation with Community Sahayak"
                description="Describe any community challenge, civic issue, infrastructure gap, or public notice you need assistance with."
              />

              {/* Starter Quick Actions Grid */}
              <div className="mt-8 max-w-2xl mx-auto">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 text-center">
                  Suggested Community Prompts
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {SUGGESTED_QUICK_ACTIONS.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(action.prompt)}
                      className="text-left p-3 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-slate-50 dark:hover:bg-slate-850 transition-all text-xs group"
                    >
                      <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center justify-between">
                        <span>{action.label}</span>
                        <CornerDownRight className="w-3 h-3 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                      </div>
                      <div className="text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 text-[11px] leading-relaxed">
                        {action.prompt}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div key={msg.id || index} className="space-y-4">
                {/* User Message */}
                <div className="flex items-start justify-end gap-2.5 max-w-3xl ml-auto">
                  <div className="bg-[#0B3B60] text-white p-3.5 rounded-lg text-xs leading-relaxed max-w-[85%] shadow-sm">
                    <p className="whitespace-pre-wrap">{msg.user_message}</p>
                    <div className="text-[10px] text-blue-200/80 mt-1.5 text-right font-mono">
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <div className="w-7 h-7 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0 text-xs font-bold">
                    <User className="w-4 h-4" />
                  </div>
                </div>

                {/* AI Message */}
                {msg.ai_response && (
                  <div className="flex items-start gap-2.5 max-w-3xl">
                    <div className="w-7 h-7 rounded bg-[#0B3B60] text-amber-300 flex items-center justify-center shrink-0 border border-[#082b47]">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="flex-1 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-lg p-4 text-xs shadow-sm">
                      <div className="prose prose-sm dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 space-y-2 whitespace-pre-wrap font-sans leading-relaxed">
                        {msg.ai_response}
                      </div>

                      {/* AI Response Action Toolbar */}
                      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                        <span className="font-mono text-[10px]">
                          Community Sahayak AI • {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopy(msg.ai_response, msg.id)}
                            className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-slate-100 px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-600 font-medium">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => handleRegenerate(msg.user_message)}
                            className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-slate-100 px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Regenerate</span>
                          </button>
                        </div>
                      </div>

                      {/* Workflow transition shortcuts */}
                      <div className="mt-3 pt-2.5 border-t border-dashed border-slate-200 dark:border-slate-800 flex flex-wrap gap-2">
                        <button
                          onClick={() => navigate('/problem-analyzer', { state: { problemText: msg.user_message } })}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-[11px] hover:bg-blue-100 transition-colors"
                        >
                          <Search className="w-3 h-3" />
                          <span>Analyze in Problem Analyzer</span>
                        </button>
                        <button
                          onClick={() => navigate('/solution-generator', { state: { problemTitle: msg.user_message.slice(0, 60), problemDescription: msg.user_message } })}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] hover:bg-emerald-100 transition-colors"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Generate 3 Solutions</span>
                        </button>
                        <button
                          onClick={() => navigate('/announcement-writer', { state: { purpose: msg.user_message.slice(0, 60), keyInfo: msg.ai_response.slice(0, 250) } })}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[11px] hover:bg-amber-100 transition-colors"
                        >
                          <Megaphone className="w-3 h-3" />
                          <span>Draft Notice</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}

          {/* Typing / Loading indicator */}
          {loading && (
            <div className="flex items-start gap-2.5 max-w-xl">
              <div className="w-7 h-7 rounded bg-[#0B3B60] text-amber-300 flex items-center justify-center shrink-0 border border-[#082b47]">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
                <span>Community Sahayak is analyzing your problem and preparing guidance...</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="p-3.5 rounded border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/50 text-red-800 dark:text-red-200 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{error}</span>
              </div>
              <Button size="sm" variant="outline" onClick={() => handleSendMessage(inputMessage)}>
                Try again
              </Button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Action Prompt Chips (Above Chat Input) */}
        <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 flex items-center gap-2 overflow-x-auto custom-scrollbar text-[11px]">
          <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] shrink-0">
            Quick Actions:
          </span>
          {SUGGESTED_QUICK_ACTIONS.map((action, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(action.prompt)}
              className="shrink-0 px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors whitespace-nowrap"
            >
              {action.label}
            </button>
          ))}
        </div>

        {/* Message Input Form */}
        <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Describe your community problem (e.g., 'Our community is facing frequent waste collection delays')..."
              className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              disabled={loading}
            />
            <Button
              type="submit"
              size="md"
              disabled={!inputMessage.trim() || loading}
              isLoading={loading}
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Send</span>
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};
