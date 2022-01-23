import React, { useState } from "react";
import { Typography, Input } from "antd";
import filtersSlice from "../Filters/filtersSlice";
import { useDispatch } from "react-redux";

export const SearchForm = () => {
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch();

  const handleSearchTextChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleSearch = () => {
    dispatch(filtersSlice.actions.searchFilterChange(searchText));
  };

  return (
    <>
      <Typography.Text style={{ fontWeight: "500", fontSize: "18px" }}>
        Search
      </Typography.Text>
      <Input.Search
        onChange={handleSearchTextChange}
        size="large"
        placeholder="Search here"
        enterButton
        allowClear
        value={searchText}
        onSearch={handleSearch}
      />
    </>
  );
};
