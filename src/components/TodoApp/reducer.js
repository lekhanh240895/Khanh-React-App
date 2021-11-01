export const todoReducer = (state, action) => {
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
        data:
          action.payload.page === 1
            ? action.payload.list
            : state.data.concat(action.payload.list),
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
