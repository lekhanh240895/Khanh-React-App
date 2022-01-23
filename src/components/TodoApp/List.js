import React from "react";
import { sortBy } from "lodash";
import { Button } from "react-bootstrap";

const SORTS = {
  NONE: (list) => list,
  TITLE: (list) => sortBy(list, "title"),
};

export const List = ({
  list,
  onRemoveTodo,
  onCheckedTodo,
  onCheckboxChange,
  UserId,
}) => {
  const [sort, setSort] = React.useState({
    sortKey: "NONE",
    isReversed: false,
  });
  const handleSort = (sortKey) => {
    const isReversed = sort.sortKey === sortKey && !sort.isReversed;
    setSort({ sortKey, isReversed });
  };

  const sortFunction = SORTS[sort.sortKey];
  const sortedList = sort.isReversed
    ? sortFunction(list).reverse()
    : sortFunction(list);

  return (
    <div className="mb-3">
      <div className="mb-3">
        <Button
          variant="success"
          type="button"
          onClick={() => handleSort("TITLE")}
          style={{
            width: "75%",
            textTransform: "uppercase",
            fontSize: "3vw",
            fontWeight: "600",
          }}
        >
          Title
        </Button>

        <Button
          variant="success"
          style={{
            width: "25%",
            textTransform: "uppercase",
            fontSize: "3vw",
            fontWeight: "600",
            pointerEvents: "none",
          }}
        >
          Action
        </Button>
      </div>

      <div className="d-flex justify-content-between">
        <div
          style={{
            fontSize: "20px",
            fontWeight: "600",
            textTransform: "capitalize",
            fontStyle: "italic",
          }}
        >
          User Id: {UserId}
        </div>

        <form>
          <div className="form-check">
            <label htmlFor="markAllTodos" className="form-check-label">
              <span
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  textTransform: "capitalize",
                  fontStyle: "italic",
                  lineHeight: "0.5",
                }}
              >
                Mark all works
              </span>
            </label>
            <input
              className="form-check-input"
              id="markAllTodos"
              type="checkbox"
              onChange={(e) => onCheckboxChange(list, e)}
            />
          </div>
        </form>
      </div>

      <div>
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
    <div className="d-flex justify-content-start align-items-center mb-1">
      <span style={{ width: "5%" }}>
        <input
          className="form-check-input"
          value={todo.title}
          id={todo.id}
          type="checkbox"
          onChange={() => onCheckedTodo(todo)}
          checked={todo.completed}
        />
      </span>

      <span
        className="form-check"
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          textTransform: "capitalize",
          width: "70%",
        }}
      >
        <label className="form-check-label" htmlFor={todo.id}>
          <span>{todo.title}</span>
        </label>
      </span>

      <span style={{ width: "25%", textAlign: "center" }}>
        <button
          className="btn btn-primary"
          type="button"
          onClick={() => onRemoveTodo(todo)}
        >
          Delete
        </button>
      </span>
    </div>
  );
};
