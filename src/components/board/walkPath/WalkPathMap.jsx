// ---------------------------WalkPathMap.jsx------------------------
import React, { useState } from "react";
import { InputGroup, Form, Card, Button } from "react-bootstrap";
import MapIcon from "../../../assets/image/map-search-icon.png";
import "../../../styles/facility/facilityMap.css"; // 기존 지도 스타일 재사용
import BaseMap from "../../common/Basemap.jsx"; // 기본 지도 공통 로직 재사용 (default export: BaseMapInput)

// Kakao SDK 전역 사용은 BaseMap 내부에서 처리하므로 이 파일에선 불필요
// const { kakao } = window;

const WalkPathMap = () => {
  // 산책 장소 목록 (최대 7개) — 기존 로직 유지
  const [places, setPlaces] = useState([""]);

  // 입력 값 변경 핸들러 — 기존 로직 유지
  const handlePlaceChange = (index, value) => {
    setPlaces((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  // 장소 추가 (최대 7개) — 기존 로직 유지
  const addPlaceField = () => {
    setPlaces((prev) => (prev.length < 7 ? [...prev, ""] : prev));
  };

  // 장소 삭제 — 기존 로직 유지
  const removePlaceField = (index) => {
    setPlaces((prev) => prev.filter((_, i) => i !== index));
  };

  // BaseMap.jsx로 넘길 markersData 구성
  // places 배열을 [{ address, label }]로 매핑
  const markersData = places.map((address, idx) => ({
    address,
    label: `산책 장소 ${idx + 1}`,
  }));

  return (
    <Card className="mb-4 diary-box">
      <Card.Header>산책 경로</Card.Header>
      <Card.Body>
        <Form>
          {/* 지도 영역 - BaseMap 재사용 */}
          <div className="map-container mb-4" style={{ width: "100%" }}>
            <BaseMap markersData={markersData} mapHeight={400} />
          </div>

          {/* 입력 폼들 — 기존 UI/흐름 유지 */}
          {places.map((place, idx) => (
            <Form.Group key={idx} className="mb-3" controlId={`place-${idx}`}>
              <InputGroup>
                <InputGroup.Text>
                  <img
                    src={MapIcon}
                    alt="지도 아이콘"
                    style={{ width: 12, height: 16 }}
                  />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder={`산책 장소 ${idx + 1} 입력`}
                  value={place}
                  onChange={(e) => handlePlaceChange(idx, e.target.value)}
                />
                {places.length > 1 && (
                  <Button
                    variant="outline-danger"
                    onClick={() => removePlaceField(idx)}
                  >
                    삭제
                  </Button>
                )}
              </InputGroup>
            </Form.Group>
          ))}

          {/* 추가 버튼 — 기존 로직 유지 */}
          <Button
            variant="outline-primary"
            onClick={addPlaceField}
            disabled={places.length >= 7}
          >
            + 산책 장소 추가
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default WalkPathMap;
