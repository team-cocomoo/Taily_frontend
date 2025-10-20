import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import "../../styles/myPage/MyPetInfo.css";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import api from '../../config/apiConfig';
import "../../styles/myPage/MyPetInfo.css";

const MyPetWriteInfoModal = ({ show, handleClose, setSelectedMenu, pet, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [file, setFile] = useState(null);
    const [name, setName] = useState("");
    const [gender, setGender] = useState("FEMALE");
    const [age, setAge] = useState("");
    const [preference, setPreference] = useState("");
    const [introduction, setIntroduction] = useState("");

    useEffect(() => {
        if (pet) {
            setName(pet.name || "");
            setGender(pet.gender || "FEMALE");
            setAge(pet.age || "");
            setPreference(Array.isArray(pet.preference) ? pet.preference.join(", ") : pet.preference || "");
            setIntroduction(pet.introduction || "");
            setFile(null);
        } else {
            setName("");
            setGender("FEMALE");
            setAge("");
            setPreference("");
            setIntroduction("");
            setFile(null);
            }
    }, [pet, show]);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleGenderChange = (event) => {
        setGender(event.target.value);
    };

    // 이미지 업로드
    const uploadPetProfileImage = async (token) => {
        if (!file) return null;
        
        const formData = new FormData();
        formData.append("tableTypesId", 2);
        formData.append("subFolder", "pet");
        formData.append("files", file);

        const response = await api.post("/api/images/upload", formData, {
            headers: {
                Authorization: token ? `Bearer ${token}` : "",
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data[0]?.id || null;
    };

    // 프로필 등록/수정
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const token = localStorage.getItem("accessToken");

        try {
            // 이미지 먼저 업로드
            const imageId = await uploadPetProfileImage(token);

            // 반려동물 프로필 JSON 데이터
            const petData = {
                name,
                gender,
                age,
                preference,
                introduction, 
                imageId,    // 업로드한 이미지의 ID
            }

            // FormData 구성
            const formDataToSend = new FormData();
            formDataToSend.append(
                "myPetProfile",
                new Blob([JSON.stringify(petData)], { type: "application/json" })
            );
    
            let response;
            if (pet?.petId) {
                // 수정
                response = await api.put(`/api/mypage/mypet/${pet.petId}`, formDataToSend, {
                    headers: { Authorization: token ? `Bearer ${token}` : "" },
                    transformRequest: [(data, headers) => {
                        delete headers['Content-Type']; 
                        return data;
                    }],
                });
            } else {
                // 작성
                response = await api.post(`/api/mypage/mypet`, formDataToSend, {
                    headers: { Authorization: token ? `Bearer ${token}` : "" },
                    transformRequest: [(data, headers) => {
                        delete headers['Content-Type']; 
                        return data;
                    }],
                });
            }
    
            // TODO: API 호출로 업로드 처리
            if (response.data.success) {
                alert(`프로필이 ${pet ? "수정" : "등록"}되었습니다!`);
                // 부모 state 업데이트
                if (onSuccess) onSuccess(response.data.data, pet?.petId);

                handleClose();

                if (setSelectedMenu) setSelectedMenu("my-pets");
            } else {
                setError(`${pet ? "수정" : "등록"}에 실패했습니다.`);
            }
        } catch (error) {
            console.error("작성/수정 중 오류:", error);
            setError("서버 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner message="내 반려동물 프로필 불러오는 중..." />;

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{pet ? "수정" : "작성"} 페이지</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>

  {/* 이름 */}
  <Form.Group className="mb-3 form-row-inline">
    <Form.Label>이름</Form.Label>
    <Form.Control
      type="text"
      value={name}
      onChange={(e) => setName(e.target.value)}
      required
    />
  </Form.Group>

{/* 성별 */}
<Form.Group className="mb-3 form-gender-inline">
  <Form.Label>성별</Form.Label>
  <div>
    <Form.Check
      inline
      label="여자"
      name="gender"
      type="radio"
      value="FEMALE"
      checked={gender === "FEMALE"}
      onChange={handleGenderChange}
    />
    <Form.Check
      inline
      label="남자"
      name="gender"
      type="radio"
      value="MALE"
      checked={gender === "MALE"}
      onChange={handleGenderChange}
    />
  </div>
</Form.Group>

  {/* 나이 */}
  <Form.Group className="mb-3 form-row-inline">
    <Form.Label>나이</Form.Label>
    <div className="d-flex align-items-center gap-2">
      <Form.Control
        type="number"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        required
        style={{ width: "100px" }}
      />
      <span>살</span>
    </div>
  </Form.Group>

  {/* 취향 */}
  <Form.Group className="mb-3">
    <Form.Label>취향</Form.Label>
    <Form.Control
      type="text"
      value={preference}
      onChange={(e) => setPreference(e.target.value)}
      placeholder="예: 개껌, 산책, 공놀이"
    />
    <Form.Text className="text-muted">
      쉼표(,)로 구분하여 입력
    </Form.Text>
  </Form.Group>

  {/* 소개글 */}
  <Form.Group className="mb-3">
    <Form.Label>소개글</Form.Label>
    <Form.Control
      as="textarea"
      rows={3}
      value={introduction}
      onChange={(e) => setIntroduction(e.target.value)}
    />
  </Form.Group>

  {/* 이미지 업로드 */}
  <Form.Group className="mb-3">
    <Form.Label>이미지 업로드</Form.Label>
    <Form.Control
      type="file"
      accept="image/*"
      onChange={handleFileChange}
    />
  </Form.Group>

  {/* 미리보기 */}
  {file && (
    <div className="mb-3">
      <img
        src={URL.createObjectURL(file)}
        alt="미리보기"
        className="pet-preview-img"
      />
    </div>
  )}

  {error && <p className="text-danger text-center mt-2">{error}</p>}

  <Button variant="success" type="submit" disabled={loading}>
    {loading ? "처리 중..." : pet ? "수정완료" : "작성완료"}
  </Button>

</Form>

            </Modal.Body>
        </Modal>
    );
};

export default MyPetWriteInfoModal;
