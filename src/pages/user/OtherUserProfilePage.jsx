import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Row, Col, Image, Modal, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthContext } from "../../contexts/AuthContext";
import userIcon from "../../assets/image/user-icon.png";
import "../../styles/user/OtherUserProfilePage.css";
import api from "../../config/apiConfig";
import SecureImage from "@/components/common/SecureImage";
import noPhoto from "@/assets/image/no-photo.jpg";

const OtherUserProfilePage = () => {
  const { id } = useParams(); // 프로필 대상 유저 ID
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // 로그인 사용자 정보

  const [profile, setProfile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [feedImages, setFeedImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // 프로필 데이터 로드
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await api.get(`/api/user-profile/${id}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) navigate("/login");
      }
    };

    const fetchFollowState = async () => {
      try {
        const res = await api.get(`/api/follows/following`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const followingList = res.data?.data || [];

        // userId로 비교
        setIsFollowing(
          followingList.some((f) => String(f.userId) === String(id))
        );
      } catch (err) {
        console.error("팔로우 상태 확인 실패:", err);
      }
    };
    const fetchMyFeedImages = async () => {
      try {
        const res = await api.get("/api/images/my-feeds", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFeedImages(res.data || []);
      } catch (err) {
        console.error("내 피드 이미지 불러오기 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
    fetchFollowState();
    fetchMyFeedImages();
  }, [id, navigate, token]);

  if (loading || !profile)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="warning" />
      </div>
    );

  /** 메시지 버튼 클릭 */
  const handleMessage = async () => {
    if (!user) return;

    try {
      // 채팅방 존재 여부 확인
      const res = await api.get(
        `/api/chats/exists?senderPublicId=${user.publicId}&receiverPublicId=${profile.publicId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const room = res.data?.data;

      if (room) {
        navigate(`/chats/${room.roomId}`, {
          state: {
            otherUsername: profile.nickname,
            otherProfileImage: profile.profileImage || userIcon,
          },
        });
      } else {
        const createRes = await api.post(
          `/api/chats?senderPublicId=${user.publicId}&receiverPublicId=${profile.publicId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const newRoom = createRes.data?.data;
        navigate(`/chats/${newRoom.roomId}`, {
          state: {
            otherUsername: profile.nickname,
            otherProfileImage: profile.profileImage || userIcon,
          },
        });
      }
    } catch (err) {
      console.error("채팅방 이동 실패:", err);
      alert("채팅방 이동 중 오류가 발생했습니다.");
    }
  };

  /** 팔로우 / 언팔로우 토글 */
  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await api.patch(
          `/api/follows/${id}/deactivate`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setIsFollowing(false);
      } else {
        await api.post(
          `/api/follows/${id}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setIsFollowing(true);
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 409) {
        alert("이미 팔로우 중입니다.");
        setIsFollowing(true);
      } else {
        alert("팔로우 처리 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div
      className="container mt-4 other-user-container"
      style={{ maxWidth: "1000px" }}
    >
      {/* 1️⃣ 사용자 기본 정보 카드 */}
      <Card className="mb-4 other-user-profile-card mx-auto">
        <Card.Body>
          <div className="d-flex align-items-start">
            <SecureImage
              src={profile.profileImageUrl || userIcon}
              roundedCircle
              width={100}
              height={100}
              className="me-3 other-user-profile-img"
            />
            <div>
              <h4>{profile.nickname}</h4>
              <Row className="text-center mt-2" style={{ maxWidth: "300px" }}>
                <Col>
                  <div className="other-user-count">{profile.postCount}</div>
                  <div>게시물</div>
                </Col>
                <Col>
                  <div className="other-user-count">
                    {profile.followerCount}
                  </div>
                  <div>팔로워</div>
                </Col>
                <Col>
                  <div className="other-user-count">
                    {profile.followingCount}
                  </div>
                  <div>팔로잉</div>
                </Col>
              </Row>
            </div>
          </div>

          <div
            className="other-user-introduction mt-3 p-3 rounded"
            style={{
              backgroundColor: "#f8f9fa",
              minHeight: "60px",
              border: "1px solid #e0e0e0",
            }}
          >
            {profile.introduction || "작성한 소개글이 없습니다."}
          </div>
        </Card.Body>
      </Card>

      {/* 버튼 영역 */}
      <div className="d-flex gap-2 mb-4">
        <Button variant="primary" className="flex-fill" onClick={handleMessage}>
          메시지
        </Button>
        <Button
          variant={isFollowing ? "secondary" : "primary"}
          className={`flex-fill ${
            isFollowing ? "following-btn" : "follow-btn"
          }`}
          onClick={handleFollow}
        >
          {isFollowing ? "팔로우 중" : "팔로우"}
        </Button>
      </div>

      {/* 2️⃣ 반려동물 정보 */}
      <Row className="mb-4">
        <Col md={12}>
          <Card className="mb-3 other-user-pet-card">
            <Card.Header>반려동물</Card.Header>
            <Card.Body>
              <Row>
                {profile.pets && profile.pets.length > 0 ? (
                  profile.pets.map((pet, idx) => (
                    <Col md={4} key={idx} className="mb-3">
                      <Card>
                        <SecureImage
                          variant="top"
                          src={pet.imageUrl || noPhoto}
                          style={{
                            width: "100%",
                            height: "200px",
                            objectFit: "cover",
                          }}
                        />
                        <Card.Body>
                          <Card.Title>
                            {pet.name} ({pet.gender})
                          </Card.Title>
                          <Card.Text>나이: {pet.age}세</Card.Text>
                          <Card.Text>취향: {pet.preference}</Card.Text>
                          <Card.Text>{pet.introduction}</Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))
                ) : (
                  <Col md={12} className="mb-3">
                    <Card className="text-center">
                      <Card.Body>저장된 펫이 없습니다.</Card.Body>
                    </Card>
                  </Col>
                )}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 3️⃣ 게시물 */}
      <Row className="mb-4">
        <Col md={12}>
          <Card className="mb-3 other-user-feed-card">
            <Card.Header>내 피드 게시물</Card.Header>
            <Card.Body>
              <Row>
                {profile.feeds && profile.feeds.length > 0 ? (
                  profile.feeds.map((feed) =>
                    (feed.imageUrls || []).map((url, idx) => (
                      <Col
                        md={4}
                        key={`${feed.feedId}-${idx}`}
                        className="mb-3"
                      >
                        <Card>
                          <div
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              navigate(`/petstory/feed/${feed.feedId}`)
                            }
                          >
                            <SecureImage
                              src={url}
                              style={{
                                width: "100%",
                                height: "180px",
                                objectFit: "cover",
                              }}
                            />
                          </div>
                        </Card>
                      </Col>
                    ))
                  )
                ) : (
                  <Col md={12}>
                    <Card className="text-center">
                      <Card.Body>등록한 피드가 없습니다.</Card.Body>
                    </Card>
                  </Col>
                )}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 이미지 확대 모달 */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Body>
          <Image src={selectedImage} fluid />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default OtherUserProfilePage;
