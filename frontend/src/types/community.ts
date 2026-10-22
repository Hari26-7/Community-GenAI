export type IssuePriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type IssueStatus = 'Open' | 'In Progress' | 'Resolved';

export interface CommunityIssue {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  priority: IssuePriority;
  status: IssueStatus;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CommunityDiscussion {
  id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  replies_count: number;
  created_at: string;
}

export interface CommunityAnnouncement {
  id: string;
  title: string;
  body: string;
  audience: string;
  category: string;
  is_ai_generated?: boolean | string;
  created_by: string;
  created_at: string;
}

export interface CommunityActivity {
  id: string;
  type: string;
  description: string;
  user_name: string;
  timestamp: string;
  metadata_json?: string;
}

export interface CommunityAnalytics {
  total_issues: number;
  open_issues: number;
  in_progress_issues: number;
  resolved_issues: number;
  total_discussions: number;
  total_announcements: number;
  total_members: number;
  ai_assistance_count: number;
  category_breakdown: Record<string, number>;
  priority_breakdown: Record<string, number>;
}

export interface AIAnalysisResult {
  id: string;
  title: string;
  description: string;
  category?: string;
  location?: string;
  priority?: string;
  summary: string;
  causes: string[];
  affected_groups: string[];
  short_term_actions: string[];
  long_term_actions: string[];
  ai_confidence: string;
  severity: string;
  created_at: string;
}

export interface AISolutionOption {
  id: string;
  title: string;
  description: string;
  difficulty: 'Low' | 'Medium' | 'High';
  expected_impact: string;
  estimated_resources: string;
  is_recommended: boolean;
  implementation_steps: string[];
  risks_and_mitigation: string;
}

export interface AISolutionsResponse {
  id: string;
  problem_title: string;
  community_context?: string;
  solutions: AISolutionOption[];
  created_at: string;
}

export interface AIAnnouncementResult {
  id: string;
  purpose: string;
  audience: string;
  title: string;
  body: string;
  short_version: string;
  social_version: string;
  created_at: string;
}

export interface AIChatMessage {
  id: string;
  conversation_id: string;
  user_message: string;
  ai_response: string;
  created_at: string;
  suggested_actions?: string[];
}
