import { TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType } from "api/todolists-api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { clearTasksAndTodolists } from "common/actions/common.actions";
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils";
import { appActions } from "features/Application";
import { todolistsAsyncActions } from "features/TodolistsList/todolists-reducer";
import { AppRootStateType, ThunkErrorType } from "utils/types";

const initialState: TasksStateType = {};

const fetchTasks = createAsyncThunk("tasks/fetchTasks", async (todolistId: string, { dispatch, rejectWithValue }) => {
  dispatch(appActions.setAppStatus({ status: "loading" }));
  try {
    let res = await todolistsAPI.getTasks(todolistId);
    const tasks = res.data.items;
    dispatch(appActions.setAppStatus({ status: "succeeded" }));
    return { tasks: tasks, todolistId: todolistId };
  } catch (error) {
    if (error instanceof Error) {
      handleServerNetworkError(error, dispatch, false);
      return rejectWithValue({ errors: [error.message], fieldsErrors: undefined });
    }
    return rejectWithValue({ errors: ["unknown error"], fieldsErrors: undefined });
  }
});
const addTask = createAsyncThunk<TaskType, { title: string; todolistId: string }, ThunkErrorType>(
  "tasks/addTask",
  async (param, { dispatch, rejectWithValue }) => {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    try {
      const res = await todolistsAPI.createTask(param.todolistId, param.title);
      if (res.data.resultCode === 0) {
        dispatch(appActions.setAppStatus({ status: "succeeded" }));
        return res.data.data.item;
      } else {
        handleServerAppError(res.data, dispatch, false);
        return rejectWithValue({ errors: res.data.messages, fieldsErrors: res.data.fieldsErrors });
      }
    } catch (error) {
      if (error instanceof Error) {
        handleServerNetworkError(error, dispatch, false);
        return rejectWithValue({ errors: [error.message], fieldsErrors: undefined });
      }
      return rejectWithValue({ errors: ["unknown error"], fieldsErrors: undefined });
    }
  },
);
const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async (
    param: {
      taskId: string;
      model: UpdateDomainTaskModelType;
      todolistId: string;
    },
    { dispatch, rejectWithValue, getState },
  ) => {
    const state = getState() as AppRootStateType;
    const task = state.tasks[param.todolistId].find((t) => t.id === param.taskId);
    if (!task) {
      return rejectWithValue("task not found in the state");
    }

    const apiModel: UpdateTaskModelType = {
      deadline: task.deadline,
      description: task.description,
      priority: task.priority,
      startDate: task.startDate,
      title: task.title,
      status: task.status,
      ...param.model,
    };

    const res = await todolistsAPI.updateTask(param.todolistId, param.taskId, apiModel);
    try {
      if (res.data.resultCode === 0) {
        return { taskId: param.taskId, model: param.model, todolistId: param.todolistId };
      } else {
        handleServerAppError(res.data, dispatch);
        return rejectWithValue(null);
      }
    } catch (error) {
      if (error instanceof Error) {
        handleServerNetworkError(error, dispatch);
        return rejectWithValue(null);
      }
      return rejectWithValue(null);
    }
  },
);
const removeTask = createAsyncThunk(
  "tasks/removeTask",
  async (param: { taskId: string; todolistId: string }, _thunkAPI) => {
    return todolistsAPI.deleteTask(param.todolistId, param.taskId).then((_res) => {
      return { taskId: param.taskId, todolistId: param.todolistId };
    });
  },
);

export const tasksAsyncActions = {
  fetchTasks,
  addTask,
  updateTask,
  removeTask,
};
export const slice = createSlice({
  name: "tasks",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(todolistsAsyncActions.addTodolist.fulfilled, (state, action) => {
        state[action.payload.todolist.id] = [];
      })
      .addCase(todolistsAsyncActions.removeTodolist.fulfilled, (state, action) => {
        delete state[action.payload.id];
      })
      .addCase(todolistsAsyncActions.fetchTodolists.fulfilled, (state, action) => {
        action.payload.todolists.forEach((tl) => {
          state[tl.id] = [];
        });
      })
      .addCase(clearTasksAndTodolists, (_state, _action) => {
        return {};
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state[action.payload.todolistId] = action.payload.tasks;
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.todolistId];
        const index = tasks.findIndex((t) => t.id === action.payload.taskId);
        if (index !== -1) tasks.splice(index, 1);
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state[action.payload.todoListId].unshift(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.todolistId];
        const index = tasks.findIndex((t) => t.id === action.payload.taskId);
        if (index !== -1) {
          tasks[index] = { ...tasks[index], ...action.payload.model };
        }
      });
  },
});

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
