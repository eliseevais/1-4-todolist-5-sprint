import React, { ChangeEvent, useCallback } from "react";
import { Checkbox, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { EditableSpan } from "components/EditableSpan/EditableSpan";
import { TaskStatuses, TaskType } from "api/todolists-api";
import { useActions } from "utils/redux-utils";
import { tasksActions } from "features/TodolistsList";

type TaskPropsType = {
  task: TaskType;
  todolistId: string;
};
export const Task = React.memo((props: TaskPropsType) => {
  const { removeTask, updateTask } = useActions(tasksActions);

  const onClickHandler = useCallback(
    () => removeTask({ taskId: props.task.id, todolistId: props.todolistId }),
    [props.task.id, props.todolistId],
  );

  const onChangeHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      updateTask({
        taskId: props.task.id,
        model: { status: e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New },
        todolistId: props.todolistId,
      });
    },
    [props.task.id, props.todolistId],
  );

  const onTitleChangeHandler = useCallback(
    (newValue: string) => {
      updateTask({
        taskId: props.task.id,
        model: { title: newValue },
        todolistId: props.todolistId,
      });
    },
    [props.task.id, props.todolistId],
  );

  return (
    <div
      key={props.task.id}
      className={props.task.status === TaskStatuses.Completed ? "is-done" : ""}
      style={{ position: "relative" }}
    >
      <Checkbox checked={props.task.status === TaskStatuses.Completed} color="primary" onChange={onChangeHandler} />

      <EditableSpan value={props.task.title} onChange={onTitleChangeHandler} />
      <IconButton onClick={onClickHandler} style={{ position: "absolute", top: "2px", right: "2px" }}>
        <Delete fontSize={"small"} />
      </IconButton>
    </div>
  );
});
