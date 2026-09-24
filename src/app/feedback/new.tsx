import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

import { api } from '@/api/client';
import type { FeedbackType } from '@/api/types';
import { Button, ChipGroup, Field, Screen, TextField, textStyles } from '@/components/ui';
import { Colors, FeedbackCategories, FeedbackTypeInfo, Spacing } from '@/constants/theme';
import { useChildren } from '@/context/children';

const types: FeedbackType[] = ['complaint', 'suggestion', 'appreciation'];

const NO_CHILD = 'none';

export default function NewFeedbackScreen() {
  const params = useLocalSearchParams<{ type?: FeedbackType }>();
  const { children, selected } = useChildren();

  const [type, setType] = useState<FeedbackType>(
    params.type && types.includes(params.type) ? params.type : 'complaint',
  );
  const [category, setCategory] = useState<string>();
  const [childId, setChildId] = useState<string>(selected?.id ?? NO_CHILD);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function changeType(next: FeedbackType) {
    setType(next);
    setCategory(undefined);
    if (next !== 'complaint' && next !== 'suggestion') setAnonymous(false);
  }

  async function submit() {
    if (!category) return setError('Please pick a category.');
    if (!subject.trim()) return setError('Please add a short subject.');
    if (message.trim().length < 10) return setError('Please describe it in a little more detail.');

    setError(null);
    setSubmitting(true);
    try {
      const created = await api.submitFeedback({
        type,
        category,
        subject: subject.trim(),
        message: message.trim(),
        childId: childId === NO_CHILD ? undefined : childId,
        anonymous,
      });
      router.replace({ pathname: '/feedback/[id]', params: { id: created.id } });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to send.');
      setSubmitting(false);
    }
  }

  const allowAnonymous = type === 'complaint' || type === 'suggestion';

  return (
    <Screen>
      <Field label="What would you like to share?">
        <ChipGroup
          options={types.map((t) => ({ value: t, label: FeedbackTypeInfo[t].label }))}
          value={type}
          onChange={changeType}
        />
      </Field>

      <Field label="Category">
        <ChipGroup
          options={FeedbackCategories[type].map((c) => ({ value: c, label: c }))}
          value={category}
          onChange={setCategory}
        />
      </Field>

      {children.length > 0 && (
        <Field label="About">
          <ChipGroup
            options={[
              ...children.map((c) => ({ value: c.id, label: c.name.split(' ')[0]! })),
              { value: NO_CHILD, label: 'General' },
            ]}
            value={childId}
            onChange={setChildId}
          />
        </Field>
      )}

      <Field label="Subject">
        <TextField value={subject} onChangeText={setSubject} placeholder="A short title" maxLength={80} />
      </Field>

      <Field label="Details" hint={`${message.length}/1000`}>
        <TextField
          value={message}
          onChangeText={setMessage}
          placeholder={
            type === 'complaint'
              ? 'What happened, when, and what would you like the school to do?'
              : type === 'suggestion'
                ? 'Describe your idea and how it would help.'
                : 'Tell the school what you appreciated.'
          }
          multiline
          maxLength={1000}
        />
      </Field>

      {allowAnonymous && (
        <View style={styles.switchRow}>
          <View style={styles.flex}>
            <Text style={textStyles.body}>Submit anonymously</Text>
            <Text style={textStyles.muted}>Your name is hidden from staff. The school may not be able to follow up.</Text>
          </View>
          <Switch value={anonymous} onValueChange={setAnonymous} trackColor={{ true: Colors.primary }} />
        </View>
      )}

      {error && <Text style={styles.error}>{error}</Text>}
      <Button title="Send to school" icon="send" onPress={submit} loading={submitting} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  flex: { flex: 1 },
  error: { color: Colors.danger, fontSize: 14 },
});
