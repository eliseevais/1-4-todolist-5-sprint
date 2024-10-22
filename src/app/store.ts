import { thunk as thunkMiddleware, ThunkAction } from "redux-thunk";
import { configureStore, UnknownAction } from "@reduxjs/toolkit";
import { AppRootStateType } from "utils/types";
import { rootReducer } from "./reducers";

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunkMiddleware),
});

// ❗ UnknownAction вместо AnyAction
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, UnknownAction>;

if (process.env.NODE_ENV === "development" && module.hot) {
  module.hot.accept("./reducers", () => {
    store.replaceReducer(rootReducer);
  });
}
