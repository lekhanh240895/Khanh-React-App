import { Col, Row } from "antd";
import React from "react";
import Todo from "../Todo";

import { useSelector } from "react-redux";

import { AddTodoForm } from "../AddTodoForm";
import { todoRemainingSelector } from "../../../redux/selectors";

const TodoList = () => {
  const todoList = useSelector(todoRemainingSelector);

  return (
    <Row style={{ height: "30vh" }}>
      <Col
        xs={24}
        style={{
          height: "calc(30vh - 25px)",
          overflowY: "auto",
          overflowX: "hidden",
          paddingBottom: 10,
        }}
      >
        {todoList.map((todo) => (
          <Todo
            key={todo.id}
            title={todo.title}
            priority={todo.priority}
            id={todo.id}
            completed={todo.completed}
          />
        ))}
      </Col>

      <Col xs={24}>
        <AddTodoForm />
      </Col>
    </Row>
  );
};

export default TodoList;
