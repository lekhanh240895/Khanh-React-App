import React, {
  useEffect,
  useReducer,
  useState,
  useCallback,
  useRef,
} from "react";
import { List } from "./List";
import { AddTodoForm } from "./AddForm";
import { todoReducer } from "./reducer";
import axios from "axios";
import * as SC from "./style";
import Pagination from "./Pagination";
import CountUp from "react-countup";
import { Button, Col, Form, Row } from "react-bootstrap";

let PageSize = 20;
const API_ENDPOINT = "https://jsonplaceholder.typicode.com/todos";
const PARAM_SEARCH = "_page=";
const PARAM_USERIDSEARCH = "userId=";

const getUrlByUserId = (searchId, page) =>
  `${API_ENDPOINT}?${PARAM_USERIDSEARCH}${searchId}&${PARAM_SEARCH}${page}`;

// Storage SearchId Hook
const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = useState(localStorage.getItem(key) || initialState);
  const isMounted = useRef(false);
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
    } else {
      localStorage.setItem(key, value);
    }
  }, [key, value]);

  return [value, setValue];
};

const TodoApp = () => {
  const [todos, dispatchTodos] = useReducer(todoReducer, {
    data: [],
    isLoading: false,
    isError: false,
  });

  const [userId, setUserId] = useState(1);
  const sum_todos = todos.data.length;
  const [unCompletedTodo, setUnCompletedTodo] = useState(0);
  const [addTodoQuery, setAddTodoQuery] = useState("");
  const [page, setPage] = useState(1);
  const [searchId, setSearchId] = useSemiPersistentState("IdSearch", userId);
  const [urls, setUrls] = useState([getUrlByUserId(searchId, page)]);
  const [isShowedAll, setIsShowedAll] = useState(false);
  const [isOver, setIsOver] = useState(false);

  const handleFetchTodos = useCallback(async () => {
    dispatchTodos({
      type: "TODOS_FETCH_INIT",
    });

    try {
      const lastUrl = urls[urls.length - 1];
      const respone = await axios.get(lastUrl);
      if (respone.data.length === 0) {
        urls.pop();
        setIsOver(true);
      } else if (urls[urls.length - 2] === lastUrl) {
        urls.pop();
      }

      dispatchTodos({
        type: "TODOS_FETCH_SUCCESS",
        payload: {
          list: respone.data,
          page: page,
        },
      });
    } catch {
      dispatchTodos({
        type: "TODOS_FETCH_FAILURE",
      });
    }
    // eslint-disable-next-line
  }, [urls]);

  useEffect(() => handleFetchTodos(), [handleFetchTodos]);

  const handleMore = () => {
    if (!isShowedAll) {
      const url = getUrlByUserId(searchId, page + 1);
      setUrls(urls.concat(url));
    }
    setPage(page + 1);
  };

  const handleCheckedTodo = (todo) => {
    dispatchTodos({
      type: todo.completed ? "UNDO_TODO" : "DO_TODO",
      id: todo.id,
    });
  };

  const handleRemoveTodo = (todo) => {
    dispatchTodos({
      type: "REMOVE_TODO",
      payload: todo,
    });
  };

  const handleAddTodo = (todoQuery) => {
    dispatchTodos({
      type: "ADD_TODO",
      payload: todoQuery,
    });
  };

  const handleAddTodoInput = (e) => {
    setAddTodoQuery(e.target.value);
  };

  const handleAddTodoSubmit = (e) => {
    e.preventDefault();
    handleAddTodo(addTodoQuery);
  };

  const handleCheckboxChange = (list, e) =>
    dispatchTodos({
      type: e.target.checked ? "MARK_ALL_TODOS" : "UNMARK_ALL_TODOS",
      payload: list,
    });

  const handleSearchIdInput = (e) => {
    setSearchId(e.target.value);
  };

  const handleSearchIdSubmit = (e) => {
    setPage(1);
    setIsShowedAll(false);
    const url = getUrlByUserId(searchId, 1);
    setUrls(urls.concat(url));
    e.preventDefault();
    setIsOver(false);
    setUserId(searchId);
  };

  const handleShowAll = () => {
    const url = `${API_ENDPOINT}`;
    setUrls(urls.concat(url));
    setIsShowedAll(true);
    setPage(1);
    setIsOver(false);
    setUserId(null);
  };

  useEffect(() => {
    if (todos) {
      setUnCompletedTodo(
        todos.data.filter((todo) => todo.completed === false).length
      );
    }
  }, [todos]);

  const extractSearchId = (url) =>
    url
      .substring(url.lastIndexOf("?") + 1, url.lastIndexOf("&"))
      .replace("userId=", "User Id: ");

  const getLastSearches = (urls) =>
    urls
      .reduce((result, url, index) => {
        const searchId = extractSearchId(url);
        if (searchId.includes("User Id")) {
          if (index === 0) {
            return result.concat(searchId);
          }

          const previousSearchId = result[result.length - 1];
          if (previousSearchId === searchId) {
            return result;
          } else {
            return result.concat(searchId);
          }
        } else {
          return result;
        }
      }, [])
      .slice(-6)
      .slice(0, -1);

  const lastSearches = getLastSearches(urls);

  const handleLastSearches = (searchId) => {
    // const extractSearchId = searchId.replace("User Id: ", "");
    const extractSearchId = Number(searchId[searchId.length - 1]);
    setPage(1);
    setIsShowedAll(false);
    const url = getUrlByUserId(extractSearchId, 1);
    setUrls(urls.concat(url));
    setSearchId(extractSearchId);
    setIsOver(false);
    setUserId(extractSearchId);
  };

  const [currentPage, setCurrentPage] = React.useState(page);
  const currentList = React.useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return todos.data.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, todos.data]);

  return (
    <div>
      <h1>
        My Todo App with <CountUp end={sum_todos} duration={1} /> works.
      </h1>

      <SC.StyledMessage>{unCompletedTodo} Works uncompleted!</SC.StyledMessage>

      <SC.StyledForm className="form mb-3" onSubmit={handleSearchIdSubmit}>
        <SC.StyledLabel
          className="form-group text-capitalize"
          htmlFor="IdSearch"
        >
          Search by UserId:
        </SC.StyledLabel>
        <Row className="row">
          <Col xs={9} md={10}>
            <Form.Control
              id="IdSearch"
              type="text"
              placeholder="Your ID number"
              autoFocus
              onChange={handleSearchIdInput}
              value={searchId}
            />
          </Col>
          <Col xs={3} md>
            <Button>Submit</Button>
          </Col>
        </Row>
      </SC.StyledForm>

      <div>
        {lastSearches.map((searchId, index) => (
          <Button
            type="button"
            onClick={() => handleLastSearches(searchId)}
            key={searchId + index}
            variant="secondary"
          >
            {searchId}
          </Button>
        ))}
      </div>

      <Button className="mt-3 mb-2" onClick={handleShowAll}>
        Show All User's Works
      </Button>

      <List
        list={!isShowedAll ? todos.data : currentList}
        onRemoveTodo={handleRemoveTodo}
        onCheckedTodo={handleCheckedTodo}
        onCheckboxChange={handleCheckboxChange}
        UserId={userId}
      />

      {todos.isError && (
        <SC.StyledMessage>Oops! Something went wrong</SC.StyledMessage>
      )}

      {todos.isLoading ? (
        <SC.StyledMessage>Loading...</SC.StyledMessage>
      ) : !isShowedAll & !isOver ? (
        <Button onClick={handleMore}>More</Button>
      ) : isOver ? (
        <SC.StyledMessage>No works</SC.StyledMessage>
      ) : (
        <Pagination
          onPageChange={(page) => {
            setPage(page);
            setCurrentPage(page);
          }}
          totalCount={todos.data.length}
          currentPage={page}
          pageSize={PageSize}
        />
      )}

      <AddTodoForm
        onAddTodoInput={handleAddTodoInput}
        onAddTodoSubmit={handleAddTodoSubmit}
      />
    </div>
  );
};
export default TodoApp;
