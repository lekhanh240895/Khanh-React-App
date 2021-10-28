import React from 'react'
import * as SC from './style';
export const InputWithLabel = ({
    isFocused,
    children,
    type = "text",
    id,
    value,
    onInputChange,
    checked,
  }) => {
    const inputRef = React.useRef(null);
    React.useEffect(() => {
      if (isFocused && inputRef.current) {
        inputRef.current.focus();
      }
    });
  
    return (
      <>
        <SC.StyledLabel htmlFor={id}> {children}</SC.StyledLabel>
        &nbsp;
        <SC.StyledInput
          id={id}
          type={type}
          value={value}
          onChange={onInputChange}
          ref={inputRef}
          checked={checked}
        ></SC.StyledInput>
      </>
    );
  };