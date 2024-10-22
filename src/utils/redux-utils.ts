import { ActionCreatorsMapObject, bindActionCreators } from "redux";
import { useDispatch } from "react-redux";
import { useMemo } from "react";

import { AppDispatch } from "utils/types";

export const useAppDispatch = () => useDispatch<AppDispatch>();

export function useActions<T extends ActionCreatorsMapObject<any, any[]>>(actions: T) {
  const dispatch = useDispatch();

  const boundActions = useMemo(() => {
    return bindActionCreators(actions, dispatch);
  }, []);
  return boundActions;
}
