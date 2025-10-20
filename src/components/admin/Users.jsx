import React, { useEffect, useState } from "react";
import api from "../../config/apiConfig";
import { Card, Pagination, Table } from "react-bootstrap";
import UserInfoModal from "../../components/admin/UserInfoModal";
import UserSearchBar from "./UserSearchBar";

const Users = () => {
    // 상태 관리
    const [userList, setUserList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const itemsPerPage = 10; // 페이지당 항목 수

    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    // 회원 리스트 조회 함수
    const fetchUsers = async (searchKeyword = "", page = 1) => {
        setLoading(true);
        try {
            const params = { page, size: itemsPerPage };
            if (searchKeyword.trim() !== "") params.keyword = searchKeyword.trim();

                const response = await api.get("/api/admin", { params });
                const data = response.data?.data;

                setUserList(Array.isArray(data?.data) ? data.data : []);
                setTotalCount(data?.totalCount || 0);
                setCurrentPage(page);
        } catch (error) {
            console.error("회원 정보 조회 실패", error);
            setUserList([]);
            setTotalCount(0);
        } finally {
            setLoading(false);
        }
    };

    // 컴포넌트 최초 렌더링 & 페이지 변경 시 호출
    useEffect(() => {
        fetchUsers(keyword, currentPage);
    }, [currentPage]);

    const handlePageChange = (pageNumber) => {
        if (pageNumber < 1 || pageNumber > Math.ceil(totalCount / itemsPerPage))
            return;
        setCurrentPage(pageNumber);
    };

    // 회원 클릭 → 모달 열기
    const handleUserClick = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setSelectedUser(null);
    };

    // 검색 처리
    const handleSearch = (searchKeyword) => {
        setKeyword(searchKeyword);
        fetchUsers(searchKeyword, 1); // 검색 시 항상 1페이지
    };

    const totalPages = Math.ceil(totalCount / itemsPerPage);

    if (loading) return <p>회원 정보를 불러오는 중...</p>;
    if (!userList.length)
        return <p className="text-center">등록된 회원이 없습니다.</p>;

    return (
        <>
            <UserInfoModal
                show={showModal}
                user={selectedUser}
                handleClose={handleClose}
            />


            <div className="mt-5 p-4">
                <h4 style={{fontWeight:"bold"}}>회원 관리</h4>
                <UserSearchBar value={keyword} onSearch={handleSearch} />
            </div>

            <Card className="p-3">
                <Table hover responsive>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>아이디</th>
                            <th>닉네임</th>
                            <th>이메일</th>
                            <th>가입일</th>
                            <th>상태</th>
                            <th>제재</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userList.map((user, index) => (
                        <tr
      key={user.id || index}
      onClick={() => handleUserClick(user)}
      style={{
        cursor: "pointer",
        transition: "background-color 0.2s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8f9fa")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "")}
    >
      <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
      <td>{user.username}</td>
      <td>{user.nickname}</td>
      <td>{user.email}</td>
      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
      <td>{user.state}</td>
      <td>{user.sanctionCount}</td>
    </tr>
                        ))}
                    </tbody>
                </Table>

                {/* 페이지네이션 */}
                {totalPages >= 1 && (
                    <Pagination className="justify-content-center mt-3">
                        <Pagination.Prev
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                        Prev
                        </Pagination.Prev>
                        {[...Array(totalPages)].map((_, i) => (
                            <Pagination.Item
                                key={i + 1}
                                active={i + 1 === currentPage}
                                onClick={() => handlePageChange(i + 1)}
                            >
                                {i + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </Pagination.Next>
                    </Pagination>
                )}
            </Card>
        </>
    );
};

export default Users;
