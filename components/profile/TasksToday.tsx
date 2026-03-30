import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts } from '../../styles/theme';

// TasksToday.tsx: Displays the number of tasks due today. Used in the Profile screen.
type TasksTodayProps = {
  readonly tasksDueToday: number;
};

export default function TasksToday({ tasksDueToday }: TasksTodayProps) {
  const taskWord = tasksDueToday === 1 ? 'task' : 'tasks';
  return (
    <View style={styles.container}>
      <Text style={styles.numTasks}>{tasksDueToday}</Text>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Garden Time!</Text>
        <Text style={[styles.taskWord, styles.bottomTextLine]}>{`${taskWord} due today`}</Text>
      </View>
    </View>
  );
}

// ---- STYLES ----
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 9,
  },
  title: {
    color: colors.greenMedium,
    fontFamily: fonts.aladin.fontFamily,
    fontSize: 44,
  },
  textContainer: {
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
  numTasks: {
    color: colors.greenLight,
    fontFamily: fonts.aladin.fontFamily,
    fontSize: 96,
  },
  taskWord: {
    color: colors.secondary,
    fontSize: 30,
    fontWeight: '600',
    marginTop: -10,
  },
  bottomTextLine: {
    paddingBottom: 13,
  },
});
