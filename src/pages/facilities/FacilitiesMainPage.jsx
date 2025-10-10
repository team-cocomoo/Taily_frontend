import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FacilityPostCard from "../../components/board/facility/facilityPostCard";
import SearchBar from "../../components/common/SearchBar";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const FacilityMainPage = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDummyPosts = async () => {
      try {
        setLoading(true);

        // ▶ 두 번째 시안에 맞춘 더미 데이터
        const dummyPosts = [
          {
            id: 1,
            title: "산내 동물 병원",
            phone: "02-xxx-xxx",
            address: "서울 성북구 xxx xxx",
            status: "진료 중",
            distanceKm: 2,
          },
          {
            id: 2,
            title: "마음 동물 병원",
            phone: "02-xxx-xxx",
            address: "서울 성북구 xxx xxx",
            status: "진료 중",
            distanceKm: 2,
          },
          {
            id: 3,
            title: "박원장 동물 병원",
            phone: "02-xxx-xxx",
            address: "서울 성북구 xxx xxx",
            status: "진료 중",
            distanceKm: 2,
          },
          {
            id: 4,
            title: "국민 동물 병원",
            phone: "02-xxx-xxx",
            address: "서울 성북구 xxx xxx",
            status: "진료 중",
            distanceKm: 2,
          },
          {
            id: 5,
            title: "운내 동물 병원",
            phone: "02-xxx-xxx",
            address: "서울 성북구 xxx xxx",
            status: "진료 중",
            distanceKm: 2,
          },
          {
            id: 6,
            title: "응응 동물 병원",
            phone: "02-xxx-xxx",
            address: "서울 성북구 xxx xxx",
            status: "진료 중",
            distanceKm: 2,
          },
          {
            id: 7,
            title: "내새끼 동물 병원",
            phone: "02-xxx-xxx",
            address: "서울 성북구 xxx xxx",
            status: "진료 중",
            distanceKm: 2,
          },
          {
            id: 8,
            title: "시립 동물 병원",
            phone: "02-xxx-xxx",
            address: "서울 성북구 xxx xxx",
            status: "진료 중",
            distanceKm: 2,
          },
        ];

        setPosts(dummyPosts);
      } finally {
        setLoading(false);
      }
    };

    fetchDummyPosts();
  }, []);

  const handleItemClick = (id) => {
    navigate(`/facilities/${id}`);
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <LoadingSpinner />
        <div>로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="mt-4" style={{ paddingTop: "160px" }}>
      <h2 className="page-title">동관시 게시판</h2>
      <SearchBar />
      <br />
      <FacilityPostCard items={posts} onItemClick={handleItemClick} />
    </div>
  );
};

export default FacilityMainPage;
