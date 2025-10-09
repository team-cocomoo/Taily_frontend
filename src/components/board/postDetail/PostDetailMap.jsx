import React, { useEffect, useRef, useState } from "react";
import "../../../styles/postDetail/PostDetailMap.css";

const PostDetailMap = ({ addresses }) => {
  const mapContainer = useRef(null);
  const [kakaoLoaded, setKakaoLoaded] = useState(false);

  // Kakao SDK 동적 로딩
  useEffect(() => {
    if (!addresses || addresses.length === 0) return;

    const apiKey = import.meta.env.VITE_KAKAO_API_KEY;
    if (!apiKey) {
      console.error("❌ VITE_KAKAO_API_KEY 환경 변수가 로드되지 않았습니다.");
      return;
    }

    if (window.kakao) {
      setKakaoLoaded(true);
      return;
    }

    if (document.getElementById("kakao-map-sdk")) return;

    const script = document.createElement("script");
    script.id = "kakao-map-sdk";
    // 💡 autoload=false 파라미터를 추가하여 수동 초기화를 준비합니다.
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&libraries=services,places&autoload=false`;
    script.async = true;

    script.onload = () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          console.log("Kakao 지도 SDK 로드 성공 및 수동 초기화 준비 완료");
          setKakaoLoaded(true);
        });
      } else {
        console.error(
          "카카오 객체가 로드되었으나, maps 라이브러리 초기화에 실패했습니다."
        );
      }
    };

    script.onerror = () => {
      console.error(
        "카카오 지도 SDK 로드 실패: API 키 또는 도메인 등록을 확인하세요."
      );
    };

    document.head.appendChild(script);
  }, [addresses]);

  useEffect(() => {
    if (!kakaoLoaded || !window.kakao) return;

    const { kakao } = window;
    const map = new kakao.maps.Map(mapContainer.current, {
      center: new kakao.maps.LatLng(37.566826, 126.9786567), // 기본 서울 시청
      level: 3,
    });

    const geocoder = new kakao.maps.services.Geocoder();
    const ps = new kakao.maps.services.Places();
    const bounds = new kakao.maps.LatLngBounds();

    const addrList = Array.isArray(addresses) ? addresses : [addresses];

    addrList.forEach((address, index) => {
      const createMarkerWithInfo = (coords) => {
        const markerImageSrc =
          "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";
        const markerImageSize = new kakao.maps.Size(24, 35); // 크기 조절
        const markerImageOptions = { offset: new kakao.maps.Point(12, 35) }; // 중심점

        const markerImage = new kakao.maps.MarkerImage(
          markerImageSrc,
          markerImageSize,
          markerImageOptions
        );

        const marker = new kakao.maps.Marker({
          map,
          position: coords,
          image: markerImage,
        });
        // 2️⃣ CustomOverlay (글씨 스타일)
        const overlayDiv = document.createElement("div");
        overlayDiv.style.padding = "5px 10px";
        overlayDiv.style.backgroundColor = "#FEB916";
        overlayDiv.style.color = "#fff";
        overlayDiv.style.fontWeight = "bold";
        overlayDiv.style.fontSize = "12px";
        overlayDiv.style.borderRadius = "6px";
        overlayDiv.style.boxShadow = "2px 2px 5px rgba(0,0,0,0.3)";
        overlayDiv.style.whiteSpace = "nowrap";
        overlayDiv.innerText =
          addrList.length > 1 ? `${index + 1}. ${address}` : address;

        const overlay = new kakao.maps.CustomOverlay({
          position: coords,
          content: overlayDiv,
          yAnchor: 2.4,
        });

        overlay.setMap(map);
        bounds.extend(coords);
        map.setBounds(bounds);
      };

      // 주소 검색
      geocoder.addressSearch(address, (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
          const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
          createMarkerWithInfo(coords);
        } else {
          // 주소 검색 실패 시 키워드 검색
          ps.keywordSearch(address, (data, status) => {
            if (status === kakao.maps.services.Status.OK) {
              const coords = new kakao.maps.LatLng(data[0].y, data[0].x);
              createMarkerWithInfo(coords);
            } else {
              console.error("검색 실패:", address, status);
            }
          });
        }
      });
    });
  }, [addresses, kakaoLoaded]);

  return <div ref={mapContainer} className="map-container" />;
};

export default PostDetailMap;
