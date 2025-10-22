import React, { useEffect, useRef, useState } from "react";
import "../../styles/postDetail/PostDetailMap.css";

/**
 * BaseMapInput (공통 지도 컴포넌트)
 *
 * props:
 * - markersData: [{ address, label }] 형식의 배열
 * - mapHeight: 지도 높이 (기본값 400px)
 */
const BaseMapInput = ({ markersData = [] }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const markersRef = useRef([]);
  const kakaoApiKey = import.meta.env.VITE_KAKAO_API_KEY;

  // ✅ Kakao SDK 동적 로드
  useEffect(() => {
    const existingScript = document.getElementById("kakao-map-sdk");
    if (!existingScript) {
      const script = document.createElement("script");
      script.id = "kakao-map-sdk";
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoApiKey}&autoload=false&libraries=services`;
      script.async = true;
      document.head.appendChild(script);
      script.onload = () => window.kakao.maps.load(initMap);
    } else {
      if (window.kakao?.maps) window.kakao.maps.load(initMap);
    }
  }, []);

  // ✅ 지도 초기화
  const initMap = () => {
    const container = mapRef.current;
    if (!container || !window.kakao) return;

    const mapInstance = new window.kakao.maps.Map(container, {
      center: new window.kakao.maps.LatLng(37.566826, 126.9786567),
      level: 6,
    });
    setMap(mapInstance);
  };

  // ✅ 마커 표시 로직
  useEffect(() => {
    if (!map) return;
    const { kakao } = window;
    const geocoder = new kakao.maps.services.Geocoder();

    // 기존 마커 제거
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    const bounds = new kakao.maps.LatLngBounds();
    let completed = 0;

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
        }
        // 모든 검색이 끝난 뒤 한번만 setBounds 실행
        completed++;
        if (completed === markersData.length) {
          if (!bounds.isEmpty()) map.setBounds(bounds);
        }
      });
    });
  }, [markersData, map]);

  return (
    <div
      ref={mapRef}
      className="post-detail-map-container"
    />
  );
};

export default BaseMapInput;
