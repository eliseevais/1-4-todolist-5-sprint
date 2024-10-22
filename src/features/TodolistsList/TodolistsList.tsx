import React, { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { TodolistDomainType, todolistsAsyncActions } from "./todolists-reducer";
import { TasksStateType } from "./tasks-reducer";
import { Grid, Paper } from "@mui/material";
import { AddItemForm, AddItemFormSubmitHelperType } from "components/AddItemForm/AddItemForm";
import { Todolist } from "./Todolist/Todolist";
import { Navigate } from "react-router-dom";
import { authSelectors } from "features/Auth";
import { todolistsActions } from "features/TodolistsList";
import { useAppDispatch } from "hooks/useAppDispatch";
import { useActions } from "utils/redux-utils";
import { AppRootStateType } from "utils/types";

type PropsType = {
  demo?: boolean;
};

export const TodolistsList: React.FC<PropsType> = ({ demo = false }) => {
  const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>((state) => state.todolists);
  const tasks = useSelector<AppRootStateType, TasksStateType>((state) => state.tasks);
  const isLoggedIn = useSelector(authSelectors.selectIsLoggedIn);
  const { fetchTodolists, addTodolist } = useActions(todolistsActions);

  const dispatch = useAppDispatch();

  const addTodolistLocal = useCallback(async (title: string, helper: AddItemFormSubmitHelperType) => {
    let thunk = todolistsAsyncActions.addTodolist(title);
    const resultAction = await dispatch(thunk);

    if (todolistsAsyncActions.addTodolist.rejected.match(resultAction)) {
      if (resultAction.payload?.errors?.length) {
        const errorMessage = resultAction.payload?.errors[0];
        helper.setError(errorMessage);
      } else {
        helper.setError("Some error occurred");
      }
    } else {
      helper.setTitle("");
    }
  }, []);

  useEffect(() => {
    if (demo || !isLoggedIn) {
      return;
    }
    if (!todolists.length) {
      fetchTodolists();
    }
  }, []);

  if (!isLoggedIn) {
    return <Navigate to={"/login"} />;
  }

  return (
    <>
      <Grid container style={{ padding: "20px" }}>
        <AddItemForm addItem={addTodolistLocal} />
      </Grid>
      <Grid
        container
        spacing={3}
        style={{
          flexWrap: "nowrap",
          overflowY: "scroll",
        }}
      >
        {todolists.map((tl) => {
          let allTodolistTasks = tasks[tl.id];

          return (
            <Grid item key={tl.id}>
              <Paper style={{ padding: "10px", width: "300px" }}>
                <Todolist todolist={tl} tasks={allTodolistTasks} demo={demo} />
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};
