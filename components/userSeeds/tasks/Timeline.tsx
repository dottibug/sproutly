import { Text, StyleSheet, View } from 'react-native';
import Timeline from 'react-native-timeline-flatlist';
import type { Data } from 'react-native-timeline-flatlist';
import { TaskType, UserSeedTask } from '../../../state/userSeeds/tasks/taskTypes';
import { isCustomTask, formatISOMonthDay, sortByDate } from '../../../state/barrels/utilsBarrel';
import TimelineEvent from './TimelineEvent';
import { colors } from '../../../styles/theme';

type TaskTimelineProps = {
  readonly tasks: UserSeedTask[];
  readonly emptyMessage: string;
};

// TaskTimeline.tsx: Renders a timeline of completed tasks for a seed
export default function TaskTimeline({ tasks, emptyMessage }: TaskTimelineProps) {
  if (tasks.length == 0) return <Text style={styles.empty}>{emptyMessage}</Text>;
  const data = mapTasksToTimelineData(tasks);

  return (
    <View style={styles.timelineContainer}>
      <Timeline
        data={data}
        lineWidth={4}
        circleSize={22}
        timeContainerStyle={styles.timeContainer}
        eventDetailStyle={styles.eventDetail}
        titleStyle={styles.title}
        timeStyle={styles.time}
        renderFullLine={true}
        columnSideMargin={16}
        options={{
          scrollEnabled: false,
          removeClippedSubviews: false,
          keyExtractor: (item) => (item as TaskTimelineRow).taskId,
        }}
      />
    </View>
  );
}

// ---- TIMELINE DATA ----
type TaskTimelineRow = Data & { readonly taskId: string; readonly lineColor: string; readonly circleColor: string };

// Maps tasks to the data format expected by react-native-timeline-flatlist package
function mapTasksToTimelineData(tasks: UserSeedTask[]): TaskTimelineRow[] {
  const sortedTasks = [...tasks].sort((a, b) => sortByDate(a.completedAt ?? a.date, b.completedAt ?? b.date));

  const getColor = (task: UserSeedTask) => {
    return isCustomTask(task) ? TASK_TYPE_COLOR_MAP.custom : TASK_TYPE_COLOR_MAP[task.taskType];
  };

  return sortedTasks.map((task) => {
    const time = formatISOMonthDay(task.date);
    const title = '';
    const lineColor = getColor(task);
    const circleColor = getColor(task);
    const description = <TimelineEvent task={task} />;
    return { taskId: task.id, time, title, description, lineColor, circleColor };
  });
}

// ---- CONSTANTS ----
const TASK_TYPE_COLOR_MAP: Record<TaskType, string> = {
  sow: colors.chocolate,
  transplant: colors.tangerine,
  fertilize: colors.coral,
  prune: colors.amethyst,
  harvest: colors.teal,
  custom: colors.blue,
};

// ---- STYLES ----
const styles = StyleSheet.create({
  timelineContainer: {
    flex: 1,
    paddingBottom: 0,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  empty: {
    color: colors.secondary,
    fontSize: 14,
    fontStyle: 'italic',
  },
  timeContainer: {
    minWidth: 12,
  },
  eventDetail: {
    marginTop: 0,
    paddingTop: 0,
    paddingBottom: 8,
  },
  title: {
    display: 'none',
  },
  time: {
    color: colors.secondary,
    fontSize: 15,
    fontWeight: '600',
    minWidth: 60,
    paddingTop: 2,
  },
});

// ---- REFERENCES ----
// https://github.com/eugnis/react-native-timeline-flatlist?tab=readme-ov-file#react-native-timeline-flatlist
