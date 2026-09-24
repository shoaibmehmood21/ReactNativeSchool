import type { FeedbackStatus, FeedbackType } from '@/api/types';

export const Colors = {
  primary: '#1D4ED8',
  primarySoft: '#DBEAFE',
  background: '#F3F5F9',
  card: '#FFFFFF',
  text: '#0F172A',
  textMuted: '#64748B',
  border: '#E2E8F0',
  success: '#15803D',
  successSoft: '#DCFCE7',
  warning: '#B45309',
  warningSoft: '#FEF3C7',
  danger: '#B91C1C',
  dangerSoft: '#FEE2E2',
  info: '#6D28D9',
  infoSoft: '#EDE9FE',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
};

export const FeedbackTypeInfo: Record<
  FeedbackType,
  { label: string; icon: 'alert-circle' | 'bulb' | 'heart' | 'document-text'; color: string; soft: string }
> = {
  complaint: { label: 'Complaint', icon: 'alert-circle', color: Colors.danger, soft: Colors.dangerSoft },
  suggestion: { label: 'Suggestion', icon: 'bulb', color: Colors.warning, soft: Colors.warningSoft },
  appreciation: { label: 'Appreciation', icon: 'heart', color: Colors.success, soft: Colors.successSoft },
  report: { label: 'Report feedback', icon: 'document-text', color: Colors.info, soft: Colors.infoSoft },
};

export const FeedbackStatusInfo: Record<FeedbackStatus, { label: string; color: string; soft: string }> = {
  submitted: { label: 'Submitted', color: Colors.primary, soft: Colors.primarySoft },
  in_review: { label: 'In review', color: Colors.warning, soft: Colors.warningSoft },
  resolved: { label: 'Resolved', color: Colors.success, soft: Colors.successSoft },
  closed: { label: 'Closed', color: Colors.textMuted, soft: Colors.border },
};

export const FeedbackCategories: Record<FeedbackType, string[]> = {
  complaint: ['Academics', 'Teacher', 'Transport', 'Facilities', 'Safety', 'Fees', 'Other'],
  suggestion: ['Academics', 'Activities', 'Facilities', 'Communication', 'Other'],
  appreciation: ['Teacher', 'Staff', 'Event', 'Other'],
  report: ['Report card'],
};
