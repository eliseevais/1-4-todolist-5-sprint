import { useSelector } from "react-redux";
import { useCallback } from "react";
import { useAppDispatch } from "hooks/useAppDispatch";
import { changeTodolistFilter, FilterValuesType, TodolistDomainType } from "features/TodolistsList/todolists-reducer";
import { TasksStateType } from "features/TodolistsList/tasks-reducer";
import { TaskStatuses } from "api/todolists-api";
import { tasksActions, todolistsActions } from "features/TodolistsList";
import { useActions } from "utils/redux-utils";
import { AppRootStateType } from "utils/types";

export const useApp = () => {
  const dispatch = useAppDispatch();

  const { removeTodolist, changeTodolistTitle, addTodolist } = useActions(todolistsActions);

  const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>((state) => state.todolists);
  const tasksObj = useSelector<AppRootStateType, TasksStateType>((state) => state.tasks);

  const removeTask = useCallback((taskId: string, todoListId: string) => {
    const thunk = tasksActions.removeTask({ taskId, todolistId: todoListId });
    dispatch(thunk);
  }, []);

  const addTask = useCallback((title: string, todoListId: string) => {
    const thunk = tasksActions.addTask({ title, todolistId: todoListId });
    dispatch(thunk);
  }, []);

  const changeTaskStatus = useCallback((taskId: string, status: TaskStatuses, todoListId: string) => {
    const thunk = tasksActions.updateTask({ taskId, model: { status }, todolistId: todoListId });
    dispatch(thunk);
  }, []);

  const changeTaskTitle = useCallback((taskId: string, title: string, todoListId: string) => {
    const thunk = tasksActions.updateTask({ taskId, model: { title }, todolistId: todoListId });
    dispatch(thunk);
  }, []);

  const changeFilter = useCallback((filter: FilterValuesType, id: string) => {
    const action = changeTodolistFilter({ filter, id });
    dispatch(action);
  }, []);

  const removeTodolistLocal = useCallback((id: string) => {
    const thunk = removeTodolist(id);
    dispatch(thunk);
  }, []);

  const changeTodolistTitleLocal = useCallback((id: string, title: string) => {
    const thunk = changeTodolistTitle({ id, title });
    dispatch(thunk);
  }, []);

  const addTodoList = useCallback(
    (title: string) => {
      const thunk = addTodolist(title);
      dispatch(thunk);
    },
    [dispatch],
  );

  return {
    tasksObj,
    todolists,
    addTodoList,
    removeTask,
    changeFilter,
    addTask,
    changeTaskStatus,
    changeTaskTitle,
    removeTodolistLocal,
    changeTodolistTitleLocal,
  };
};
