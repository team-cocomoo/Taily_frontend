import React from "react";
import { Form, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import ImageBox from "../../components/board/ImageBox";
import WalkPathContent from "../../components/board/walkPath/WalkPathContent";
import WalkPathTitle from "../../components/board/walkPath/WalkPathTitle";
import "../../styles/walkPath/WalkPathWrite.css";

const WalkPathWritePage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");

  return (
    <div className="container main-content">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          {/* 제목 */}
          <WalkPathTitle value={title} onChange={setTitle} />

          {/* 산책 경로 - 지도 API */}

          {/*  내용 */}
          <WalkPathContent />

          {/* 사진 첨부 */}
          <ImageBox />

          <div className="d-flex justify-content-center gap-2 mt-3">
            <Button variant="secondary" onClick={() => navigate("/")}>
              목록
            </Button>
            {/* type=submit */}
            {/* <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? "작성 중..." : "작성완료"}
                </Button> */}
            <Button variant="primary">완료</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalkPathWritePage;
