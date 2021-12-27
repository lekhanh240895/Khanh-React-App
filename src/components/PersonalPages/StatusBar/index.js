import { Card } from "react-bootstrap";
import PostStatusForm from "../PostStatusForm";
import UploadImagesModal from "../UploadImagesModal";

const StatusBar = ({ userProfile, imgUrls, setImgUrls }) => {
  return (
    <Card className="mb-4">
      <Card.Body className="px-0 my-2">
        <PostStatusForm userProfile={userProfile} />
      </Card.Body>

      <Card.Footer>
        <UploadImagesModal
          userProfile={userProfile}
          imgUrls={imgUrls}
          setImgUrls={setImgUrls}
        />
      </Card.Footer>
    </Card>
  );
};

export default StatusBar;
