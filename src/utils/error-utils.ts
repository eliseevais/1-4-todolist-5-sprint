import { ResponseType } from "api/todolists-api";
import { Dispatch } from "redux";
import { appActions } from "features/Application";

export const handleServerAppError = <D>(data: ResponseType<D>, dispatch: Dispatch, showError = true) => {
  if (showError) {
    dispatch(appActions.setAppError({ error: data.messages.length ? data.messages[0] : "Some error occurred" }));
  }
  dispatch(appActions.setAppStatus({ status: "failed" }));
};

export const handleServerNetworkError = (error: { message: string }, dispatch: Dispatch, showError = true) => {
  if (showError) {
    dispatch(appActions.setAppError({ error: error.message ? error.message : "Some error occurred" }));
  }
  dispatch(appActions.setAppStatus({ status: "failed" }));
};
