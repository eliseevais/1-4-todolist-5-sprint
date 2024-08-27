import { todolistsAPI, TodolistType } from "api/todolists-api";
import { RequestStatusType, setAppStatus } from "app/app-reducer";
import { handleServerNetworkError } from "utils/error-utils";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clearTasksAndTodolists } from "common/actions/common.actions";

export const fetchTodolistsTC = createAsyncThunk(
  "todolists/fetchTodolists",
  async (param, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setAppStatus({ status: "loading" }));
      const res = await todolistsAPI.getTodolists();
      dispatch(setAppStatus({ status: "succeeded" }));
      return { todolists: res.data };
    } catch (error) {
      if (error instanceof Error) {
        handleServerNetworkError(error, dispatch);
        return rejectWithValue(null);
      }
      return rejectWithValue(null);
    }
  },
);
export const removeTodolistTC = createAsyncThunk(
  "todolists/removeTodolist",
  async (todolistId: string, { dispatch }) => {
    dispatch(setAppStatus({ status: "loading" }));
    dispatch(changeTodolistEntityStatus({ id: todolistId, status: "loading" }));
    const res = await todolistsAPI.deleteTodolist(todolistId);
    dispatch(setAppStatus({ status: "succeeded" }));
    return { id: todolistId };
  },
);

export const addTodolistTC = createAsyncThunk("todolists/addTodolist", async (title: string, { dispatch }) => {
  dispatch(setAppStatus({ status: "loading" }));
  const res = await todolistsAPI.createTodolist(title);
  dispatch(setAppStatus({ status: "succeeded" }));
  return { todolist: res.data.data.item };
});

export const changeTodolistTitleTC = createAsyncThunk(
  "todolists/changeTodolistTitle",
  async (param: { id: string; title: string }, { dispatch }) => {
    const res = todolistsAPI.updateTodolist(param.id, param.title);
    return { id: param.id, title: param.title };
  },
);

const slice = createSlice({
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
      .addCase(fetchTodolistsTC.fulfilled, (state, action) => {
        return action.payload.todolists.map((todo) => ({ ...todo, filter: "all", entityStatus: "idle" }));
      })
      .addCase(removeTodolistTC.fulfilled, (state, action) => {
        const index = state.findIndex((todo) => todo.id === action.payload.id);
        if (index != -1) state.splice(index, 1);
      })
      .addCase(addTodolistTC.fulfilled, (state, action) => {
        state.unshift({ ...action.payload.todolist, filter: "all", entityStatus: "idle" });
      })
      .addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
        const index = state.findIndex((todo) => todo.id === action.payload.id);
        if (index !== -1) {
          state[index].title = action.payload.title;
        }
      });
  },
});

export const todolistsReducer = slice.reducer;
export const { changeTodolistFilter, changeTodolistEntityStatus } = slice.actions;
export const todolistsActions = slice.actions;

// types
export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};
