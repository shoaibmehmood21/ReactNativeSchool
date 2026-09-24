import { router } from 'expo-router';
import { useState } from 'react';

import { api } from '@/api/client';
import type { FeedbackType } from '@/api/types';
import { FeedbackCard } from '@/components/feedback-card';
import { Button, ChipGroup, EmptyState, ErrorView, LoadingView, Screen } from '@/components/ui';
import { FeedbackTypeInfo } from '@/constants/theme';
import { useQuery } from '@/hooks/use-query';

type Filter = 'all' | FeedbackType;

const filters: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  ...(Object.keys(FeedbackTypeInfo) as FeedbackType[]).map((type) => ({
    value: type,
    label: FeedbackTypeInfo[type].label,
  })),
];

export default function FeedbackScreen() {
  const feedback = useQuery('feedback', () => api.listFeedback());
  const [filter, setFilter] = useState<Filter>('all');

  if (feedback.error) return <ErrorView message={feedback.error} onRetry={feedback.refresh} />;

  const items = feedback.data?.filter((f) => filter === 'all' || f.type === filter);

  return (
    <Screen refreshing={feedback.isRefreshing} onRefresh={feedback.refresh}>
      <Button title="New complaint or suggestion" icon="add-circle" onPress={() => router.push('/feedback/new')} />
      <ChipGroup options={filters} value={filter} onChange={setFilter} />
      {!items ? (
        <LoadingView />
      ) : items.length === 0 ? (
        <EmptyState
          icon="chatbubbles-outline"
          title="Nothing here yet"
          message="Complaints, suggestions and report feedback you send will appear here with the school's replies."
        />
      ) : (
        items.map((item) => <FeedbackCard key={item.id} item={item} />)
      )}
    </Screen>
  );
}
