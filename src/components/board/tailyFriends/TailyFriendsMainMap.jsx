// src/components/main/MainTailyFriendsMap.jsx
import React, { useEffect, useRef, useState } from "react";
import api from "../../../config/apiConfig";
import "../../../styles/postDetail/TailyFriendsMainMap.css";

const TailyFriendsMainMap = () => {
  const mapContainer = useRef(null);
  const [addresses, setAddresses] = useState([]);
  const [kakaoLoaded, setKakaoLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState(null); // ✅ 사용자 위치 저장

  // ✅ 전체 게시글 주소 불러오기
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await api.get("/api/taily-friends/addresses");
        setAddresses(response.data.data || []);
      } catch (error) {
        console.error("주소 목록 불러오기 실패:", error);
      }
    };
    fetchAddresses();
  }, []);

  // ✅ 사용자 현재 위치 가져오기
  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("❌ 브라우저가 위치 서비스를 지원하지 않습니다.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        console.log("📍 사용자 위치:", latitude, longitude);
      },
      (err) => {
        console.error("❌ 위치 정보를 가져올 수 없습니다:", err);
        // 기본값: 서울시청
        setUserLocation({ lat: 37.566826, lng: 126.9786567 });
      }
    );
  }, []);

  // ✅ Kakao SDK 로드
  useEffect(() => {
    const apiKey = import.meta.env.VITE_KAKAO_API_KEY;
    if (!apiKey) {
      console.error("❌ VITE_KAKAO_API_KEY 환경 변수가 없습니다.");
      return;
    }

    if (window.kakao?.maps) {
      setKakaoLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.id = "kakao-map-sdk";
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&libraries=services,places&autoload=false`;
    script.async = true;

    script.onload = () => {
      if (window.kakao?.maps) {
        window.kakao.maps.load(() => {
          console.log("✅ Kakao 지도 SDK 로드 완료");
          setKakaoLoaded(true);
        });
      }
    };

    script.onerror = () => {
      console.error("❌ Kakao 지도 SDK 로드 실패");
    };

    document.head.appendChild(script);
  }, []);

  // ✅ 지도 표시 및 마커 렌더링
  useEffect(() => {
    if (!kakaoLoaded || !window.kakao || !userLocation) return;

    const { kakao } = window;

    // ✅ 사용자 위치 기준 중심 설정
    const map = new kakao.maps.Map(mapContainer.current, {
      center: new kakao.maps.LatLng(userLocation.lat, userLocation.lng),
      level: 6,
    });

    const geocoder = new kakao.maps.services.Geocoder();
    const bounds = new kakao.maps.LatLngBounds();

    // ✅ 사용자 위치 마커 표시
    const userMarker = new kakao.maps.Marker({
      position: new kakao.maps.LatLng(userLocation.lat, userLocation.lng),
      map,
      title: "내 위치",
    });

    const userOverlay = new kakao.maps.CustomOverlay({
      position: new kakao.maps.LatLng(userLocation.lat, userLocation.lng),
      content: `
        <div style="
          background: #0066ff;
          color: white;
          font-weight: bold;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          box-shadow: 1px 1px 4px rgba(0,0,0,0.3);
          white-space: nowrap;
        ">내 위치</div>
      `,
      yAnchor: 2.6
    });
    userOverlay.setMap(map);

    // ✅ 게시글 주소 마커 표시
    addresses.forEach((item) => {
      const address = item.address;
      if (!address) return;

      geocoder.addressSearch(address, (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
          const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
          const marker = new kakao.maps.Marker({
            map,
            position: coords,
          });

          // ✅ 커스텀 오버레이 (게시글 제목)
          const overlayDiv = document.createElement("div");
          overlayDiv.className = "main-map-overlay";
          overlayDiv.innerText = item.title || "제목 없음";

          const overlay = new kakao.maps.CustomOverlay({
            position: coords,
            content: overlayDiv,
            yAnchor: 2.6,
          });

          overlay.setMap(map);
          bounds.extend(coords);

          // ✅ 마커 클릭 시 상세 이동
          kakao.maps.event.addListener(marker, "click", () => {
            window.location.href = `/taily-friends/${item.id}`;
          });
        } else {
          console.warn(`주소 검색 실패: ${address}`);
        }
      });
    });

    // 지도 영역에 모든 마커 포함시키기
    bounds.extend(new kakao.maps.LatLng(userLocation.lat, userLocation.lng));
    map.setBounds(bounds);
  }, [addresses, kakaoLoaded, userLocation]);

  return (
    <div className="tailyfriends-map-wrapper">
      <div ref={mapContainer} className="main-tailyfriends-map-container" />
    </div>
  );
};

export default TailyFriendsMainMap;
