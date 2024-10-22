import { todolistsAPI, TodolistType } from "api/todolists-api";
import { RequestStatusType } from "features/Application/application-reducer";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clearTasksAndTodolists } from "common/actions/common.actions";
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils";
import { appActions } from "features/Application";
import { ThunkErrorType } from "utils/types";

const fetchTodolists = createAsyncThunk("todolists/fetchTodolists", async (param, { dispatch, rejectWithValue }) => {
  try {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    const res = await todolistsAPI.getTodolists();
    dispatch(appActions.setAppStatus({ status: "succeeded" }));
    return { todolists: res.data };
  } catch (error) {
    if (error instanceof Error) {
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    }
    return rejectWithValue(null);
  }
});
const addTodolist = createAsyncThunk<{ todolist: TodolistType }, string, ThunkErrorType>(
  "todolists/addTodolist",
  async (title: string, { dispatch, rejectWithValue }) => {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    const res = await todolistsAPI.createTodolist(title);
    try {
      if (res.data.resultCode === 0) {
        dispatch(appActions.setAppStatus({ status: "succeeded" }));
        return { todolist: res.data.data.item };
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
const changeTodolistTitle = createAsyncThunk(
  "todolists/changeTodolistTitle",
  async (param: { id: string; title: string }, { dispatch, rejectWithValue }) => {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    const res = await todolistsAPI.updateTodolist(param.id, param.title);

    try {
      if (res.data.resultCode === 0) {
        dispatch(appActions.setAppStatus({ status: "succeeded" }));
        return { id: param.id, title: param.title };
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
const removeTodolist = createAsyncThunk(
  "todolists/removeTodolist",
  async (todolistId: string, { dispatch, rejectWithValue }) => {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    dispatch(changeTodolistEntityStatus({ id: todolistId, status: "loading" }));
    try {
      const res = await todolistsAPI.deleteTodolist(todolistId);
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      return { id: todolistId };
    } catch (error) {
      if (error instanceof Error) {
        handleServerNetworkError(error, dispatch, false);
        return rejectWithValue({ errors: [error.message], fieldsErrors: undefined });
      }
      return rejectWithValue({ errors: ["unknown error"], fieldsErrors: undefined });
    }
  },
);

export const todolistsAsyncActions = {
  fetchTodolists,
  removeTodolist,
  addTodolist,
  changeTodolistTitle,
};
export const slice = createSlice({
  name: "todolists",
  initialState: [] as Array<TodolistDomainType>,
  reducers: {
    changeTodolistFilter: (state, action: PayloadAction<{ id: string; filter: FilterValuesType }>) => {
      const index = state.findIndex((todo) => todo.id === action.payload.id);
      if (index !== -1) {
        state[index].filter = action.payload.filter;
      }
    },
    changeTodolistEntityStatus: (state, action: PayloadAction<{ id: string; status: RequestStatusType }>) => {
      const index = state.findIndex((todo) => todo.id === action.payload.id);
      if (index !== -1) {
        state[index].entityStatus = action.payload.status;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(clearTasksAndTodolists, (state, action) => {
        return [];
      })
      .addCase(fetchTodolists.fulfilled, (state, action) => {
        return action.payload.todolists.map((todo) => ({ ...todo, filter: "all", entityStatus: "idle" }));
      })
      .addCase(removeTodolist.fulfilled, (state, action) => {
        const index = state.findIndex((todo) => todo.id === action.payload.id);
        if (index != -1) state.splice(index, 1);
      })
      .addCase(addTodolist.fulfilled, (state, action) => {
        state.unshift({ ...action.payload.todolist, filter: "all", entityStatus: "idle" });
      })
      .addCase(changeTodolistTitle.fulfilled, (state, action) => {
        const index = state.findIndex((todo) => todo.id === action.payload.id);
        if (index !== -1) {
          state[index].title = action.payload.title;
        }
      });
  },
});

export const { changeTodolistFilter, changeTodolistEntityStatus } = slice.actions;

// types
export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};
