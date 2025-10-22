import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Card, Spinner, Image } from "react-bootstrap";
import userIcon from "../../assets/image/user-icon.png";
import SearchBar from "../common/SearchBar"; // 공통 검색바 import
import "../../styles/mypage/MyFollowFollowingList.css";

const MyFollowFollowingList = () => {
  const [activeTab, setActiveTab] = useState("followers");
  const [followers, setFollowers] = useState([]);
  const [followings, setFollowings] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // 검색어
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchFollowData = async () => {
    setLoading(true);
    try {
      const [followersRes, followingsRes] = await Promise.all([
        axios.get(
          `http://localhost:8080/api/mypage/followers${
            searchTerm ? `?nickname=${searchTerm}` : ""
          }`,
          { headers: { Authorization: `Bearer ${token}` } }
        ),
        axios.get(
          `http://localhost:8080/api/mypage/following${
            searchTerm ? `?nickname=${searchTerm}` : ""
          }`,
          { headers: { Authorization: `Bearer ${token}` } }
        ),
      ]);

      setFollowers(followersRes.data.data || []);
      setFollowings(followingsRes.data.data || []);
    } catch (err) {
      console.error("팔로우 목록 불러오기 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowData();
  }, []);

  // 검색 term 변경 시 API 재호출 (debounce)
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchFollowData();
    }, 300);

    return () => clearTimeout(delay);
  }, [searchTerm, activeTab]);

  const handleUnfollow = async (userId) => {
    if (!window.confirm("정말 언팔로우하시겠습니까?")) return;

    try {
      await axios.patch(
        `http://localhost:8080/api/follows/${userId}/deactivate`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFollowings((prev) => prev.filter((user) => user.id !== userId));
    } catch (err) {
      console.error("언팔로우 실패:", err);
    }
  };

  const renderList = (list, showUnfollow) => {
    if (loading) return <Spinner animation="border" />;
    if (!list.length) return <p className="text-muted">목록이 없습니다.</p>;

    return (
      <ul className="follow-ul list-unstyled">
        {list.map((user) => (
          <li
            key={user.id}
            className="d-flex align-items-center mb-2 p-2 border-bottom"
          >
            <Image
              src={user.profileImageUrl || userIcon}
              roundedCircle
              className="follow-img"
              alt="프로필"
            />
            <span className="ms-3 flex-grow-1 follow-nickname">
              {user.nickname}
            </span>
            {showUnfollow && (
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => handleUnfollow(user.id)}
              >
                삭제
              </Button>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="follow-container">
      {/* 탭 버튼 */}
      <div className="follow-tabs d-flex justify-content-center mb-3">
        <Button
          variant={activeTab === "followers" ? "primary" : "outline-primary"}
          className={
            activeTab === "followers"
              ? "follow-btn-active me-3"
              : "follow-btn-inactive me-3"
          }
          onClick={() => setActiveTab("followers")}
        >
          팔로워
        </Button>
        <Button
          variant={activeTab === "following" ? "primary" : "outline-primary"}
          className={
            activeTab === "following"
              ? "follow-btn-active"
              : "follow-btn-inactive"
          }
          onClick={() => setActiveTab("following")}
        >
          팔로잉
        </Button>
      </div>

      {/* 검색바 */}
      <div className="d-flex justify-content-center mb-3">
        <SearchBar
          placeholder="닉네임 검색..."
          onSearch={(value) => setSearchTerm(value)}
          className="follow-searchbar"
        />
      </div>

      {/* 리스트 */}
      <div className="follow-list">
        {activeTab === "followers"
          ? renderList(followers, false)
          : renderList(followings, true)}
      </div>
    </div>
  );
};

export default MyFollowFollowingList;
