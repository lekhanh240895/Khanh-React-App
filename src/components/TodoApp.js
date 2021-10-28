import React, { useEffect, useReducer, useState } from "react";
import axios from "axios";
import { sortBy } from "lodash";

const todoReducer = (state, action) => {
  switch (action.type) {
    case "TODOS_FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case "TODOS_FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case "TODOS_FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case "DO_TODO":
      return {
        ...state,
        data: state.data.map((todo) => {
          if (todo.id === action.id) {
            return { ...todo, completed: true };
          } else {
            return todo;
          }
        }),
      };
    case "UNDO_TODO":
      return {
        ...state,
        data: state.data.map((todo) => {
          if (todo.id === action.id) {
            return { ...todo, completed: false };
          } else {
            return todo;
          }
        }),
      };
    case "REMOVE_TODO":
      return {
        ...state,
        data: state.data.filter((todo) => todo.id !== action.payload.id),
      };

    case "ADD_TODO":
      return {
        ...state,
        data: state.data.concat({
          id: Math.random(),
          title: action.payload,
          completed: false,
        }),
      };
    case "MARK_ALL_TODOS":
      return {
        ...state,
        data: state.data.map((todo) => {
          return {
            ...todo,
            completed: true,
          };
        }),
      };
    case "UNMARK_ALL_TODOS":
      return {
        ...state,
        data: state.data.map((todo) => {
          return {
            ...todo,
            completed: false,
          };
        }),
      };
    default:
      return state;
  }
};

const TodoApp = () => {
  const [todos, dispatchTodos] = useReducer(todoReducer, {
    data: [],
    isLoading: false,
    isError: false,
  });
  const sum_todos = todos.data.length;
  const [unDoneTodos, setUnDoneTodos] = useState(0);
  const [todoQuery, setTodoQuery] = useState("");

  const handleFetchTodos = React.useCallback(async () => {
    dispatchTodos({
      type: "TODOS_FETCH_INIT",
    });

    try {
      const respone = await axios.get(
        `https://jsonplaceholder.typicode.com/todos`
      );
      setTimeout(
        () =>
          dispatchTodos({
            type: "TODOS_FETCH_SUCCESS",
            payload: respone.data,
          }),
        2000
      );
    } catch {
      dispatchTodos({
        type: "TODOS_FETCH_FAILURE",
      });
    }
  }, []);

  useEffect(() => handleFetchTodos(), [handleFetchTodos]);

  useEffect(() => {
    setUnDoneTodos(
      todos.data.filter((todo) => todo.completed === false).length
    );
  }, [todos]);

  const handleCheckedTodo = (todo) => {
    dispatchTodos({
      type: todo.completed ? "UNDO_TODO" : "DO_TODO",
      id: todo.id,
    });
  };

  const handleRemoveTodo = (todo) => {
    dispatchTodos({
      type: "REMOVE_TODO",
      payload: todo,
    });
  };

  const handleAddTodo = (todoQuery) => {
    dispatchTodos({
      type: "ADD_TODO",
      payload: todoQuery,
    });
  };

  const handleAddTodoInput = (e) => {
    setTodoQuery(e.target.value);
  };

  const handleAddTodoSubmit = (e) => {
    e.preventDefault();
    handleAddTodo(todoQuery);
  };

  const handleCheckboxChange = (list, e) =>
    dispatchTodos({
      type: e.target.checked ? "MARK_ALL_TODOS" : "UNMARK_ALL_TODOS",
      payload: list,
    });

  return (
    <div>
      <h1
        style={{
          textAlign: "center",
          fontWeight: "700",
          fontSize: "48px",
        }}
      >
        My Todo with {sum_todos} works.
      </h1>
      <p>{unDoneTodos} Works uncompleted! </p>
      {todos.isError && <p>Oops! Something went wrong</p>}

      {todos.isLoading ? (
        <p>Loading...</p>
      ) : (
        <List
          list={todos.data}
          onRemoveTodo={handleRemoveTodo}
          onCheckedTodo={handleCheckedTodo}
          onCheckboxChange={handleCheckboxChange}
        />
      )}

      <AddTodoForm
        onAddTodoInput={handleAddTodoInput}
        onAddTodoSubmit={handleAddTodoSubmit}
      >
        Add your work:
      </AddTodoForm>
    </div>
  );
};
export default TodoApp;

const InputWithLabel = ({
  isFocused,
  checked,
  value,
  type = "text",
  id,
  children,
  onInputChange,
}) => {
  const inputRef = React.useRef(null);
  if (isFocused && inputRef.current) {
    inputRef.current.focus();
  }

  return (
    <div style={{ display: "flex", width: "90%" }}>
      <label
        style={{ width: "70%", margin: "10px", textTransform: "capitalize" }}
        htmlFor={id}
      >
        {children}
      </label>
      &nbsp;
      <input
        style={{ width: "20%" }}
        value={value}
        id={id}
        type={type}
        onChange={onInputChange}
        checked={checked}
        ref={inputRef}
      />
    </div>
  );
};

const AddTodoForm = ({ onAddTodoSubmit, onAddTodoInput }) => (
  <form onSubmit={onAddTodoSubmit} style={{ fontSize: "20px" }}>
    <label style={{ fontWeight: "600" }} htmlFor="add">
      Add your work:
    </label>
    &nbsp;
    <input
      style={{ padding: "5px" }}
      id="add"
      type="text"
      onChange={onAddTodoInput}
    />
    <button type="submit" style={{ padding: "5px 10px" }}>
      Add
    </button>
  </form>
);

const SORTS = {
  NONE: (list) => list,
  TITLE: (list) => sortBy(list, "title"),
};

const List = ({ list, onRemoveTodo, onCheckedTodo, onCheckboxChange }) => {
  const [sort, setSort] = useState("NONE");
  const handleSort = (sortKey) => {
    setSort(sortKey);
  };

  const sortFunction = SORTS[sort];
  const sortedList = sortFunction(list);

  return (
    <div>
      <div>
        <label htmlFor="markAllTodos">
          <input
            id="markAllTodos"
            type="checkbox"
            onChange={(e) => onCheckboxChange(list, e)}
          />

          <span>Mark all works</span>
        </label>
      </div>

      <div>
        <button type="button" onClick={() => handleSort("TITLE")}>
          Sort List
        </button>
      </div>
      
      <div style={{ listStyle: "none" }}>
        {sortedList.map((todo) => (
          <Item
            todo={todo}
            onRemoveTodo={onRemoveTodo}
            onCheckedTodo={onCheckedTodo}
            key={todo.id}
          />
        ))}
      </div>
    </div>
  );
};

const Item = ({ todo, onRemoveTodo, onCheckedTodo }) => {
  return (
    <div style={{ display: "flex", margin: "10px" }}>
      <button
        style={{
          padding: "5px",
          margin: "5px",
          width: "10%",
        }}
        onClick={() => onRemoveTodo(todo)}
      >
        Delete
      </button>

      <InputWithLabel
        id={todo.id}
        value={todo.title}
        checked={todo.completed}
        type="checkbox"
        onInputChange={() => onCheckedTodo(todo)}
      >
        <span>{todo.title}</span>
      </InputWithLabel>
    </div>
  );
};
