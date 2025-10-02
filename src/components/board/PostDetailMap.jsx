import React, { useEffect, useRef, useState } from "react";

const PostDetailMap = ({ addresses }) => {
  const mapContainer = useRef(null);
  const [kakaoLoaded, setKakaoLoaded] = useState(false);

  // 1️⃣ Kakao SDK 동적 로딩
  useEffect(() => {
    // 1. 주소가 없으면 종료
    if (!addresses || addresses.length === 0) return;

    // 2. API 키 유효성 검사
    const apiKey = import.meta.env.VITE_KAKAO_API_KEY;
    if (!apiKey) {
      console.error("❌ VITE_KAKAO_API_KEY 환경 변수가 로드되지 않았습니다.");
      return;
    }

    // 3. 이미 로드되었거나, 스크립트가 이미 존재하면 상태만 업데이트
    if (window.kakao) {
      setKakaoLoaded(true);
      return;
    }

    if (document.getElementById("kakao-map-sdk")) return;

    // 4. SDK 스크립트 생성 및 로드
    const script = document.createElement("script");
    script.id = "kakao-map-sdk";
    // 💡 autoload=false 파라미터를 추가하여 수동 초기화를 준비합니다.
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&libraries=services,places&autoload=false`;
    script.async = true;

    script.onload = () => {
      // 5. 스크립트 로드 성공 후, 수동으로 지도 라이브러리 초기화
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          console.log("✅ Kakao 지도 SDK 로드 성공 및 수동 초기화 준비 완료");
          setKakaoLoaded(true);
        });
      } else {
        console.error(
          "카카오 객체가 로드되었으나, maps 라이브러리 초기화에 실패했습니다."
        );
      }
    };

    script.onerror = () => {
      // 6. 로드 실패 시 에러 출력 (대부분 API 키 또는 도메인 문제)
      console.error(
        "❌ 카카오 지도 SDK 로드 실패: API 키 또는 도메인 등록을 확인하세요."
      );
    };

    document.head.appendChild(script);

    // cleanup: 컴포넌트 언마운트 시 스크립트 제거 (선택적)
    // 그러나 SDK는 한 번만 로드하는 것이 일반적이므로 생략할 수도 있습니다.
    /*
    return () => {
      const existingScript = document.getElementById("kakao-map-sdk");
      if (existingScript) {
        document.head.removeChild(existingScript);
        setKakaoLoaded(false);
      }
    };
    */
  }, [addresses]);

  // 2️⃣ 지도 생성 및 마커 표시
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
      geocoder.addressSearch(address, (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
          const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
          const marker = new kakao.maps.Marker({ map, position: coords });

          if (addrList.length > 1) {
            new kakao.maps.InfoWindow({
              content: `<div style="padding:5px;font-size:12px;">${
                index + 1
              }</div>`,
            }).open(map, marker);
          }

          bounds.extend(coords);
          map.setBounds(bounds);
        } else {
          // 주소 검색 실패 시 키워드 검색
          ps.keywordSearch(address, (data, status) => {
            if (status === kakao.maps.services.Status.OK) {
              const coords = new kakao.maps.LatLng(data[0].y, data[0].x);
              const marker = new kakao.maps.Marker({ map, position: coords });

              if (addrList.length > 1) {
                new kakao.maps.InfoWindow({
                  content: `<div style="padding:5px;font-size:12px;">${
                    index + 1
                  }</div>`,
                }).open(map, marker);
              }

              bounds.extend(coords);
              map.setBounds(bounds);
            } else {
              console.error("검색 실패:", address, status);
            }
          });
        }
      });
    });
  }, [addresses, kakaoLoaded]);

  return (
    <div
      ref={mapContainer}
      style={{ width: "100%", height: "400px", minHeight: "400px" }}
    />
  );
};

export default PostDetailMap;
