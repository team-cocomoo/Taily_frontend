import React, { useState } from "react";
import { InputGroup, Form, Card, Button } from "react-bootstrap";
import MapIcon from "../../../assets/image/map-search-icon.png";
import "../../../styles/facility/facilityMap.css"; // 기존 지도 스타일 재사용
import BaseMap from "../../common/Basemap.jsx"; // 기본 지도 공통 로직 재사용 (default export: BaseMapInput)
import { useEffect } from "react";

const WalkPathMapInput = ({
  mode = "create",
  initialRoutes = [],
  onChange,
}) => {
  // 산책 장소 목록 (최대 3개) — 기존 로직 유지
  const [places, setPlaces] = useState(
    initialRoutes.length > 0 ? initialRoutes : [""]
  );

  useEffect(() => {
    onChange(places);
  }, [places]); //places가 바뀔 때마다 상위 전달

  // 입력 값 변경 핸들러
  const handlePlaceChange = (index, value) => {
    const updated = [...places];
    updated[index] = value;
    setPlaces(updated);
  };

  // 장소 추가 (최대 3개)
  const addPlaceField = () => {
    if (places.length >= 3) return;
    setPlaces([...places, ""]);
  };
  // 장소 삭제
  const removePlaceField = (index) => {
    setPlaces(places.filter((_, i) => i !== index));
  };

  const markersData = places.map((place, idx) => ({
    address: place,
    label: `산책 장소 ${idx + 1}`,
  }));

  return (
    <Card className="mb-4 diary-box">
      <Card.Header>
        {mode === "edit" ? "산책 경로 수정" : "산책 경로 입력"}
      </Card.Header>
      <Card.Body>
        <Form>
          <div className="map-container mb-4" style={{ width: "100%" }}>
            <BaseMap markersData={markersData} mapHeight={400} />
          </div>

          {places.map((place, idx) => (
            <Form.Group key={idx} className="mb-3">
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

          {places.length < 7 && (
            <Button variant="outline-primary" onClick={addPlaceField}>
              + 산책 장소 추가
            </Button>
          )}
        </Form>
      </Card.Body>
    </Card>
  );
};

export default WalkPathMapInput;
