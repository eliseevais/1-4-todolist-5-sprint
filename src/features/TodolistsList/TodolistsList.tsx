import React, { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { Grid, Paper } from "@mui/material";
import { AppRootStateType } from "utils/types";
import { TodolistDomainType, todolistsAsyncActions } from "./todolists-reducer";
import { TasksStateType } from "./tasks-reducer";
import { AddItemForm, AddItemFormSubmitHelperType } from "components/AddItemForm/AddItemForm";
import { Todolist } from "./Todolist/Todolist";
import { Navigate } from "react-router-dom";
import { useAppDispatch } from "hooks/useAppDispatch";
import { useActions } from "utils/redux-utils";
import { authSelectors } from "features/Auth";
import { todolistsActions } from "features/TodolistsList";

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
      <Grid
        container
        style={{
          padding: "20px 0 0 0",
          width: "1080px",
          margin: "0 auto",
          boxSizing: "border-box",
        }}
      >
        <AddItemForm addItem={addTodolistLocal} />
      </Grid>
      <Grid
        container
        spacing={3}
        sx={{ minWidth: "100%" }}
        style={{
          // flexWrap: "nowrap",
          // overflowY: "scroll",
          flexWrap: "wrap",
          width: "1080px",
          margin: "0 auto",
          justifyContent: "flex-start",
          padding: "10px",
          boxSizing: "border-box",
        }}
      >
        {todolists.map((tl) => {
          let allTodolistTasks = tasks[tl.id];

          return (
            <Grid item key={tl.id} style={{ padding: "12px" }}>
              <Paper
                style={{
                  padding: "16px",
                  width: "350px",
                  margin: "0 auto",
                  justifyContent: "center",
                  boxSizing: "border-box",
                }}
              >
                <Todolist todolist={tl} tasks={allTodolistTasks} demo={demo} />
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};
