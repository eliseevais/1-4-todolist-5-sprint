import { Dispatch } from "redux";
import { authAPI } from "api/todolists-api";
import { setIsLoggedIn } from "features/Login/auth-reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: InitialStateType = {
  status: "idle",
  error: null,
  isInitialized: false,
};

const slice = createSlice({
  name: "app",
  initialState: initialState,
  reducers: {
    setAppStatus: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
      state.status = action.payload.status;
    },
    setAppError: (state, action: PayloadAction<{ error: null | string }>) => {
      state.error = action.payload.error;
    },
    setAppInitialized: (state, action: PayloadAction<{ isInitialized: boolean }>) => {
      state.isInitialized = action.payload.isInitialized;
    },
  },
});

export const appReducer = slice.reducer;
export const { setAppStatus, setAppError, setAppInitialized } = slice.actions;
export const appActions = slice.actions;

// types
export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";
export type InitialStateType = {
  // происходит ли сейчас взаимодействие с сервером
  status: RequestStatusType;
  // если ошибка какая-то глобальная произойдёт - мы запишем текст ошибки сюда
  error: string | null;
  // true когда приложение проинициализировалось (проверили юзера, настройки получили и т.д.)
  isInitialized: boolean;
};

export type AppInitialStateType = ReturnType<typeof slice.getInitialState>;

export const initializeAppTC = () => (dispatch: Dispatch) => {
  authAPI.me().then((res) => {
    if (res.data.resultCode === 0) {
      dispatch(setIsLoggedIn({ isLoggedIn: true }));
    } else {
    }

    dispatch(setAppInitialized({ isInitialized: true }));
  });
};
