import React, { useEffect, useState, useRef } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../config/apiConfig";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import TailyFriendsDetailContent from "../../components/board/tailyFriends/TailyFriendsDetailContent";
import TailyFriendsDetailCommentCard from "../../components/board/tailyFriends/TailyFriendsDetailCommentCard";
import ErrorAlert from "../../components/common/ErrorAlert";

const TailyFriendDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const fetchedRef = useRef(false); 

  useEffect(() => {
    if (fetchedRef.current) return; 
    fetchedRef.current = true;

    const fetchDetail = async () => {
      try {
        setLoading(true);
        const [postRes, commentRes] = await Promise.all([
          api.get(`/api/taily-friends/${id}`),
          api.get(`/api/taily-friends/${id}/comments`),
        ]);

        if (postRes.data.success) setPost(postRes.data.data);
        if (commentRes.data.success) setComments(commentRes.data.data);
      } catch (err) {
        console.error("게시글 상세 조회 실패:", err);
        setError("게시글 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <LoadingSpinner />
        <div>로딩 중...</div>
      </div>
    );
  }

  if (error) return <ErrorAlert message={error} variant="danger" />;
  if (!post) return <div className="text-center mt-5">게시글이 없습니다.</div>;

  return (
    <Row className="justify-content-center mt-4">
      <Col xs={12} md={10} lg={10}>
        <TailyFriendsDetailContent post={post} />

        <div className="d-flex justify-content-end mt-1 mb-4">
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => navigate("/taily-friends")}
          >
            목록으로
          </Button>
        </div>

        <TailyFriendsDetailCommentCard
          postId={id}
          comments={comments}
          setComments={setComments}
        />
      </Col>
    </Row>
  );
};

export default TailyFriendDetailPage;
