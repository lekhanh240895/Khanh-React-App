import { Checkbox, Col, Row, Tag } from "antd";
import React, { useState } from "react";
import todoListSlice from "../TodoList/todoListSlice";
import { useDispatch } from "react-redux";
import { DeleteOutlined } from "@ant-design/icons";

const priorityColorMapping = {
  High: "red",
  Medium: "blue",
  Low: "gray",
};

export default function Todo({ title, priority, completed, id }) {
  const [checked, setChecked] = useState(completed);
  const dispatch = useDispatch();

  const toggleCheckbox = () => {
    setChecked(!checked);

    dispatch(todoListSlice.actions.toggleTodoStatus(id));
  };

  const handleRemoveTodo = () => {
    dispatch(todoListSlice.actions.removeTodo(id));
  };

  return (
    <Row
      style={{
        marginBottom: 3,
        ...(checked ? { opacity: 0.5, textDecoration: "line-through" } : {}),
      }}
    >
      <Col
        span={18}
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxHeight: "50px",
        }}
      >
        <Checkbox checked={checked} onChange={toggleCheckbox}>
          {title}
        </Checkbox>
      </Col>

      <Col span={1}>
        <DeleteOutlined onClick={handleRemoveTodo} />
      </Col>

      <Col span={5} style={{ textAlign: "right" }}>
        <Tag color={priorityColorMapping[priority]} style={{ margin: 0 }}>
          {priority}
        </Tag>
      </Col>
    </Row>
  );
}
