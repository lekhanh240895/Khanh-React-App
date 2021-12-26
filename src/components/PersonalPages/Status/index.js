import { Card, Row, Col } from "react-bootstrap";
import Avatar from "../Avatar";
import Moment from "react-moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Comment from "../Comment";
import PostCommentForm from "../Comment/PostCommentForm";

const Status = ({
  statuses,
  userProfile,
  isUser,
  handleDeleteStatus,
  handleLikeStatus,
  handleToggleCommentForm,
  handleLikeComment,
  handleDeleteComment,
  onPostComment,
  handleCloseCommentForm,
}) => {
  return (
    <div className="d-flex flex-column">
      {statuses.map((status) => (
        <Card className="mb-3" key={status.id}>
          <Card.Header>
            <div className="mt-3 d-flex justify-content-between">
              <div>
                <div style={{ float: "left" }}>
                  <Avatar userProfile={userProfile} />
                </div>
                <h4
                  style={{
                    paddingLeft: "50px",
                    lineHeight: "0.7",
                  }}
                >
                  {userProfile.displayName}
                </h4>
                <p
                  style={{
                    fontSize: "14px",
                    paddingLeft: "50px",
                    fontStyle: "italic",
                  }}
                >
                  <Moment fromNow unix>
                    {status.postedAt.seconds}
                  </Moment>
                </p>
              </div>

              {isUser && (
                <span onClick={() => handleDeleteStatus(status)}>
                  <FontAwesomeIcon icon={["far", "trash-alt"]} />
                </span>
              )}
            </div>
          </Card.Header>

          <Card.Body>{status.content}</Card.Body>

          <Card.Footer>
            <Row className="text-center my-2">
              <Col
                onClick={() => handleLikeStatus(status)}
                id="status-like"
                style={{ cursor: "pointer" }}
              >
                <span>
                  <FontAwesomeIcon
                    icon={
                      status.isLikedByUser & isUser || status.isLiked & !isUser
                        ? ["fas", "heart"]
                        : ["far", "heart"]
                    }
                    className={
                      status.isLikedByUser & isUser || status.isLiked & !isUser
                        ? "status-liked me-2"
                        : "me-2"
                    }
                    size="lg"
                  />
                </span>
                <span>
                  {!status.likedPeople.length
                    ? "Like"
                    : status.likedPeople.length === 1
                    ? `${status.likedPeople.length} Like`
                    : `${status.likedPeople.length} Likes`}
                </span>
              </Col>

              <Col
                onClick={() => handleToggleCommentForm(status)}
                id="status-comment"
                style={{ cursor: "pointer" }}
              >
                <span>
                  <FontAwesomeIcon
                    icon={["far", "comments"]}
                    className="me-2"
                    size="lg"
                  />
                </span>
                <span>Comment</span>
              </Col>
            </Row>

            {status.likedPeople.length > 0 && (
              <div className="d-flex mb-2">
                {status.likedPeople.map((person) => (
                  <span key={person.displayName} className="me-1">
                    {person.displayName}
                  </span>
                ))}
                <span>liked this.</span>
              </div>
            )}

            <div
              style={{
                display: status.isCommentFormOpened ? "block" : "none",
              }}
            >
              {status.comments?.map((comment) => (
                <Comment
                  key={comment.id}
                  comment={comment}
                  onLikeComment={(comment) =>
                    handleLikeComment(status, comment)
                  }
                  onDeleteComment={(comment) =>
                    handleDeleteComment(status, comment)
                  }
                  isUser={isUser}
                />
              ))}

              <PostCommentForm
                userProfile={userProfile}
                onPostComment={(data) => onPostComment(data, status)}
                onCloseCommentForm={() => handleCloseCommentForm(status)}
              />
            </div>
          </Card.Footer>
        </Card>
      ))}
    </div>
  );
};
export default Status;
