import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import type { Feedback } from '@/api/types';
import { Badge, Card, textStyles } from '@/components/ui';
import { FeedbackStatusInfo, FeedbackTypeInfo, Spacing } from '@/constants/theme';
import { formatDate } from '@/utils/format';

export function FeedbackCard({ item }: { item: Feedback }) {
  const type = FeedbackTypeInfo[item.type];
  const status = FeedbackStatusInfo[item.status];
  const lastMessage = item.messages[item.messages.length - 1];
  const schoolReplied = lastMessage?.from === 'school';

  return (
    <Card onPress={() => router.push({ pathname: '/feedback/[id]', params: { id: item.id } })}>
      <View style={styles.row}>
        <View style={[styles.icon, { backgroundColor: type.soft }]}>
          <Ionicons name={type.icon} size={18} color={type.color} />
        </View>
        <View style={styles.flex}>
          <Text style={textStyles.title} numberOfLines={1}>
            {item.subject}
          </Text>
          <Text style={textStyles.muted}>
            {type.label} · {item.category} · {formatDate(item.updatedAt)}
          </Text>
        </View>
      </View>
      {lastMessage && (
        <Text style={textStyles.body} numberOfLines={2}>
          {schoolReplied ? 'School: ' : ''}
          {lastMessage.body}
        </Text>
      )}
      <Badge label={status.label} color={status.color} background={status.soft} />
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  icon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  flex: { flex: 1 },
});
