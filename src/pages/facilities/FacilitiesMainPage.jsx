import React, { useState, useEffect } from "react";
import FacilityPostCard from "../../components/board/facility/facilityPostCard";
import SearchBar from "../../components/common/SearchBar";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import FacilityMap from "../../components/board/facility/facilityMap";
import { getFacilityData } from "../../api/FacilityService";

const FacilityMainPage = () => {
  const [posts, setPosts] = useState([]); // 시설 데이터 저장
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [selectedFacility, setSelectedFacility] = useState(null); // 카드 클릭 연결용
  const [userLocation, setUserLocation] = useState(null); // 유저 위치 상태

  //  거리 계산 함수 (Haversine formula)
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // km 단위 거리
  };

  //  1단계: 유저 위치 가져오기
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        console.log(" 현재 위치:", pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        console.warn(" 위치 접근 거부 또는 실패:", err);
        // fallback → 서울시청 좌표
        setUserLocation({ lat: 37.566826, lng: 126.9786567 });
      }
    );
  }, []);

  //  2단계: 유저 위치가 확인되면 시설 데이터 불러오기
  useEffect(() => {
    if (!userLocation) return; // 위치 정보가 아직 없으면 실행 안 함

    const fetchData = async () => {
      try {
        setLoading(true);
        const facilities = await getFacilityData();
        const { kakao } = window;
        const geocoder = new kakao.maps.services.Geocoder();

        const promises = facilities.map(
          (item) =>
            new Promise((resolve) => {
              const address =
                typeof item.venue === "object"
                  ? item.venue["#text"]
                  : item.venue;
              if (!address || address === "주소 없음") {
                resolve(null);
                return;
              }

              // 주소 → 좌표 변환
              geocoder.addressSearch(address, (result, status) => {
                if (status === kakao.maps.services.Status.OK) {
                  const lat = parseFloat(result[0].y);
                  const lng = parseFloat(result[0].x);
                  const distanceKm = getDistance(
                    userLocation.lat,
                    userLocation.lng,
                    lat,
                    lng
                  );

                  resolve({
                    id: Math.random().toString(36).substr(2, 9),
                    title:
                      typeof item.title === "object"
                        ? item.title["#text"]
                        : item.title,
                    address: address,
                    phone:
                      typeof item.phone === "object"
                        ? item.phone["#text"]
                        : item.phone,
                    status: "진료 중",
                    lat,
                    lng,
                    distanceKm: Number(distanceKm.toFixed(2)),
                  });
                } else {
                  resolve(null);
                }
              });
            })
        );

        const results = (await Promise.all(promises)).filter(Boolean);

        //  가까운 순으로 정렬하고 상위 10개만 표시
        const nearest = results
          .sort((a, b) => a.distanceKm - b.distanceKm)
          .slice(0, 10);

        setPosts(nearest);
      } catch (error) {
        console.error("API 불러오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userLocation]);

  //  3단계: 카드 클릭 시 선택된 시설 저장
  const handleCardClick = (facility) => {
    setSelectedFacility(facility);
  };

  //  4단계: 로딩 중 화면
  if (loading) {
    return (
      <div className="text-center mt-5">
        <LoadingSpinner />
        <div>내 위치 기준으로 주변 병원 찾는 중...</div>
      </div>
    );
  }

  // ✅ 5단계: 실제 렌더링
  return (
    <div className="mt-4" style={{ paddingTop: "160px" }}>
      <h2 className="page-title">우리 동네 정보</h2>

      {/* 지도 */}
      <FacilityMap
        facilities={posts}
        selectedFacility={selectedFacility}
        userLocation={userLocation}
      />

      <br />

      {/* 검색바 */}
      <SearchBar />

      <br />

      {/* 카드 목록 */}
      <FacilityPostCard items={posts} onItemClick={handleCardClick} />
    </div>
  );
};

export default FacilityMainPage;
