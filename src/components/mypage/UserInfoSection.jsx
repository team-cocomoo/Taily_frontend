import React from "react";
import { Button, Table } from "react-bootstrap";
import "@/styles/mypage/UserInfoSection.css";
import { useNavigate } from "react-router-dom";

const UserInfoSection = ({ userInfo }) => {
  const navigate = useNavigate();

  if (!userInfo) return null; // 데이터 없을 때 안전 처리

  return (
    <div className="userinfo-section">
      <Table bordered={false} hover responsive>
        <tbody>
          <tr>
            <th>아이디</th>
            <td>{userInfo.username}</td>
          </tr>
          <tr>
            <th>닉네임</th>
            <td>{userInfo.nickname}</td>
          </tr>
          <tr>
            <th>TEL</th>
            <td>{userInfo.tel}</td>
          </tr>
          <tr>
            <th>이메일</th>
            <td>{userInfo.email}</td>
          </tr>
          <tr>
            <th>주소</th>
            <td>{userInfo.address}</td>
          </tr>
          <tr>
            <th>소개글</th>
            <td>{userInfo.introduction}</td>
          </tr>
        </tbody>
      </Table>

      {/* 버튼 영역 */}
      <div className="text-end mt-3">
        <Button
          variant="warning"
          className="userinfo-edit-btn"
          onClick={() => navigate("/mypage/password-verify")}
        >
          수정하기
        </Button>
      </div>
    </div>
  );
};

export default UserInfoSection;
