import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/ui';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { useChildren } from '@/context/children';

/** Horizontal selector shown on screens that are scoped to one child. */
export function ChildSwitcher() {
  const { children, selected, select } = useChildren();
  if (children.length < 2) return null;

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {children.map((child) => {
        const active = child.id === selected?.id;
        return (
          <Pressable
            key={child.id}
            onPress={() => select(child.id)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            style={[styles.pill, active && styles.pillActive]}>
            <Avatar name={child.name} color={child.avatarColor} size={28} />
            <View>
              <Text style={[styles.name, active && styles.nameActive]}>{child.name.split(' ')[0]}</Text>
              <Text style={[styles.cls, active && styles.nameActive]}>{child.className}</Text>
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: Spacing.sm },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: 6,
    paddingLeft: 6,
    paddingRight: Spacing.lg,
    borderRadius: Radius.pill,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pillActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  name: { fontSize: 14, fontWeight: '600', color: Colors.text },
  cls: { fontSize: 11, color: Colors.textMuted },
  nameActive: { color: '#FFFFFF' },
});
