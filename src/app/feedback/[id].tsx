import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { api } from '@/api/client';
import { Badge, Button, Card, ErrorView, LoadingView, Screen, StarRating, TextField, textStyles } from '@/components/ui';
import { Colors, FeedbackStatusInfo, FeedbackTypeInfo, Radius, Spacing } from '@/constants/theme';
import { useChildren } from '@/context/children';
import { useQuery } from '@/hooks/use-query';
import { formatDateTime } from '@/utils/format';

export default function FeedbackThreadScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { children } = useChildren();
  const thread = useQuery(`feedback:${id}`, () => api.getFeedback(id));
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (thread.error) return <ErrorView message={thread.error} onRetry={thread.refresh} />;
  if (!thread.data) return <LoadingView />;

  const item = thread.data;
  const type = FeedbackTypeInfo[item.type];
  const status = FeedbackStatusInfo[item.status];
  const child = children.find((c) => c.id === item.childId);
  const canReply = item.status !== 'closed';

  async function send() {
    if (!reply.trim()) return;
    setSending(true);
    setError(null);
    try {
      await api.replyToFeedback(item.id, reply.trim());
      setReply('');
      thread.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to send.');
    } finally {
      setSending(false);
    }
  }

  return (
    <Screen refreshing={thread.isRefreshing} onRefresh={thread.refresh}>
      <Stack.Screen options={{ title: type.label }} />
      <Card>
        <View style={styles.badges}>
          <Badge label={type.label} color={type.color} background={type.soft} />
          <Badge label={status.label} color={status.color} background={status.soft} />
        </View>
        <Text style={textStyles.title}>{item.subject}</Text>
        <Text style={textStyles.muted}>
          {item.category}
          {child ? ` · ${child.name}` : ''}
          {item.anonymous ? ' · Anonymous' : ''}
        </Text>
        {item.rating ? <StarRating value={item.rating} /> : null}
        {item.reportId && (
          <Button
            title="View report card"
            variant="secondary"
            icon="document-text-outline"
            onPress={() => router.push({ pathname: '/report/[id]', params: { id: item.reportId! } })}
          />
        )}
      </Card>

      {item.messages.map((message) => {
        const mine = message.from === 'parent';
        return (
          <View key={message.id} style={[styles.bubble, mine ? styles.mine : styles.theirs]}>
            <Text style={[styles.author, mine && styles.mineText]}>{message.author}</Text>
            <Text style={[textStyles.body, mine && styles.mineText]}>{message.body}</Text>
            <Text style={[styles.time, mine && styles.mineMuted]}>{formatDateTime(message.at)}</Text>
          </View>
        );
      })}

      {item.messages.every((m) => m.from === 'parent') && (
        <Text style={[textStyles.muted, styles.center]}>
          The school has received your message and will reply here.
        </Text>
      )}

      {canReply && (
        <Card style={styles.replyBox}>
          <TextField value={reply} onChangeText={setReply} placeholder="Add a follow-up message…" multiline />
          {error && <Text style={styles.error}>{error}</Text>}
          <Button title="Send" icon="send" onPress={send} loading={sending} disabled={!reply.trim()} />
        </Card>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  badges: { flexDirection: 'row', gap: Spacing.sm },
  bubble: { maxWidth: '85%', padding: Spacing.md, borderRadius: Radius.lg, gap: 4 },
  mine: { alignSelf: 'flex-end', backgroundColor: Colors.primary, borderBottomRightRadius: 4 },
  theirs: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.card,
    borderBottomLeftRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
  },
  author: { fontSize: 12, fontWeight: '700', color: Colors.textMuted },
  mineText: { color: '#FFFFFF' },
  mineMuted: { color: '#DBEAFE' },
  time: { fontSize: 11, color: Colors.textMuted },
  center: { textAlign: 'center' },
  replyBox: { gap: Spacing.md },
  error: { color: Colors.danger, fontSize: 14 },
});
