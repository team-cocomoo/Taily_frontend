
import "../../styles/WriteButton.css";
import footprintImg from "../../assets/image/footprintImg.png"; // 발자국 이미지 경로

const WriteButton = ({onClick}) => {

  return (
    <img
      src={footprintImg}
      alt="글 작성 버튼"
      className="write-button"
      onClick={onClick} 
    />
  );
};

export default WriteButton;
