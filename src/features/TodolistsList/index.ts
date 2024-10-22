import { slice as tasksSlice, tasksAsyncActions as tasksAsyncActionsIndex } from "./tasks-reducer";
import { slice as todolistsSlice, todolistsAsyncActions as todolistsAsyncActionsIndex } from "./todolists-reducer";
import { TodolistsList } from "features/TodolistsList/TodolistsList";

const todolistsReducer = todolistsSlice.reducer;
const tasksReducer = tasksSlice.reducer;

const todolistsActions = {
  ...todolistsAsyncActionsIndex,
  ...todolistsSlice.actions,
};

const tasksActions = {
  ...tasksAsyncActionsIndex,
  ...tasksSlice.actions,
};

export { tasksActions, todolistsActions, TodolistsList, todolistsReducer, tasksReducer };
