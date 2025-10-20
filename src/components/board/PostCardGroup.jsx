import React from "react";
import { Card, Badge, Row, Col } from "react-bootstrap";
import "../../styles/PostCardGroup.css";
import SecureImage from "../common/SecureImage";

const PostCardGroup = ({ items, onItemClick }) => {
  return (
    <div className="tailyfriend-card-container">
      <Row className="justify-content-start g-4">
        {items.map((item) => {
          const hasImage = item.images && item.images.length > 0;

          return (
            <Col
              xs={12}
              md={6}
              lg={6}
              key={item.id}
              className="d-flex justify-content-center"
            >
              <Card
                className="post-card h-100 mx-auto"
                onClick={() => onItemClick(item.id)}
                style={{ cursor: "pointer" }}
              >
                <div className="post-card-image-container">
                  {hasImage ? (
                    <SecureImage
                      src={item.images[0].filePath}
                      alt={item.title}
                    />
                  ) : (
                    <div className="no-image-text">이미지가 없습니다.</div>
                  )}
                </div>

                <Card.Body>
                  <Card.Title className="mb-2">{item.title}</Card.Title>

                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <Badge bg="light" text="dark" pill className="author">
                      {item.nickname}
                    </Badge>
                    <div className="d-flex flex-column text-end">
                      <div className="views">조회수 {item.view}</div>
                      <div className="date">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default PostCardGroup;
