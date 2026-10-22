import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { communityService, aiService } from '../lib/services';
import {
  CommunityAnalytics,
  CommunityIssue,
  CommunityActivity,
  AIChatMessage
} from '../types/community';
import { PageHeader } from '../components/ui/PageHeader';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { EmptyState } from '../components/ui/EmptyState';
import {
  Users,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Bot,
  Search,
  Megaphone,
  ArrowRight,
  TrendingUp,
  Clock,
  Layers,
  FileText,
  Activity as ActivityIcon,
  MapPin,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState<CommunityAnalytics | null>(null);
  const [issues, setIssues] = useState<CommunityIssue[]>([]);
  const [activities, setActivities] = useState<CommunityActivity[]>([]);
  const [recentChats, setRecentChats] = useState<AIChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  // Compute time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const userName = profile?.full_name || 'Community Leader';

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [anData, issData, actData, chatData] = await Promise.all([
          communityService.getAnalytics(),
          communityService.getIssues(),
          communityService.getActivity(8),
          aiService.getHistory(5)
        ]);

        setAnalytics(anData);
        setIssues(issData);
        setActivities(actData);
        setRecentChats(chatData);
      } catch (err) {
        console.warn('Dashboard data fetch warning:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const openIssues = issues.filter((i) => i.status !== 'Resolved');
  const resolvedIssues = issues.filter((i) => i.status === 'Resolved');

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* 1. Header & Greeting */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>{getGreeting()}, {userName} 👋</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Here's what's happening across your community.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="primary"
              onClick={() => navigate('/ai-assistant')}
            >
              <Bot className="w-3.5 h-3.5 mr-1" />
              <span>Ask Community Sahayak</span>
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Overview Statistics Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-4">
              <LoadingSkeleton rows={2} />
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Community Members */}
          <Card className="p-4">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <span>Community Members</span>
              <Users className="w-4 h-4 text-[#0B3B60] dark:text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2 font-mono">
              {analytics?.total_members || 0}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <span className="text-emerald-600 font-semibold">Active</span>
              <span>•</span>
              <span>Ward residents & representatives</span>
            </div>
          </Card>

          {/* Card 2: Active Issues */}
          <Card className="p-4">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <span>Active Issues</span>
              <AlertCircle className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2 font-mono">
              {openIssues.length}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {issues.filter((i) => i.status === 'Open').length} open • {issues.filter((i) => i.status === 'In Progress').length} in progress
            </div>
          </Card>

          {/* Card 3: Resolved Issues */}
          <Card className="p-4">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <span>Resolved Issues</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2 font-mono">
              {resolvedIssues.length}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {issues.length > 0
                ? `${Math.round((resolvedIssues.length / issues.length) * 100)}% resolution rate`
                : 'No issues logged yet'}
            </div>
          </Card>

          {/* Card 4: AI Assistance Used */}
          <Card className="p-4">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <span>AI Assistance Used</span>
              <Sparkles className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2 font-mono">
              {analytics?.ai_assistance_count || 0}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Diagnostic & solution runs
            </div>
          </Card>
        </div>
      )}

      {/* 3. Quick Action Cards */}
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
          Quick Actions
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/problem-analyzer')}
            className="text-left p-4 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-slate-50 dark:hover:bg-slate-850 transition-all text-xs group cursor-pointer shadow-xs"
          >
            <div className="w-8 h-8 rounded bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
              <Search className="w-4 h-4" />
            </div>
            <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
              <span>Analyze a Problem</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 text-[11px]">
              Triage root causes, severity, and short/long-term mitigation steps.
            </p>
          </button>

          <button
            onClick={() => navigate('/solution-generator')}
            className="text-left p-4 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-400 dark:hover:border-emerald-600 hover:bg-slate-50 dark:hover:bg-slate-850 transition-all text-xs group cursor-pointer shadow-xs"
          >
            <div className="w-8 h-8 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
              <span>Generate a Solution</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 text-[11px]">
              Synthesize 3 practical community and municipal intervention options.
            </p>
          </button>

          <button
            onClick={() => navigate('/announcement-writer')}
            className="text-left p-4 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-amber-400 dark:hover:border-amber-600 hover:bg-slate-50 dark:hover:bg-slate-850 transition-all text-xs group cursor-pointer shadow-xs"
          >
            <div className="w-8 h-8 rounded bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
              <Megaphone className="w-4 h-4" />
            </div>
            <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
              <span>Draft an Announcement</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 transition-colors" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 text-[11px]">
              Create multi-format circulars for notice boards, WhatsApp & social media.
            </p>
          </button>

          <button
            onClick={() => navigate('/ai-assistant')}
            className="text-left p-4 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-purple-400 dark:hover:border-purple-600 hover:bg-slate-50 dark:hover:bg-slate-850 transition-all text-xs group cursor-pointer shadow-xs"
          >
            <div className="w-8 h-8 rounded bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
              <Bot className="w-4 h-4" />
            </div>
            <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
              <span>Ask Community Sahayak</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600 transition-colors" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 text-[11px]">
              Chat directly with your intelligent civic copilot for real-time guidance.
            </p>
          </button>
        </div>
      </div>

      {/* 4. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Recent Issues & AI Insights */}
        <div className="lg:col-span-8 space-y-6">
          {/* Recent Community Issues */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Recent Community Issues
                  </h2>
                </div>
                <Link
                  to="/community"
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>View All ({issues.length})</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </CardHeader>

            {loading ? (
              <LoadingSkeleton rows={3} />
            ) : issues.length === 0 ? (
              <EmptyState
                title="No community issues yet"
                description="Start by reporting an issue or analyzing a civic problem with Community Sahayak."
                action={
                  <Button size="sm" onClick={() => navigate('/community')}>
                    Report First Issue
                  </Button>
                }
              />
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {issues.slice(0, 4).map((issue) => (
                  <div key={issue.id} className="py-3 flex items-start justify-between gap-3 text-xs">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-slate-100 truncate">
                          {issue.title}
                        </span>
                        <Badge
                          variant={
                            issue.priority === 'Critical'
                              ? 'danger'
                              : issue.priority === 'High'
                              ? 'warning'
                              : 'secondary'
                          }
                        >
                          {issue.priority}
                        </Badge>
                        <Badge
                          variant={
                            issue.status === 'Resolved'
                              ? 'success'
                              : issue.status === 'In Progress'
                              ? 'warning'
                              : 'primary'
                          }
                        >
                          {issue.status}
                        </Badge>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 line-clamp-1">
                        {issue.description}
                      </p>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2">
                        <span>{issue.location}</span>
                        <span>•</span>
                        <span>{new Date(issue.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      className="shrink-0"
                      onClick={() =>
                        navigate('/problem-analyzer', {
                          state: { problemText: `${issue.title}: ${issue.description}` }
                        })
                      }
                    >
                      <Bot className="w-3.5 h-3.5 mr-1 text-blue-600" />
                      <span>Analyze</span>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* AI Insights Banner */}
          <Card className="bg-blue-50/40 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-[#0B3B60] dark:text-blue-300">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>AI Insight: Municipal Waste & Sanitation Pattern</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 max-w-xl leading-relaxed">
                  Waste collection delays represent the most frequently reported concern this month.
                  Our diagnostic engine has prepared 3 synchronized intervention protocols ready for implementation.
                </p>
              </div>

              <Button
                size="sm"
                variant="primary"
                className="shrink-0"
                onClick={() =>
                  navigate('/problem-analyzer', {
                    state: {
                      problemText: 'Our community is facing frequent waste collection delays causing roadside dumps.'
                    }
                  })
                }
              >
                <span>Run Diagnostic</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Column (4 cols): Community Activity & Recent AI Conversations */}
        <div className="lg:col-span-4 space-y-6">
          {/* Community Activity Timeline */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <ActivityIcon className="w-4 h-4 text-[#0B3B60] dark:text-blue-400" />
                  <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Community Activity
                  </h2>
                </div>
                <Link
                  to="/activity"
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                >
                  View All
                </Link>
              </div>
            </CardHeader>

            {loading ? (
              <LoadingSkeleton rows={4} />
            ) : activities.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No recent activity recorded.</p>
            ) : (
              <div className="space-y-3.5 text-xs">
                {activities.slice(0, 5).map((act) => (
                  <div key={act.id} className="flex items-start gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <div className="text-slate-800 dark:text-slate-200 font-medium leading-snug">
                        {act.description}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {act.user_name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Recent AI Conversations */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-purple-600" />
                  <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Recent Conversations
                  </h2>
                </div>
                <Link
                  to="/ai-assistant"
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                >
                  Open Chat
                </Link>
              </div>
            </CardHeader>

            {recentChats.length === 0 ? (
              <div className="text-xs text-slate-500 py-3 text-center">
                <p>No recent conversations yet.</p>
                <button
                  onClick={() => navigate('/ai-assistant')}
                  className="text-blue-600 dark:text-blue-400 underline font-semibold mt-1 inline-block"
                >
                  Start your first chat
                </button>
              </div>
            ) : (
              <div className="space-y-2.5 text-xs">
                {recentChats.slice(0, 3).map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => navigate('/ai-assistant')}
                    className="p-2.5 rounded bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors border border-slate-200 dark:border-slate-800"
                  >
                    <div className="font-semibold text-slate-900 dark:text-slate-100 line-clamp-1">
                      "{chat.user_message}"
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                      {chat.ai_response.replace(/###/g, '').slice(0, 80)}...
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

