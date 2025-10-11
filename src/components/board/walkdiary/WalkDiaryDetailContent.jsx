import React, { useContext } from "react";
import { Card, Dropdown, Row, Col } from "react-bootstrap";
import "../../../styles/walkDiary/WalkDiaryDetail.css";
import { AuthContext } from "../../../contexts/AuthContext"
import meatballIcon from "../../../assets/image/meatball-icon.png";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../config/apiConfig";

const WalkDiaryDetailContent = ({ walkDiary }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  // 로그인 + 작성자 본인일 경우만 수정/삭제 노출
  const isOwner = user && user.username === walkDiary.username;
  
  const handleDelete = async () => {
    const token = localStorage.getItem("accessToken");
    if (!window.confirm("정말 삭제하시겠습니까?")) return; // 확인창

    try {
      await api.delete(`/api/walk-diaries/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      alert("삭제 완료");
      navigate("/walk-diaries"); // 삭제 후 목록으로 이동
    } catch (error) {
      console.error("삭제 실패:", error);
      alert("삭제에 실패했습니다.");
    }
  };
  
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
                {isOwner ? (
                  <>
                    <Dropdown.Item
                    onClick={() => 
                      navigate(`/walk-diaries/edit/${id}`, { state: { clickedDate: walkDiary.date } })
                    }
                    className="dropdown-item"
                    >
                    수정
                    </Dropdown.Item>
                    <Dropdown.Item onClick={handleDelete}>
                      삭제
                    </Dropdown.Item>
                  </>
                ) : (
                  <>
                    <Dropdown.Item
                      onClick={() => alert("신고")}
                      className="dropdown-item"
                    >
                      신고
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => alert("공유")}>
                      공유
                    </Dropdown.Item>
                  </>
                )}
                
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
