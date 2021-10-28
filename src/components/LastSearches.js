import React from 'react'

export const LastSearches = ({ lastSearchs, onLastSearch }) => (
    <div style={{marginBottom: "20px"}}>
      {lastSearchs.map((searchTerm, index) => (
        <button
          key={searchTerm + index}
          type="button"
          onClick={() => onLastSearch(searchTerm)}
        >
          {searchTerm}
        </button>
      ))}
    </div>
  );
  