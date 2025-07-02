import { configureStore, ThunkAction, UnknownAction } from "@reduxjs/toolkit";
import { AppRootStateType } from "utils/types";
import { rootReducer } from "./reducers";

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, UnknownAction>;

if (process.env.NODE_ENV === "development" && module.hot) {
  module.hot.accept("./reducers", () => {
    store.replaceReducer(rootReducer);
  });
}
