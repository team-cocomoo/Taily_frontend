import React, { useEffect, useRef, useState } from "react";
const { kakao } = window;

/**
 * BaseMapInput (공통 지도 컴포넌트)
 *
 * props:
 * - markersData: [{ address, label }] 형식의 배열
 * - mapHeight: 지도 높이 (기본값 400px)
 */
const BaseMapInput = ({ markersData = [], mapHeight = 400 }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const markersRef = useRef([]);

  // ✅ 지도 초기화
  useEffect(() => {
    const container = mapRef.current;
    const mapInstance = new kakao.maps.Map(container, {
      center: new kakao.maps.LatLng(37.566826, 126.9786567), // 서울 시청 기준
      level: 4,
    });
    setMap(mapInstance);
  }, []);

  // ✅ 마커 표시 로직
  useEffect(() => {
    if (!map) return;
    const { kakao } = window;
    const geocoder = new kakao.maps.services.Geocoder();

    // 기존 마커 제거
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    const bounds = new kakao.maps.LatLngBounds();

    markersData.forEach((item, idx) => {
      if (!item.address || item.address.trim() === "") return;

      geocoder.addressSearch(item.address, (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
          const lat = parseFloat(result[0].y);
          const lng = parseFloat(result[0].x);
          const position = new kakao.maps.LatLng(lat, lng);

          const marker = new kakao.maps.Marker({ map, position });
          const overlay = new kakao.maps.CustomOverlay({
            position,
            content: `
              <div style="
                background:#FEB916;
                color:white;
                font-weight:bold;
                padding:3px 8px;
                border-radius:6px;
                font-size:12px;
                box-shadow:1px 1px 3px rgba(0,0,0,0.3);
                white-space:nowrap;
              ">${item.label || `${idx + 1}번 장소`}</div>
            `,
            yAnchor: 2.2,
          });
          overlay.setMap(map);

          markersRef.current.push(marker);
          bounds.extend(position);
          map.setBounds(bounds);
        }
      });
    });
  }, [markersData, map]);

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: `${mapHeight}px`,
        borderRadius: "10px",
        border: "1px solid #ccc",
      }}
    />
  );
};

export default BaseMapInput;
