import React, { useEffect, useRef, useState } from "react";
import api from "../../../config/apiConfig";
import "../../../styles/postDetail/TailyFriendsMainMap.css";

const TailyFriendsMainMap = () => {
  const mapContainer = useRef(null);
  const [addresses, setAddresses] = useState([]);
  const [kakaoLoaded, setKakaoLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState({
    lat: 37.566826,
    lng: 126.9786567, // 기본 서울시청 좌표
  });
  const [loading, setLoading] = useState(true);

  // ✅ 주소 불러오기
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await api.get("/api/taily-friends/addresses");
        setAddresses(res.data.data || []);
      } catch (error) {
        console.error("❌ 주소 목록 불러오기 실패:", error);
      }
    };
    fetchAddresses();
  }, []);

  // ✅ 사용자 위치 가져오기 (3초 타임아웃)
  useEffect(() => {
    if (!navigator.geolocation) {
      console.warn("브라우저가 위치 서비스를 지원하지 않습니다.");
      setLoading(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      setLoading(false); // 기본 좌표로 표시
    }, 3000);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        clearTimeout(timeoutId);
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLoading(false);
      },
      (err) => {
        console.error("위치 정보 가져오기 실패:", err);
        clearTimeout(timeoutId);
        setLoading(false);
      }
    );
  }, []);

  // ✅ Kakao SDK 로드
  useEffect(() => {
    if (window.kakao?.maps) {
      setKakaoLoaded(true);
      return;
    }

    const apiKey = import.meta.env.VITE_KAKAO_API_KEY;
    if (!apiKey) {
      console.error("❌ VITE_KAKAO_API_KEY가 없습니다.");
      return;
    }

    const script = document.createElement("script");
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

  // ✅ 지도 생성 및 마커 표시
  useEffect(() => {
    if (
      !kakaoLoaded ||
      !window.kakao ||
      !userLocation ||
      addresses.length === 0
    )
      return;

    const { kakao } = window;
    const map = new kakao.maps.Map(mapContainer.current, {
      center: new kakao.maps.LatLng(userLocation.lat, userLocation.lng),
      level: 6,
    });

    const geocoder = new kakao.maps.services.Geocoder();
    const bounds = new kakao.maps.LatLngBounds();
    const cache = {}; // ✅ 주소 캐시

    // ✅ 내 위치 표시
    const myPos = new kakao.maps.LatLng(userLocation.lat, userLocation.lng);
    new kakao.maps.Marker({ map, position: myPos });
    bounds.extend(myPos);

    const userOverlay = new kakao.maps.CustomOverlay({
      position: myPos,
      content: `<div class="map-user-label">내 위치</div>`,
      yAnchor: 2.6,
    });
    userOverlay.setMap(map);

    // ✅ 모든 주소 비동기 변환 후 한 번에 setBounds()
    const promises = addresses.map((item) => {
      return new Promise((resolve) => {
        if (cache[item.address]) {
          createMarker(cache[item.address], item);
          resolve();
        } else {
          geocoder.addressSearch(item.address, (result, status) => {
            if (status === kakao.maps.services.Status.OK) {
              const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
              cache[item.address] = coords;
              createMarker(coords, item);
              resolve();
            } else {
              console.warn("주소 변환 실패:", item.address);
              resolve();
            }
          });
        }
      });
    });

    Promise.all(promises).then(() => {
      map.setBounds(bounds);
      setLoading(false);
    });

    // ✅ 마커 생성 함수
    function createMarker(coords, item) {
      const marker = new kakao.maps.Marker({ map, position: coords });

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

      kakao.maps.event.addListener(marker, "click", () => {
        window.location.href = `/taily-friends/${item.id}`;
      });
    }
  }, [kakaoLoaded, userLocation, addresses]);

  return (
    <div className="tailyfriends-map-wrapper">
      {loading && (
        <div className="map-loading">🐾 지도를 불러오는 중입니다...</div>
      )}
      <div ref={mapContainer} className="main-tailyfriends-map-container" />
    </div>
  );
};

export default TailyFriendsMainMap;
