import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import "../../../styles/facility/facility.css";

const FacilityPostCard = ({ items, onItemClick }) => {
  return (
    <div className="page-card-container">
      {/* ✅ 스크롤 가능한 영역 */}
      <div className="list-container">
        <Row className="g-4">
          {items.map((item) => (
            <Col xs={12} md={6} lg={6} key={item.id}>
              <Card
                className="facility-card h-100"
                onClick={() => onItemClick(item.id)}
                role="button"
                tabIndex={0}
              >
                <Card.Body>
                  <h5 className="facility-name">{item.title}</h5>
                  <ul className="facility-meta">
                    <li><span className="label">전화번호</span> : {item.phone}</li>
                    <li><span className="label">주소</span> : {item.address}</li>
                    <li><span className="label">진료</span> : {item.status}</li>
                    <li className="distance">{item.distanceKm} km</li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default FacilityPostCard;
