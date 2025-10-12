import React, { useEffect, useState } from "react";
import { Card, Row, Col, Table, Dropdown, Button } from "react-bootstrap";
import profileImage from "../../assets/image/calendar-paw.png";
import meatballIcon from "../../assets/image/meatball-icon.png";
import api from "../../config/apiConfig";
import MyPetWriteInfoModal from "../../components/mypage/MyPetWriteInfoModal"; 

import "../../styles/myPage/MyPetInfo.css";

const MyPetInfoCard = () => {
    const [petList, setPetList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false); // 모달 상태 추가

    useEffect(() => {
        const fetchMyPets = async () => {
        try {
            const response = await api.get("/api/mypage/mypet");
            if (response.data.success) {
            setPetList(response.data.data);
            }
        } catch (err) {
            console.error("반려동물 리스트 조회 실패:", err);
        } finally {
            setLoading(false);
        }
        };
        fetchMyPets();
    }, []);

    const handleModalOpen = () => setShowModal(true);
    const handleModalClose = () => setShowModal(false);

    if (loading) return <p>반려동물 정보를 불러오는 중...</p>;

    if (!petList || petList.length === 0) {
        return (
        <div className="text-center mt-5">
            <p>아직 내 반려동물 프로필이 없어요.</p>
            <Button variant="warning" onClick={handleModalOpen}>
            등록하기
            </Button>
            {/* 모달 컴포넌트 */}
            <MyPetWriteInfoModal show={showModal} handleClose={handleModalClose} />
        </div>
        );
    }

    return (
        <>
        {petList.map((pet, index) => (
            <Card
            key={index}
            className="profile-box mt-4 p-3"
            style={{ maxWidth: "600px", margin: "auto" }}
            >
            <Row>
                <Col sm={4} className="d-flex justify-content-center align-items-center">
                <img
                    src={profileImage}
                    alt="pet"
                    style={{ width: "100%", borderRadius: "10px" }}
                />
                </Col>
                <Col sm={8} style={{ position: "relative" }}>
                <Dropdown className="profile-dropdown mx-4" style={{ position: "absolute", top: 0, right: 0 }}>
                    <Dropdown.Toggle variant="light" id="dropdown-basic" size="sm" className="no-caret">
                    <img src={meatballIcon} alt="메뉴" className="meatballIcon" />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                    <Dropdown.Item onClick={() => alert("수정")}>수정</Dropdown.Item>
                    <Dropdown.Item onClick={() => alert("삭제")}>삭제</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>

                <Table borderless>
                    <tbody>
                    <tr>
                        <td><strong>이름</strong></td>
                        <td>{pet.name || "-"}</td>
                    </tr>
                    <tr>
                        <td><strong>성별</strong></td>
                        <td>{pet.gender || "-"}</td>
                    </tr>
                    <tr>
                        <td><strong>나이</strong></td>
                        <td>{pet.age || "-"}</td>
                    </tr>
                    <tr>
                        <td><strong>취향</strong></td>
                        <td>{pet.preference?.join(", ") || "-"}</td>
                    </tr>
                    <tr>
                        <td><strong>소개글</strong></td>
                        <td>{pet.introduction || "-"}</td>
                    </tr>
                    </tbody>
                </Table>
                </Col>
            </Row>
            </Card>
        ))}
        </>
    );
};

export default MyPetInfoCard;
