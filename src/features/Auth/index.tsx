import * as authSelectors from "./selectors";
import { Login } from "./Login";
import { authAsyncActions, slice } from "features/Auth/auth-reducer";

const authReducer = slice.reducer;

const authActions = {
  ...authAsyncActions,
  ...slice.actions,
};

export { authSelectors, Login, authActions, authReducer };
