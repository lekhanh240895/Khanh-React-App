import { InputWithLabel } from "./InputWithLabel";
import React from 'react'
import * as SC from './style';


export const SearchForm = React.memo(
    ({ onSearchSubmit, onSearchInput, searchTerm }) => (
      <SC.StyledSearchForm onSubmit={onSearchSubmit}>
        <InputWithLabel
          onInputChange={onSearchInput}
          value={searchTerm}
          id="search"
          isFocused={true}
        >
          <strong>Search for:</strong>
        </InputWithLabel>
        <SC.StyledButtonLarge type="submit" disabled={!searchTerm}>
          Submit
        </SC.StyledButtonLarge>
      </SC.StyledSearchForm>
    )
  );