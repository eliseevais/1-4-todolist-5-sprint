import React, { useCallback, useEffect } from "react";
import { Button, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { AddItemForm, AddItemFormSubmitHelperType } from "components/AddItemForm/AddItemForm";
import { FilterValuesType, TodolistDomainType } from "../todolists-reducer";
import { EditableSpan } from "components/EditableSpan/EditableSpan";
import { useAppDispatch } from "hooks/useAppDispatch";
import { useActions } from "utils/redux-utils";
import { Task } from "./Task/Task";
import { TaskStatuses, TaskType } from "api/todolists-api";
import { tasksAsyncActions } from "features/TodolistsList/tasks-reducer";
import { tasksActions, todolistsActions } from "features/TodolistsList";

type PropsType = {
  todolist: TodolistDomainType;
  tasks: Array<TaskType>;
  demo?: boolean;
};

export const Todolist = React.memo(function ({ demo = false, ...props }: PropsType) {
  const { changeTodolistFilter, removeTodolist, changeTodolistTitle } = useActions(todolistsActions);
  const { fetchTasks } = useActions(tasksActions);

  useEffect(() => {
    if (demo) {
      return;
    }
    if (!props.tasks.length) {
      fetchTasks(props.todolist.id);
    }
  }, []);

  const dispatch = useAppDispatch();

  const changeTodolistTitleLocal = useCallback(
    (title: string) => {
      changeTodolistTitle({ id: props.todolist.id, title: title });
    },
    [props.todolist.id],
  );
  const removeTodolistLocal = () => {
    removeTodolist(props.todolist.id);
  };

  const onFilterButtonClickHandler = useCallback(
    (filter: FilterValuesType) => changeTodolistFilter({ filter: filter, id: props.todolist.id }),
    [props.todolist.id],
  );

  const addTaskLocal = useCallback(
    async (title: string, helper: AddItemFormSubmitHelperType) => {
      let thunk = tasksAsyncActions.addTask({ title: title, todolistId: props.todolist.id });
      const resultAction = await dispatch(thunk);

      if (tasksAsyncActions.addTask.rejected.match(resultAction)) {
        if (resultAction.payload?.errors?.length) {
          const errorMessage = resultAction.payload?.errors[0];
          helper.setError(errorMessage);
        } else {
          helper.setError("Some error occurred");
        }
      } else {
        helper.setTitle("");
      }
    },
    [props.todolist.id],
  );

  let tasksForTodolist = props.tasks;

  if (props.todolist.filter === "active") {
    tasksForTodolist = props.tasks.filter((t) => t.status === TaskStatuses.New);
  }
  if (props.todolist.filter === "completed") {
    tasksForTodolist = props.tasks.filter((t) => t.status === TaskStatuses.Completed);
  }

  const renderFilterButton = (buttonFilter: FilterValuesType, color: any, text: string) => {
    return (
      <Button
        variant={props.todolist.filter === text ? "contained" : "outlined"}
        onClick={() => onFilterButtonClickHandler(buttonFilter)}
        color={color}
        style={{
          width: "100px",
          boxSizing: "border-box",
        }}
      >
        {text}
      </Button>
    );
  };

  return (
    <div style={{ position: "relative" }}>
      <IconButton
        onClick={removeTodolistLocal}
        disabled={props.todolist.entityStatus === "loading"}
        style={{ position: "absolute", right: "2px", top: "-5px" }}
      >
        <Delete fontSize={"small"} />
      </IconButton>
      <h3>
        <EditableSpan value={props.todolist.title} onChange={changeTodolistTitleLocal} />
      </h3>
      <AddItemForm addItem={addTaskLocal} disabled={props.todolist.entityStatus === "loading"} />
      <div>
        {tasksForTodolist.map((t) => (
          <Task key={t.id} task={t} todolistId={props.todolist.id} />
        ))}
        {!tasksForTodolist.length && <div style={{ padding: "6px", color: "grey" }}>No tasks</div>}
      </div>
      <div
        style={{
          padding: "10px 0 10px 0",
          display: "flex",
          justifyContent: "space-between",
          boxSizing: "border-box",
          flexDirection: "row",
        }}
      >
        <div>{renderFilterButton("all", "inherit", "all")}</div>
        <div>{renderFilterButton("active", "primary", "active")}</div>
        <div>{renderFilterButton("completed", "success", "completed")}</div>
      </div>
    </div>
  );
});
