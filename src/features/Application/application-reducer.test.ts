import { AppInitialStateType } from "features/Application/application-reducer";
import { appActions, appReducer } from "features/Application/index";

let startState: AppInitialStateType;

beforeEach(() => {
  startState = {
    error: null,
    status: "idle",
    isInitialized: false,
  };
});

test("correct error message should be set", () => {
  const endState = appReducer(startState, appActions.setAppError({ error: "some error" }));
  expect(endState.error).toBe("some error");
});

test("correct status should be set", () => {
  const endState = appReducer(startState, appActions.setAppStatus({ status: "loading" }));
  expect(endState.status).toBe("loading");
});
