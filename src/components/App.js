import React from "react";
import axios from "axios";
import { useCallback, useMemo, useReducer, useEffect, useState } from "react";
import * as SC from "./style";
/* import TodoApp from "./TodoApp"; */
import { SearchForm } from "./SearchForm";
import { List } from "./List";
import { LastSearches } from "./LastSearches";
import { usePersistentState } from "./hooks/Custom Hook";
import storiesReducer from "./reducers";

//https://hn.algolia.com/api Hacker News API

const API_BASE = "https://hn.algolia.com/api/v1";
const API_SEARCH = "/search";
const PARAM_SEARCH = "query=";
const PARAM_PAGE = "page=";
const PARAM_PAGESIZE = "hitsPerPage=";
let pageSize = 10;
const getUrl = (searchTerm, page) =>
  `${API_BASE}${API_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_PAGESIZE}${pageSize}`;
const extractSearchTerm = (url) =>
  url
    .substring(url.lastIndexOf("?") + 1, url.indexOf("&"))
    .replace(PARAM_SEARCH, "");

const App = () => {
  const [stories, dispatchStories] = useReducer(storiesReducer, {
    data: [],
    isLoading: false,
    isError: false,
    page: 0,
  });

  const [searchTerm, setSearchTerm] = usePersistentState("search", "React");
  const [urls, setUrls] = useState([getUrl(searchTerm, 0)]);

  const getLastSearches = (urls) =>
    urls
      .reduce((result, url, index) => {
        const searchTerm = extractSearchTerm(url);
        if (index === 0) {
          return result.concat(searchTerm);
        }
        const previousSearchTerm = result[result.length - 1];
        if (previousSearchTerm === searchTerm) {
          return result;
        } else {
          return result.concat(searchTerm);
        }
      }, [])
      .slice(-6)
      .slice(0, -1);

  const lastSearchs = getLastSearches(urls);

  //Fetch data from server
  const handleFetchStories = useCallback(async () => {
    dispatchStories({
      type: "STORIES_FETCH_INIT",
    });

    try {
      const lastUrl = urls[urls.length - 1];
      const result = await axios.get(lastUrl);
      dispatchStories({
        type: "STORIES_FETCH_SUCCESS",
        payload: {
          list: result.data.hits,
          page: result.data.page,
        },
      });
    } catch {
      dispatchStories({
        type: "STORIES_FETCH_FAILURE",
      });
    }
  }, [urls]);

  useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  const handleRemoveStory = useCallback((item) => {
    dispatchStories({
      type: "REMOVE_STORY",
      payload: item,
    });
  }, []);

  const handleSearchInput = useCallback(
    (e) => setSearchTerm(e.target.value),
    [setSearchTerm]
  );

  const handleSearchSubmit = (e) => {
    handleSearch(searchTerm, 0);
    e.preventDefault();
  };

  const handleLastSearch = (searchTerm) => {
    handleSearch(searchTerm, 0);
    setSearchTerm(searchTerm);
  };

  const handleSearch = useCallback(
    (searchTerm, page) => {
      const url = getUrl(searchTerm, page);
      setUrls(urls.concat(url));
    },
    [urls]
  );

  const handleMore = () => {
    const lastUrl = urls[urls.length - 1];
    const searchTerm = extractSearchTerm(lastUrl);
    handleSearch(searchTerm, stories.page + 1);
  };

  //useMemo get sum ... of stories
  const getSumComments = (stories) => {
    return stories.data.reduce(
      (result, value) => result + value.num_comments,
      0
    );
  };

  const sumComments = useMemo(() => getSumComments(stories), [stories]);
  console.log("HEllo World")

  return (
    <SC.StyledContainer>
      {/*  <TodoApp /> */}

      <SC.StyledHeadlinePrimary>
        My Hacker Stories with {sumComments} comments
      </SC.StyledHeadlinePrimary>

      <SearchForm
        searchTerm={searchTerm}
        onSearchSubmit={handleSearchSubmit}
        onSearchInput={handleSearchInput}
      />

      <LastSearches lastSearchs={lastSearchs} onLastSearch={handleLastSearch} />

      <List list={stories.data} onRemoveItem={handleRemoveStory} />

      {stories.isError && (
        <p>
          <strong>Oops! Something went wrong...</strong>
        </p>
      )}

      {stories.isLoading ? (
        <p>
          <strong>Loading...</strong>
        </p>
      ) : (
        <button type="button" onClick={handleMore}>
          More
        </button>
      )}
    </SC.StyledContainer>
  );
};

export default App;
