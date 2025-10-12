import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import "../../styles/myPage/MyPetInfo.css";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import api from '../../config/apiConfig';
// import { useNavigate } from 'react-router-dom';

const MyPetWriteInfoModal = ({ show, handleClose, setSelectedMenu }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [file, setFile] = useState(null);
    const [gender, setGender] = useState("FEMALE");
    // const navigate = useNavigate();

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleGenderChange = (event) => {
        setGender(event.target.value);
    };

    if (loading) return <LoadingSpinner message="내 반려동물 프로필 불러오는 중..." />;

    // 작성 처리
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const token = localStorage.getItem("accessToken");
        try {
            const formData = new FormData();
            formData.append("name", e.target.name.value);
            formData.append("gender", e.target.gender.value);
            formData.append("age", e.target.age.value);
            formData.append("preference", e.target.preference.value);
            formData.append("introduction", e.target.introduction.value);
            if (file) formData.append("profile", file);
    
            for (let [key, value] of formData.entries()) {
                console.log(`${key}:`, value);
            }
    
            const response = await api.post(`/api/mypage/mypet`, formData, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                }
            });
            // TODO: API 호출로 업로드 처리
            if (response.data.success) {
                alert("프로필이 등록되었습니다!");
                handleClose();
                if (setSelectedMenu) setSelectedMenu("my-pets");
            } else {
                setError("등록에 실패했습니다.");
            }
        } catch (error) {
            console.error("작성 중 오류: ", error);
            setError("서버 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>작성 페이지</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    {/* 이름 */}
                    <Form.Group className="mb-3" controlId="petName">
                        <Form.Label>이름</Form.Label>
                        <Form.Control type="text" name="name" placeholder="이름 입력" required />
                    </Form.Group>

                    {/* 성별 */}
                    <Form.Group className="mb-3">
                        <Form.Label>성별</Form.Label>
                        <div>
                            <Form.Check
                                inline
                                label="여자"
                                name="gender"
                                type="radio"
                                id="FEMALE"
                                value="FEMALE"
                                checked={gender === "FEMALE"}
                                onChange={handleGenderChange}
                            />
                            <Form.Check
                                inline
                                label="남자"
                                name="gender"
                                type="radio"
                                id="MALE"
                                value="MALE"
                                checked={gender === "MALE"}
                                onChange={handleGenderChange}
                            />
                        </div>
                    </Form.Group>

                    {/* 나이 */}
                    <Form.Group className="mb-3" controlId="petAge">
                        <Form.Label>나이</Form.Label>
                        <Form.Control type="text" name="age" placeholder="예: 2살" required />
                    </Form.Group>

                    {/* 취향 */}
                    <Form.Group className="mb-3" controlId="petPreference">
                        <Form.Label>취향</Form.Label>
                        <Form.Control type="text" name="preference" placeholder="예: 개껌, 산책, 공놀이" />
                        <Form.Text className="form-text text-muted">쉼표(,)로 구분하여 입력</Form.Text>
                    </Form.Group>

                    {/* 소개글 */}
                    <Form.Group className="mb-3" controlId="petIntroduction">
                        <Form.Label>소개글</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="introduction"
                            rows={3}
                            placeholder="소개글 입력"
                        />
                    </Form.Group>

                    {/* 이미지 업로드 */}
                    <Form.Group className="mb-3" controlId="petImage">
                        <Form.Label>이미지 업로드</Form.Label>
                        <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
                    </Form.Group>

                    {/* 미리보기 */}
                    {file && (
                        <div className="mb-3">
                        <img src={URL.createObjectURL(file)} alt="미리보기" style={{ maxWidth: "100%", height: "auto" }} />
                        </div>
                    )}
                    {error && <p className="text-danger text-center mt-2">{error}</p>}
                    {/* 제출 버튼 */}
                    <Button variant="success" type="submit" disabled={loading}>
                        {loading ? "작성 중..." : "작성완료"}
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default MyPetWriteInfoModal;
