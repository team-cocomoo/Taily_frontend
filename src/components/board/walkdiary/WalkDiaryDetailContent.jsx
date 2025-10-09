import React from "react";
import { Card, Dropdown, Row, Col } from "react-bootstrap";
import "../../../styles/walkdiary/WalkDiaryDetail.css";

import meatballIcon from "../../../assets/image/meatball-icon.png";

const WalkDiaryDetailContent = ({ walkDiary }) => {
    const weatherIcons = {
      SUNNY: "☀️",
      CLOUDY: "☁️",
      RAINY: "🌧️",
      SNOWY: "❄️",
    };

  const emotionIcons = {
    LOVE: "😍",
    SMILE: "🙂",
    NEUTRAL: "😐",
    SAD: "😟",
    ANGRY: "😡",
  };
  if (!walkDiary) return null;

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
          <Col sm={10}>{walkDiary.date}</Col>
        </Row>
        <Row className="mb-2">
          <Col sm={2}>날씨</Col>
          <Col sm={10}>
            {weatherIcons[walkDiary.walkDiaryWeather]}
          </Col>
        </Row>
        <Row className="mb-2">
          <Col sm={2}>산책 시간</Col>
          <Col sm={10}>
            {walkDiary.beginTime} ~ {walkDiary.endTime} ({walkDiary.totalTime})
          </Col>
        </Row>
        <Row className="mb-2">
          <Col sm={2}>테일리의 기분</Col>
          <Col sm={10}>
            {emotionIcons[walkDiary.walkDiaryEmotion]}
          </Col>
        </Row>

        <hr className="mx-auto w-50 mb-4" />

        {/* 이미지 */}
        {walkDiary.images && walkDiary.images.length > 0 ? (
          <div className="d-flex justify-content-center flex-wrap mb-4 gap-3">
            {walkDiary.images.map((img, idx) => (
              <div key={idx} className="image-wrapper">
                <img
                  src={img.imageUrl || img.url || img.imagePath}
                  alt={`산책일지-${idx}`}
                  className="detail-image"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted mb-4">
            <em>첨부된 사진이 없습니다.</em>
          </div>
        )}

        <div
          className="post-detail-content"
          style={{ whiteSpace: "pre-wrap", minHeight: "200px" }}
          dangerouslySetInnerHTML={{ __html: walkDiary.content }}
        />


      </Card.Body>
    </Card>
    
    
  );
};

export default WalkDiaryDetailContent;
