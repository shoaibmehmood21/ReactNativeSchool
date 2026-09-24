import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { api } from '@/api/client';
import type { Announcement } from '@/api/types';
import {
  Avatar,
  Badge,
  Card,
  ErrorView,
  type IconName,
  LoadingView,
  Screen,
  SectionHeader,
  textStyles,
} from '@/components/ui';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { useSession } from '@/context/auth';
import { useChildren } from '@/context/children';
import { useQuery } from '@/hooks/use-query';
import { formatDate } from '@/utils/format';

const announcementBadge: Record<Announcement['category'], { color: string; background: string }> = {
  event: { color: Colors.primary, background: Colors.primarySoft },
  exam: { color: Colors.info, background: Colors.infoSoft },
  holiday: { color: Colors.success, background: Colors.successSoft },
  notice: { color: Colors.warning, background: Colors.warningSoft },
};

const quickActions: { label: string; icon: IconName; color: string; onPress: () => void }[] = [
  {
    label: 'Complaint',
    icon: 'alert-circle',
    color: Colors.danger,
    onPress: () => router.push({ pathname: '/feedback/new', params: { type: 'complaint' } }),
  },
  {
    label: 'Suggestion',
    icon: 'bulb',
    color: Colors.warning,
    onPress: () => router.push({ pathname: '/feedback/new', params: { type: 'suggestion' } }),
  },
  {
    label: 'Appreciate',
    icon: 'heart',
    color: Colors.success,
    onPress: () => router.push({ pathname: '/feedback/new', params: { type: 'appreciation' } }),
  },
  {
    label: 'Reports',
    icon: 'document-text',
    color: Colors.info,
    onPress: () => router.navigate('/reports'),
  },
];

export default function HomeScreen() {
  const session = useSession();
  const kids = useChildren();
  const announcements = useQuery('announcements', () => api.getAnnouncements());
  const [expanded, setExpanded] = useState<string | null>(null);

  if (kids.isLoading && kids.children.length === 0) return <LoadingView />;
  if (kids.error) return <ErrorView message={kids.error} onRetry={kids.reload} />;

  return (
    <Screen
      refreshing={announcements.isRefreshing}
      onRefresh={() => {
        kids.reload();
        announcements.refresh();
      }}>
      <View>
        <Text style={textStyles.muted}>{session.schoolName}</Text>
        <Text style={styles.greeting}>Hello, {session.parent.name.split(' ')[0]} 👋</Text>
      </View>

      <SectionHeader title="My children" />
      {kids.children.map((child) => (
        <Card
          key={child.id}
          onPress={() => {
            kids.select(child.id);
            router.navigate('/progress');
          }}>
          <View style={styles.row}>
            <Avatar name={child.name} color={child.avatarColor} />
            <View style={styles.flex}>
              <Text style={textStyles.title}>{child.name}</Text>
              <Text style={textStyles.muted}>
                {child.className} · Roll {child.rollNo}
              </Text>
              <Text style={textStyles.muted}>Class teacher: {child.classTeacher}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
          </View>
        </Card>
      ))}

      <SectionHeader title="Talk to the school" />
      <View style={styles.actions}>
        {quickActions.map((action) => (
          <Pressable
            key={action.label}
            onPress={action.onPress}
            accessibilityRole="button"
            style={({ pressed }) => [styles.action, pressed && { opacity: 0.7 }]}>
            <Ionicons name={action.icon} size={24} color={action.color} />
            <Text style={styles.actionLabel}>{action.label}</Text>
          </Pressable>
        ))}
      </View>

      <SectionHeader title="Announcements" />
      {announcements.isLoading && !announcements.data ? (
        <LoadingView />
      ) : announcements.error ? (
        <Text style={textStyles.muted}>{announcements.error}</Text>
      ) : (
        announcements.data?.map((item) => {
          const open = expanded === item.id;
          return (
            <Card key={item.id} onPress={() => setExpanded(open ? null : item.id)}>
              <View style={styles.row}>
                <Badge label={item.category.toUpperCase()} {...announcementBadge[item.category]} />
                <Text style={[textStyles.muted, styles.flex]}>{formatDate(item.date)}</Text>
                <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={18} color={Colors.textMuted} />
              </View>
              <Text style={textStyles.title}>{item.title}</Text>
              <Text style={textStyles.body} numberOfLines={open ? undefined : 2}>
                {item.body}
              </Text>
            </Card>
          );
        })
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  greeting: { fontSize: 26, fontWeight: '800', color: Colors.text },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  flex: { flex: 1 },
  actions: { flexDirection: 'row', gap: Spacing.sm },
  action: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.md,
    borderRadius: Radius.lg,
    backgroundColor: Colors.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
  },
  actionLabel: { fontSize: 12, fontWeight: '600', color: Colors.text },
});
