import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';

import { api } from '@/api/client';
import type { Trend } from '@/api/types';
import { ChildSwitcher } from '@/components/child-switcher';
import {
  Badge,
  Card,
  EmptyState,
  ErrorView,
  LoadingView,
  ProgressBar,
  Screen,
  SectionHeader,
  textStyles,
} from '@/components/ui';
import { Colors, Spacing } from '@/constants/theme';
import { useChildren } from '@/context/children';
import { useQuery } from '@/hooks/use-query';
import { formatDate, scoreColor } from '@/utils/format';

const trendIcon: Record<Trend, { name: 'trending-up' | 'trending-down' | 'remove'; color: string }> = {
  up: { name: 'trending-up', color: Colors.success },
  down: { name: 'trending-down', color: Colors.danger },
  steady: { name: 'remove', color: Colors.textMuted },
};

export default function ProgressScreen() {
  const { selected } = useChildren();
  const childId = selected?.id;
  const progress = useQuery(`progress:${childId}`, () =>
    childId ? api.getProgress(childId) : Promise.resolve(undefined),
  );

  if (!selected) return <EmptyState icon="people-outline" title="No children" message="No linked children found." />;
  if (progress.error) return <ErrorView message={progress.error} onRetry={progress.refresh} />;

  const data = progress.data?.childId === childId ? progress.data : undefined;

  return (
    <Screen refreshing={progress.isRefreshing} onRefresh={progress.refresh}>
      <ChildSwitcher />
      {!data ? (
        <LoadingView />
      ) : (
        <>
          <Card>
            <Text style={textStyles.label}>{data.term}</Text>
            <View style={styles.summary}>
              <View style={styles.flex}>
                <Text style={[styles.big, { color: scoreColor(data.overallPercent) }]}>{data.overallPercent}%</Text>
                <Text style={textStyles.muted}>Overall score</Text>
              </View>
              <View style={styles.flex}>
                <Text style={styles.big}>
                  {Math.round((data.attendance.present / data.attendance.totalDays) * 100)}%
                </Text>
                <Text style={textStyles.muted}>Attendance</Text>
              </View>
            </View>
            <View style={styles.attendance}>
              <Stat label="Present" value={data.attendance.present} color={Colors.success} />
              <Stat label="Absent" value={data.attendance.absent} color={Colors.danger} />
              <Stat label="Late" value={data.attendance.late} color={Colors.warning} />
              <Stat label="School days" value={data.attendance.totalDays} color={Colors.text} />
            </View>
          </Card>

          <SectionHeader title="Subjects" />
          {data.subjects.map((subject) => (
            <Card key={subject.subject}>
              <View style={styles.row}>
                <View style={styles.flex}>
                  <Text style={textStyles.title}>{subject.subject}</Text>
                  <Text style={textStyles.muted}>{subject.teacher}</Text>
                </View>
                <Ionicons name={trendIcon[subject.trend].name} size={20} color={trendIcon[subject.trend].color} />
                <Badge label={subject.grade} color={scoreColor(subject.score)} background={Colors.background} />
              </View>
              <View style={styles.row}>
                <View style={styles.flex}>
                  <ProgressBar percent={subject.score} color={scoreColor(subject.score)} />
                </View>
                <Text style={styles.score}>{subject.score}%</Text>
              </View>
              <Text style={textStyles.body}>“{subject.remarks}”</Text>
            </Card>
          ))}

          {data.upcoming.length > 0 && (
            <>
              <SectionHeader title="Upcoming" />
              {data.upcoming.map((item) => (
                <Card key={item.id}>
                  <View style={styles.row}>
                    <Ionicons name="calendar" size={20} color={Colors.primary} />
                    <View style={styles.flex}>
                      <Text style={textStyles.title}>{item.title}</Text>
                      <Text style={textStyles.muted}>
                        {item.subject} · {formatDate(item.date)}
                      </Text>
                    </View>
                  </View>
                </Card>
              ))}
            </>
          )}
        </>
      )}
    </Screen>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View style={styles.stat}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={textStyles.muted}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  summary: { flexDirection: 'row', gap: Spacing.lg },
  big: { fontSize: 32, fontWeight: '800', color: Colors.text },
  attendance: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
    paddingTop: Spacing.md,
    marginTop: Spacing.xs,
  },
  stat: { alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '700' },
  score: { fontSize: 14, fontWeight: '600', color: Colors.text, width: 44, textAlign: 'right' },
});
