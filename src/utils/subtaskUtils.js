export const subtaskChange = (prevSubtasks, taskId, value) => ({
  ...prevSubtasks,
  [taskId]: {
    ...(prevSubtasks[taskId] || { input: "", list: [] }),
    input: value,
  },
});

export const addSubtask = (prevSubtasks, taskId) => {
  const current = prevSubtasks[taskId] || { input: "", list: [] };
  if (!current.input.trim()) return prevSubtasks;

  const newSubtask = {
    id: Date.now(),
    text: current.input.trim(),
    completed: false,
  };

  return {
    ...prevSubtasks,
    [taskId]: {
      input: "",
      list: [...current.list, newSubtask],
    },
  };
};

export const toggleSubtask = (prevSubtasks, taskId, subtaskId) => {
  const current = prevSubtasks[taskId] || { input: "", list: [] };
  return {
    ...prevSubtasks,
    [taskId]: {
      ...current,
      list: current.list.map((subtask) =>
        subtask.id === subtaskId
          ? { ...subtask, completed: !subtask.completed }
          : subtask
      ),
    },
  };
};

export const getSubtaskProgress = (subtasks, taskId) => {
  const subtaskList = subtasks[taskId]?.list || [];
  if (subtaskList.length === 0) return null;

  const total = subtaskList.length;
  const completed = subtaskList.filter((s) => s.completed).length;
  const percentage = Math.round((completed / total) * 100);

  return { total, completed, percentage };
};
