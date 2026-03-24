import { sortByDate } from '../../../state/app/appUtils';
import { UserSeedTask } from '../../../state/userSeeds/tasks/taskTypes';
import type { Data } from 'react-native-timeline-flatlist';
import { Text, StyleSheet, View, TextStyle } from 'react-native';
import { colors } from '../../../styles/theme';
import Timeline from 'react-native-timeline-flatlist';
import Heading from '../../ui/Heading';

type TaskTimelineRow = Data & { readonly taskId: string; readonly lineColor: string; readonly circleColor: string };

type TaskTimelineProps = {
  readonly tasks: UserSeedTask[];
  readonly emptyMessage: string;
};

// TODO: Pick colors for each task type. Current are just placeholder colors

const TASK_TYPE_COLOR_MAP = {
  sow: 'red',
  transplant: 'orange',
  fertilize: 'green',
  prune: 'brown',
  harvest: 'purple',
  other: 'blue',
};

export default function TaskTimeline({ tasks, emptyMessage }: TaskTimelineProps) {
  if (tasks.length == 0) return <Text style={styles.empty}>{emptyMessage}</Text>;

  const data = mapTasksToTimelineData(tasks);

  return (
    <View>
      <Timeline
        data={data}
        circleSize={20}
        lineWidth={4}
        lineColor={colors.hunterGreen}
        separator={true}
        circleColor={colors.hunterGreen}
        columnSideMargin={0}
        timeContainerStyle={styles.timeContainer}
        eventDetailStyle={styles.eventDetail}
        titleStyle={styles.title}
        renderFullLine={true}
        options={{
          scrollEnabled: false,
          removeClippedSubviews: false,
          keyExtractor: (item) => (item as TaskTimelineRow).taskId,
        }}
      />
    </View>
  );
}

function Description({ task }: { task: UserSeedTask }) {
  const typeLabel = task.customTaskType ?? task.taskType;
  const taskLabelColor = TASK_TYPE_COLOR_MAP[task.taskType];

  const notes = (task.notes ?? '').trim();
  const hasNotes = notes.length > 0;
  const noteTextStyle: TextStyle = {
    fontStyle: hasNotes ? 'normal' : 'italic',
    color: hasNotes ? 'black' : colors.secondary,
  };

  return (
    <View style={styles.descriptionContainer}>
      <View style={[styles.taskTypeContainer, { backgroundColor: taskLabelColor }]}>
        <Text style={styles.taskType}>{typeLabel}</Text>
      </View>
      <View style={styles.notesContainer}>
        <Heading size="xsmall">{task.title}</Heading>
        <Text style={[styles.notes, noteTextStyle]}>{hasNotes ? notes : 'No task notes'}</Text>
      </View>
    </View>
  );
}

// Maps tasks to the data format expected by react-native-timeline-flatlist package
function mapTasksToTimelineData(tasks: UserSeedTask[]): TaskTimelineRow[] {
  // Sort falls back to date created if no completedAt
  const sortedTasks = [...tasks].sort((a, b) => sortByDate(a.completedAt ?? a.date, b.completedAt ?? b.date));

  return sortedTasks.map((task) => {
    const time = '';
    const title = '';
    const lineColor = TASK_TYPE_COLOR_MAP[task.taskType];
    const circleColor = TASK_TYPE_COLOR_MAP[task.taskType];
    const description = <Description task={task} />;
    return { taskId: task.id, time, title, description, lineColor, circleColor };
  });
}

const styles = StyleSheet.create({
  empty: {
    textAlign: 'center',
    color: colors.secondary,
    fontStyle: 'italic',
    marginVertical: 8,
  },
  title: {
    display: 'none',
  },
  timeContainer: {
    minWidth: 12,
  },
  descriptionContainer: {
    gap: 8,
  },
  taskTypeContainer: {
    backgroundColor: colors.lightGray,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  eventDetail: {
    marginTop: 0,
    paddingTop: 0,
    paddingBottom: 8,

    // borderWidth: 1,
    // borderColor: 'blue',
  },
  taskType: {
    fontSize: 12,
    color: colors.white,
    fontWeight: '600',
  },
  notes: {
    fontSize: 14,
  },
  notesContainer: {
    gap: 4,
  },
});
