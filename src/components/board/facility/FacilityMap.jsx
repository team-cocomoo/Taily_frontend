import React, { useEffect, useRef, useState } from "react";
import { Card } from "react-bootstrap";

/**
 * Kakao Map 기반 시설 지도
 *
 * props:
 * - facilities: 표시할 시설 배열 (lat, lng 포함)
 * - selectedFacility: 클릭된 시설 정보
 * - userLocation: 사용자 위치 {lat, lng}
 */
const FacilityMap = ({ facilities = [], selectedFacility, userLocation }) => {
  const mapRef = useRef(null);
  const [kakaoLoaded, setKakaoLoaded] = useState(false);
  const [map, setMap] = useState(null);
  const markersRef = useRef([]);

  // ✅ Kakao SDK 로드
  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      setKakaoLoaded(true);
      return;
    }

    if (document.getElementById("kakao-map-sdk")) return;

    const script = document.createElement("script");
    script.id = "kakao-map-sdk";
    const apiKey = import.meta.env.VITE_KAKAO_API_KEY;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&libraries=services&autoload=false`;
    script.async = true;
    script.onload = () => {
      window.kakao.maps.load(() => {
        console.log("✅ Kakao SDK 로드 완료");
        setKakaoLoaded(true);
      });
    };
    document.head.appendChild(script);
  }, []);

  // ✅ 지도 초기화 (유저 위치 중심)
  useEffect(() => {
    if (!kakaoLoaded || !window.kakao || !userLocation) return;
    const { kakao } = window;
    const container = mapRef.current;
    const options = {
      center: new kakao.maps.LatLng(userLocation.lat, userLocation.lng),
      level: 6,
    };
    const mapInstance = new kakao.maps.Map(container, options);
    setMap(mapInstance);

    // ✅ 내 위치 마커 추가
    const userMarkerImage = new kakao.maps.MarkerImage(
      "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
      new kakao.maps.Size(30, 45)
    );

    new kakao.maps.Marker({
      position: new kakao.maps.LatLng(userLocation.lat, userLocation.lng),
      map: mapInstance,
      image: userMarkerImage,
      title: "내 위치",
    });

    // ✅ 내 위치 라벨
    const userOverlay = new kakao.maps.CustomOverlay({
      position: new kakao.maps.LatLng(userLocation.lat, userLocation.lng),
      content: `
        <div style="
          background: #0066ff;
          color: white;
          font-weight: bold;
          padding: 3px 8px;
          border-radius: 5px;
          font-size: 12px;
          box-shadow: 1px 1px 4px rgba(0,0,0,0.3);
          white-space: nowrap;
        ">내 위치</div>
      `,
      yAnchor: 2.6,
    });
    userOverlay.setMap(mapInstance);
  }, [kakaoLoaded, userLocation]);

  // ✅ 병원 마커 표시 (lat/lng 기반)
  useEffect(() => {
    if (!map || facilities.length === 0) return;
    const { kakao } = window;
    const bounds = new kakao.maps.LatLngBounds();

    // 기존 마커 제거
    markersRef.current.forEach(({ marker, overlay }) => {
      marker.setMap(null);
      overlay.setMap(null);
    });
    markersRef.current = [];

    facilities.forEach((item) => {
      if (!item.lat || !item.lng) return;
      const coords = new kakao.maps.LatLng(item.lat, item.lng);

      const marker = new kakao.maps.Marker({
        map,
        position: coords,
        title: item.title,
      });

      const overlay = new kakao.maps.CustomOverlay({
        position: coords,
        content: `
          <div style="
            background: #FEB916;
            color: white;
            font-weight: bold;
            padding: 3px 8px;
            border-radius: 6px;
            font-size: 12px;
            box-shadow: 1px 1px 3px rgba(0,0,0,0.3);
            white-space: nowrap;
          ">${item.title}</div>
        `,
        yAnchor: 2.6,
      });
      overlay.setMap(map);

      kakao.maps.event.addListener(marker, "click", () => {
        map.panTo(coords);
        map.setLevel(3);
      });

      markersRef.current.push({ marker, overlay });
      bounds.extend(coords);
    });

    if (userLocation) {
      bounds.extend(new kakao.maps.LatLng(userLocation.lat, userLocation.lng));
    }
    map.setBounds(bounds);
  }, [map, facilities, userLocation]);

  // ✅ 카드 클릭 시 해당 시설로 이동
  useEffect(() => {
    if (!selectedFacility || !map) return;
    const { lat, lng } = selectedFacility;
    if (lat && lng) {
      const coords = new window.kakao.maps.LatLng(lat, lng);
      map.panTo(coords);
      map.setLevel(3);
    }
  }, [selectedFacility, map]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "20px",
        marginBottom: "20px",
      }}
    >
      <div
        ref={mapRef}
        style={{
          width: "50%",
          height: "400px",
          borderRadius: "10px",
          overflow: "hidden", // 지도 모서리 둥글게
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)", // 약간의 그림자 효과 (선택)
        }}
      />
    </div>
  );
};

export default FacilityMap;
