import { TasksStateType } from "./tasks-reducer";
import { TaskPriorities, TaskStatuses } from "api/todolists-api";
import { tasksActions, tasksReducer } from "features/TodolistsList";
import { todolistsActions } from "features/TodolistsList";

let startState: TasksStateType = {};
beforeEach(() => {
  startState = {
    todolistId1: [
      {
        id: "1",
        title: "CSS",
        status: TaskStatuses.New,
        todoListId: "todolistId1",
        description: "",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPriorities.Low,
      },
      {
        id: "2",
        title: "JS",
        status: TaskStatuses.Completed,
        todoListId: "todolistId1",
        description: "",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPriorities.Low,
      },
      {
        id: "3",
        title: "React",
        status: TaskStatuses.New,
        todoListId: "todolistId1",
        description: "",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPriorities.Low,
      },
    ],
    todolistId2: [
      {
        id: "1",
        title: "bread",
        status: TaskStatuses.New,
        todoListId: "todolistId2",
        description: "",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPriorities.Low,
      },
      {
        id: "2",
        title: "milk",
        status: TaskStatuses.Completed,
        todoListId: "todolistId2",
        description: "",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPriorities.Low,
      },
      {
        id: "3",
        title: "tea",
        status: TaskStatuses.New,
        todoListId: "todolistId2",
        description: "",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPriorities.Low,
      },
    ],
  };
});

test("correct task should be deleted from correct array", () => {
  const params = { taskId: "2", todolistId: "todolistId2" };
  const action = tasksActions.removeTask.fulfilled({ taskId: "2", todolistId: "todolistId2" }, "requestId", params);

  const endState = tasksReducer(startState, action);

  expect(endState["todolistId1"].length).toBe(3);
  expect(endState["todolistId2"].length).toBe(2);
  expect(endState["todolistId2"].every((t) => t.id != "2")).toBeTruthy();
});
test("correct task should be added to correct array", () => {
  const task = {
    todoListId: "todolistId2",
    title: "juice",
    status: TaskStatuses.New,
    addedDate: "",
    deadline: "",
    description: "",
    order: 0,
    priority: 0,
    startDate: "",
    id: "id exists",
  };
  const action = tasksActions.addTask.fulfilled(task, "requestId", {
    title: task.title,
    todolistId: task.todoListId,
  });

  const endState = tasksReducer(startState, action);

  expect(endState["todolistId1"].length).toBe(3);
  expect(endState["todolistId2"].length).toBe(4);
  expect(endState["todolistId2"][0].id).toBeDefined();
  expect(endState["todolistId2"][0].title).toBe("juice");
  expect(endState["todolistId2"][0].status).toBe(TaskStatuses.New);
});
test("status of specified task should be changed", () => {
  const task = {
    taskId: "2",
    model: { status: TaskStatuses.New },
    todolistId: "todolistId2",
  };
  const action = tasksActions.updateTask.fulfilled(task, "requestId", task);

  const endState = tasksReducer(startState, action);

  expect(endState["todolistId1"][1].status).toBe(TaskStatuses.Completed);
  expect(endState["todolistId2"][1].status).toBe(TaskStatuses.New);
});
test("title of specified task should be changed", () => {
  const task = {
    taskId: "2",
    model: {
      title: "yogurt",
    },
    todolistId: "todolistId2",
  };
  const action = tasksActions.updateTask.fulfilled(task, "requestId", task);

  const endState = tasksReducer(startState, action);

  expect(endState["todolistId1"][1].title).toBe("JS");
  expect(endState["todolistId2"][1].title).toBe("yogurt");
  expect(endState["todolistId2"][0].title).toBe("bread");
});
test("new array should be added when new todolist is added", () => {
  const param = {
    id: "blabla",
    title: "new todolist",
    order: 0,
    addedDate: "",
  };
  const action = todolistsActions.addTodolist.fulfilled({ todolist: param }, "requestId", "blabla");

  const endState = tasksReducer(startState, action);

  const keys = Object.keys(endState);
  const newKey = keys.find((k) => k != "todolistId1" && k != "todolistId2");
  if (!newKey) {
    throw Error("new key should be added");
  }

  expect(keys.length).toBe(3);
  expect(endState[newKey]).toEqual([]);
});
test("propertry with todolistId should be deleted", () => {
  const action = todolistsActions.removeTodolist.fulfilled({ id: "todolistId2" }, "requestId", "todolistId2");

  const endState = tasksReducer(startState, action);

  const keys = Object.keys(endState);

  expect(keys.length).toBe(1);
  expect(endState["todolistId2"]).not.toBeDefined();
});

test("empty arrays should be added when we set todolists", () => {
  const todolistsPayload = [
    { id: "1", title: "title 1", order: 0, addedDate: "" },
    {
      id: "2",
      title: "title 2",
      order: 0,
      addedDate: "",
    },
  ];
  const action = todolistsActions.fetchTodolists.fulfilled(
    {
      todolists: todolistsPayload,
    },
    "requestId",
  );

  const endState = tasksReducer({}, action);

  const keys = Object.keys(endState);

  expect(keys.length).toBe(2);
  expect(endState["1"]).toBeDefined();
  expect(endState["2"]).toBeDefined();
});
test("tasks should be added for todolist", () => {
  const params = { tasks: startState["todolistId1"], todolistId: "todolistId1" };
  const action = tasksActions.fetchTasks.fulfilled(params, "requestId", "todolistId1");

  const endState = tasksReducer(
    {
      todolistId2: [],
      todolistId1: [],
    },
    action,
  );

  expect(endState["todolistId1"].length).toBe(3);
  expect(endState["todolistId2"].length).toBe(0);
});
