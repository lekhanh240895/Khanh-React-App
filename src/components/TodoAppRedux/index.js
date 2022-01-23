import { Typography, Divider } from "antd";
import Filters from "./Filters";
import TodoList from "./TodoList";

function TodoAppRedux() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: 500,
          boxShadow: "0 0 10px 5px #bfbfbf",
          backgroundColor: "white",
          borderRadius: 5,
          padding: 20,
        }}
      >
        <Typography.Title style={{ textAlign: "center" }}>
          TODO APP WITH REDUX
        </Typography.Title>
        <Filters />
        <Divider />
        <TodoList />
      </div>
    </div>
  );
}

export default TodoAppRedux;
