import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import api from "../../../config/apiConfig";
import UserInfoModal from "../../../components/admin/UserInfoModal";
import UserSearchBar from "../../../components/admin/UserSearchBar";
import Users from "../../../components/admin/Users";
import "../../../styles/admin/AdminUsers.css";

const AdminUsersPage = () => {
    const [userList, setUserList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const itemsPerPage = 10;

    const fetchUsers = async (searchKeyword = "", page = 1) => {
        setLoading(true);
        try {
            const params = { page, size: itemsPerPage };
            if (searchKeyword.trim() !== "") params.keyword = searchKeyword.trim();

            const response = await api.get("/api/admin", { params });
            const data = response.data?.data;

            console.log("data : ", data);
            

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

    useEffect(() => {
        fetchUsers(keyword, currentPage);
    }, [currentPage]);

    const handleSearch = (searchKeyword) => {
        setKeyword(searchKeyword);
        fetchUsers(searchKeyword, 1);
    };

    const handleUserClick = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setSelectedUser(null);
    };

    const handlePageChange = (pageNumber) => {
        if (pageNumber < 1) return;
        setCurrentPage(pageNumber);
    };

    return (
        <Container className="admin-users-container">
        <Row className="align-items-center mb-4">
            <Col>
            <h3 className="admin-users-title">👥 회원 관리</h3>
            <p className="admin-users-subtitle">
                등록된 회원 정보를 조회하고 관리할 수 있습니다.
            </p>
            </Col>
        </Row>

        <Card className="admin-users-card shadow-sm">
            <Card.Body>
            <UserSearchBar value={keyword} onSearch={handleSearch} />

            {loading ? (
                <p className="text-center mt-3">회원 정보를 불러오는 중...</p>
            ) : (
                <Users
                    userList={userList}
                    currentPage={currentPage}
                    totalCount={totalCount}
                    itemsPerPage={itemsPerPage}
                    onUserClick={handleUserClick}
                    onPageChange={handlePageChange}
                />
            )}
            </Card.Body>
        </Card>

        <UserInfoModal show={showModal} user={selectedUser} handleClose={handleClose} />
        </Container>
    );
};

export default AdminUsersPage;
