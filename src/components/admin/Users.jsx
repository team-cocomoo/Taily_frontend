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
    const [pageSize, setPageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);

    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    // ---------------------------
    // 회원 리스트 조회 함수
    // ---------------------------
    const fetchUsers = async (searchKeyword = "", page = 1) => {
        setLoading(true);
        try {
        const params = { page, size: pageSize };
        if (searchKeyword.trim() !== "") params.keyword = searchKeyword.trim();

        const response = await api.get("/api/admin", { params });
        console.log("API 응답:", response.data.data);

        // 배열 추출 (백엔드 구조: data.data.data)
        const users = Array.isArray(response.data.data.data)
            ? response.data.data.data
            : [];
        setUserList(users);

        setTotalCount(response.data.data.totalCount || 0);
        setCurrentPage(page);
        } catch (error) {
        console.error("회원 정보 조회 실패", error);
        } finally {
        setLoading(false);
        }
    };

    // ---------------------------
    // 컴포넌트 최초 렌더링 시 전체 회원 조회
    // ---------------------------
    useEffect(() => {
        fetchUsers();
    }, []);

    // ---------------------------
    // 회원 클릭 → 모달 열기
    // ---------------------------
    const handleUserClick = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setSelectedUser(null);
    };

    // ---------------------------
    // 검색 처리
    // ---------------------------
    const handleSearch = (searchKeyword) => {
        setKeyword(searchKeyword);
        fetchUsers(searchKeyword, 1); // 검색 시 항상 1페이지로 초기화
    };

    // ---------------------------
    // 페이지네이션 계산
    // ---------------------------
    const totalPages = Math.ceil(totalCount / pageSize);

    const paginationItems = [];
    for (let number = 1; number <= totalPages; number++) {
        paginationItems.push(
        <Pagination.Item
            key={number}
            active={number === currentPage}
            onClick={() => fetchUsers(keyword, number)}
        >
            {number}
        </Pagination.Item>
        );
    }

    // ---------------------------
    // 로딩 상태
    // ---------------------------
    if (loading) return <p>전체 회원 정보를 불러오는 중...</p>;

    // ---------------------------
    // 렌더링
    // ---------------------------
    return (
        <>
        <UserInfoModal
            show={showModal}
            user={selectedUser}
            handleClose={handleClose}
        />

        <UserSearchBar value={keyword} onSearch={handleSearch} />

        <div className="user-list">
            {userList.length === 0 ? (
            <p className="text-center">회원이 없습니다.</p>
            ) : (
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
                    <tr key={user.id || index}>
                        <td>{index + 1}</td>
                        <td
                        className="text-primary"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleUserClick(user)}
                        >
                        {user.username}
                        </td>
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
                {totalPages > 1 && (
                <Pagination className="justify-content-center mt-3">
                    {paginationItems}
                </Pagination>
                )}
            </Card>
            )}
        </div>
        </>
    );
};

export default Users;
