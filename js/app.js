import { TASK_STATES, MESSAGES, SAMPLE_TASKS, createIdGenerator } from "./data.js";
import { validateTaskText, generateUniqueId, countByState } from "./utils.js";
import { showMessage, clearMessage, renderCounts } from "./display.js";

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const loadSamplesBtn = document.getElementById("loadSamplesBtn");
const taskList = document.getElementById("taskList");
const taskMessage = document.getElementById("taskMessage");
const countElements = {
  total: document.getElementById("totalCount"),
  pending: document.getElementById("pendingCount"),
  completed: document.getElementById("completedCount")
};

const nextTaskId = createIdGenerator("task-");

function createTaskElement(taskText, taskId) {
  const taskItem = document.createElement("li");
  taskItem.classList.add("task-item");
  taskItem.dataset.taskId = taskId;
  taskItem.dataset.state = TASK_STATES.PENDING;

  const textSpan = document.createElement("span");
  textSpan.classList.add("task-text");
  textSpan.textContent = taskText;

  const completeBtn = document.createElement("button");
  completeBtn.type = "button";
  completeBtn.classList.add("complete-btn");
  completeBtn.textContent = "Complete";

  const editBtn = document.createElement("button");
  editBtn.type = "button";
  editBtn.classList.add("edit-btn");
  editBtn.textContent = "Edit";

  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.classList.add("remove-btn");
  removeBtn.textContent = "Remove";

  taskItem.append(textSpan, completeBtn, editBtn, removeBtn);
  return taskItem;
}

function addTask(taskText) {
  const { valid, value } = validateTaskText(taskText);
  if (!valid) {
    showMessage(taskMessage, MESSAGES.EMPTY_TASK);
    return;
  }

  const taskId = generateUniqueId(nextTaskId, (id) =>
    Boolean(taskList.querySelector(`[data-task-id="${id}"]`))
  );

  taskList.appendChild(createTaskElement(value, taskId));
  taskInput.value = "";
  clearMessage(taskMessage);
  updateTaskCounts();
}

function toggleTaskComplete(taskItem) {
  const isCompleted = taskItem.classList.toggle("completed");
  taskItem.dataset.state = isCompleted ? TASK_STATES.COMPLETED : TASK_STATES.PENDING;
  updateTaskCounts();
}

function beginTaskEdit(taskItem) {
  const textSpan = taskItem.querySelector(".task-text");
  if (!textSpan) return;

  const editInput = document.createElement("input");
  editInput.type = "text";
  editInput.classList.add("edit-input");
  editInput.value = textSpan.textContent;

  textSpan.replaceWith(editInput);
  taskItem.querySelector(".edit-btn").textContent = "Save";
  editInput.focus();
}

function saveTaskEdit(taskItem) {
  const editInput = taskItem.querySelector(".edit-input");
  if (!editInput) return;

  const { valid, value } = validateTaskText(editInput.value);
  if (!valid) {
    showMessage(taskMessage, MESSAGES.EMPTY_TASK);
    return;
  }

  const textSpan = document.createElement("span");
  textSpan.classList.add("task-text");
  textSpan.textContent = value;

  editInput.replaceWith(textSpan);
  taskItem.querySelector(".edit-btn").textContent = "Edit";
  clearMessage(taskMessage);
}

function removeTask(taskItem) {
  taskItem.remove();
  updateTaskCounts();
}

function updateTaskCounts() {
  const states = Array.from(taskList.querySelectorAll(".task-item"))
    .map((taskItem) => taskItem.dataset.state);
  renderCounts(countByState(states), countElements);
}

function handleTaskListClick(event) {
  const button = event.target;
  const taskItem = button.closest(".task-item");
  if (!taskItem) return;

  if (button.matches(".complete-btn")) {
    toggleTaskComplete(taskItem);
  } else if (button.matches(".edit-btn")) {
    if (taskItem.querySelector(".edit-input")) {
      saveTaskEdit(taskItem);
    } else {
      beginTaskEdit(taskItem);
    }
  } else if (button.matches(".remove-btn")) {
    removeTask(taskItem);
  }
}

function loadSampleTasks() {
  const fragment = document.createDocumentFragment();

  SAMPLE_TASKS.forEach((sampleText) => {
    const taskId = generateUniqueId(nextTaskId, (id) =>
      Boolean(taskList.querySelector(`[data-task-id="${id}"]`))
    );
    fragment.appendChild(createTaskElement(sampleText, taskId));
  });

  taskList.appendChild(fragment);
  clearMessage(taskMessage);
  updateTaskCounts();
}

addTaskBtn.addEventListener("click", () => addTask(taskInput.value));
loadSamplesBtn.addEventListener("click", loadSampleTasks);
taskList.addEventListener("click", handleTaskListClick);

taskInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") addTask(taskInput.value);
});
taskList.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && event.target.matches(".edit-input")) {
    saveTaskEdit(event.target.closest(".task-item"));
  }
});

Object.assign(window, {
  createTaskElement, addTask, toggleTaskComplete, beginTaskEdit,
  saveTaskEdit, removeTask, updateTaskCounts, handleTaskListClick, loadSampleTasks
});

updateTaskCounts();