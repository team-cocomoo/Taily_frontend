import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "@/styles/mypage/MyPageUserInfo.css";
import '@/styles/myPage/myLikes.css';
import UserProfileImage from "@/components/mypage/UserProfileImage";
import MyPageSidebar from "@/components/mypage/MyPageSidebar";
import MyLikesList from "../../components/mypage/MyLikesList";

const MyLikePage = () => {
    return (
        <div className="mypage-wrapper">
        <UserProfileImage />

        {/* 본문 영역 */}
        <Container className="mypage-container">
            <Row>
            {/* 왼쪽 사이드 메뉴 */}
            <Col md={3}>
                <MyPageSidebar />
            </Col>

            {/* 오른쪽 내 정보 카드 */}
            <Col md={9}>
                <Card className="mypage-card">
                    <MyLikesList />
                </Card>
            </Col>
            </Row>
        </Container>
    </div>
    );
};

export default MyLikePage;