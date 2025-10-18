import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import api from "../../config/apiConfig";
import { Row, Col } from "react-bootstrap";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorAlert from "../../components/common/ErrorAlert";
import WalkPathDetailContent from "../../components/board/walkPath/WalkPathDetailContent";
import WalkPathDetailCommentCard from "../../components/board/walkPath/WalkPathDetailCommentCard";
import WalkPathImageBox from "../../components/board/walkPath/WalkPathImageBox";
import WalkPathMapView from "../../components/board/walkPath/WalkPathMapView";

const WalkPathDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate(); 
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  //게시글 + 댓글 조회
  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        setLoading(true);
        const [postRes, commentRes] = await Promise.all([
          api.get(`/api/walk-paths/${id}`),
          api.get(`/api/walk-paths/${id}/comments`),
        ]);

        if (postRes.data.success) {
          console.log("✅ postRes 구조 확인:", postRes.data);
          setPost(postRes.data.data);
        }
        if (commentRes.data.success) setComments(commentRes.data.data);
      } catch (error) {
        console.error("게시글 상세 조회 실패:", error);
        setError("게시글 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndComments();
  }, [id]);

  if (loading) return <LoadingSpinner message="게시글 불러오는 중..." />;
  if (error) return <ErrorAlert message={error} variant="danger" />;
  if (!post)
    return (
      <ErrorAlert
        message="게시글이 존재하지 않습니다."
        variant="warning"
        onGoBack={() => navigate("/walk-paths")}
      />
    );

  return (
    <Row className="justify-content-center mt-4">
      <Col xs={12} md={10} lg={10}>

        {/* 게시글 상세 (제목, 이미지, 내용, 지도, 좋아요)*/}
        <WalkPathDetailContent post={post} />

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
        <WalkPathDetailCommentCard
          postId={id}
          comments={comments}
          setComments={setComments}
        />
      </Col>
    </Row>
  );
};

export default WalkPathDetailPage;
