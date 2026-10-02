export const TASK_STATES = Object.freeze({
  PENDING: "pending",
  COMPLETED: "completed"
});

export const MESSAGES = Object.freeze({
  EMPTY_TASK: "Task cannot be empty"
});

export const SAMPLE_TASKS = [
  "Review DOM selectors",
  "Practice createElement",
  "Study event delegation"
];

export function createIdGenerator(prefix = "task-") {
  let counter = 0;
  return () => `${prefix}${++counter}`;
}