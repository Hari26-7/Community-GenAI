import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { aiService } from '../lib/services';
import { AISolutionOption } from '../types/community';
import { PageHeader } from '../components/ui/PageHeader';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  ArrowRight,
  Check,
  Megaphone,
  TrendingUp,
  FileCheck2,
  DollarSign
} from 'lucide-react';

export const SolutionGenerator: React.FC = () => {
  const { profile } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [problemTitle, setProblemTitle] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [communityContext, setCommunityContext] = useState('Urban residential neighbourhood with 450 households');
  const [availableResources, setAvailableResources] = useState('RWA contingency fund, 12 youth volunteers, ward meeting hall');
  const [constraints, setConstraints] = useState('Need actionable impact within 14 days, low capital expenditure');
  const [expectedOutcome, setExpectedOutcome] = useState('Restore prompt morning waste collection and eliminate roadside littering');

  const [generating, setGenerating] = useState(false);
  const [solutions, setSolutions] = useState<AISolutionOption[]>([]);
  const [selectedSolutionId, setSelectedSolutionId] = useState<string | null>(null);

  // Auto-populate from route state if forwarded from Problem Analyzer or AI Assistant
  useEffect(() => {
    const state = location.state as {
      problemTitle?: string;
      problemDescription?: string;
      communityContext?: string;
    } | null;

    if (state?.problemTitle) setProblemTitle(state.problemTitle);
    if (state?.problemDescription) setProblemDescription(state.problemDescription);
    if (state?.communityContext) setCommunityContext(state.communityContext);
  }, [location.state]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!problemTitle.trim() || !problemDescription.trim()) {
      showToast('Please provide a problem title and description', 'warning');
      return;
    }

    setGenerating(true);
    setSolutions([]);
    setSelectedSolutionId(null);

    try {
      const res = await aiService.generateSolutions({
        problem_title: problemTitle,
        problem_description: problemDescription,
        community_context: communityContext,
        available_resources: availableResources,
        constraints,
        expected_outcome: expectedOutcome,
        user_name: profile?.full_name || 'Community Leader',
      });

      if (res && res.solutions) {
        setSolutions(res.solutions);
        // Default select the recommended one
        const recommended = res.solutions.find((s: AISolutionOption) => s.is_recommended);
        if (recommended) setSelectedSolutionId(recommended.id);
        else if (res.solutions.length > 0) setSelectedSolutionId(res.solutions[0].id);

        showToast('3 actionable solutions generated successfully', 'success');
      }
    } catch (err: any) {
      showToast('Failed to generate solutions. Please try again.', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const selectedSolution = solutions.find((s) => s.id === selectedSolutionId);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <PageHeader
        title="Generate Practical Solutions"
        subtitle="Synthesize high-impact intervention strategies calibrated to community capacity, statutory channels, and volunteer availability."
        badge={
          <Badge variant="primary">
            <Sparkles className="w-3 h-3 text-blue-600" />
            <span>AI Solution Synthesizer</span>
          </Badge>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Constraints & Parameters */}
        <div className="lg:col-span-5 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#0B3B60] dark:text-blue-400" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Problem Context & Inputs
                </h2>
              </div>
            </CardHeader>

            <form onSubmit={handleGenerate} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Problem to Solve <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={problemTitle}
                  onChange={(e) => setProblemTitle(e.target.value)}
                  placeholder="e.g. Frequent municipal waste collection delays"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded p-2 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Problem Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
                  placeholder="Detail the issue, impact on residents, and current roadblocks..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded p-2 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none resize-y"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Community Context
                </label>
                <input
                  type="text"
                  value={communityContext}
                  onChange={(e) => setCommunityContext(e.target.value)}
                  placeholder="e.g. 450 residential apartments + local market street"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded p-2 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Available Resources
                </label>
                <input
                  type="text"
                  value={availableResources}
                  onChange={(e) => setAvailableResources(e.target.value)}
                  placeholder="e.g. RWA budget, volunteer marshals, WhatsApp groups"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded p-2 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Constraints & Limitations
                </label>
                <input
                  type="text"
                  value={constraints}
                  onChange={(e) => setConstraints(e.target.value)}
                  placeholder="e.g. Cannot increase monthly dues; need action within 2 weeks"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded p-2 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Expected Outcome
                </label>
                <input
                  type="text"
                  value={expectedOutcome}
                  onChange={(e) => setExpectedOutcome(e.target.value)}
                  placeholder="e.g. Reliable pickup 6 days a week, clean streets"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded p-2 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
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
                  <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                  <span>Generate Solutions</span>
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Right Solutions Deck */}
        <div className="lg:col-span-7 space-y-4">
          {generating ? (
            <Card className="p-8 text-center">
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-950 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-blue-600 animate-spin" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Synthesizing 3 Solution Strategies...
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                  Evaluating immediate operational tweaks, community-led initiatives, and institutional escalations.
                </p>
              </div>
            </Card>
          ) : solutions.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Select a solution to activate:
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  3 Options Evaluated
                </span>
              </div>

              {/* 3 Solution Cards */}
              <div className="space-y-3">
                {solutions.map((sol, index) => {
                  const isSelected = selectedSolutionId === sol.id;
                  return (
                    <div
                      key={sol.id || index}
                      onClick={() => setSelectedSolutionId(sol.id)}
                      className={`cursor-pointer p-4 rounded-md border transition-all text-xs ${
                        isSelected
                          ? 'border-blue-500 bg-white dark:bg-slate-900 ring-2 ring-blue-500/20 shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                              isSelected
                                ? 'border-blue-600 bg-blue-600 text-white'
                                : 'border-slate-300 dark:border-slate-700'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3" />}
                          </div>
                          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                            {sol.title}
                          </h3>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {sol.is_recommended && (
                            <Badge variant="success">Recommended</Badge>
                          )}
                          <Badge
                            variant={
                              sol.difficulty === 'Low'
                                ? 'info'
                                : sol.difficulty === 'Medium'
                                ? 'warning'
                                : 'danger'
                            }
                          >
                            {sol.difficulty} Difficulty
                          </Badge>
                        </div>
                      </div>

                      <p className="mt-2 text-slate-700 dark:text-slate-300 leading-relaxed pl-6">
                        {sol.description}
                      </p>

                      <div className="mt-3 pl-6 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <TrendingUp className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Impact: {sol.expected_impact}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <DollarSign className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>Resources: {sol.estimated_resources}</span>
                        </div>
                      </div>

                      {/* Expanded steps on selection */}
                      {isSelected && (
                        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 pl-6 space-y-3">
                          <div>
                            <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-1.5 flex items-center gap-1">
                              <FileCheck2 className="w-3.5 h-3.5 text-blue-600" />
                              <span>Step-by-Step Implementation Roadmap:</span>
                            </h4>
                            <ol className="list-decimal list-inside space-y-1 text-slate-700 dark:text-slate-300">
                              {sol.implementation_steps.map((step, sIdx) => (
                                <li key={sIdx} className="leading-snug">
                                  {step}
                                </li>
                              ))}
                            </ol>
                          </div>

                          <div className="p-2.5 rounded bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200 text-[11px]">
                            <span className="font-semibold">Potential Risk & Mitigation: </span>
                            <span>{sol.risks_and_mitigation}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Bottom Execution Bar */}
              {selectedSolution && (
                <div className="p-4 rounded-md bg-[#0B3B60] text-white flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Selected: {selectedSolution.title}</span>
                    </div>
                    <div className="text-[11px] text-blue-200 mt-0.5">
                      Ready to mobilize the community with a formal announcement notice.
                    </div>
                  </div>

                  <Button
                    size="sm"
                    className="bg-amber-400 text-slate-950 hover:bg-amber-300 border-none font-bold shrink-0"
                    onClick={() =>
                      navigate('/announcement-writer', {
                        state: {
                          purpose: selectedSolution.title,
                          keyInfo: `Plan: ${selectedSolution.description}\nSteps:\n${selectedSolution.implementation_steps.join('\n')}`
                        }
                      })
                    }
                  >
                    <Megaphone className="w-3.5 h-3.5 mr-1 text-slate-950" />
                    <span>Draft Announcement Notice</span>
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <div className="flex flex-col items-center justify-center space-y-2">
                <Sparkles className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Ready to Generate Solutions
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                  Enter the problem context and constraints on the left, then click "Generate Solutions" to review 3 tiered intervention strategies.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
