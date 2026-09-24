import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { api } from '@/api/client';
import { FeedbackCard } from '@/components/feedback-card';
import {
  Button,
  Card,
  ErrorView,
  Field,
  LoadingView,
  Screen,
  SectionHeader,
  StarRating,
  TextField,
  textStyles,
} from '@/components/ui';
import { Colors, Spacing } from '@/constants/theme';
import { useChildren } from '@/context/children';
import { useQuery } from '@/hooks/use-query';
import { formatDate, scoreColor } from '@/utils/format';

export default function ReportScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { children } = useChildren();
  const report = useQuery(`report:${id}`, () => api.getReport(id));
  const feedback = useQuery('feedback', () => api.listFeedback());

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  if (report.error) return <ErrorView message={report.error} onRetry={report.refresh} />;
  if (!report.data) return <LoadingView />;

  const data = report.data;
  const child = children.find((c) => c.id === data.childId);
  const existing = feedback.data?.filter((f) => f.reportId === data.id) ?? [];

  async function submit() {
    if (rating === 0) {
      setFormError('Please choose a rating.');
      return;
    }
    if (!comment.trim()) {
      setFormError('Please add a comment for the teacher.');
      return;
    }
    setFormError(null);
    setSubmitting(true);
    try {
      await api.submitFeedback({
        type: 'report',
        category: 'Report card',
        subject: `${data.term}${child ? ` – ${child.name}` : ''}`,
        message: comment.trim(),
        childId: data.childId,
        reportId: data.id,
        rating,
        anonymous: false,
      });
      setComment('');
      setRating(0);
      feedback.refresh();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Unable to send feedback.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Screen>
      <Card>
        <Text style={textStyles.label}>{child?.name ?? 'Student'}</Text>
        <Text style={styles.term}>{data.term}</Text>
        <Text style={textStyles.muted}>Issued {formatDate(data.issuedOn)}</Text>
        <View style={styles.summary}>
          <Summary label="Grade" value={data.overallGrade} color={scoreColor(data.overallPercent)} />
          <Summary label="Percentage" value={`${data.overallPercent}%`} color={scoreColor(data.overallPercent)} />
          {data.classPosition && <Summary label="Position" value={data.classPosition} color={Colors.text} />}
        </View>
      </Card>

      <SectionHeader title="Marks" />
      <Card>
        <View style={[styles.tableRow, styles.tableHead]}>
          <Text style={[styles.cellSubject, styles.headText]}>Subject</Text>
          <Text style={[styles.cell, styles.headText]}>Marks</Text>
          <Text style={[styles.cell, styles.headText]}>Grade</Text>
        </View>
        {data.subjects.map((s) => {
          const percent = (s.marks / s.maxMarks) * 100;
          return (
            <View key={s.subject} style={styles.tableRow}>
              <Text style={[styles.cellSubject, textStyles.body]}>{s.subject}</Text>
              <Text style={[styles.cell, textStyles.body]}>
                {s.marks}/{s.maxMarks}
              </Text>
              <Text style={[styles.cell, styles.grade, { color: scoreColor(percent) }]}>{s.grade}</Text>
            </View>
          );
        })}
      </Card>

      <SectionHeader title="Remarks" />
      <Card>
        <Text style={textStyles.label}>Class teacher</Text>
        <Text style={textStyles.body}>{data.teacherRemarks}</Text>
        <Text style={[textStyles.label, styles.gapTop]}>Principal</Text>
        <Text style={textStyles.body}>{data.principalRemarks}</Text>
      </Card>

      <SectionHeader title="Your feedback on this report" />
      {existing.map((item) => (
        <FeedbackCard key={item.id} item={item} />
      ))}
      <Card style={styles.form}>
        <Text style={textStyles.body}>
          {existing.length > 0
            ? 'Want to add more? Send another note to the teacher.'
            : 'How do you feel about this report? Your comments go to the class teacher.'}
        </Text>
        <Field label="Rating">
          <StarRating value={rating} onChange={setRating} />
        </Field>
        <Field label="Comment">
          <TextField
            value={comment}
            onChangeText={setComment}
            placeholder="e.g. Thank you for the detailed remarks. Could we discuss Urdu writing practice?"
            multiline
          />
        </Field>
        {formError && <Text style={styles.error}>{formError}</Text>}
        <Button title="Send feedback" icon="send" onPress={submit} loading={submitting} />
      </Card>
    </Screen>
  );
}

function Summary({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={styles.summaryItem}>
      <Text style={[styles.summaryValue, { color }]}>{value}</Text>
      <Text style={textStyles.muted}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  term: { fontSize: 22, fontWeight: '800', color: Colors.text },
  summary: { flexDirection: 'row', gap: Spacing.lg, marginTop: Spacing.sm },
  summaryItem: { flex: 1 },
  summaryValue: { fontSize: 20, fontWeight: '800' },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  tableHead: { paddingTop: 0 },
  headText: { fontSize: 12, fontWeight: '700', color: Colors.textMuted, textTransform: 'uppercase' },
  cellSubject: { flex: 2 },
  cell: { flex: 1, textAlign: 'right' },
  grade: { fontSize: 15, fontWeight: '700' },
  gapTop: { marginTop: Spacing.sm },
  form: { gap: Spacing.lg },
  error: { color: Colors.danger, fontSize: 14 },
});
