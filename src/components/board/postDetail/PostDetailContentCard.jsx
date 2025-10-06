import React from "react";
import { Card, Dropdown } from "react-bootstrap";
import "../../../styles/postDetail/PostDetailContentCard.css";

import userIcon from "../../../assets/image/user-icon.png";
import filledHeart from "../../../assets/image/filled-heart.png";
import meatballIcon from "../../../assets/image/meatball-icon.png";
import PostDetailMap from "../postDetail/PostDetailMap";

const PostDetailContentCard = ({ post }) => {
  if (!post) return null;
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
                <span className="author-name">{post.nickname}</span>
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
                {/* 나중에 로그인 했을때는 수정,삭제가 뜨게 */}
                <Dropdown.Menu className="dropdown-menu">
                  <Dropdown.Item
                    onClick={() => alert("신고")}
                    className="dropdown-item"
                  >
                    신고하기
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => alert("공유")}>
                    공유하기
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </Card.Header>
        <Card.Body>
          {/* 나중에 이 부분에 이미지 출력 */}
          <div
            className="post-detail-content"
            style={{ whiteSpace: "pre-wrap", minHeight: "200px" }}
          >
            {post.content}
          </div>
          <div className="post-detail-address">
            <hr className="mx-auto w-50 mb-4" />
            {post.address && <PostDetailMap addresses={post.address} />}
          </div>

          {/* 나중에 state 이용해서 좋아요 한 상태면 변화하게 */}
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
