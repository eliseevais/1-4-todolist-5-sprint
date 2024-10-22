import { combineReducers } from "redux";
import { appReducer } from "../features/Application";
import { authReducer } from "../features/Auth";
import { tasksReducer, todolistsReducer } from "../features/TodolistsList";

// ❗старая запись, с новыми версиями не работает
//  const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
// export const store = configureStore({ reducer: rootReducer });

export const rootReducer = combineReducers({
  app: appReducer,
  auth: authReducer,
  todolists: todolistsReducer,
  tasks: tasksReducer,
});
