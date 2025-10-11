import React, { useState, useEffect, useRef } from "react";
import { InputGroup, Form, Card, Button } from "react-bootstrap";
import MapIcon from "../../../assets/image/map-search-icon.png";
import "../../../styles/facility/facilityMap.css"; // 기존 지도 스타일 재사용

const { kakao } = window;

const WalkPathMap = () => {
  const [places, setPlaces] = useState([""]); // 산책 장소 목록 (최대 7개)
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);

  // 지도 초기화
  useEffect(() => {
    const mapInstance = new kakao.maps.Map(mapRef.current, {
      center: new kakao.maps.LatLng(37.566826, 126.9786567), // 서울 시청 기준
      level: 4,
    });
    setMap(mapInstance);
  }, []);

  // 장소 목록이 바뀔 때마다 마커 갱신
  useEffect(() => {
    if (!map) return;

    const geocoder = new kakao.maps.services.Geocoder();

    // 기존 마커 모두 제거
    markers.forEach((marker) => marker.setMap(null));
    const newMarkers = [];

    // 각 장소 주소로 마커 생성
    places.forEach((place) => {
      if (!place) return;
      geocoder.addressSearch(place, (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
          const position = new kakao.maps.LatLng(result[0].y, result[0].x);
          const marker = new kakao.maps.Marker({ map, position });
          newMarkers.push(marker);
          map.setCenter(position);
        }
      });
    });

    setMarkers(newMarkers);
  }, [places, map]);

  // 입력 값 변경 핸들러
  const handlePlaceChange = (index, value) => {
    setPlaces((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  // 장소 추가 (최대 7개)
  const addPlaceField = () => {
    setPlaces((prev) => (prev.length < 7 ? [...prev, ""] : prev));
  };

  // 장소 삭제
  const removePlaceField = (index) => {
    setPlaces((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Card className="mb-4 diary-box">
      <Card.Header>산책 경로</Card.Header>
      <Card.Body>
        <Form>
          {/* 지도 영역 */}
          <div
            ref={mapRef}
            className="map-container mb-4"
            style={{ width: "100%", height: "400px" }}
          />

          {/* 입력 폼들 */}
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

          {/* 추가 버튼 */}
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
