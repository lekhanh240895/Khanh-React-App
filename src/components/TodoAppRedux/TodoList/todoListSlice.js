import { createSlice } from "@reduxjs/toolkit";

const todoListSlice = createSlice({
  name: "todoList",
  initialState: [
    { id: 1, title: "delectus aut autem", completed: false, priority: "Low" },
    {
      id: 2,
      title: "quis ut nam facilis et officia qui",
      completed: false,
      priority: "Medium",
    },
    {
      id: 3,
      title: "fugiat veniam minus",
      completed: false,
      priority: "High",
    },
    {
      id: 4,
      title: "et porro tempora",
      completed: false,
      priority: "Low",
    },
    {
      id: 5,
      title:
        "oriosam mollitia et enim quasi adipisci quia provident illumollitia et enim quasi adipisci quia provideci quia provident illumollitia et enim quasi adipisci quia provident i",
      completed: false,
      priority: "Medium",
    },
    {
      id: 6,
      title: "qui ullam ratione quibusdam volud",
      completed: true,
      priority: "Low",
    },
    {
      id: 7,
      title: "illo expedita consequatur quia in",
      completed: true,
      priority: "High",
    },
  ],
  reducers: {
    addTodo: (state, action) => {
      state.push(action.payload);
    },
    toggleTodoStatus: (state, action) => {
      const currentTodo = state.find((todo) => todo.id === action.payload);
      if (currentTodo) {
        currentTodo.completed = !currentTodo.completed;
      }
    },
    removeTodo: (state, action) => {
      const newTodoList = state.filter((todo) => todo.id !== action.payload);
      return newTodoList;
    },
  },
});

export default todoListSlice;
