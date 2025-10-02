import { useNavigate } from "react-router-dom";
import "../../styles/WriteButton.css";
import footprintImg from "../../assets/image/footprintImg.png"; // 발자국 이미지 경로

const WriteButton = () => {
  const navigate = useNavigate();

  return (
    <img
      src={footprintImg}
      alt="글 작성 버튼"
      className="write-button"
      onClick={() => navigate("/walkpath/write")}
    />
  );
};

export default WriteButton;
