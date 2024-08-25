import { Dispatch } from "redux";
import { authAPI, FieldErrorType, LoginParamsType } from "api/todolists-api";
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { setAppStatus } from "app/app-reducer";
import { clearTasksAndTodolists } from "common/actions/common.actions";

const initialState: InitialStateType = {
  isLoggedIn: false,
};

export const loginTC = createAsyncThunk<
  { isLoggedIn: boolean },
  LoginParamsType,
  {
    rejectValue: { errors: Array<string>; fieldsErrors?: Array<FieldErrorType> };
  }
>("auth/login", async (param: LoginParamsType, thunkAPI) => {
  thunkAPI.dispatch(setAppStatus({ status: "loading" }));
  try {
    const res = await authAPI.login(param);
    if (res.data.resultCode === 0) {
      thunkAPI.dispatch(setAppStatus({ status: "succeeded" }));
      return { isLoggedIn: true };
    } else {
      handleServerAppError(res.data, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue({ errors: res.data.messages, fieldsErrors: res.data.fieldsErrors });
    }
  } catch (error) {
    if (error instanceof Error) {
      handleServerNetworkError(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue({ errors: [error.message], fieldsErrors: undefined });
    }
    return thunkAPI.rejectWithValue({ errors: ["unknown error"], fieldsErrors: undefined });
  }
});

const slice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setIsLoggedIn(state, action: PayloadAction<{ isLoggedIn: boolean }>) {
      state.isLoggedIn = action.payload.isLoggedIn;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginTC.fulfilled, (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn;
    });
  },
});

export const authReducer = slice.reducer;
export const { setIsLoggedIn } = slice.actions;
export const authActions = slice.actions;

// thunks

export const logoutTC = () => (dispatch: Dispatch) => {
  dispatch(setAppStatus({ status: "loading" }));
  authAPI
    .logout()
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(setIsLoggedIn({ isLoggedIn: false }));
        dispatch(clearTasksAndTodolists());
        dispatch(setAppStatus({ status: "succeeded" }));
      } else {
        handleServerAppError(res.data, dispatch);
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch);
    });
};

// types
type InitialStateType = {
  isLoggedIn: boolean;
};
