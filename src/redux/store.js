import { configureStore } from "@reduxjs/toolkit";
import filtersSlice from "../components/TodoAppRedux/Filters/filtersSlice";
import todoListSlice from "../components/TodoAppRedux/TodoList/todoListSlice";

const store = configureStore({
  reducer: {
    filters: filtersSlice.reducer,
    todoList: todoListSlice.reducer,
  },
});

export default store;
