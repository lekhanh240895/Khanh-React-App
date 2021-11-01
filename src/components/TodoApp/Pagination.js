import React from "react";
import { usePagination, DOTS } from "../hooks/usePagination";
import classnames from "classnames";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const StyledPagination = styled.li`
  font-weight: 700;
  &:hover {
    cursor: pointer;
  }
`;
const StyledPaginationDisabled = styled(StyledPagination)`
  &.page-item {
    &.disabled {
      pointer-events: none;
    }
  }
`;

export default function Pagination(props) {
  const {
    onPageChange,
    totalCount,
    siblingCount = 1,
    currentPage,
    pageSize,
  } = props;

  const paginationRange = usePagination({
    totalCount,
    siblingCount,
    currentPage,
    pageSize,
  });

  if ((currentPage <= 0) & (paginationRange.length < 2)) {
    return null;
  }

  const onPrevious = () => onPageChange(currentPage - 1);
  const onNext = () => onPageChange(currentPage + 1);
  const lastPage = paginationRange[paginationRange.length - 1];

  return (
    <ul className="pagination justify-content-center mt-4">
      <StyledPaginationDisabled
        className={classnames("page-item", { disabled: currentPage === 1 })}
        onClick={onPrevious}
      >
        <span className="page-link">
          <FontAwesomeIcon icon={["fas", "arrow-left"]} />
        </span>
      </StyledPaginationDisabled>

      {paginationRange.map((pageNumber, index) => {
        // If the pageItem is a DOT, render the DOTS unicode character
        if (pageNumber === DOTS) {
          return (
            <li key={Math.random()} className="page-item page-link">
              &#8230;
            </li>
          );
        }

        // Render our Page Pills
        return (
          <StyledPagination
            key={pageNumber}
            className={classnames("page-item", {
              active: pageNumber === currentPage,
            })}
            onClick={() => onPageChange(pageNumber)}
          >
            <span className="page-link">{pageNumber}</span>
          </StyledPagination>
        );
      })}

      <StyledPaginationDisabled
        className={classnames("page-item", {
          disabled: currentPage === lastPage,
        })}
        onClick={onNext}
      >
        <span className="page-link">
          <FontAwesomeIcon icon={["fas", "arrow-right"]} />
        </span>
      </StyledPaginationDisabled>
    </ul>
  );
}
