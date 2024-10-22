import { store } from "app/store";
import { FieldErrorType } from "api/todolists-api";
import { rootReducer } from "../app/reducers";

export type RootReducerType = typeof rootReducer;
// определить автоматически тип всего объекта состояния
export type AppRootStateType = ReturnType<RootReducerType>;
export type AppDispatch = typeof store.dispatch;
export type ThunkErrorType = {
  rejectValue: {
    errors: Array<string>;
    fieldsErrors?: Array<FieldErrorType>;
  };
};
