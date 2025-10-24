import React, { useEffect, useRef, useState } from "react";
import api from "../../../config/apiConfig";
import "../../../styles/postdetail/TailyFriendsMainMap.css";

const TailyFriendsMainMap = () => {
  const mapContainer = useRef(null);
  const [addresses, setAddresses] = useState([]);
  const [kakaoLoaded, setKakaoLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState({
    lat: 37.566826,
    lng: 126.9786567, // 기본 서울시청 좌표
  });
  const [loading, setLoading] = useState(true);

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

    const ps = new kakao.maps.services.Places();
    const bounds = new kakao.maps.LatLngBounds();

    const myPos = new kakao.maps.LatLng(userLocation.lat, userLocation.lng);
    new kakao.maps.Marker({ map, position: myPos });
    bounds.extend(myPos);

    const userOverlay = new kakao.maps.CustomOverlay({
      position: myPos,
      content: `<div class="map-user-label">내 위치</div>`,
      yAnchor: 2.6,
    });
    userOverlay.setMap(map);

    const promises = addresses.map((item) => {
      return new Promise((resolve) => {
        ps.keywordSearch(item.address, (result, status) => {
          if (status === kakao.maps.services.Status.OK && result.length > 0) {
            const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
            createMarker(coords, item);
            bounds.extend(coords);
          } else {
            console.warn("키워드 검색 실패:", item.address);
          }
          resolve();
        });
      });
    });

    Promise.all(promises).then(() => {
      map.setCenter(new kakao.maps.LatLng(userLocation.lat, userLocation.lng));
      map.setLevel(2);
      setLoading(false);
    });

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
