import { authAPI } from "api/todolists-api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { setIsLoggedIn } from "features/Login/auth-reducer";

export const initializeAppTC = createAsyncThunk("app/initializeApp", async (param, { dispatch }) => {
  const res = await authAPI.me();
  if (res.data.resultCode === 0) {
    dispatch(setIsLoggedIn({ isLoggedIn: true }));
  } else {
  }
});

const slice = createSlice({
  name: "app",
  initialState: {
    status: "idle",
    error: null,
    isInitialized: false,
  } as InitialStateType,
  reducers: {
    setAppStatus: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
      state.status = action.payload.status;
    },
    setAppError: (state, action: PayloadAction<{ error: null | string }>) => {
      state.error = action.payload.error;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(initializeAppTC.fulfilled, (state) => {
      state.isInitialized = true;
    });
  },
});

export const appReducer = slice.reducer;
export const { setAppStatus, setAppError } = slice.actions;
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
