import { StyleSheet, Pressable, Text, View } from 'react-native';
import { colors } from '../../styles/theme';

type TabProps = {
  readonly label: string;
  readonly active: boolean;
  readonly onPress: () => void;
  readonly badgeCount?: number;
};

// Single tab within a list of tabs. Adds a bottom border to the active tab.
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

const styles = StyleSheet.create({
  tabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
    borderColor: colors.hunterGreen,
    color: colors.hunterGreen,
  },
  badge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.red,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  badgeCount: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
});
