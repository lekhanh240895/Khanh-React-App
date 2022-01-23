import { Col, Radio, Row, Typography, Select, Tag } from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { SearchForm } from "../SearchForm";
import filtersSlice from "./filtersSlice";

export default function Filters() {
  const dispatch = useDispatch();

  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriorities, setFilterPriorities] = useState([]);

  const handleFilterStatusChange = (e) => {
    setFilterStatus(e.target.value);
    dispatch(filtersSlice.actions.statusFilterChange(e.target.value));
  };

  const handleFilterPrioritiesChange = (value) => {
    setFilterPriorities(value);

    dispatch(filtersSlice.actions.prioritiesFilterChange(value));
  };

  return (
    <Row>
      <Col xs={24} style={{ marginBottom: "0.5rem" }}>
        <SearchForm />
      </Col>

      <Col xs={24} style={{ marginBottom: "0.5rem" }}>
        <Typography.Paragraph
          style={{ marginBottom: "0", fontWeight: "500", fontSize: "18px" }}
        >
          Filter By Status
        </Typography.Paragraph>
        <Radio.Group
          name="radiogroup"
          value={filterStatus}
          onChange={handleFilterStatusChange}
        >
          <Radio value="All">All</Radio>
          <Radio value="Completed">Completed</Radio>
          <Radio value="To do">To do</Radio>
        </Radio.Group>
      </Col>

      <Col xs={24}>
        <Typography.Paragraph
          style={{ marginBottom: "0", fontWeight: "500", fontSize: "18px" }}
        >
          Filter By Priority
        </Typography.Paragraph>

        <Select
          mode="multiple"
          allowClear
          style={{ width: "100%" }}
          placeholder="Please select"
          onChange={handleFilterPrioritiesChange}
          value={filterPriorities}
        >
          <Select.Option value="High" label="High">
            <Tag color="red">High</Tag>
          </Select.Option>
          <Select.Option value="Medium" label="Medium">
            <Tag color="blue">Medium</Tag>
          </Select.Option>
          <Select.Option value="Low" label="Low">
            <Tag color="gray">Low</Tag>
          </Select.Option>
        </Select>
      </Col>
    </Row>
  );
}
