import React, { useEffect, useState } from "react";
import { Table, Spinner, Pagination } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../../config/apiConfig";
import "../../styles/myPage/MyWalkPaths.css";

const MyWalkPathsList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const pageSize = 10;

  useEffect(() => {
    const fetchMyWalkPaths = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await api.get(
          `/api/mypage/mywalk-paths?page=${page}&size=${pageSize}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setPosts(response.data.data.content);
        setTotalPages(response.data.data.totalPages);
      } catch (err) {
        console.error("내 산책 경로 조회 실패", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyWalkPaths();
  }, [page]);

  const handleClickTitle = (id) => {
    navigate(`/walk-paths/${id}`);
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
  console.log("산책경로 게시글 수: ",posts.length);

  return (
    <>
      <Table borderless hover responsive className="text-center">
        <thead className="table">
          <tr className="my-taily-friends-tr">
            <th style={{ width: "10%" }}>번호</th>
            <th style={{ width: "20%" }}>제목</th>
            <th style={{ width: "35%" }}>내용</th>
            <th style={{ width: "15%" }}>조회수</th>
            <th style={{ width: "20%" }}>작성일</th>
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
              <td dangerouslySetInnerHTML={{ __html: post.content }}></td>
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

export default MyWalkPathsList;
