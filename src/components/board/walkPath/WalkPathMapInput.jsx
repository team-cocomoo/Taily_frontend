import React, { useState, useEffect } from "react";
import { InputGroup, Form, Card, Button } from "react-bootstrap";
import MapIcon from "../../../assets/image/map-search-icon.png";
import "../../../styles/facility/facilityMap.css";
import BaseMap from "../../common/Basemap.jsx";

const WalkPathMapInput = ({
  mode = "create",
  initialRoutes = [],
  onChange,
}) => {
  // 산책 장소 목록 (최대 3개)
  const [places, setPlaces] = useState(
    initialRoutes.length > 0 ? initialRoutes : [""]
  );

  useEffect(() => {
    onChange(places);
  }, [places]);

  // 입력 값 변경
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

  // 지도 마커 데이터
  const markersData = places.map((place, idx) => ({
    address: place,
    label: `산책 장소 ${idx + 1}`,
  }));

  return (
    <Card className="mb-4 diary-box">
      <Card.Header>
        {mode === "edit" ? "산책 경로 수정" : "산책 경로 입력"}
      </Card.Header>

      <Card.Body
        style={{
          padding: "30px",
          paddingBottom: "10px",
          backgroundColor: "#fffef8", // 시각적으로 부드럽게
        }}
      >
        {/* ✅ 지도 */}
        <div className="map-wrapper">
          <BaseMap markersData={markersData} mapHeight={340} />
        </div>

        {/* ✅ 지도 아래 자연스러운 간격 */}
        <div style={{ height: "10px" }}></div>

        {/* ✅ 입력 폼 */}
        <Form>
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

          {places.length < 3 && (
            <Button
              variant="outline-primary"
              onClick={addPlaceField}
              className="mt-2"
            >
              + 산책 장소 추가
            </Button>
          )}
        </Form>
      </Card.Body>
    </Card>
  );
};

export default WalkPathMapInput;
