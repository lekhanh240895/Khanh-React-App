import { Card, Row, Col, Image } from "react-bootstrap";
import Moment from "react-moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import Comment from "../Comment";
import PostCommentForm from "../Comment/PostCommentForm";

const Status = ({
  userDoc,
  status,
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
    <Card className="mb-3">
      <Card.Header>
        <div className="d-flex my-2 justify-content-between">
          <div style={{ lineHeight: "1" }}>
            <Link to={`/${status.postStatusUserProfile?.email}`}>
              <Image
                className="float-start"
                src={status.postStatusUserProfile?.photoURL}
                alt="Avatar"
                style={{
                  borderRadius: "50%",
                  width: "50px",
                  height: "50px",
                }}
              />
            </Link>

            <h4 style={{ paddingLeft: "60px" }}>
              {status.postStatusUserProfile?.displayName}
            </h4>

            <p
              style={{
                fontSize: "14px",
                fontStyle: "italic",
                paddingLeft: "60px",
              }}
            >
              <Moment fromNow unix>
                {status.postedAt.seconds}
              </Moment>
            </p>
          </div>

          {status.postStatusUserProfile?.uid !== status.userProfile.uid && (
            <>
              <span style={{ fontSize: "20px", margin: "15px 15px 0 15px" }}>
                <FontAwesomeIcon icon={["fas", "arrow-right"]} />
              </span>

              <div className="flex-grow-1">
                <Link to={`/${status.userProfile?.email}`}>
                  <Image
                    className="float-start"
                    src={status.userProfile?.photoURL}
                    alt="Avatar"
                    style={{
                      borderRadius: "50%",
                      width: "50px",
                      height: "50px",
                      marginRight: "10px",
                    }}
                  />
                </Link>

                <h4>{status.userProfile?.displayName}</h4>
              </div>
            </>
          )}

          {isUser && (
            <span
              onClick={() => handleDeleteStatus(status)}
              style={{ cursor: "pointer" }}
            >
              <FontAwesomeIcon icon={["far", "trash-alt"]} />
            </span>
          )}
        </div>
      </Card.Header>

      <Card.Body>
        <p style={{ fontSize: "18px" }}>{status.content}</p>
      </Card.Body>

      <Card.Footer>
        <Row className="text-center my-2">
          <Col
            onClick={() => handleLikeStatus(status)}
            id="status-like"
            style={{ cursor: "pointer", height: "5vh" }}
            className="d-flex align-items-center justify-content-center"
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
            style={{ cursor: "pointer", height: "5vh" }}
            className="d-flex align-items-center justify-content-center"
          >
            <span>
              <FontAwesomeIcon
                icon={["far", "comments"]}
                className="me-2"
                size="lg"
              />
            </span>
            <span>
              {!status.comments.length
                ? "Comment"
                : status.comments.length === 1
                ? `${status.comments.length} Comment`
                : `${status.comments.length} Comments`}
            </span>
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
              onLikeComment={(comment) => handleLikeComment(status, comment)}
              onDeleteComment={(comment) =>
                handleDeleteComment(status, comment)
              }
              isUser={isUser}
            />
          ))}

          <PostCommentForm
            userProfile={userDoc}
            onPostComment={(data) => onPostComment(data, status)}
            onCloseCommentForm={() => handleCloseCommentForm(status)}
          />
        </div>
      </Card.Footer>
    </Card>
  );
};
export default Status;
