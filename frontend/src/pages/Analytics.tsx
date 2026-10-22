import React, { useState, useEffect } from 'react';
import { communityService } from '../lib/services';
import { CommunityAnalytics } from '../types/community';
import { PageHeader } from '../components/ui/PageHeader';
import { Card, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { EmptyState } from '../components/ui/EmptyState';
import {
  BarChart3,
  TrendingUp,
  CheckCircle2,
  Clock,
  Users,
  Bot,
  Activity as ActivityIcon,
  PieChart
} from 'lucide-react';

export const Analytics: React.FC = () => {
  const [data, setData] = useState<CommunityAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const res = await communityService.getAnalytics();
        setData(res);
      } catch (err) {
        console.warn('Failed loading analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <PageHeader
        title="Community Analytics"
        subtitle="Transparent metrics on community issue resolution velocity, AI assistance utilization, and resident participation."
        badge={
          <Badge variant="primary">
            <BarChart3 className="w-3 h-3 text-blue-600" />
            <span>Operational Telemetry</span>
          </Badge>
        }
      />

      {loading ? (
        <Card className="p-6">
          <LoadingSkeleton rows={5} />
        </Card>
      ) : !data || data.total_issues === 0 ? (
        <EmptyState
          icon={<BarChart3 className="w-8 h-8 text-slate-400" />}
          title="No analytics data available yet"
          description="Analytics will automatically populate as community members log issues, engage in discussions, and consult Community Sahayak AI."
        />
      ) : (
        <div className="space-y-6">
          {/* Key Metric Gauges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase">
                <span>Active Tracked Issues</span>
                <Clock className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2 font-mono">
                {data.open_issues + data.in_progress_issues}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Out of {data.total_issues} cumulative reports
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase">
                <span>Resolution Rate</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2 font-mono">
                {Math.round((data.resolved_issues / (data.total_issues || 1)) * 100)}%
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                {data.resolved_issues} successfully addressed
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase">
                <span>Community Members</span>
                <Users className="w-4 h-4 text-[#0B3B60] dark:text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2 font-mono">
                {data.total_members}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Verified residents & marshals
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase">
                <span>AI Consultations</span>
                <Bot className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-2 font-mono">
                {data.ai_assistance_count}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Triage, DPR & circular generations
              </div>
            </Card>
          </div>

          {/* Breakdown Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Breakdown */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-[#0B3B60] dark:text-blue-400" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Distribution by Problem Domain
                  </h3>
                </div>
              </CardHeader>

              <div className="space-y-3.5 text-xs">
                {Object.entries(data.category_breakdown).map(([category, count]) => {
                  const pct = Math.round((count / (data.total_issues || 1)) * 100);
                  return (
                    <div key={category} className="space-y-1">
                      <div className="flex items-center justify-between font-medium text-slate-700 dark:text-slate-300">
                        <span>{category}</span>
                        <span className="font-mono">{count} ({pct}%)</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Status Velocity */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <ActivityIcon className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Issue Lifecycle Distribution
                  </h3>
                </div>
              </CardHeader>

              <div className="space-y-4 text-xs">
                <div className="p-3 rounded bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    <span className="font-medium">Open & Awaiting Nodal Review</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                    {data.open_issues}
                  </span>
                </div>

                <div className="p-3 rounded bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                    <span className="font-medium">In Progress (Field Work Active)</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                    {data.in_progress_issues}
                  </span>
                </div>

                <div className="p-3 rounded bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                    <span className="font-medium">Fully Resolved & Audited</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                    {data.resolved_issues}
                  </span>
                </div>

                <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                  Total civic throughput: {data.total_issues} verified records recorded in the live registry.
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
