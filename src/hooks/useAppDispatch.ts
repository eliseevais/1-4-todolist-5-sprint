import { useDispatch } from "react-redux";

import { AppDispatch } from "utils/types";

// export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppDispatch = () => useDispatch<AppDispatch>();
