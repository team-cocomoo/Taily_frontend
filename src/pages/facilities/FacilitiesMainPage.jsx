import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FacilityPostCard from "../../components/board/facility/facilityPostCard";
import SearchBar from "../../components/common/SearchBar";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import FacilityMap from "../../components/board/facility/facilityMap";
import { getFacilityData } from "../../api/FacilityService"; 

const FacilityMainPage = () => {
  const [posts, setPosts] = useState([]); // 시설 데이터 저장
  const [loading, setLoading] = useState(true); // 로딩 상태
  const navigate = useNavigate();

  //  컴포넌트가 처음 렌더링될 때 API 호출
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // API 호출
        const facilities = await getFacilityData();
        console.log("API 데이터:", facilities); 

        // 변환된 데이터 구조를 React 카드 형식에 맞게 가공
        const formatted = facilities.map((item, index) => ({
          id: index + 1,
          title: item.title || "이름 없음",
          address: item.address || "주소 없음",
          phone: item.phone || "전화번호 없음",
          status: "진료 중",
          distanceKm: Math.floor(Math.random() * 5) + 1, // 예시용 랜덤 거리
        }));

        // 상태 업데이트
        setPosts(formatted);
      } catch (error) {
        console.error("API 불러오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData(); //  함수 실제 호출
  }, []);

  //  카드 클릭 시 이동
  const handleItemClick = (id) => {
    navigate(`/facilities/${id}`);
  };

  //  로딩 중일 때
  if (loading) {
    return (
      <div className="text-center mt-5">
        <LoadingSpinner />
        <div>로딩 중...</div>
      </div>
    );
  }

  //  메인 렌더링
  return (
    <div className="mt-4" style={{ paddingTop: "160px" }}>
      <h2 className="page-title">우리 동네 정보</h2>

      {/* 지도 */}
      <FacilityMap facilities={posts}/>

      <br />

      {/* 검색바 */}
      <SearchBar />

      <br />

      {/* 시설 카드 목록 */}
      <FacilityPostCard items={posts} onItemClick={handleItemClick} />
    </div>
  );
};

export default FacilityMainPage;
