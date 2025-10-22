import React, { useContext, useState } from "react";
import { Card, Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import "../../../styles/postDetail/PostDetailContentCard.css";

import userIcon from "../../../assets/image/user-icon.png";
import meatballIcon from "../../../assets/image/meatball-icon.png";
import PostDetailMap from "../postDetail/PostDetailMap";
import UserPopover from "../../common/UserPopover";
import LikeButton from "../LikeButton";
import ReportModal from "../ReportModal";
import ShareModal from "../ShareModal";
import SecureImage from "../../common/SecureImage";

const TailyFriendsDetailContent = ({ post }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // 로그인한 사용자 정보
  const [showReportModal, setShowReportModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const handleOpenShareModal = () => setShowShareModal(true);
  const handleCloseShareModal = () => setShowShareModal(false);
  const handleOpenReportModal = () => setShowReportModal(true);
  const handleCloseReportModal = () => setShowReportModal(false);
  if (!post) return null;

  const isAuthor = user && user.nickname === post.nickname;

  const handleDelete = async () => {
    if (!window.confirm("정말 게시글을 삭제하시겠습니까?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8080/api/taily-friends/${post.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("게시글 삭제 완료!");
      navigate("/taily-friends");
    } catch (err) {
      console.error(err);
      alert("게시글 삭제 실패");
    }
  };
  return (
    <div className="post-detail-body d-flex justify-content-center align-items-center">
      <Card className="mb-4 shadow post-card">
        <Card.Header className="card-header-section">
          <div className="card-header-title">
            <p>{post.title}</p>
          </div>
          <div className="d-flex align-items-center mt-2">
            {post.profileImage ? (
              <SecureImage
                src={post.profileImage}
                alt="프로필 이미지"
                className="user-profile"
              />
            ) : (
              <img src={userIcon} alt="기본 프로필" className="user-profile" />
            )}

            <div className="user-text">
              <div className="author-info">
                <UserPopover userId={post.userId} nickname={post.nickname}>
                  {post.nickname}
                </UserPopover>
                <small className="author-date">
                  {new Date(post.createdAt).toLocaleString()} 조회수:{" "}
                  {post.view}
                </small>
              </div>

              <Dropdown className="profile-dropdown">
                <Dropdown.Toggle
                  variant="light"
                  id="dropdown-basic"
                  size="sm"
                  className="no-caret"
                >
                  <img src={meatballIcon} alt="메뉴" className="meatballIcon" />
                </Dropdown.Toggle>
                <Dropdown.Menu className="dropdown-menu">
                  {isAuthor ? (
                    <>
                      <Dropdown.Item
                        onClick={() =>
                          navigate(`/taily-friends/edit/${post.id}`)
                        }
                      >
                        수정하기
                      </Dropdown.Item>
                      <Dropdown.Item onClick={handleDelete}>
                        삭제하기
                      </Dropdown.Item>
                      <Dropdown.Item onClick={handleOpenShareModal}>
                        공유하기
                      </Dropdown.Item>
                    </>
                  ) : (
                    <>
                      <Dropdown.Item onClick={handleOpenReportModal}>
                        신고하기
                      </Dropdown.Item>
                      <Dropdown.Item onClick={handleOpenShareModal}>
                        공유하기
                      </Dropdown.Item>
                    </>
                  )}
                </Dropdown.Menu>

                <ReportModal
                  show={showReportModal}
                  handleClose={handleCloseReportModal}
                  reportedId={post.userId}
                  path={window.location.href}
                />
                <ShareModal
                  show={showShareModal}
                  handleClose={handleCloseShareModal}
                  postTitle={post.title}
                  postUrl={window.location.href}
                />
              </Dropdown>
            </div>
          </div>
        </Card.Header>
        <Card.Body>
          {post.images && post.images.length > 0 && (
            <div className="post-detail-images mb-3 d-flex justify-content-center flex-wrap gap-3">
              {post.images && post.images.length > 0 && (
                <div className="post-detail-images mb-3 d-flex justify-content-center flex-wrap gap-3">
                  {post.images.map((img) => (
                    <SecureImage
                      key={img.id}
                      src={img.filePath}
                      alt="게시글 이미지"
                      style={{
                        maxWidth:"500px",
                        height:"auto",
                        borderRadius: "10px",
                        objectFit: "cover",
                        marginTop: "30px",
                        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
          <div
            className="post-detail-content"
            style={{
              whiteSpace: "pre-wrap",
              minHeight:
                post.images && post.images.length > 0 ? "0px" : "200px",
              marginTop:
                post.images && post.images.length > 0 ? "100px" : "0px",
              marginBottom:
                post.images && post.images.length > 0 ? "50px" : "0px",
            }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          ></div>
          <div className="post-detail-address">
            <hr className="mx-auto w-50 mb-4" />
            {post.address && <PostDetailMap addresses={post.address} />}
          </div>

          <div className="d-flex justify-content-center align-items-center mt-3">
            <LikeButton postId={post.id} tableTypeId={5} />
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default TailyFriendsDetailContent;
