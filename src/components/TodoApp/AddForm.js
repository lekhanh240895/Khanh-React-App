import React from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import * as SC from "./style";

export const AddTodoForm = ({ onAddTodoSubmit, onAddTodoInput }) => (
  <SC.StyledForm onSubmit={onAddTodoSubmit} className="form-row">
    <SC.StyledLabel
      className="form-group"
      htmlFor="addForm"
      style={{
        fontSize: "20px",
        fontWeight: "600",
        textTransform: "capitalize",
      }}
    >
      Add Something:
    </SC.StyledLabel>

    <Row className="form-group">
      <Col xs={9} md={10}>
        <Form.Control
          id="addForm"
          type="text"
          placeholder="What do you want to do?"
          onChange={onAddTodoInput}
        />
      </Col>

      <Col xs={3} md>
        <Button className="btn btn-primary" type="submit">
          Submit
        </Button>
      </Col>
    </Row>
  </SC.StyledForm>
);
