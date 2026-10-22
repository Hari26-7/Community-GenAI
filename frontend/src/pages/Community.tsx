import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { communityService } from '../lib/services';
import {
  CommunityIssue,
  CommunityDiscussion,
  CommunityAnnouncement,
  IssueStatus,
  IssuePriority
} from '../types/community';
import { PageHeader } from '../components/ui/PageHeader';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import {
  Users,
  AlertCircle,
  MessageSquare,
  Megaphone,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  MapPin,
  Bot,
  UserCheck,
  Check,
  X,
  ExternalLink
} from 'lucide-react';

export const Community: React.FC = () => {
  const { profile } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  // Segmented Tabs: overview | issues | discussions | announcements | members
  const [activeTab, setActiveTab] = useState<'overview' | 'issues' | 'discussions' | 'announcements' | 'members'>('overview');

  // Issues Data
  const [issues, setIssues] = useState<CommunityIssue[]>([]);
  const [issueFilterStatus, setIssueFilterStatus] = useState<string>('All');
  const [issueSearch, setIssueSearch] = useState<string>('');
  const [loadingIssues, setLoadingIssues] = useState<boolean>(true);

  // Discussions Data
  const [discussions, setDiscussions] = useState<CommunityDiscussion[]>([]);
  const [loadingDiscussions, setLoadingDiscussions] = useState<boolean>(true);

  // Announcements Data
  const [announcements, setAnnouncements] = useState<CommunityAnnouncement[]>([]);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState<boolean>(true);

  // Modals
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [discussionModalOpen, setDiscussionModalOpen] = useState(false);

  // New Issue Form
  const [newIssueTitle, setNewIssueTitle] = useState('');
  const [newIssueDesc, setNewIssueDesc] = useState('');
  const [newIssueCat, setNewIssueCat] = useState('Waste & Sanitation');
  const [newIssueLoc, setNewIssueLoc] = useState('Ward 14, Main Road');
  const [newIssuePrio, setNewIssuePrio] = useState<IssuePriority>('Medium');
  const [submittingIssue, setSubmittingIssue] = useState(false);

  // New Discussion Form
  const [newDiscTitle, setNewDiscTitle] = useState('');
  const [newDiscContent, setNewDiscContent] = useState('');
  const [newDiscCat, setNewDiscCat] = useState('General');
  const [submittingDisc, setSubmittingDisc] = useState(false);

  useEffect(() => {
    const state = location.state as { initialTab?: 'overview' | 'issues' | 'discussions' | 'announcements' | 'members' } | null;
    if (state?.initialTab) {
      setActiveTab(state.initialTab);
    }
  }, [location.state]);

  const loadIssues = async () => {
    setLoadingIssues(true);
    try {
      const data = await communityService.getIssues({
        status: issueFilterStatus === 'All' ? undefined : issueFilterStatus,
        q: issueSearch || undefined
      });
      setIssues(data);
    } catch (err) {
      console.warn('Failed loading issues:', err);
    } finally {
      setLoadingIssues(false);
    }
  };

  const loadDiscussions = async () => {
    setLoadingDiscussions(true);
    try {
      const data = await communityService.getDiscussions();
      setDiscussions(data);
    } catch (err) {
      console.warn('Failed loading discussions:', err);
    } finally {
      setLoadingDiscussions(false);
    }
  };

  const loadAnnouncements = async () => {
    setLoadingAnnouncements(true);
    try {
      const data = await communityService.getAnnouncements();
      setAnnouncements(data);
    } catch (err) {
      console.warn('Failed loading announcements:', err);
    } finally {
      setLoadingAnnouncements(false);
    }
  };

  useEffect(() => {
    loadIssues();
  }, [issueFilterStatus, issueSearch]);

  useEffect(() => {
    loadDiscussions();
    loadAnnouncements();
  }, []);

  const handleCreateIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIssueTitle.trim() || !newIssueDesc.trim()) return;
    setSubmittingIssue(true);
    try {
      await communityService.createIssue({
        title: newIssueTitle,
        description: newIssueDesc,
        category: newIssueCat,
        location: newIssueLoc,
        priority: newIssuePrio,
        created_by: profile?.full_name || 'Community Resident',
      });
      showToast('New issue reported successfully', 'success');
      setReportModalOpen(false);
      setNewIssueTitle('');
      setNewIssueDesc('');
      loadIssues();
    } catch (err) {
      showToast('Failed to report issue', 'error');
    } finally {
      setSubmittingIssue(false);
    }
  };

  const handleUpdateIssueStatus = async (issueId: string, nextStatus: IssueStatus) => {
    try {
      await communityService.updateIssue(issueId, { status: nextStatus });
      setIssues((prev) =>
        prev.map((i) => (i.id === issueId ? { ...i, status: nextStatus, updated_at: new Date().toISOString() } : i))
      );
      showToast(`Issue status updated to ${nextStatus}`, 'success');
    } catch (err) {
      showToast('Failed to update issue status', 'error');
    }
  };

  const handleCreateDiscussion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDiscTitle.trim() || !newDiscContent.trim()) return;
    setSubmittingDisc(true);
    try {
      await communityService.createDiscussion({
        title: newDiscTitle,
        content: newDiscContent,
        category: newDiscCat,
        author: profile?.full_name || 'Community Resident',
      });
      showToast('Discussion topic created', 'success');
      setDiscussionModalOpen(false);
      setNewDiscTitle('');
      setNewDiscContent('');
      loadDiscussions();
    } catch (err) {
      showToast('Failed to create discussion', 'error');
    } finally {
      setSubmittingDisc(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <PageHeader
        title="Community Hub"
        subtitle="Collaborative civic space to track local infrastructure challenges, organize public initiatives, and broadcast critical updates."
        action={
          <div className="flex items-center gap-2">
            <Button size="sm" variant="primary" onClick={() => setReportModalOpen(true)}>
              <Plus className="w-3.5 h-3.5 mr-1" />
              <span>Report an Issue</span>
            </Button>
            <Button size="sm" variant="outline" onClick={() => setDiscussionModalOpen(true)}>
              <MessageSquare className="w-3.5 h-3.5 mr-1" />
              <span>Start Discussion</span>
            </Button>
          </div>
        }
      />

      {/* Segmented Navigation Bar */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-md px-2 pt-1 gap-1 text-xs font-semibold overflow-x-auto custom-scrollbar">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-1.5 px-3 py-2.5 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'overview'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('issues')}
          className={`flex items-center gap-1.5 px-3 py-2.5 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'issues'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Active & Resolved Issues</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 font-mono">
            {issues.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('discussions')}
          className={`flex items-center gap-1.5 px-3 py-2.5 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'discussions'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Discussions</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 font-mono">
            {discussions.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('announcements')}
          className={`flex items-center gap-1.5 px-3 py-2.5 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'announcements'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <Megaphone className="w-3.5 h-3.5" />
          <span>Announcements</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 font-mono">
            {announcements.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('members')}
          className={`flex items-center gap-1.5 px-3 py-2.5 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'members'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Members & Marshals</span>
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Total Tracked Issues
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1 font-mono">
                {issues.length}
              </div>
              <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                <span className="text-emerald-600 font-semibold">
                  {issues.filter((i) => i.status === 'Resolved').length} resolved
                </span>
                <span>•</span>
                <span>{issues.filter((i) => i.status === 'Open').length} open</span>
              </div>
            </Card>

            <Card className="p-4">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Active Discussions
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1 font-mono">
                {discussions.length}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Citizen governance & participatory feedback
              </div>
            </Card>

            <Card className="p-4">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Public Circulars
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1 font-mono">
                {announcements.length}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Active advisories and operational updates
              </div>
            </Card>

            <Card className="p-4">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Community Resolution Rate
              </div>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
                {issues.length > 0
                  ? `${Math.round((issues.filter((i) => i.status === 'Resolved').length / issues.length) * 100)}%`
                  : 'N/A'}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Verified through local ward inspections
              </div>
            </Card>
          </div>

          {/* Quick Issue list preview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Recent Critical Community Issues
                  </h3>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setActiveTab('issues')}>
                  <span>View All Issues</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </CardHeader>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {issues.slice(0, 4).map((issue) => (
                <div key={issue.id} className="py-3 flex items-start justify-between gap-4 text-xs">
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
                    <div className="text-[11px] text-slate-500 flex items-center gap-3">
                      <span>{issue.location}</span>
                      <span>•</span>
                      <span>Reported by {issue.created_by}</span>
                      <span>•</span>
                      <span>{new Date(issue.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        navigate('/problem-analyzer', { state: { problemText: `${issue.title} - ${issue.description}` } })
                      }
                    >
                      <Bot className="w-3.5 h-3.5 mr-1" />
                      <span>Analyze</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Tab 2: Issues */}
      {activeTab === 'issues' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-md border border-slate-200 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={issueSearch}
                onChange={(e) => setIssueSearch(e.target.value)}
                placeholder="Search issues by keyword, title, or location..."
                className="bg-transparent border-none focus:outline-none text-slate-900 dark:text-slate-100 placeholder-slate-400 w-full sm:w-64"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <span className="text-slate-500 text-[11px] font-semibold">Status:</span>
              <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded border border-slate-200 dark:border-slate-700">
                {['All', 'Open', 'In Progress', 'Resolved'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setIssueFilterStatus(st)}
                    className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                      issueFilterStatus === st
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Issues Table / Cards */}
          {loadingIssues ? (
            <Card className="p-6">
              <LoadingSkeleton rows={4} />
            </Card>
          ) : issues.length === 0 ? (
            <EmptyState
              icon={<AlertCircle className="w-6 h-6 text-slate-400" />}
              title="No community issues found"
              description="There are currently no active issues matching your filter criteria. You can report a new community problem anytime."
              action={
                <Button size="sm" onClick={() => setReportModalOpen(true)}>
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  <span>Report an Issue</span>
                </Button>
              }
            />
          ) : (
            <div className="space-y-3">
              {issues.map((issue) => (
                <Card key={issue.id} className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
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
                          {issue.priority} Priority
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
                        <span className="text-[11px] text-slate-500 font-mono">
                          ID: {issue.id}
                        </span>
                      </div>

                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        {issue.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{issue.location}</span>
                        </span>
                        <span>•</span>
                        <span>Category: {issue.category}</span>
                        <span>•</span>
                        <span>Reported by {issue.created_by}</span>
                        <span>•</span>
                        <span>{new Date(issue.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Status Toggle & AI Actions */}
                    <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-1">
                        {issue.status !== 'Resolved' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleUpdateIssueStatus(
                                issue.id,
                                issue.status === 'Open' ? 'In Progress' : 'Resolved'
                              )
                            }
                          >
                            <Check className="w-3 h-3 text-emerald-600 mr-1" />
                            <span>
                              {issue.status === 'Open' ? 'Mark In Progress' : 'Mark Resolved'}
                            </span>
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() =>
                            navigate('/problem-analyzer', {
                              state: { problemText: `${issue.title}: ${issue.description}` }
                            })
                          }
                        >
                          <Bot className="w-3 h-3 mr-1 text-blue-600" />
                          <span>AI Triage</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Discussions */}
      {activeTab === 'discussions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Participatory Community Topics
            </span>
            <Button size="sm" onClick={() => setDiscussionModalOpen(true)}>
              <Plus className="w-3.5 h-3.5 mr-1" />
              <span>New Topic</span>
            </Button>
          </div>

          {loadingDiscussions ? (
            <Card className="p-6">
              <LoadingSkeleton rows={3} />
            </Card>
          ) : discussions.length === 0 ? (
            <EmptyState
              icon={<MessageSquare className="w-6 h-6 text-slate-400" />}
              title="No discussions started yet"
              description="Start a collaborative conversation with your community members on civic improvements, events, or local ideas."
              action={
                <Button size="sm" onClick={() => setDiscussionModalOpen(true)}>
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  <span>Start First Discussion</span>
                </Button>
              }
            />
          ) : (
            <div className="space-y-3">
              {discussions.map((disc) => (
                <Card key={disc.id} className="p-4">
                  <div className="flex items-start justify-between gap-3 text-xs">
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                          {disc.title}
                        </span>
                        <Badge variant="secondary">{disc.category}</Badge>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {disc.content}
                      </p>
                      <div className="text-[11px] text-slate-500 flex items-center gap-3 pt-1">
                        <span>Started by {disc.author}</span>
                        <span>•</span>
                        <span>{new Date(disc.created_at).toLocaleDateString()}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400">
                          <MessageSquare className="w-3 h-3" />
                          <span>{disc.replies_count || 0} replies</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Announcements */}
      {activeTab === 'announcements' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Published Circulars & Advisories
            </span>
            <Button size="sm" onClick={() => navigate('/announcement-writer')}>
              <Plus className="w-3.5 h-3.5 mr-1" />
              <span>Draft with AI Writer</span>
            </Button>
          </div>

          {loadingAnnouncements ? (
            <Card className="p-6">
              <LoadingSkeleton rows={3} />
            </Card>
          ) : announcements.length === 0 ? (
            <EmptyState
              icon={<Megaphone className="w-6 h-6 text-slate-400" />}
              title="No announcements published"
              description="Draft and broadcast community updates, schedule changes, or safety advisories with the Announcement Writer."
              action={
                <Button size="sm" onClick={() => navigate('/announcement-writer')}>
                  <Megaphone className="w-3.5 h-3.5 mr-1" />
                  <span>Draft Announcement</span>
                </Button>
              }
            />
          ) : (
            <div className="space-y-3">
              {announcements.map((ann) => (
                <Card key={ann.id} className="p-4">
                  <div className="space-y-2 text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                          {ann.title}
                        </span>
                        {ann.is_ai_generated && (
                          <Badge variant="primary">AI Drafted</Badge>
                        )}
                        <Badge variant="secondary">{ann.audience}</Badge>
                      </div>
                      <span className="text-[11px] text-slate-500">
                        {new Date(ann.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {ann.body}
                    </p>

                    <div className="text-[11px] text-slate-500 pt-1 flex items-center justify-between">
                      <span>Broadcast by {ann.created_by}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          navigator.clipboard.writeText(`${ann.title}\n\n${ann.body}`);
                          showToast('Announcement copied to clipboard', 'info');
                        }}
                      >
                        Copy text
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Members & Marshals */}
      {activeTab === 'members' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#0B3B60] dark:text-blue-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Verified Community Representatives & Ward Committee
                </h3>
              </div>
            </CardHeader>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {[
                { name: 'Hari Haran (You)', role: 'Community Lead & RWA Secretary', ward: 'Ward 14, North Block', verified: true, contact: 'lead@community.org' },
                { name: 'Dr. Anita Desai', role: 'Public Health & Sanitation Coordinator', ward: 'Sector 4, Central', verified: true, contact: 'health.coord@community.org' },
                { name: 'Rajesh K. Verma', role: 'Infrastructure & Road Safety Marshal', ward: 'Block C & D', verified: true, contact: 'infra.marshal@community.org' },
                { name: 'Meenakshi Sundaram', role: 'Women SHG Federation President', ward: 'Rural Cooperative Cluster', verified: true, contact: 'shg.president@community.org' },
              ].map((m, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#0B3B60] text-white flex items-center justify-center font-bold text-xs">
                      {m.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                        <span>{m.name}</span>
                        {m.verified && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {m.role} • {m.ward}
                      </div>
                    </div>
                  </div>
                  <div className="text-slate-500 text-[11px] font-mono">
                    {m.contact}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Modal: Report an Issue */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60" onClick={() => setReportModalOpen(false)}></div>
          <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg max-w-lg w-full p-6 shadow-lg z-10 text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Report a Community Issue
              </h3>
              <button onClick={() => setReportModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateIssue} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Issue Title *</label>
                <input
                  type="text"
                  required
                  value={newIssueTitle}
                  onChange={(e) => setNewIssueTitle(e.target.value)}
                  placeholder="e.g. Clogged drainage culvert causing waterlogging"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded p-2 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={newIssueDesc}
                  onChange={(e) => setNewIssueDesc(e.target.value)}
                  placeholder="Describe location, severity, duration of issue..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded p-2 focus:ring-1 focus:ring-blue-500 focus:outline-none resize-y"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Category</label>
                  <select
                    value={newIssueCat}
                    onChange={(e) => setNewIssueCat(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded p-2 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Waste & Sanitation">Waste & Sanitation</option>
                    <option value="Water Supply">Water Supply & Drainage</option>
                    <option value="Civic Infrastructure">Roads & Streetlights</option>
                    <option value="Public Safety">Public Safety & Health</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Priority</label>
                  <select
                    value={newIssuePrio}
                    onChange={(e) => setNewIssuePrio(e.target.value as IssuePriority)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded p-2 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Location / Ward</label>
                <input
                  type="text"
                  value={newIssueLoc}
                  onChange={(e) => setNewIssueLoc(e.target.value)}
                  placeholder="e.g. Near Community Center, Lane 3"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded p-2 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Button type="button" variant="outline" size="sm" onClick={() => setReportModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" isLoading={submittingIssue}>
                  Submit Report
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Start Discussion */}
      {discussionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60" onClick={() => setDiscussionModalOpen(false)}></div>
          <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg max-w-lg w-full p-6 shadow-lg z-10 text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Start a Community Discussion
              </h3>
              <button onClick={() => setDiscussionModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDiscussion} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Topic Title *</label>
                <input
                  type="text"
                  required
                  value={newDiscTitle}
                  onChange={(e) => setNewDiscTitle(e.target.value)}
                  placeholder="e.g. Proposal for weekend park cleanup & tree plantation drive"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded p-2 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Content & Details *</label>
                <textarea
                  required
                  rows={4}
                  value={newDiscContent}
                  onChange={(e) => setNewDiscContent(e.target.value)}
                  placeholder="Share details, suggest dates, and invite thoughts from residents..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded p-2 focus:ring-1 focus:ring-blue-500 focus:outline-none resize-y"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Category</label>
                <select
                  value={newDiscCat}
                  onChange={(e) => setNewDiscCat(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded p-2 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="General">General</option>
                  <option value="Environment">Environment & Greenery</option>
                  <option value="Security">Safety & Security</option>
                  <option value="Youth & Education">Youth & Education</option>
                  <option value="Governance">Ward Governance</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Button type="button" variant="outline" size="sm" onClick={() => setDiscussionModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" isLoading={submittingDisc}>
                  Post Topic
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
