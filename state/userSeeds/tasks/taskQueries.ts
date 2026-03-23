import { supabase } from '../../app/supabase';
import { UserSeedTask, TaskType, TaskStatus } from './taskTypes';
import { buildUserSeedTask } from './taskUtils';

// Insert a new reminder into the user_seed_reminders table
export async function insertTask(
  userId: string,
  userSeedId: string,
  taskType: TaskType,
  date: string,
  title: string,
  notes: string,
  status: TaskStatus,
): Promise<UserSeedTask> {
  const { data, error } = await supabase
    .from('user_seed_tasks')
    .insert({
      user_id: userId,
      user_seed_id: userSeedId,
      task_type: taskType,
      date: date,
      title: title,
      notes: notes,
      status: status,
    })
    .select('*')
    .single();

  if (error) throw error;

  return buildUserSeedTask({
    id: data.id,
    userId: data.user_id,
    userSeedId: data.user_seed_id,
    taskType: data.task_type,
    title: data.title,
    notes: data.notes,
    status: data.status as TaskStatus,
    date: data.date,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  });
}

// Update a task's status in the user_seed_tasks table
export async function updateTask(userId: string, taskId: string, status: TaskStatus): Promise<void> {
  const { error } = await supabase
    .from('user_seed_tasks')
    .update({ status: status, updated_at: new Date().toISOString() })
    .eq('id', taskId)
    .eq('user_id', userId);

  if (error) throw error;
}

// Delete a task from the user_seed_tasks table
export async function deleteTask(userId: string, taskId: string): Promise<void> {
  const { error } = await supabase.from('user_seed_tasks').delete().eq('id', taskId).eq('user_id', userId);
  if (error) throw error;
}

// Fetch reminders associated with the seeds in a user's collection
export async function fetchTasksByUserSeedId(userSeedIds: string[]): Promise<UserSeedTask[]> {
  if (userSeedIds.length === 0) return [];

  const { data, error } = await supabase
    .from('user_seed_tasks')
    .select('id, user_seed_id, user_id, task_type, title, date, notes, status, created_at, updated_at')
    .in('user_seed_id', userSeedIds)
    .order('date', { ascending: true });

  if (error) throw error;

  const tasks = data?.map((task) =>
    buildUserSeedTask({
      id: task.id,
      userId: task.user_id,
      userSeedId: task.user_seed_id,
      taskType: task.task_type,
      title: task.title,
      notes: task.notes,
      status: task.status as TaskStatus,
      date: task.date,
      createdAt: task.created_at,
      updatedAt: task.updated_at,
    }),
  );

  return tasks ?? ([] as UserSeedTask[]);
}
