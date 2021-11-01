import React from 'react'

export const InputWithLabel = ({
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
          style={{ width: "30%" }}
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