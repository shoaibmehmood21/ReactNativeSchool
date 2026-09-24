import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { api } from '@/api/client';
import { ChildSwitcher } from '@/components/child-switcher';
import { Card, EmptyState, ErrorView, LoadingView, Screen, textStyles } from '@/components/ui';
import { Colors, Spacing } from '@/constants/theme';
import { useChildren } from '@/context/children';
import { useQuery } from '@/hooks/use-query';
import { formatDate, scoreColor } from '@/utils/format';

export default function ReportsScreen() {
  const { selected } = useChildren();
  const childId = selected?.id;
  const reports = useQuery(`reports:${childId}`, () =>
    childId ? api.getReports(childId) : Promise.resolve([]),
  );
  const feedback = useQuery('feedback', () => api.listFeedback());

  if (!selected) return <EmptyState icon="people-outline" title="No children" message="No linked children found." />;
  if (reports.error) return <ErrorView message={reports.error} onRetry={reports.refresh} />;

  const list = reports.data?.filter((r) => r.childId === childId);
  const reviewed = new Set(feedback.data?.map((f) => f.reportId).filter(Boolean));

  return (
    <Screen refreshing={reports.isRefreshing} onRefresh={reports.refresh}>
      <ChildSwitcher />
      {!list ? (
        <LoadingView />
      ) : list.length === 0 ? (
        <EmptyState icon="document-text-outline" title="No reports yet" message="Report cards will appear here once issued." />
      ) : (
        list.map((report) => (
          <Card key={report.id} onPress={() => router.push({ pathname: '/report/[id]', params: { id: report.id } })}>
            <View style={styles.row}>
              <View style={[styles.grade, { borderColor: scoreColor(report.overallPercent) }]}>
                <Text style={[styles.gradeText, { color: scoreColor(report.overallPercent) }]}>
                  {report.overallGrade}
                </Text>
              </View>
              <View style={styles.flex}>
                <Text style={textStyles.title}>{report.term}</Text>
                <Text style={textStyles.muted}>
                  {report.overallPercent}% · Issued {formatDate(report.issuedOn)}
                </Text>
                <View style={styles.status}>
                  <Ionicons
                    name={reviewed.has(report.id) ? 'checkmark-circle' : 'chatbox-ellipses-outline'}
                    size={14}
                    color={reviewed.has(report.id) ? Colors.success : Colors.primary}
                  />
                  <Text style={[textStyles.muted, { color: reviewed.has(report.id) ? Colors.success : Colors.primary }]}>
                    {reviewed.has(report.id) ? 'Feedback sent' : 'Share your feedback'}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
            </View>
          </Card>
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  flex: { flex: 1, gap: 2 },
  grade: { width: 52, height: 52, borderRadius: 26, borderWidth: 3, alignItems: 'center', justifyContent: 'center' },
  gradeText: { fontSize: 18, fontWeight: '800' },
  status: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
});
