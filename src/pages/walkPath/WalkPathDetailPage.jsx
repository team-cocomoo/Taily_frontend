// pages/board/PostDetailPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import api from "../../config/apiConfig";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorAlert from "../../components/common/ErrorAlert";
import PostDetailContentCard from "../../components/board/postDetail/PostDetailContentCard";
import PostCommentCard from "../../components/board/postDetail/PostDetailCommentCard";

const WalkPathsDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const mockPost = {
          id: 1,
          title: "테스트 게시글",
          content: "목데이터로 보는 상세 게시글",
          nickname: "홍길동",
          createdAt: "2025-10-01T12:00:00",
          view: 120,
          likeCount: 200,
          address: "혜화역",
        };

        const mockComments = [
          {
            id: 1,
            content: "첫 댓글입니다",
            nickname: "김철수",
            createdAt: "2025-10-01T12:10:00",
            replies: [
              {
                id: 11,
                nickname: "Bob",
                content: "답글이에요",
                createdAt: "2025-10-02T11:05:00Z",
              },
            ],
          },
          {
            id: 2,
            content: "두 번째 댓글입니다",
            nickname: "이영희",
            createdAt: "2025-10-01T12:20:00",
          },
        ];

        setPost(mockPost);
        setComments(mockComments);
      } catch (error) {
        setError("데이터 로딩 실패");
      } finally {
        setLoading(false); // ✅ 반드시 마지막에 false로 바꿔야 함
      }
    };

    fetchPostAndComments();
  }, [id]);

  if (loading) return <LoadingSpinner message="게시글 불러오는 중..." />;
  if (error)
    return (
      <ErrorAlert
        message={error}
        variant="danger"
        onRetry={() => window.location.reload()}
        onGoBack={() => navigate("/walk-paths")}
      />
    );
  if (!post)
    return (
      <ErrorAlert
        message="게시글이 존재하지 않습니다."
        variant="warning"
        onGoBack={() => navigate("/walk-paths")}
      />
    );

  return (
    <div className="row justify-content-center">
      <div className="col-md-11">
        {/* 게시글 상세 */}
        <PostDetailContentCard post={post} />
        {/* 하단 버튼 */}
        <div className="d-flex justify-content-end mt-1 mb-4">
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => navigate("/walk-paths")}
          >
            목록으로
          </Button>
        </div>
        {/* 댓글 목록 */}
        <PostCommentCard comments={comments} />
      </div>
    </div>
  );
};

export default WalkPathsDetailPage;
