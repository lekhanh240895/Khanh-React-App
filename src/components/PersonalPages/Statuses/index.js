import React, { useEffect, useState } from "react";
import { useAppContext } from "../../../contexts/AppContext";
import Status from "./Status";
import InfiniteScroll from "react-infinite-scroll-component";
import { Button, Spinner } from "react-bootstrap";

const Statuses = ({ statuses }) => {
  const {
    handleDeleteStatus,
    handleReactStatus,
    handleToggleCommentTab,
    handleDeleteComment,
    handleReactComment,
  } = useAppContext();

  const [loadData, setLoadData] = useState([]);
  const [loadCount, setLoadCount] = useState(2);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (statuses.length > 0) {
      setLoadData(statuses.slice(0, loadCount));

      if (loadCount > statuses.length) {
        setLoadCount(statuses.length);
      }
    }

    if (loadCount === statuses.length) {
      setHasMore(false);
    }

    if (loadCount < statuses.length) {
      setHasMore(true);
    }
  }, [statuses, loadCount]);

  const fetchData = () => {
    setTimeout(() => {
      setLoadCount(loadCount + 1);
      setLoadData(loadData.concat(statuses.slice(loadCount, loadCount + 1)));
    }, 500);
  };

  return (
    <div className="d-flex flex-column">
      <InfiniteScroll
        dataLength={loadData.length}
        next={fetchData}
        hasMore={hasMore}
        loader={
          <div className="text-center mb-3">
            <Button variant="secondary" disabled>
              <Spinner
                as="span"
                animation="border"
                role="status"
                aria-hidden="true"
                size="sm"
              />
              <span className="ms-2" style={{ fontSize: 18 }}>
                Loading...
              </span>
            </Button>
          </div>
        }
      >
        {loadData.map((status) => (
          <Status
            key={status.id}
            status={status}
            onDeleteStatus={handleDeleteStatus}
            onReactStatus={(emoReact) => handleReactStatus(status, emoReact)}
            onToggleCommentTab={handleToggleCommentTab}
            onReactComment={handleReactComment}
            onDeleteComment={handleDeleteComment}
          />
        ))}
      </InfiniteScroll>
    </div>
  );
};
export default Statuses;
