import { TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType } from "api/todolists-api";
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils";
import { setAppStatus } from "app/app-reducer";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addTodolistTC,
  fetchTodolistsTC,
  removeTodolistTC,
  todolistsActions,
} from "features/TodolistsList/todolists-reducer";
import { clearTasksAndTodolists } from "common/actions/common.actions";
import { AppRootStateType } from "app/store";

const initialState: TasksStateType = {};

export const fetchTasksTC = createAsyncThunk("tasks/fetchTasks", async (todolistId: string, { dispatch }) => {
  dispatch(setAppStatus({ status: "loading" }));
  let res = await todolistsAPI.getTasks(todolistId);
  const tasks = res.data.items;
  dispatch(setAppStatus({ status: "succeeded" }));
  return { tasks: tasks, todolistId: todolistId };
});

export const removeTaskTC = createAsyncThunk(
  "tasks/removeTask",
  async (param: { taskId: string; todolistId: string }, thunkAPI) => {
    return todolistsAPI.deleteTask(param.todolistId, param.taskId).then((res) => {
      return { taskId: param.taskId, todolistId: param.todolistId };
    });
  },
);

export const addTaskTC = createAsyncThunk(
  "tasks/addTask",
  async (param: { title: string; todolistId: string }, { dispatch, rejectWithValue }) => {
    dispatch(setAppStatus({ status: "loading" }));
    try {
      const res = await todolistsAPI.createTask(param.todolistId, param.title);
      if (res.data.resultCode === 0) {
        dispatch(setAppStatus({ status: "succeeded" }));
        return res.data.data.item;
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

export const updateTaskTC = createAsyncThunk(
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

const slice = createSlice({
  name: "tasks",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addTodolistTC.fulfilled, (state, action) => {
        state[action.payload.todolist.id] = [];
      })
      .addCase(removeTodolistTC.fulfilled, (state, action) => {
        delete state[action.payload.id];
      })
      .addCase(fetchTodolistsTC.fulfilled, (state, action) => {
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
      })
      .addCase(addTaskTC.fulfilled, (state, action) => {
        state[action.payload.todoListId].unshift(action.payload);
      })
      .addCase(updateTaskTC.fulfilled, (state, action) => {
        const tasks = state[action.payload.todolistId];
        const index = tasks.findIndex((t) => t.id === action.payload.taskId);
        if (index !== -1) {
          tasks[index] = { ...tasks[index], ...action.payload.model };
        }
      });
  },
});
export const tasksReducer = slice.reducer;

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
