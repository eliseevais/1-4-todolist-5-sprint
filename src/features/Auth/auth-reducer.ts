import { authAPI, FieldErrorType, LoginParamsType } from "api/todolists-api";
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clearTasksAndTodolists } from "common/actions/common.actions";
import { appActions } from "features/Application";

export const login = createAsyncThunk<
  undefined,
  LoginParamsType,
  { rejectValue: { errors: Array<string>; fieldsErrors?: Array<FieldErrorType> } }
>("auth/login", async (param: LoginParamsType, { dispatch, rejectWithValue }) => {
  dispatch(appActions.setAppStatus({ status: "loading" }));
  try {
    const res = await authAPI.login(param);
    if (res.data.resultCode === 0) {
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      return;
    } else {
      handleServerAppError(res.data, dispatch);
      return rejectWithValue({ errors: res.data.messages, fieldsErrors: res.data.fieldsErrors });
    }
  } catch (error) {
    if (error instanceof Error) {
      handleServerNetworkError(error, dispatch);
      return rejectWithValue({ errors: [error.message], fieldsErrors: undefined });
    }
    return rejectWithValue({ errors: ["unknown error"], fieldsErrors: undefined });
  }
});

export const logout = createAsyncThunk("auth/logout", async (param, { dispatch, rejectWithValue }) => {
  dispatch(appActions.setAppStatus({ status: "loading" }));
  try {
    const res = await authAPI.logout();
    if (res.data.resultCode === 0) {
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      dispatch(clearTasksAndTodolists());
      return;
    } else {
      handleServerAppError(res.data, dispatch);
      return rejectWithValue({});
    }
  } catch (error) {
    if (error instanceof Error) {
      handleServerNetworkError(error, dispatch);
      return rejectWithValue({});
    }
    return rejectWithValue({});
  }
});

export const authAsyncActions = {
  login,
  logout,
};

export const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
  } as InitialStateType,
  reducers: {
    setIsLoggedIn(state, action: PayloadAction<{ isLoggedIn: boolean }>) {
      state.isLoggedIn = action.payload.isLoggedIn;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state) => {
        state.isLoggedIn = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoggedIn = false;
      });
  },
});

export const { setIsLoggedIn } = slice.actions;
export const authActions = slice.actions;

// types
type InitialStateType = {
  isLoggedIn: boolean;
};
