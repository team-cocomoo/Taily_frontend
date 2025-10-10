import React, { useState, useEffect, useRef } from "react";
import { InputGroup, Form, Card } from "react-bootstrap";
import MapIcon from "../../../assets/image/map-search-icon.png";
import "../../../styles/facility/facilityMap.css";

const { kakao } = window;

const WalkPathMap = ({ address, setAddress }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const overlayRef = useRef(null);
  const [map, setMap] = useState(null);

  // FacilityMap의 useEffect, updateMarkerAndOverlay 복붙
  useEffect(() => {
    const container = mapRef.current;
    const mapInstance = new kakao.maps.Map(container, {
      center: new kakao.maps.LatLng(37.566826, 126.9786567),
      level: 3,
    });
    setMap(mapInstance);
  }, []);

  // ... 나머지 useEffect, updateMarkerAndOverlay 그대로 복사

  return (
    <Card className="mb-4 diary-box">
      <Card.Header>산책 경로</Card.Header>
      <Card.Body>
        <Form>
          {/* 지도 div */}
          <div ref={mapRef} className="map-container" style={{ marginBottom: "20px" }}/>
          <Form.Group className="mb-3" controlId="walkPathAddress">
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
                placeholder="주소를 입력하세요"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </InputGroup>
          </Form.Group>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default WalkPathMap;
