import React from "react";
import { Card, Dropdown, Row, Col } from "react-bootstrap";
import "../../../styles/walkdiary/WalkDiaryDetail.css";

import meatballIcon from "../../../assets/image/meatball-icon.png";

const WalkDiaryDetailContent = ({ post }) => {
  if (!post) return null;


  return (
    <Card className="mb-4 detail-box">
      <Card.Header className="m-3">
        <Row>
          <Col sm={11}>
            <h2>오늘의 산책 일지</h2>
          </Col>
          <Col className="d-flex justify-content-end">
            <Dropdown className="profile-dropdown">
              <Dropdown.Toggle
              variant="light"
                id="dropdown-basic"
                size="sm"
                className="no-caret"
              >
                <img src={meatballIcon} alt="메뉴" className="meatballIcon" />
              </Dropdown.Toggle>
              {/* 나중에 로그인 했을때는 수정,삭제가 뜨게 */}
              <Dropdown.Menu className="dropdown-menu">
                <Dropdown.Item
                  onClick={() => alert("신고")}
                  className="dropdown-item"
                >
                  신고하기
                </Dropdown.Item>
                <Dropdown.Item onClick={() => alert("공유")}>
                  공유하기
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>
      </Card.Header>
      <Card.Body className="m-3">
        <Row className="mb-2">
          <Col sm={2}>날짜</Col>
          <Col sm={10}>{post.date}</Col>
        </Row>
        <Row className="mb-2">
          <Col sm={2}>날씨</Col>
          <Col sm={10}>{post.weather}</Col>
        </Row>
        <Row className="mb-2">
          <Col sm={2}>산책 시간</Col>
          <Col sm={10}>{post.startTime} ~ {post.endTime} ({post.totalTime})</Col>
        </Row>
        <Row className="mb-2">
          <Col sm={2}>{post.petName}의 기분</Col>
          <Col sm={10}>{post.emotion}</Col>
        </Row>

        <hr className="mx-auto w-50 mb-4" />

        {/* 이미지 */}
        <div className="d-flex justify-content-center mb-4">
          <div className="images">사진</div>
        </div>


        <div
          className="post-detail-content"
          style={{ whiteSpace: "pre-wrap", minHeight: "200px" }}
        >
          {post.content}
        </div>


      </Card.Body>
    </Card>
    
    
  );
};

export default WalkDiaryDetailContent;
