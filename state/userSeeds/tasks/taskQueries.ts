import { supabase } from '../../app/supabase';
import { UserSeedTask, TaskType, TaskStatus } from './taskTypes';

// taskQueries.ts: Contains functions to interact with the database for tasks

type InsertTaskInput = {
  userId: string;
  userSeedId: string;
  taskType: TaskType;
  date: string;
  customTaskType: string | null;
  notes: string;
  status: TaskStatus;
};

// Insert a new task into the user_seed_tasks table
export async function insertTask(input: InsertTaskInput): Promise<UserSeedTask> {
  const { userId, userSeedId, taskType, date, customTaskType, notes, status } = input;
  const { data, error } = await supabase
    .from('user_seed_tasks')
    .insert({
      user_id: userId,
      user_seed_id: userSeedId,
      task_type: taskType,
      custom_task_type: customTaskType,
      completed_at: null,
      date: date,
      notes: notes,
      status: status,
    })
    .select('*')
    .single();

  if (error) throw error;

  return {
    id: data.id,
    userId: data.user_id,
    userSeedId: data.user_seed_id,
    taskType: data.task_type,
    customTaskType: data.custom_task_type,
    notes: data.notes,
    status: data.status as TaskStatus,
    date: data.date,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    completedAt: null,
  } as UserSeedTask;
}

// Update a task's status in the user_seed_tasks table
export async function updateTaskStatus(userId: string, taskId: string, status: TaskStatus): Promise<void> {
  const { error } = await supabase
    .from('user_seed_tasks')
    .update({
      status: status,
      updated_at: new Date().toISOString(),
      completed_at: status === 'completed' ? new Date().toISOString() : null,
    })
    .eq('id', taskId)
    .eq('user_id', userId);

  if (error) throw error;
}

// Update task details in the user_seed_tasks table
export async function updateTaskDetails(userId: string, task: UserSeedTask): Promise<void> {
  const { error } = await supabase
    .from('user_seed_tasks')
    .update({
      task_type: task.taskType,
      custom_task_type: task.customTaskType,
      date: task.date,
      notes: task.notes,
      updated_at: task.updatedAt,
    })
    .eq('id', task.id)
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
    .select('id, user_seed_id, user_id, task_type, custom_task_type, date, notes, status, created_at, updated_at, completed_at')
    .in('user_seed_id', userSeedIds)
    .order('date', { ascending: true });

  if (error) throw error;

  const tasks = data?.map((task) => {
    return {
      id: task.id,
      userId: task.user_id,
      userSeedId: task.user_seed_id,
      taskType: task.task_type,
      customTaskType: task.custom_task_type,
      notes: task.notes,
      status: task.status as TaskStatus,
      date: task.date,
      createdAt: task.created_at,
      updatedAt: task.updated_at,
      completedAt: task.completed_at,
    } as UserSeedTask;
  });

  return tasks ?? ([] as UserSeedTask[]);
}
