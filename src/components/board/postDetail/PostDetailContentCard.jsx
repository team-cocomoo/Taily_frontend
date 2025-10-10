import React, { useContext } from "react";
import { Card, Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import "../../../styles/postDetail/PostDetailContentCard.css";

import userIcon from "../../../assets/image/user-icon.png";
import filledHeart from "../../../assets/image/filled-heart.png";
import meatballIcon from "../../../assets/image/meatball-icon.png";
import PostDetailMap from "../postDetail/PostDetailMap";
import UserPopover from "../../common/UserPopover";

const PostDetailContentCard = ({ post }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // 로그인한 사용자 정보

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
      <Card className="mb-4 shadow-sm post-card">
        <Card.Header className="card-header-section">
          <div className="card-header-title">
            <p>{post.title}</p>
          </div>
          <div className="d-flex align-items-center mt-2">
            <img src={userIcon} alt="프로필" className="user-profile" />

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
                      <Dropdown.Item onClick={() => alert("공유")}>
                        공유하기
                      </Dropdown.Item>
                    </>
                  ) : (
                    <>
                      <Dropdown.Item onClick={() => alert("신고")}>
                        신고하기
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => alert("공유")}>
                        공유하기
                      </Dropdown.Item>
                    </>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </Card.Header>
        <Card.Body>
          <div
            className="post-detail-content"
            style={{ whiteSpace: "pre-wrap", minHeight: "200px" }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          ></div>
          <div className="post-detail-address">
            <hr className="mx-auto w-50 mb-4" />
            {post.address && <PostDetailMap addresses={post.address} />}
          </div>

          <div className="d-flex justify-content-center align-items-center mt-3">
            <div className="like-area">
              좋아요 {post.likeCount}{" "}
              <img src={filledHeart} alt="좋아요 하트" className="heart" />
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default PostDetailContentCard;
