import React, { useState, useEffect, useRef } from "react";
import { InputGroup, Form, Card } from "react-bootstrap";
import MapIcon from "../../../assets/image/map-search-icon.png";

const { kakao } = window;

const TailyFriendsWriteMap = ({ address, setAddress }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const overlayRef = useRef(null);
  const [map, setMap] = useState(null);

  // 지도 초기화
  useEffect(() => {
    const container = mapRef.current;
    const mapInstance = new kakao.maps.Map(container, {
      center: new kakao.maps.LatLng(37.566826, 126.9786567), // 서울 시청
      level: 3,
    });
    setMap(mapInstance);
  }, []);

  // map 생성 후 초기 주소가 있으면 마커 표시
  useEffect(() => {
    if (!map || !address) return;

    const geocoder = new kakao.maps.services.Geocoder();
    geocoder.addressSearch(address, (result, status) => {
      if (status === kakao.maps.services.Status.OK) {
        const position = new kakao.maps.LatLng(result[0].y, result[0].x);
        updateMarkerAndOverlay(position, address);
        map.setCenter(position);
      }
    });
  }, [map, address]);

  // 주소 입력 시 마커 + CustomOverlay 업데이트
  useEffect(() => {
    if (!map || !setAddress) return; // setAddress가 없으면 입력 무시

    if (!address) return; // 작성용일 경우

    const geocoder = new kakao.maps.services.Geocoder();
    const ps = new kakao.maps.services.Places();

    geocoder.addressSearch(address, (result, status) => {
      if (status === kakao.maps.services.Status.OK) {
        const position = new kakao.maps.LatLng(result[0].y, result[0].x);
        updateMarkerAndOverlay(position, address);
        map.setCenter(position);
      } else {
        ps.keywordSearch(address, (data, status) => {
          if (status === kakao.maps.services.Status.OK) {
            const position = new kakao.maps.LatLng(data[0].y, data[0].x);
            updateMarkerAndOverlay(position, data[0].place_name);
            map.setCenter(position);
          }
        });
      }
    });
  }, [map, address]);

  // 마커 + CustomOverlay 생성/업데이트 함수
  const updateMarkerAndOverlay = (position, label) => {
    const markerImageSrc =
      "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";
    const markerImageSize = new kakao.maps.Size(24, 35);
    const markerImageOptions = { offset: new kakao.maps.Point(12, 35) };
    const markerImage = new kakao.maps.MarkerImage(
      markerImageSrc,
      markerImageSize,
      markerImageOptions
    );

    if (markerRef.current) {
      markerRef.current.setPosition(position);
    } else {
      markerRef.current = new kakao.maps.Marker({
        map,
        position,
        image: markerImage,
      });
    }

    const overlayDiv = document.createElement("div");
    overlayDiv.style.padding = "5px 10px";
    overlayDiv.style.backgroundColor = "#FEB916";
    overlayDiv.style.color = "#fff";
    overlayDiv.style.fontWeight = "bold";
    overlayDiv.style.fontSize = "12px";
    overlayDiv.style.borderRadius = "6px";
    overlayDiv.style.boxShadow = "2px 2px 5px rgba(0,0,0,0.3)";
    overlayDiv.innerText = label;

    if (overlayRef.current) {
      overlayRef.current.setPosition(position);
      overlayRef.current.setContent(overlayDiv);
    } else {
      overlayRef.current = new kakao.maps.CustomOverlay({
        position,
        content: overlayDiv,
        yAnchor: 2.4,
      });
      overlayRef.current.setMap(map);
    }
  };

  return (
    <Card className="mb-4 diary-box">
      <Card.Header className="card-header">
        <span>모임 장소</span>
      </Card.Header>
      <Card.Body>
        <Form>
          <Form.Group className="mb-3" controlId="diaryAddress">
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

          <div ref={mapRef} style={{ width: "100%", height: "400px" }} />
        </Form>
      </Card.Body>
    </Card>
  );
};

export default TailyFriendsWriteMap;
