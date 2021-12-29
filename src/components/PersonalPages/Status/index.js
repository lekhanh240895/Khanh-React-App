import { Card, Row, Col, Image } from "react-bootstrap";
import Moment from "react-moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import Comment from "../Comment";
import { some } from "lodash";
import PostCommentForm from "../PostCommentForm";

const Status = ({
  userDoc,
  status,
  isUser,
  handleDeleteStatus,
  handleLikeStatus,
  handleToggleCommentTab,
  handleLikeComment,
  handleDeleteComment,
  onPostComment,
}) => {
  const isStatusOfUser = status.postStatusUserProfile?.uid === userDoc?.uid;
  const isUserLikedStatus = some(status.likedPeople, { uid: userDoc?.uid });
  const likedStatusList = status.likedPeople.map(
    (person) => person.displayName
  );

  return (
    <Card className="mb-3">
      <Card.Header>
        <Row className="my-2">
          <Col xs={11} style={{ lineHeight: "1" }}>
            <div>
              <Link to={`/${status.postStatusUserProfile?.email}`}>
                {status.postStatusUserProfile?.photoURL ? (
                  <Image
                    src={status.postStatusUserProfile?.photoURL}
                    alt="Avatar"
                    style={{
                      float: "left",
                      borderRadius: "50%",
                      width: "50px",
                      height: "50px",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      float: "left",
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      background: "pink",
                    }}
                    className="text-white d-flex justify-content-center align-items-center"
                  >
                    <span style={{ fontSize: "20px", fontWeight: "600" }}>
                      {status.postStatusUserProfile?.displayName?.charAt(0)}
                    </span>
                  </div>
                )}
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
              <div>
                <div
                  style={{
                    fontSize: "20px",
                    padding: "0 0 15px 15px",
                  }}
                >
                  <FontAwesomeIcon icon={["fas", "arrow-down"]} />
                </div>

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

                <h4 style={{ paddingLeft: "60px" }}>
                  {status.userProfile?.displayName}
                </h4>
              </div>
            )}
          </Col>

          <Col xs={1}>
            {(isUser || isStatusOfUser) && (
              <span
                onClick={() => handleDeleteStatus(status)}
                style={{ cursor: "pointer" }}
              >
                <FontAwesomeIcon icon={["far", "trash-alt"]} />
              </span>
            )}
          </Col>
        </Row>
      </Card.Header>

      <Card.Body>
        <p style={{ fontSize: "18px" }}>{status.content}</p>
      </Card.Body>

      <Card.Footer>
        <Row className="text-center mb-2">
          <Col
            onClick={() => handleLikeStatus(status)}
            id="status-like"
            style={{ cursor: "pointer", height: "5vh" }}
            className="d-flex align-items-center justify-content-center"
          >
            <span>
              <FontAwesomeIcon
                icon={isUserLikedStatus ? ["fas", "heart"] : ["far", "heart"]}
                className={isUserLikedStatus ? "status-liked me-2" : "me-2"}
                size="lg"
                onClick={() => handleLikeStatus(status)}
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
            onClick={() => handleToggleCommentTab(status)}
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
          <div className="mb-2">
            <span>{likedStatusList.join(", ")}</span>
            &nbsp;
            <span>liked this.</span>
          </div>
        )}

        <div
          style={{
            display: status.isCommentTabOpened ? "block" : "none",
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
              userDoc={userDoc}
            />
          ))}

          <PostCommentForm
            userProfile={userDoc}
            onPostComment={(data) => onPostComment(data, status)}
          />
        </div>
      </Card.Footer>
    </Card>
  );
};
export default Status;
