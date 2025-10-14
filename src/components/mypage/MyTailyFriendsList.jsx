import React, { useEffect, useState } from "react";
import { Table, Spinner, Pagination } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../../config/apiConfig";

const MyTailyFriendsList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const pageSize = 10;

  useEffect(() => {
    const fetchMyTailyFriends = async () => {
      setLoading(true);
      try {
        const response = await api.get(
          `/api/mypage/mytaily-friends?page=${page}&size=${pageSize}`
        );
        setPosts(response.data.data.content);
        setTotalPages(response.data.data.totalPages);
      } catch (err) {
        console.error("내 테일리 프렌즈 조회 실패", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyTailyFriends();
  }, [page]);

  const handleClickTitle = (id) => {
    navigate(`/taily-friends/${id}`);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const renderPagination = () => (
    <div className="d-flex justify-content-center mt-4">
      <Pagination className="custom-pagination">
        <Pagination.Prev
          key={"Prev"}
          disabled={page === 1}
          onClick={() => handlePageChange(page - 1)}
        />
        {Array.from({ length: totalPages }, (_, idx) => (
          <Pagination.Item
            key={idx + 1}
            active={page === idx + 1}
            onClick={() => handlePageChange(idx + 1)}
          >
            {idx + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          disabled={page >= totalPages}
          onClick={() => handlePageChange(page + 1)}
        />
      </Pagination>
    </div>
  );

  if (loading) return <Spinner animation="border" />;

  if (!posts.length) return <p>작성한 게시글이 없습니다.</p>;

  return (
    <>
      <Table bordered hover responsive>
        <thead className="table">
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>조회수</th>
            <th>작성일</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post, index) => (
            <tr
              key={post.id}
              onClick={() => handleClickTitle(post.id)}
              style={{ cursor: "pointer" }}
            >
              <td>{(page - 1) * pageSize + index + 1}</td>
              <td>{post.title}</td>
              <td>{post.view}</td>
              <td>{new Date(post.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      {renderPagination()}
    </>
  );
};

export default MyTailyFriendsList;
