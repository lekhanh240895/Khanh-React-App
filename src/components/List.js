import { ReactComponent as Check } from "../svg/checked-mark.svg";
import * as SC from "./style";
import React from "react";
import { sortBy } from "lodash";

const SORTS = {
  NONE: (list) => list,
  TITLE: (list) => sortBy(list, "title"),
  AUTHOR: (list) => sortBy(list, "author"),
  NUM_COMMENTS: (list) => sortBy(list, "num_comments").reverse(),
  POINTS: (list) => sortBy(list, "points").reverse(),
};

export const List = React.memo(({ list, onRemoveItem }) => {
  const [sort, setSort] = React.useState({
    sortKey: "NONE",
    isReversed: false,
  });

  const handleSort = (sortKey) => {
    const isReversed = sortKey === sort.sortKey && !sort.isReversed;

    /*  setSort({ sortKey: sortKey, isReversed: isReversed }); */
    setSort({ sortKey, isReversed }); //JS Object initializers
  };

  const sortFunction = SORTS[sort.sortKey];
  const sortedList = sort.isReversed
    ? sortFunction(list).reverse()
    : sortFunction(list);

  return (
    <div>
      <div>
        <SC.StyledItem>
          <SC.StyledButtonSmall
            type="button"
            onClick={() => handleSort("TITLE")}
            style={{ width: "40%" }}
          >
            Title
          </SC.StyledButtonSmall>

          <SC.StyledButtonSmall
            type="button"
            onClick={() => handleSort("AUTHOR")}
            style={{ width: "20%" }}
          >
            Author
          </SC.StyledButtonSmall>

          <SC.StyledButtonSmall
            type="button"
            onClick={() => handleSort("NUM_COMMENTS")}
            style={{ width: "20%" }}
          >
            Comments
          </SC.StyledButtonSmall>

          <SC.StyledButtonSmall
            type="button"
            onClick={() => handleSort("POINTS")}
            style={{ width: "10%" }}
          >
            Points
          </SC.StyledButtonSmall>

          <SC.StyledButtonSmall style={{ width: "10%" }}>
            Actions
          </SC.StyledButtonSmall>
        </SC.StyledItem>
      </div>
      <div id="list">
        {sortedList.map((item) => (
          <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
        ))}
      </div>
    </div>
  );
});

export const Item = React.memo(({ item, onRemoveItem }) => (
  <SC.StyledItem>
    <SC.StyledColumn style={{ textAlign: "left", width: "40%" }}>
      <a href={item.url}>{item.title}</a>
    </SC.StyledColumn>
    <SC.StyledColumn style={{ textTransform: "capitalize", width: "20%" }}>
      {item.author}
    </SC.StyledColumn>
    <SC.StyledColumn width="20%">{item.num_comments}</SC.StyledColumn>
    <SC.StyledColumn width="10%">{item.points}</SC.StyledColumn>

    <SC.StyledColumn width="10%">
      <SC.StyledButtonSmall type="button" onClick={() => onRemoveItem(item)}>
        <Check height="10px" width="10px" />
      </SC.StyledButtonSmall>
    </SC.StyledColumn>
  </SC.StyledItem>
));
