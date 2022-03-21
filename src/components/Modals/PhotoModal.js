// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { Tooltip } from "antd";
// import React from "react";
// import { Image, Row, Col, Modal, Carousel } from "react-bootstrap";
// import { useAppContext } from "../../contexts/AppContext";
// import StatusWithPhoto from "../PersonalPages/StatusWithPhoto/index.js";
// import "./index.css";
// import { ref, deleteObject } from "firebase/storage";
// import { storage } from "../../firebase/config";

// export default function PhotoModal() {
//   const {
//     statuses,
//     userDoc,
//     handleDeleteStatus,
//     handleReactStatus,
//     handleToggleCommentTab,
//     handleDeleteComment,
//     handleReactComment,
//     selectedStatusId,
//     isStatusPhotoModalShowed,
//     setIsStatusPhotosModalShowed,
//     photoIndex,
//     setPhotoIndex,
//     updateDocument,
//   } = useAppContext();

//   const status =
//     statuses.find((status) => status.id === selectedStatusId) || {};

//   const isStatusOfUser =
//     status.postUid === userDoc?.uid || status.uid === userDoc?.uid;

//   const handleCloseStatusPhotoModal = () => setIsStatusPhotosModalShowed(false);

//   const handleSelect = (selectedIndex, e) => {
//     setPhotoIndex(selectedIndex);
//   };

//   const handleDeletePhoto = async (photoUrl) => {
//     const httpRef = ref(storage, photoUrl);
//     await deleteObject(httpRef);
//     const newAttachments = status.attachments.filter((url) => url !== photoUrl);

//     updateDocument("statuses", status.id, {
//       attachments: newAttachments,
//     });

//     if (photoIndex === status.attachments.length - 1) {
//       setPhotoIndex(0);
//     }
//   };

//   return (
//     <Modal
//       show={isStatusPhotoModalShowed}
//       onHide={handleCloseStatusPhotoModal}
//       fullscreen
//       className="photo-modal"
//     >
//       <Row style={{ postion: "relative" }}>
//         <span
//           className="closed-photo-modal-icon"
//           onClick={handleCloseStatusPhotoModal}
//         >
//           <FontAwesomeIcon icon={["fas", "times"]} />
//         </span>

//         <Col xs={12} md={8}>
//           {status.attachments?.length > 1 && (
//             <Carousel activeIndex={photoIndex} onSelect={handleSelect}>
//               {status.attachments.map((url) => (
//                 <Carousel.Item key={url}>
//                   <Image
//                     fluid
//                     src={url}
//                     alt="Photos"
//                     className="carousel-photo"
//                     key={`photo-${url}`}
//                     rounded
//                   />

//                   {isStatusOfUser && (
//                     <Tooltip
//                       placement="bottomRight"
//                       title={
//                         <div
//                           style={{
//                             cursor: "pointer",
//                             color: "#000",
//                             fontSize: 14,
//                           }}
//                         >
//                           <Row
//                             onClick={() => handleDeletePhoto(url)}
//                             className="status-action m-0 p-1"
//                           >
//                             <Col xs={3}>
//                               <FontAwesomeIcon icon={["far", "trash-alt"]} />
//                             </Col>
//                             <Col xs>
//                               <span>Delete photo</span>
//                             </Col>
//                           </Row>
//                         </div>
//                       }
//                       trigger="click"
//                       color="#fff"
//                     >
//                       <span className="option-photo-modal-icon">
//                         <FontAwesomeIcon icon={["fas", "ellipsis-h"]} />
//                       </span>
//                     </Tooltip>
//                   )}
//                 </Carousel.Item>
//               ))}
//             </Carousel>
//           )}

//           {status.attachments?.length === 1 && (
//             <div>
//               <Image
//                 fluid
//                 src={status.attachments[0]}
//                 alt="Photos"
//                 className="carousel-photo"
//                 key={`photo-${status.attachments[0]}`}
//                 rounded
//               />
//               {isStatusOfUser && (
//                 <Tooltip
//                   placement="bottomRight"
//                   title={
//                     <div
//                       style={{
//                         cursor: "pointer",
//                         color: "#000",
//                         fontSize: 14,
//                       }}
//                     >
//                       <Row
//                         onClick={() => handleDeletePhoto(status.attachments[0])}
//                         className="status-action m-0 p-1"
//                       >
//                         <Col xs={3}>
//                           <FontAwesomeIcon icon={["far", "trash-alt"]} />
//                         </Col>
//                         <Col xs>
//                           <span>Delete photo</span>
//                         </Col>
//                       </Row>
//                     </div>
//                   }
//                   trigger="click"
//                   color="#fff"
//                 >
//                   <span className="option-photo-modal-icon">
//                     <FontAwesomeIcon icon={["fas", "ellipsis-h"]} />
//                   </span>
//                 </Tooltip>
//               )}
//             </div>
//           )}
//         </Col>

//         <Col xs={12} md={4} style={{ height: "100vh", overflowY: "scroll" }}>
//           <StatusWithPhoto
//             status={status}
//             userDoc={userDoc}
//             onDeleteStatus={handleDeleteStatus}
//             onReactStatus={(emoReact) => handleReactStatus(status, emoReact)}
//             onToggleCommentTab={handleToggleCommentTab}
//             onReactComment={handleReactComment}
//             onDeleteComment={handleDeleteComment}
//           />
//         </Col>
//       </Row>
//     </Modal>
//   );
// }
