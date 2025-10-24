import React, { useContext, useState } from "react";
import { Card, Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import WalkPathImageBox from "./WalkPathImageBox";
import WalkPathMapView from "./WalkPathMapView";
import "../../../styles/postdetail/PostDetailContentCard.css";

import userIcon from "../../../assets/image/user-icon.png";
import meatballIcon from "../../../assets/image/meatball-icon.png";
import PostDetailMap from "../postdetail/PostDetailMap";
import UserPopover from "../../common/UserPopover";
import LikeButton from "../LikeButton";
import ReportModal from "../ReportModal";
import ShareModal from "../ShareModal";

const WalkPathDetailContent = ({ post }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // 로그인한 사용자 정보
  const [showReportModal, setShowReportModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const handleOpenShareModal = () => setShowShareModal(true);
  const handleCloseShareModal = () => setShowShareModal(false);
  const handleOpenReportModal = () => setShowReportModal(true);
  const handleCloseReportModal = () => setShowReportModal(false);
  if (!post) return null;
  console.log("post:", post);

  const isAuthor = user && user.nickname === post.authorName;

  const handleDelete = async () => {
    if (!window.confirm("정말 게시글을 삭제하시겠습니까?")) return;

    try {
      const token = localStorage.getItem("token");
      const effectiveId = post.id ?? post.postId;
      await axios.delete(
        `https://taily24.store/api/walk-paths/${effectiveId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("게시글 삭제 완료!");
      navigate("/walk-paths");
    } catch (err) {
      console.error(err);
      alert("게시글 삭제 실패");
    }
  };
  return (
    <div className="post-detail-body d-flex justify-content-center align-items-center">
      <Card className="mb-4 shadow-sm post-card">
        <Card.Header className="card-header-section">
          <div className="card-header-title">
            <p>{post.title}</p>
          </div>
          <div className="d-flex align-items-center mt-2">
            <img src={userIcon} alt="프로필" className="user-profile" />
            <div className="user-text">
              <div className="author-info">
                <UserPopover nickname={post.authorName}>
                  {post.authorName}
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
                        onClick={() => {
                          const effectiveId = post.id ?? post.postId;
                          navigate(`/walk-paths/edit/${effectiveId}`);
                        }}
                      >
                        수정하기
                      </Dropdown.Item>
                      <Dropdown.Item onClick={handleDelete}>
                        삭제하기
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => alert("공유")}>
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
                  path={window.location.href} // 현재 URL 또는 post.path
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
          {/* 이미지 표시 */}
          <WalkPathImageBox images={post.images || []} />

          {/* 게시글 내용 */}
          <div
            className="post-detail-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          ></div>

          {/* 게시글 지도 */}
          <WalkPathMapView routes={post.routes} />

          {/* 게시글 좋아요 */}
          <div className="d-flex justify-content-center align-items-center mt-3">
            <LikeButton
              postId={post.id ?? post.postId}
              tableTypeId={6} // WalkPath = 6
            />
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default WalkPathDetailContent;
