import React, { useState, useEffect } from 'react';
import { communityService } from '../lib/services';
import { CommunityActivity } from '../types/community';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { EmptyState } from '../components/ui/EmptyState';
import {
  Activity as ActivityIcon,
  Search,
  Sparkles,
  Megaphone,
  CheckCircle2,
  Users,
  Clock,
  Bot,
  AlertCircle
} from 'lucide-react';

export const Activity: React.FC = () => {
  const [activities, setActivities] = useState<CommunityActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      setLoading(true);
      try {
        const res = await communityService.getActivity(40);
        setActivities(res);
      } catch (err) {
        console.warn('Failed to load activities:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'problem_analyzed':
        return <Search className="w-4 h-4 text-blue-600" />;
      case 'solution_generated':
        return <Sparkles className="w-4 h-4 text-emerald-600" />;
      case 'announcement_created':
        return <Megaphone className="w-4 h-4 text-amber-600" />;
      case 'issue_created':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'issue_status_changed':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'ai_chat':
        return <Bot className="w-4 h-4 text-purple-600" />;
      default:
        return <ActivityIcon className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader
        title="Community Activity Timeline"
        subtitle="Chronological audit trail of all civic reports, AI consultations, status progressions, and public announcements."
        badge={
          <Badge variant="primary">
            <ActivityIcon className="w-3 h-3 text-blue-600" />
            <span>Live Audit Trail</span>
          </Badge>
        }
      />

      {loading ? (
        <Card className="p-6">
          <LoadingSkeleton rows={6} />
        </Card>
      ) : activities.length === 0 ? (
        <EmptyState
          icon={<ActivityIcon className="w-8 h-8 text-slate-400" />}
          title="No activity recorded yet"
          description="Activity logs are recorded automatically as problems are analyzed, solutions generated, or issues updated."
        />
      ) : (
        <Card className="p-6">
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
            {activities.map((act) => (
              <div key={act.id} className="relative flex items-start gap-4 text-xs">
                {/* Dot / Icon */}
                <div className="absolute -left-[1.95rem] mt-0.5 w-6 h-6 rounded-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-xs">
                  {getActivityIcon(act.type)}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      {act.description}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(act.timestamp).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500 flex items-center gap-2">
                    <span>Initiated by {act.user_name}</span>
                    <span>•</span>
                    <Badge variant="secondary" size="sm">
                      {act.type.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
