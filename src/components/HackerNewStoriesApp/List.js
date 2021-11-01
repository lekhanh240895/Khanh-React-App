import * as SC from "./style";
import React from "react";
import { sortBy } from "lodash";
import InfiniteScroll from "react-infinite-scroll-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SORTS = {
  NONE: (list) => list,
  TITLE: (list) => sortBy(list, "title"),
  AUTHOR: (list) => sortBy(list, "author"),
  NUM_COMMENTS: (list) => sortBy(list, "num_comments").reverse(),
  POINTS: (list) => sortBy(list, "points").reverse(),
};

export const List = React.memo(({ list, onRemoveItem, onFetchMore, page }) => {
  const [sort, setSort] = React.useState({
    sortKey: "NONE",
    isReversed: false,
    isSorted: false,
    isShowArrow: false,
  });

  const handleSort = (sortKey) => {
    const isReversed = sortKey === sort.sortKey && !sort.isReversed;

    /*  setSort({ sortKey: sortKey, isReversed: isReversed }); */
    setSort({ sortKey, isReversed, isSorted: true }); //JS Object initializers
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
            style={{
              width: "35%",
              fontSize: "18px",
              textTransform: "uppercase",
              fontWeight: "600",
            }}
          >
            <span className="p-2">Title</span>
            {sort.isSorted & (sort.sortKey === "TITLE") ? (
              sort.isReversed ? (
                <FontAwesomeIcon icon={["fas", "arrow-down"]} />
              ) : (
                <FontAwesomeIcon icon={["fas", "arrow-up"]} />
              )
            ) : null}
          </SC.StyledButtonSmall>

          <SC.StyledButtonSmall
            type="button"
            onClick={() => handleSort("AUTHOR")}
            style={{
              width: "15%",
              fontSize: "18px",
              textTransform: "uppercase",
              fontWeight: "600",
            }}
          >
            <span className="p-2">Author</span>
            {sort.isSorted & (sort.sortKey === "AUTHOR") ? (
              sort.isReversed ? (
                <FontAwesomeIcon icon={["fas", "arrow-down"]} />
              ) : (
                <FontAwesomeIcon icon={["fas", "arrow-up"]} />
              )
            ) : null}
          </SC.StyledButtonSmall>

          <SC.StyledButtonSmall
            type="button"
            onClick={() => handleSort("NUM_COMMENTS")}
            style={{
              width: "20%",
              fontSize: "18px",
              textTransform: "uppercase",
              fontWeight: "600",
            }}
          >
            <span className="p-2">Comments</span>
            {sort.isSorted & (sort.sortKey === "NUM_COMMENTS") ? (
              sort.isReversed ? (
                <FontAwesomeIcon icon={["fas", "arrow-up"]} />
              ) : (
                <FontAwesomeIcon icon={["fas", "arrow-down"]} />
              )
            ) : null}
          </SC.StyledButtonSmall>

          <SC.StyledButtonSmall
            type="button"
            onClick={() => handleSort("POINTS")}
            style={{
              width: "15%",
              fontSize: "18px",
              textTransform: "uppercase",
              fontWeight: "600",
            }}
          >
            <span className="p-2">Points</span>
            {sort.isSorted & (sort.sortKey === "POINTS") ? (
              sort.isReversed ? (
                <FontAwesomeIcon icon={["fas", "arrow-up"]} />
              ) : (
                <FontAwesomeIcon icon={["fas", "arrow-down"]} />
              )
            ) : null}
          </SC.StyledButtonSmall>

          <SC.StyledButtonSmall
            style={{
              width: "15%",
              fontSize: "18px",
              textTransform: "uppercase",
              fontWeight: "600",
              cursor: "text"
            }}
          >
            <span className="p-2">Actions</span>
          </SC.StyledButtonSmall>
        </SC.StyledItem>
      </div>

      <InfiniteScroll //Infinite Scroll Fetch API
        dataLength={sortedList.length}
        next={onFetchMore}
        hasMore={true}
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
      >
        {sortedList.map((item) => (
          <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
        ))}
      </InfiniteScroll>
    </div>
  );
});

const Item = React.memo(({ item, onRemoveItem }) => (
  <SC.StyledItem>
    <SC.StyledColumn style={{ textAlign: "left", width: "35%" }}>
      <a href={item.url}>{item.title}</a>
    </SC.StyledColumn>
    <SC.StyledColumn style={{ textTransform: "capitalize", width: "15%" }}>
      {item.author}
    </SC.StyledColumn>
    <SC.StyledColumn width="20%">{item.num_comments}</SC.StyledColumn>
    <SC.StyledColumn width="15%">{item.points}</SC.StyledColumn>

    <SC.StyledColumn width="15%">
      <SC.StyledButtonSmall type="button" onClick={() => onRemoveItem(item)}>
        <FontAwesomeIcon icon={["fas", "check"]} size="sm" />
      </SC.StyledButtonSmall>
    </SC.StyledColumn>
  </SC.StyledItem>
));
