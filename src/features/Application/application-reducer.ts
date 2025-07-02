import { authAPI } from "api/todolists-api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { setIsLoggedIn } from "features/Auth/auth-reducer";

const initializeApp = createAsyncThunk("app/initializeApp", async (param, { dispatch }) => {
  const res = await authAPI.me();
  if (res.data.resultCode === 0) {
    dispatch(setIsLoggedIn({ isLoggedIn: true }));
  } else {
  }
});

export const applicationAsyncActions = {
  initializeApp,
};

export const slice = createSlice({
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
    builder.addCase(initializeApp.fulfilled, (state) => {
      state.isInitialized = true;
    });
  },
});

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";
export type InitialStateType = {
  status: RequestStatusType;
  error: string | null;
  isInitialized: boolean;
};

export type AppInitialStateType = ReturnType<typeof slice.getInitialState>;
