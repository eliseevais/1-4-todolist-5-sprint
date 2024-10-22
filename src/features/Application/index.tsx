import * as appSelectors from "app/selectors";
import { applicationAsyncActions, slice } from "features/Application/application-reducer";

const appReducer = slice.reducer;
const actions = slice.actions;

const appActions = {
  ...actions,
  ...applicationAsyncActions,
};

export { appSelectors, appReducer, appActions };
