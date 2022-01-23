import { createSelector } from "@reduxjs/toolkit";

const todoListSelector = (state) => state.todoList;
const searchTextSelector = (state) => state.filters.search;
const filterStatusSelector = (state) => state.filters.status;
const filterPrioritiesSelector = (state) => state.filters.priorities;

export const todoRemainingSelector = createSelector(
  todoListSelector,
  searchTextSelector,
  filterStatusSelector,
  filterPrioritiesSelector,
  (todoList, searchText, status, priorities) => {
    return todoList.filter((todo) => {
      if (status === "All") {
        return !priorities.length
          ? todo.title.toLowerCase().includes(searchText.toLowerCase())
          : todo.title.toLowerCase().includes(searchText.toLowerCase()) &&
              priorities.includes(todo.priority);
      }
      return (
        todo.title.toLowerCase().includes(searchText.toLowerCase()) &&
        (status === "Completed" ? todo.completed : !todo.completed) &&
        (priorities.length ? priorities.includes(todo.priority) : true)
      );
    });
  }
);
