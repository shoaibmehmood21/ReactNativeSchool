import Ionicons from '@expo/vector-icons/Ionicons';
import Constants from 'expo-constants';
import { Alert, Platform, StyleSheet, Text, View } from 'react-native';

import { isDemoMode } from '@/api/client';
import { Avatar, Button, Card, Screen, SectionHeader, type IconName, textStyles } from '@/components/ui';
import { Colors, Spacing } from '@/constants/theme';
import { useAuth, useSession } from '@/context/auth';
import { useChildren } from '@/context/children';

export default function AccountScreen() {
  const session = useSession();
  const { signOut } = useAuth();
  const { children } = useChildren();

  function confirmSignOut() {
    if (Platform.OS === 'web') {
      signOut();
      return;
    }
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: () => signOut() },
    ]);
  }

  return (
    <Screen>
      <Card style={styles.profile}>
        <Avatar name={session.parent.name} color={Colors.primary} size={64} />
        <Text style={styles.name}>{session.parent.name}</Text>
        <Text style={textStyles.muted}>Parent · {session.schoolName}</Text>
      </Card>

      <SectionHeader title="Contact details" />
      <Card>
        <Row icon="mail-outline" label="Email" value={session.parent.email} />
        <Row icon="call-outline" label="Phone" value={session.parent.phone} />
      </Card>

      <SectionHeader title="Linked children" />
      <Card>
        {children.map((child) => (
          <Row key={child.id} icon="person-outline" label={child.name} value={child.className} />
        ))}
      </Card>

      <Button title="Sign out" icon="log-out-outline" variant="secondary" onPress={confirmSignOut} />
      <Text style={[textStyles.muted, styles.version]}>
        School Connect v{Constants.expoConfig?.version ?? '1.0.0'}
        {isDemoMode ? ' · demo data' : ''}
      </Text>
    </Screen>
  );
}

function Row({ icon, label, value }: { icon: IconName; label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Ionicons name={icon} size={20} color={Colors.textMuted} />
      <Text style={[textStyles.body, styles.flex]}>{label}</Text>
      <Text style={textStyles.muted}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  profile: { alignItems: 'center', paddingVertical: Spacing.xl },
  name: { fontSize: 22, fontWeight: '700', color: Colors.text },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.xs },
  flex: { flex: 1 },
  version: { textAlign: 'center' },
});
