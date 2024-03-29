import { Card } from "react-bootstrap";
import PostStatusForm from "../PostStatusForm";

const StatusBar = ({ userProfile }) => {
  return (
    <Card className="mb-4">
      <Card.Body className="px-0 my-2">
        <PostStatusForm userProfile={userProfile} />
      </Card.Body>
    </Card>
  );
};

export default StatusBar;
