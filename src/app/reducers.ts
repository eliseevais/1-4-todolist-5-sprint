import { combineReducers } from "redux";
import { appReducer } from "../features/Application";
import { authReducer } from "../features/Auth";
import { tasksReducer, todolistsReducer } from "../features/TodolistsList";

export const rootReducer = combineReducers({
  app: appReducer,
  auth: authReducer,
  todolists: todolistsReducer,
  tasks: tasksReducer,
});
