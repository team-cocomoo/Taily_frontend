import React, { useEffect, useRef, useState } from "react";
import { Card } from "react-bootstrap";

const FacilityMap = ({ facilities = [],selectedFacility }) => {
  const mapRef = useRef(null);
  const [kakaoLoaded, setKakaoLoaded] = useState(false);
  const markersRef = useRef([]);
  const [map, setMap] = useState(null);

  // Kakao SDK 로드
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

  // ✅ 지도 초기화
  useEffect(() => {
    if (!kakaoLoaded || !window.kakao) return;

    console.log("facilities 데이터 구조:", facilities);

    const { kakao } = window;
    const container = mapRef.current;
    const options = {
      center: new kakao.maps.LatLng(37.566826, 126.9786567),
      level: 7,
    };
    const mapInstance = new kakao.maps.Map(container, options);
    setMap(mapInstance);
  }, [kakaoLoaded]);

  // ✅ 마커 표시
  useEffect(() => {
    if (!map || facilities.length === 0) return;

    const { kakao } = window;
    const geocoder = new kakao.maps.services.Geocoder();
    const bounds = new kakao.maps.LatLngBounds();

    //기존 마커 제거
    markersRef.current.forEach(({marker, overlay}) => {
      marker.setMap(null);
      overlay.setMap(null);
    });
    markersRef.current = [];

    // 첫 화면에 10개의 시설들을 마커로 표시
    facilities.forEach((item) => {
      const address =
        typeof item.address === "object"
          ? item.address["#text"]
          : item.address;
      
      if (!address || address === "주소 없음") return;

      geocoder.addressSearch(address, (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
          const coords  = new kakao.maps.LatLng(result[0].y, result[0].x);

          //마커 생성
          const marker = new kakao.maps.Marker({
            map,
            position:coords,
            title: item.title,
          });
          // markersRef.current.push(marker);

          //마커 이름 텍스트(overlay)
          const content = `
            <div style="
              background: #FEB916;
              color: white;
              font-weight: bold;
              padding: 3px 7px;
              border-radius: 6px;
              font-size: 12px;
              box-shadow: 1px 1px 3px rgba(0,0,0,0.3);
              white-space: nowrap;
            ">
              ${item.title}
            </div>
          `;
          //인포윈도우 - 시설명
          const overlay = new kakao.maps.CustomOverlay({
            position: coords,
            content,
            yAnchor:2.4, // 마커 위쪽으로 띄우기
          });
          overlay.setMap(map);
          
          //클릭 시 확대 + 중심 이동 
          kakao.maps.event.addListener(marker, "click", () =>{
            map.panTo(coords);
            map.setLevel(3);
          });
          // 지도 범위 확장
          markersRef.current.push({ marker, overlay });
          bounds.extend(coords);
          map.setBounds(bounds);
        }
      });
    });
  }, [map, facilities]);

  //카드 클릭 시 지도 이동
  useEffect(() => {
    if (!selectedFacility || !map) return;
    const { kakao } = window;
    const geocoder = new kakao.maps.services.Geocoder();

    geocoder.addressSearch(selectedFacility.address, (result, status) => {
      if (status === kakao.maps.services.Status.OK) {
        const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
        map.panTo(coords);
        map.setLevel(3); // 확대
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
