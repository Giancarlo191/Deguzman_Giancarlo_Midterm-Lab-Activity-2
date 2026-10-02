import { TASK_STATES } from "./data.js";

export function validateTaskText(rawText) {
  const value = String(rawText ?? "").trim();
  return { valid: value.length > 0, value };
}

export function generateUniqueId(nextId, isTaken) {
  let id = nextId();
  while (isTaken(id)) {
    id = nextId();
  }
  return id;
}

export function countByState(states) {
  const { PENDING, COMPLETED } = TASK_STATES;
  const pending = states.filter((state) => state === PENDING).length;
  const completed = states.filter((state) => state === COMPLETED).length;
  return { total: states.length, pending, completed };
}