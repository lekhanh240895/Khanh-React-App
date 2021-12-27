import { Card, Row, Col, Image } from "react-bootstrap";
import Moment from "react-moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import Comment from "../Comment";
import PostCommentForm from "../Comment/PostCommentForm";

const Status = ({
  userDoc,
  userProfile,
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
        {status.email !== userProfile.email ? (
          <Row className="mt-3" style={{ lineHeight: "0.5" }}>
            <Col xs={2}>
              <Link to={`/${status.email}`}>
                <Image
                  src={status.photoURL}
                  alt="Avatar"
                  style={{
                    borderRadius: "50%",
                    width: "50px",
                    height: "50px",
                    marginLeft: "10px",
                  }}
                />
              </Link>
            </Col>

            <Col xs={1} className="mt-3">
              <div>
                <FontAwesomeIcon icon={["fas", "arrow-right"]} />
              </div>
            </Col>

            <Col xs={2}>
              <Link to={`/${userProfile?.email}`}>
                <Image
                  src={userProfile?.photoURL}
                  alt="Avatar"
                  style={{
                    borderRadius: "50%",
                    width: "50px",
                    height: "50px",
                    marginLeft: "10px",
                  }}
                />
              </Link>
            </Col>

            <Col xs>
              <h4>{userProfile?.displayName}</h4>
              <p
                style={{
                  fontSize: "14px",

                  fontStyle: "italic",
                }}
              >
                <Moment fromNow unix>
                  {status.postedAt.seconds}
                </Moment>
              </p>
            </Col>
          </Row>
        ) : (
          <Row className="mt-3" style={{ lineHeight: "0.5" }}>
            <Col xs={1}>
              <Link to={`/${status.email}`}>
                <Image
                  src={status.photoURL}
                  alt="Avatar"
                  style={{
                    borderRadius: "50%",
                    width: "50px",
                    height: "50px",
                    marginLeft: "10px",
                  }}
                />
              </Link>
            </Col>

            <Col xs={10} className="ps-5">
              <h4>{status.displayName}</h4>
              <p
                style={{
                  fontSize: "14px",

                  fontStyle: "italic",
                }}
              >
                <Moment fromNow unix>
                  {status.postedAt.seconds}
                </Moment>
              </p>
            </Col>

            <Col xs={1}>
              {isUser && (
                <span onClick={() => handleDeleteStatus(status)}>
                  <FontAwesomeIcon icon={["far", "trash-alt"]} />
                </span>
              )}
            </Col>
          </Row>
        )}
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
