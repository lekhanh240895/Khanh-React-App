import React, { useState } from "react";
import { Button, Form, Input, Select, Tag } from "antd";
import { v1 as uuidv1 } from "uuid";
import todoListSlice from "../TodoList/todoListSlice";
import { useDispatch } from "react-redux";

export const AddTodoForm = () => {
  const handleTodoQueryChange = (e) => {
    setTodoQuery(e.target.value);
  };

  const dispatch = useDispatch();
  const [todoQuery, setTodoQuery] = useState("");
  const [todoPriority, setTodoPriority] = useState("High");
  const [form] = Form.useForm();

  const handleTodoPriorityChange = (value) => setTodoPriority(value);

  const handleAddTodo = () => {
    dispatch(
      todoListSlice.actions.addTodo({
        id: uuidv1(),
        title: todoQuery,
        completed: false,
        priority: todoPriority,
      })
    );

    form.resetFields();
  };

  return (
    <Form onFinish={handleAddTodo} form={form} style={{ display: "flex" }}>
      <Form.Item name="todoQuery" style={{ flexGrow: 1 }}>
        <Input
          placeholder="Type your work here"
          onChange={handleTodoQueryChange}
          value={todoQuery}
          required
        />
      </Form.Item>
      <Form.Item>
        <Select
          onChange={handleTodoPriorityChange}
          value={todoPriority}
          name="priorities"
        >
          <Select.Option value="High">
            <Tag color="red">High</Tag>
          </Select.Option>
          <Select.Option value="Medium">
            <Tag color="blue">Medium</Tag>
          </Select.Option>
          <Select.Option value="Low">
            <Tag color="gray">Low</Tag>
          </Select.Option>
        </Select>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Add
        </Button>
      </Form.Item>
    </Form>
  );
};
