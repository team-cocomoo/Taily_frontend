import React, { useEffect, useRef, useState } from "react";
import { Card } from "react-bootstrap";

const FacilityMap = ({ facilities = [], selectedFacility, userLocation }) => {
  const mapRef = useRef(null);
  const [kakaoLoaded, setKakaoLoaded] = useState(false);
  const markersRef = useRef([]);
  const [map, setMap] = useState(null);

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

    const userMarker = new kakao.maps.Marker({
      position: new kakao.maps.LatLng(userLocation.lat, userLocation.lng),
      map: mapInstance,
      image: userMarkerImage,
      title: "내 위치",
    });

    // ✅ 내 위치 텍스트 라벨 추가
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
      yAnchor: 2.2,
    });
    userOverlay.setMap(mapInstance);
  }, [kakaoLoaded, userLocation]);

  // ✅ 병원 마커 표시
  useEffect(() => {
    if (!map || facilities.length === 0) return;

    const { kakao } = window;
    const geocoder = new kakao.maps.services.Geocoder();
    const bounds = new kakao.maps.LatLngBounds();

    // 기존 마커 제거
    markersRef.current.forEach(({ marker, overlay }) => {
      marker.setMap(null);
      overlay.setMap(null);
    });
    markersRef.current = [];

    facilities.forEach((item) => {
      const address =
        typeof item.address === "object" ? item.address["#text"] : item.address;
      if (!address || address === "주소 없음") return;

      geocoder.addressSearch(address, (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
          const coords = new kakao.maps.LatLng(result[0].y, result[0].x);

          // ✅ 마커 생성
          const marker = new kakao.maps.Marker({
            map,
            position: coords,
            title: item.title,
          });

          // ✅ 병원 이름 라벨
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
              ">
                ${item.title}
              </div>
            `,
            yAnchor: 2.2,
          });
          overlay.setMap(map);

          kakao.maps.event.addListener(marker, "click", () => {
            map.panTo(coords);
            map.setLevel(3);
          });

          markersRef.current.push({ marker, overlay });
          bounds.extend(coords);
        }
      });
    });

    // ✅ 지도 범위 확장 (내 위치 + 병원 포함)
    if (userLocation) {
      bounds.extend(new kakao.maps.LatLng(userLocation.lat, userLocation.lng));
    }
    map.setBounds(bounds);
  }, [map, facilities, userLocation]);

  // ✅ 카드 클릭 시 해당 시설로 이동
  useEffect(() => {
    if (!selectedFacility || !map) return;
    const { kakao } = window;
    const geocoder = new kakao.maps.services.Geocoder();

    geocoder.addressSearch(selectedFacility.address, (result, status) => {
      if (status === kakao.maps.services.Status.OK) {
        const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
        map.panTo(coords);
        map.setLevel(3);
      }
    });
  }, [selectedFacility, map]);

  return (
    <Card className="mb-4 diary-box">
      <Card.Body>
        <div
          ref={mapRef}
          style={{ width: "100%", height: "400px", borderRadius: "10px" }}
        />
      </Card.Body>
    </Card>
  );
};

export default FacilityMap;
