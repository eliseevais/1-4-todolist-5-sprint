import { TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType } from "api/todolists-api";
import { Dispatch } from "redux";
import { AppRootStateType } from "app/store";
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils";
import { setAppStatus } from "app/app-reducer";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { todolistsActions } from "features/TodolistsList/todolists-reducer";
import { clearTasksAndTodolists } from "common/actions/common.actions";

const initialState: TasksStateType = {};

export const fetchTasksTC = createAsyncThunk("tasks/fetchTasks", async (todolistId: string, thunkAPI) => {
  thunkAPI.dispatch(setAppStatus({ status: "loading" }));
  let res = await todolistsAPI.getTasks(todolistId);
  const tasks = res.data.items;
  thunkAPI.dispatch(setAppStatus({ status: "succeeded" }));
  return { tasks: tasks, todolistId: todolistId };
});

export const removeTaskTC = createAsyncThunk(
  "tasks/removeTask",
  async (param: { taskId: string; todolistId: string }, thunkAPI) => {
    const res = await todolistsAPI.deleteTask(param.todolistId, param.taskId);
    return { taskId: param.taskId, todolistId: param.todolistId };
  },
);

export const addTaskTC = (title: string, todolistId: string) => (dispatch: Dispatch) => {
  dispatch(setAppStatus({ status: "loading" }));
  todolistsAPI
    .createTask(todolistId, title)
    .then((res) => {
      if (res.data.resultCode === 0) {
        const task = res.data.data.item;
        const action = addTask({ task: task });
        dispatch(action);
        dispatch(setAppStatus({ status: "succeeded" }));
      } else {
        handleServerAppError(res.data, dispatch);
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch);
    });
};
export const updateTaskTC =
  (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string) =>
  (dispatch: Dispatch, getState: () => AppRootStateType) => {
    const state = getState();
    const task = state.tasks[todolistId].find((t) => t.id === taskId);
    if (!task) {
      //throw new Error("task not found in the state");
      console.warn("task not found in the state");
      return;
    }

    const apiModel: UpdateTaskModelType = {
      deadline: task.deadline,
      description: task.description,
      priority: task.priority,
      startDate: task.startDate,
      title: task.title,
      status: task.status,
      ...domainModel,
    };

    todolistsAPI
      .updateTask(todolistId, taskId, apiModel)
      .then((res) => {
        if (res.data.resultCode === 0) {
          const action = updateTask({ taskId: taskId, model: domainModel, todolistId: todolistId });
          dispatch(action);
        } else {
          handleServerAppError(res.data, dispatch);
        }
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch);
      });
  };

const slice = createSlice({
  name: "tasks",
  initialState: initialState,
  reducers: {
    addTask: (state, action: PayloadAction<{ task: TaskType }>) => {
      const tasks = state[action.payload.task.todoListId];
      tasks.unshift(action.payload.task);
    },
    updateTask: (
      state,
      action: PayloadAction<{ taskId: string; model: UpdateDomainTaskModelType; todolistId: string }>,
    ) => {
      const tasks = state[action.payload.todolistId];
      const index = tasks.findIndex((t) => t.id === action.payload.taskId);
      if (index !== -1) {
        tasks[index] = { ...tasks[index], ...action.payload.model };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(todolistsActions.addTodolist, (state, action) => {
        state[action.payload.todolist.id] = [];
      })
      .addCase(todolistsActions.removeTodolist, (state, action) => {
        delete state[action.payload.id];
      })
      .addCase(todolistsActions.setTodolists, (state, action) => {
        action.payload.todolists.forEach((tl) => {
          state[tl.id] = [];
        });
      })
      .addCase(clearTasksAndTodolists, (state, action) => {
        return {};
      })
      .addCase(fetchTasksTC.fulfilled, (state, action) => {
        state[action.payload.todolistId] = action.payload.tasks;
      })
      .addCase(removeTaskTC.fulfilled, (state, action) => {
        const tasks = state[action.payload.todolistId];
        const index = tasks.findIndex((t) => t.id === action.payload.taskId);
        if (index !== -1) tasks.splice(index, 1);
      });
  },
});
export const tasksReducer = slice.reducer;
export const { addTask, updateTask } = slice.actions;

// types
export type UpdateDomainTaskModelType = {
  title?: string;
  description?: string;
  status?: TaskStatuses;
  priority?: TaskPriorities;
  startDate?: string;
  deadline?: string;
};
export type TasksStateType = {
  [key: string]: Array<TaskType>;
};
