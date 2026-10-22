import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { aiService, communityService } from '../lib/services';
import { AIAnnouncementResult } from '../types/community';
import { PageHeader } from '../components/ui/PageHeader';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  Megaphone,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  Send,
  MessageSquare,
  Share2,
  FileText,
  Users
} from 'lucide-react';

export const AnnouncementWriter: React.FC = () => {
  const { profile } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [purpose, setPurpose] = useState('');
  const [audience, setAudience] = useState('All Residents & Local Businesses');
  const [tone, setTone] = useState('Professional, Empathetic & Action-oriented');
  const [keyInfo, setKeyInfo] = useState('');
  const [language, setLanguage] = useState('English');

  const [generating, setGenerating] = useState(false);
  const [posting, setPosting] = useState(false);
  const [result, setResult] = useState<AIAnnouncementResult | null>(null);

  // Editable output state
  const [editedTitle, setEditedTitle] = useState('');
  const [editedBody, setEditedBody] = useState('');
  const [activeTab, setActiveTab] = useState<'official' | 'short' | 'social'>('official');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Auto populate if forwarded from problem analyzer or solution generator
  useEffect(() => {
    const state = location.state as { purpose?: string; keyInfo?: string } | null;
    if (state?.purpose) setPurpose(state.purpose);
    if (state?.keyInfo) setKeyInfo(state.keyInfo);
  }, [location.state]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!purpose.trim() || !keyInfo.trim()) {
      showToast('Please provide an announcement purpose and key information', 'warning');
      return;
    }

    setGenerating(true);
    setResult(null);

    try {
      const data = await aiService.generateAnnouncement({
        purpose,
        audience,
        tone,
        key_information: keyInfo,
        language,
        user_name: profile?.full_name || 'Community Leader',
      });
      setResult(data);
      setEditedTitle(data.title);
      setEditedBody(data.body);
      showToast('Multi-format announcement generated successfully', 'success');
    } catch (err: any) {
      showToast('Failed to generate announcement. Please try again.', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast('Copied to clipboard', 'info');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handlePostToCommunity = async () => {
    if (!result) return;
    setPosting(true);
    try {
      await communityService.createAnnouncement({
        title: editedTitle || result.title,
        body: editedBody || result.body,
        audience: result.audience || audience,
        category: 'Notice',
      });
      showToast('Announcement published directly to Community Hub!', 'success');
      navigate('/community', { state: { initialTab: 'announcements' } });
    } catch (err: any) {
      showToast('Failed to publish announcement to feed', 'error');
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <PageHeader
        title="Announcement Writer"
        subtitle="Generate clear, empathetic, multi-channel notices for WhatsApp broadcasts, notice boards, and social media."
        badge={
          <Badge variant="primary">
            <Sparkles className="w-3 h-3 text-blue-600" />
            <span>AI Drafting Studio</span>
          </Badge>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Input Form */}
        <div className="lg:col-span-5 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-[#0B3B60] dark:text-blue-400" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Notice Details
                </h2>
              </div>
            </CardHeader>

            <form onSubmit={handleGenerate} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Announcement Purpose <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="e.g. Revised morning waste collection timings & segregation drive"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded p-2 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Audience
                  </label>
                  <select
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded p-2 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="All Residents & Local Businesses">All Residents & Shops</option>
                    <option value="Residential Block Residents">Residential Block Only</option>
                    <option value="Community Volunteers & Marshals">Volunteers & Marshals</option>
                    <option value="Senior Citizens & Families">Senior Citizens & Families</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded p-2 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi (हिन्दी)</option>
                    <option value="Tamil">Tamil (தமிழ்)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tone of Voice
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded p-2 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="Professional, Empathetic & Action-oriented">Professional & Empathetic</option>
                  <option value="Urgent & Time-sensitive">Urgent & Time-Sensitive</option>
                  <option value="Encouraging & Community-building">Encouraging & Cooperative</option>
                  <option value="Official Administrative Advisory">Formal Administrative</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Key Information to Include <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={keyInfo}
                  onChange={(e) => setKeyInfo(e.target.value)}
                  placeholder="Timings, locations, steps residents must follow, contact numbers..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded p-2 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none resize-y"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  size="md"
                  className="w-full"
                  isLoading={generating}
                  disabled={generating}
                >
                  <Megaphone className="w-3.5 h-3.5 mr-1.5" />
                  <span>Generate Announcement</span>
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Right Output Area */}
        <div className="lg:col-span-7 space-y-4">
          {generating ? (
            <Card className="p-8 text-center">
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-950 flex items-center justify-center">
                  <Megaphone className="w-5 h-5 text-blue-600 animate-spin" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Drafting Multi-Channel Announcements...
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                  Formatting official circular, short WhatsApp/SMS notice, and civic social media post.
                </p>
              </div>
            </Card>
          ) : result ? (
            <div className="space-y-4">
              {/* Channel Tabs */}
              <div className="flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-t-md px-2 pt-2 gap-1 text-xs font-semibold">
                <button
                  onClick={() => setActiveTab('official')}
                  className={`flex items-center gap-1.5 px-3 py-2 border-b-2 transition-colors ${
                    activeTab === 'official'
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Official Notice (Full)</span>
                </button>
                <button
                  onClick={() => setActiveTab('short')}
                  className={`flex items-center gap-1.5 px-3 py-2 border-b-2 transition-colors ${
                    activeTab === 'short'
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp & SMS Notice</span>
                </button>
                <button
                  onClick={() => setActiveTab('social')}
                  className={`flex items-center gap-1.5 px-3 py-2 border-b-2 transition-colors ${
                    activeTab === 'social'
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Social Media Post</span>
                </button>
              </div>

              {/* Tab Contents */}
              <Card className="rounded-t-none">
                {activeTab === 'official' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Formal Notice Board Circular
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCopy(`${editedTitle}\n\n${editedBody}`, 'official')}
                      >
                        {copiedKey === 'official' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'official' ? 'Copied' : 'Copy'}</span>
                      </Button>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">Title</label>
                      <input
                        type="text"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        className="w-full font-bold text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded p-2 text-slate-900 dark:text-slate-100"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">Body Text</label>
                      <textarea
                        rows={9}
                        value={editedBody}
                        onChange={(e) => setEditedBody(e.target.value)}
                        className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded p-3 text-slate-900 dark:text-slate-100 leading-relaxed font-sans"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'short' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Short Broadcast (SMS / WhatsApp)
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCopy(result.short_version, 'short')}
                      >
                        {copiedKey === 'short' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'short' ? 'Copied' : 'Copy'}</span>
                      </Button>
                    </div>

                    <div className="p-3.5 rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-100 whitespace-pre-wrap font-sans leading-relaxed">
                      {result.short_version}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Ideal for RWA broadcast lists, Telegram channels, and SMS alerts.
                    </div>
                  </div>
                )}

                {activeTab === 'social' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Civic Social Post (X / Facebook / Instagram)
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCopy(result.social_version, 'social')}
                      >
                        {copiedKey === 'social' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'social' ? 'Copied' : 'Copy'}</span>
                      </Button>
                    </div>

                    <div className="p-3.5 rounded bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs text-blue-900 dark:text-blue-100 whitespace-pre-wrap font-sans leading-relaxed">
                      {result.social_version}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Formatted with engaging community hashtags and clean spacing.
                    </div>
                  </div>
                )}

                {/* Bottom Publication Trigger */}
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    Draft ready. Save and publish directly to the live Community Hub announcements stream.
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button
                      size="sm"
                      variant="primary"
                      className="w-full sm:w-auto"
                      onClick={handlePostToCommunity}
                      isLoading={posting}
                    >
                      <Send className="w-3.5 h-3.5 mr-1.5" />
                      <span>Publish to Community Hub</span>
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          ) : (
            <Card className="p-8 text-center">
              <div className="flex flex-col items-center justify-center space-y-2">
                <Megaphone className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Ready to Draft Announcement
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                  Specify the purpose, key timings, and audience on the left, then click "Generate Announcement".
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
