import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { isDemoMode } from '@/api/client';
import { DEMO_EMAIL, DEMO_PASSWORD, SCHOOL_NAME } from '@/api/mock-data';
import { Button, Card, Field, TextField, textStyles } from '@/components/ui';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/auth';

export default function SignInScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState(isDemoMode ? DEMO_EMAIL : '');
  const [password, setPassword] = useState(isDemoMode ? DEMO_PASSWORD : '');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await signIn(email, password);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to sign in.');
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.hero}>
            <View style={styles.logo}>
              <Ionicons name="school" size={40} color="#FFFFFF" />
            </View>
            <Text style={styles.appName}>School Connect</Text>
            <Text style={textStyles.muted}>{isDemoMode ? SCHOOL_NAME : 'Parent portal'}</Text>
          </View>

          <Card style={styles.form}>
            <Text style={textStyles.title}>Parent sign in</Text>
            <Field label="Email">
              <TextField
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                textContentType="emailAddress"
              />
            </Field>
            <Field label="Password">
              <TextField
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                secureTextEntry
                autoComplete="password"
                textContentType="password"
                onSubmitEditing={handleSubmit}
              />
            </Field>
            {error && <Text style={styles.error}>{error}</Text>}
            <Button title="Sign in" onPress={handleSubmit} loading={submitting} />
          </Card>

          {isDemoMode && (
            <Text style={[textStyles.muted, styles.demo]}>
              Demo mode · use {DEMO_EMAIL} / {DEMO_PASSWORD}
            </Text>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },
  content: { flexGrow: 1, justifyContent: 'center', padding: Spacing.xl, gap: Spacing.xl },
  hero: { alignItems: 'center', gap: Spacing.sm },
  logo: {
    width: 80,
    height: 80,
    borderRadius: Radius.lg,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: { fontSize: 28, fontWeight: '800', color: Colors.text },
  form: { gap: Spacing.lg, padding: Spacing.xl },
  error: { color: Colors.danger, fontSize: 14 },
  demo: { textAlign: 'center' },
});
