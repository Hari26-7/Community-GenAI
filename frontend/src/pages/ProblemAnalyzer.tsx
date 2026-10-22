import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { aiService } from '../lib/services';
import { AIAnalysisResult } from '../types/community';
import { PageHeader } from '../components/ui/PageHeader';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  Search,
  Sparkles,
  AlertTriangle,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  Copy,
  Check,
  Megaphone
} from 'lucide-react';

export const ProblemAnalyzer: React.FC = () => {
  const { profile } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Waste & Sanitation');
  const [locationName, setLocationName] = useState('Ward 14, Main Residential Sector');
  const [priority, setPriority] = useState('High');
  const [supportingInfo, setSupportingInfo] = useState('');

  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AIAnalysisResult | null>(null);
  const [copied, setCopied] = useState(false);

  // Check if initiated from another page (like AI Assistant)
  useEffect(() => {
    const state = location.state as { problemText?: string } | null;
    if (state?.problemText) {
      setTitle(state.problemText.slice(0, 70));
      setDescription(state.problemText);
    }
  }, [location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      showToast('Please provide both a title and description', 'warning');
      return;
    }

    setAnalyzing(true);
    setResult(null);

    try {
      const data = await aiService.analyzeProblem({
        title,
        description,
        category,
        location: locationName,
        priority,
        supporting_info: supportingInfo,
        user_name: profile?.full_name || 'Community Leader',
      });
      setResult(data);
      showToast('Problem analysis generated successfully', 'success');
    } catch (err: any) {
      showToast('Failed to analyze problem. Please try again.', 'error');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleCopyAnalysis = () => {
    if (!result) return;
    const text = `PROBLEM ANALYSIS: ${result.title}\nSeverity: ${result.severity}\n\nSUMMARY:\n${result.summary}\n\nPOSSIBLE CAUSES:\n${result.causes.map((c, i) => `${i + 1}. ${c}`).join('\n')}\n\nAFFECTED GROUPS:\n${result.affected_groups.map((g) => `• ${g}`).join('\n')}\n\nSHORT-TERM ACTIONS:\n${result.short_term_actions.map((a) => `✓ ${a}`).join('\n')}\n\nLONG-TERM ACTIONS:\n${result.long_term_actions.map((a) => `✓ ${a}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Analysis copied to clipboard', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <PageHeader
        title="Analyze a Community Problem"
        subtitle="Turn a community challenge into actionable insights with structured diagnostic breakdown and multi-tiered response actions."
        badge={
          <Badge variant="primary">
            <Sparkles className="w-3 h-3 text-blue-600" />
            <span>AI Diagnostic Engine</span>
          </Badge>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Input Form */}
        <div className="lg:col-span-5 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-[#0B3B60] dark:text-blue-400" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Problem Parameters
                </h2>
              </div>
            </CardHeader>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Problem Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Frequent waste collection delays causing roadside dumps"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded p-2 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Detailed Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what is occurring, frequency, and ground observations..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded p-2 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none resize-y"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded p-2 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Waste & Sanitation">Waste & Sanitation</option>
                    <option value="Water Supply">Water Supply & Drainage</option>
                    <option value="Civic Infrastructure">Roads & Streetlights</option>
                    <option value="Public Safety">Public Safety & Health</option>
                    <option value="Cooperative & SHG">Cooperative & SHGs</option>
                    <option value="General">General Civic</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded p-2 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Location / Ward
                </label>
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="e.g. Ward 14, North Block / Gram Panchayat"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded p-2 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Supporting Context (Optional)
                </label>
                <input
                  type="text"
                  value={supportingInfo}
                  onChange={(e) => setSupportingInfo(e.target.value)}
                  placeholder="e.g. 15 households signed complaint; dog menace reported"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded p-2 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  size="md"
                  className="w-full"
                  isLoading={analyzing}
                  disabled={analyzing}
                >
                  <Search className="w-3.5 h-3.5 mr-1.5" />
                  <span>Analyze Problem</span>
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Right Output Area */}
        <div className="lg:col-span-7 space-y-4">
          {analyzing ? (
            <Card className="p-8 text-center">
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-950 flex items-center justify-center">
                  <Search className="w-5 h-5 text-blue-600 animate-spin" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Analyzing Community Problem...
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                  Synthesizing causes, identifying vulnerable groups, and calibrating short and long-term actions.
                </p>
              </div>
            </Card>
          ) : result ? (
            <div className="space-y-4">
              {/* Header Card */}
              <Card>
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                        {result.title}
                      </h2>
                      <Badge
                        variant={
                          result.severity === 'Critical'
                            ? 'danger'
                            : result.severity === 'High'
                            ? 'warning'
                            : 'primary'
                        }
                      >
                        {result.severity} Severity
                      </Badge>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {result.location} • {result.category}
                    </div>
                  </div>

                  <Button variant="outline" size="sm" onClick={handleCopyAnalysis}>
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy Report'}</span>
                  </Button>
                </div>

                {/* Summary */}
                <div className="mt-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Problem Summary
                  </h4>
                  <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-slate-850 p-3 rounded border border-slate-200 dark:border-slate-800">
                    {result.summary}
                  </p>
                </div>

                {/* Possible Causes */}
                <div className="mt-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                    <span>Identified Possible Causes</span>
                  </h4>
                  <div className="space-y-2">
                    {result.causes.map((cause, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 p-2.5 rounded border border-slate-200 dark:border-slate-800"
                      >
                        <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-[10px] shrink-0">
                          {idx + 1}
                        </span>
                        <span className="leading-snug">{cause}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Affected Groups */}
                <div className="mt-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-blue-500" />
                    <span>Affected Community Segments</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {result.affected_groups.map((group, idx) => (
                      <div
                        key={idx}
                        className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700"
                      >
                        • {group}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Actions: Short-term vs Long-term */}
                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-2 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Immediate Actions (24-48h)</span>
                    </h4>
                    <div className="space-y-2">
                      {result.short_term_actions.map((act, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 bg-emerald-50/50 dark:bg-emerald-950/30 p-2 rounded border border-emerald-200 dark:border-emerald-900/60"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="leading-snug">{act}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 mb-2 flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Long-Term Systemic Reform</span>
                    </h4>
                    <div className="space-y-2">
                      {result.long_term_actions.map((act, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 bg-blue-50/50 dark:bg-blue-950/30 p-2 rounded border border-blue-200 dark:border-blue-900/60"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                          <span className="leading-snug">{act}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Reasoning Indicator */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                  <span>AI Assessment Confidence: {result.ai_confidence}</span>
                </div>
              </Card>

              {/* Connected Next Actions */}
              <div className="p-4 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  Ready to move from diagnosis to execution?
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button
                    size="sm"
                    variant="primary"
                    className="flex-1 sm:flex-none"
                    onClick={() =>
                      navigate('/solution-generator', {
                        state: {
                          problemTitle: result.title,
                          problemDescription: result.summary,
                          communityContext: `${result.location} (${result.category})`
                        }
                      })
                    }
                  >
                    <Sparkles className="w-3.5 h-3.5 mr-1" />
                    <span>Generate Solutions</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 sm:flex-none"
                    onClick={() =>
                      navigate('/announcement-writer', {
                        state: {
                          purpose: result.title,
                          keyInfo: `Issue: ${result.summary}\nImmediate action: ${result.short_term_actions[0] || ''}`
                        }
                      })
                    }
                  >
                    <Megaphone className="w-3.5 h-3.5 mr-1" />
                    <span>Draft Notice</span>
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <Card className="p-8 text-center">
              <div className="flex flex-col items-center justify-center space-y-2">
                <Search className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Ready for Analysis
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                  Fill in the problem parameters on the left and click "Analyze Problem" to run a comprehensive civic evaluation.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
