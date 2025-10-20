import React, { useEffect, useState } from "react";
import { Card, Row, Col, Table, Dropdown, Button } from "react-bootstrap";
import meatballIcon from "../../assets/image/meatball-icon.png";
import api from "../../config/apiConfig";
import MyPetWriteInfoModal from "../../components/mypage/MyPetWriteInfoModal"; 
import SecureImage from "../../components/common/SecureImage";

import "../../styles/myPage/MyPetInfo.css";

const MyPetInfoCard = ({ setSelectedMenu }) => {
    const [petList, setPetList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false); // 모달 상태 추가
    const [selectedPet, setSelectedPet] = useState(null); // 모달용 선택 반려동물

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

    const handleModalClose = () => {
        setShowModal(false);
        setSelectedPet(null);
    };

    // 프로필 삭제
    const handleDelete = async (petId) => {
        const token = localStorage.getItem("accessToken");
        if(!window.confirm("정말 마이 펫 프로필을 삭제하시겠습니까?")) return;

        try {
            await api.delete(`/api/mypage/mypet/${petId}`, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                },
            });
            alert("삭제 완료");
            // 삭제 후 리스트에서 제거
            setPetList(prev => prev.filter(p => p.petId !== petId));

        } catch (error) {
            console.error("삭제 실패:", error);
            alert("삭제에 실패했습니다.");
        }
    }

    if (loading) return <p>반려동물 정보를 불러오는 중...</p>;

    return (
<>
            {/* 등록 버튼 */}
            <div className="text-center mt-3 mb-3">
                <Button
                    variant="warning"
                    onClick={() => {
                        setSelectedPet(null);
                        setShowModal(true);
                    }}
                >
                    새로운 프로필 추가
                </Button>
            </div>

            {/* 모달 */}
            <MyPetWriteInfoModal
                show={showModal}
                handleClose={handleModalClose}
                setSelectedMenu={setSelectedMenu}
                pet={selectedPet}
                onSuccess={(updatedPet, petId) => {
                    setPetList(prev => {
                        if (petId) {
                            return prev.map(p => (p.petId === petId ? updatedPet : p));
                        } else {
                            return [...prev, updatedPet];
                        }
                    });
                }}
            />

            {/* 프로필 리스트 */}
            <div className="profile-list-container">
                {petList.length === 0 ? (
                    <p className="text-center">아직 내 반려동물 프로필이 없어요.</p>
                ) : (
                    petList.map((pet, index) => (
                        <Card key={index} className="profile-box mt-4 p-3" style={{ maxWidth: "600px", margin: "auto" }}>
                            <Row>
                                <Col sm={4} className="d-flex justify-content-center align-items-center">
                                    {/* ✅ SecureImage로 교체 */}
                                    {pet.imagePath ? (
                                        <SecureImage
                                            src={pet.imagePath}
                                            alt={pet.name}
                                            style={{ width: "100%", borderRadius: "10px", objectFit: "cover" }}
                                        />
                                    ) : (
                                        <div
                                            style={{
                                                width: "100%",
                                                height: "150px",
                                                backgroundColor: "#f0f0f0",
                                                borderRadius: "10px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                color: "#aaa",
                                            }}
                                        >
                                            이미지 없음
                                        </div>
                                    )}
                                </Col>

                                <Col sm={8} style={{ position: "relative" }}>
                                    <Dropdown className="profile-dropdown mx-4" style={{ position: "absolute", top: 0, right: 0 }}>
                                        <Dropdown.Toggle variant="light" id="dropdown-basic" size="sm" className="no-caret">
                                            <img src={meatballIcon} alt="메뉴" className="meatballIcon" />
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item
                                                onClick={() => {
                                                    setSelectedPet(pet);
                                                    setShowModal(true);
                                                }}
                                            >
                                                수정
                                            </Dropdown.Item>
                                            <Dropdown.Item onClick={() => handleDelete(pet.petId)}>삭제</Dropdown.Item>
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
                                                <td>{Array.isArray(pet.preference) ? pet.preference.join(", ") : pet.preference || "-"}</td>
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
                    ))
                )}
            </div>
        </>
    );
};

export default MyPetInfoCard;
