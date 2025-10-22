import React from "react";
import { Table, Pagination } from "react-bootstrap";

const Users = ({
        userList = [],
        currentPage = 1,
        totalCount = 0,
        itemsPerPage = 10,
        onUserClick,
        onPageChange
    }) => {
    const totalPages = Math.ceil(totalCount / itemsPerPage);

    if (!userList.length)
        return <p className="text-center">등록된 회원이 없습니다.</p>;

    return (
        <div className="admin-users-list">
            <Table hover bordered responsive className="admin-users-table align-middle">
                <thead>
                    <tr>
                        <th style={{ width: "5%" }}>#</th>
                        <th style={{ width: "15%" }}>아이디</th>
                        <th style={{ width: "15%" }}>닉네임</th>
                        <th style={{ width: "25%" }}>이메일</th>
                        <th style={{ width: "15%" }}>가입일</th>
                        <th style={{ width: "10%" }}>상태</th>
                        <th style={{ width: "10%" }}>제재</th>
                    </tr>
                </thead>
                <tbody>
                {userList.map((user, index) => (
                    <tr
                    key={user.id || index}
                    onClick={() => onUserClick?.(user)}
                    className="user-row"
                    style={{ cursor: "pointer" }}
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

            {totalPages >= 1 && (
                <Pagination className="justify-content-center mt-4">
                    <Pagination.Prev
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Prev
                    </Pagination.Prev>

                    {[...Array(totalPages || 1)].map((_, i) => (
                        <Pagination.Item
                        key={i + 1}
                        active={i + 1 === currentPage}
                        onClick={() => onPageChange(i + 1)}
                        >
                        {i + 1}
                        </Pagination.Item>
                    ))}

                    <Pagination.Next
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </Pagination.Next>
                </Pagination>
            )}
        </div>
    );
};

export default Users;
