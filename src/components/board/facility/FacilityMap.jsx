import React, { useEffect, useRef, useState } from "react";
import { Card } from "react-bootstrap";
import "../../../styles/facility/facilityMap.css";

const { kakao } = window;

const FacilityMap = ({ facilities = [] }) => {
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const [map, setMap] = useState(null);

  // ✅ 지도 초기화
  useEffect(() => {
    const container = mapRef.current;
    const options = {
      center: new kakao.maps.LatLng(37.566826, 126.9786567), // 서울 시청 좌표
      level: 7,
    };
    const mapInstance = new kakao.maps.Map(container, options);
    setMap(mapInstance);
  }, []);

  // 시설 목록이 변경될 때마다 마커 표시
  useEffect(() => {
    if (!map || facilities.length === 0) return;

    const geocoder = new kakao.maps.services.Geocoder();
    const bounds = new kakao.maps.LatLngBounds();

    // 기존 마커 제거
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // 시설 데이터 반복
    facilities.forEach((item) => {
      if (!item.address || item.address === "주소 없음") return;

      geocoder.addressSearch(item.address, (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
          const position = new kakao.maps.LatLng(result[0].y, result[0].x);

          // ✅ 마커 생성
          const marker = new kakao.maps.Marker({
            map,
            position,
            title: item.title,
          });
          markersRef.current.push(marker);

          // ✅ 인포윈도우 (시설명 표시)
          const infowindow = new kakao.maps.InfoWindow({
            content: `
              <div style="
                padding:5px 10px;
                font-size:13px;
                color:#333;
                font-weight:bold;
              ">
                ${item.title}
              </div>
            `,
          });

          kakao.maps.event.addListener(marker, "click", () => {
            infowindow.open(map, marker);
          });

          // 지도 범위 확장
          bounds.extend(position);
          map.setBounds(bounds);
        }
      });
    });
  }, [map, facilities]);

  return (
    <Card className="mb-4 diary-box">
      <Card.Body>
        <div
          ref={mapRef}
          className="map-container"
          style={{
            width: "100%",
            height: "400px",
            borderRadius: "10px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
          }}
        />
      </Card.Body>
    </Card>
  );
};

export default FacilityMap;
