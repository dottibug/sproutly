import { StyleSheet, Pressable, Text, View } from 'react-native';
import { colors } from '../../styles/theme';

// Tab.tsx: Single tab within a list of tabs. Adds a bottom border to the active tab. Used in the Home screen to render the 'My Seeds' and 'Browse' tabs. Also used in the 'Seed Details' screen to render the 'Notes', 'Photos', 'Reminders', and 'History' tabs.

type TabProps = {
  readonly label: string;
  readonly active: boolean;
  readonly onPress: () => void;
  readonly badgeCount?: number;
};

export default function Tab({ label, active, onPress, badgeCount }: TabProps) {
  const showBadge = typeof badgeCount === 'number' && badgeCount > 0;

  return (
    <Pressable onPress={onPress}>
      <View style={styles.tabRow}>
        <Text style={[styles.tab, active ? styles.activeTab : styles.inactiveTab]}>{label}</Text>
        {showBadge && (
          <View style={styles.badge}>
            <Text style={styles.badgeCount}>{badgeCount > 99 ? '99+' : badgeCount}</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

// ---- STYLES ----
const styles = StyleSheet.create({
  tabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    position: 'relative',
  },
  tab: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingBottom: 8,
    textAlign: 'center',
  },
  inactiveTab: {
    borderBottomWidth: 0,
    borderColor: 'transparent',
    color: '#999',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderColor: colors.greenMedium,
    color: colors.greenMedium,
  },
  badge: {
    alignItems: 'center',
    backgroundColor: colors.greenMedium,
    borderRadius: 100,
    height: 24,
    justifyContent: 'center',
    position: 'absolute',
    right: -30,
    top: -3,
    width: 24,
  },
  badgeCount: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
});
