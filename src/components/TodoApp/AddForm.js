import React from "react";
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

    <div className="row form-group">
      <div className="col-10" style={{ marginRight: "-0.75rem" }}>
        <input
          className="form-control"
          id="addForm"
          type="text"
          placeholder="What do you want to do?"
          onChange={onAddTodoInput}
          
        />
      </div>

      <div className="col-2">
        <button className="btn btn-primary" type="submit">
          Submit
        </button>
      </div>
    </div>
  </SC.StyledForm>
);
