import { useSelector } from "react-redux";
import { AppRootStateType } from "../store";
import { useCallback } from "react";
import { useAppDispatch } from "hooks/useAppDispatch";
import {
  addTodolistTC,
  changeTodolistFilter,
  changeTodolistTitleTC,
  FilterValuesType,
  removeTodolistTC,
  TodolistDomainType,
} from "features/TodolistsList/todolists-reducer";
import { addTaskTC, removeTaskTC, TasksStateType, updateTaskTC } from "features/TodolistsList/tasks-reducer";
import { TaskStatuses } from "api/todolists-api";

export const useApp = () => {
  const dispatch = useAppDispatch();
  const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>((state) => state.todolists);
  const tasksObj = useSelector<AppRootStateType, TasksStateType>((state) => state.tasks);

  const removeTask = useCallback((taskId: string, todoListId: string) => {
    const thunk = removeTaskTC({ taskId, todolistId: todoListId });
    dispatch(thunk);
  }, []);

  const addTask = useCallback((title: string, todoListId: string) => {
    const thunk = addTaskTC(title, todoListId);
    dispatch(thunk);
  }, []);

  const changeTaskStatus = useCallback((taskId: string, status: TaskStatuses, todoListId: string) => {
    const thunk = updateTaskTC(taskId, { status: status }, todoListId);
    dispatch(thunk);
  }, []);

  const changeTaskTitle = useCallback((taskId: string, newTitle: string, todoListId: string) => {
    const thunk = updateTaskTC(taskId, { title: newTitle }, todoListId);
    dispatch(thunk);
  }, []);

  const changeFilter = useCallback((filter: FilterValuesType, id: string) => {
    const action = changeTodolistFilter({ filter, id });
    dispatch(action);
  }, []);

  const removeTodolist = useCallback((id: string) => {
    const thunk = removeTodolistTC(id);
    dispatch(thunk);
  }, []);

  const changeTodolistTitle = useCallback((id: string, title: string) => {
    const thunk = changeTodolistTitleTC(id, title);
    dispatch(thunk);
  }, []);

  const addTodoList = useCallback(
    (title: string) => {
      const thunk = addTodolistTC(title);
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
    removeTodolist,
    changeTodolistTitle,
  };
};
