import React from "react";
import { Form, Card, Row, Col, ToggleButton } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import WalkTimeSelectBox from "./WalkTimeSelectBox";
import { useParams } from "react-router-dom";

const WalkDiaryInfo = ({ values, onChange, onSubmit }) => {
  // 산책 날짜
  const {date} = useParams();

  // 산책 날씨
  // const [weather, setWeather] = useState("SUNNY");
  const weatherOptions = [
    { value: "SUNNY", label: "☀️" },
    { value: "CLOUDY", label: "⛅" },
    { value: "RAINY", label: "🌧️" },
    { value: "SNOWY", label: "❄️" },
  ];

  // 반려견 기분
  // const [emotion, setEmotion] = useState("LOVE");
  const emotionOptions = [
    { value: "LOVE", label: "😍" },
    { value: "SMILE", label: "🙂" },
    { value: "NEUTRAL", label: "😐" },
    { value: "SAD", label: "😟" },
    { value: "ANGRY", label: "😡" },
  ];

  // 산책 일지 작성 처리
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("폼 제출!");
    onSubmit(values); // 부모에서 서버 요청
  };

  return (
    <Card className="mb-4 diary-box">
      <Card.Header className="card-header">
        <span>오늘의 정보</span>
      </Card.Header>
      <Card.Body>
        {/* 에러 메시지 표시 - ErrorAlert 컴포넌트 */}

        <Form onSubmit={handleSubmit}>
          {/* 날짜 - 추후 클릭한 달력 일자로 뜨도록 수정 */}
          <Form.Group as={Row} controlId="date" className="mb-3">
            <Form.Label column sm={2}>
              날짜
            </Form.Label>
            <Col sm={10}>
              {date}
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="weather" className="mb-3">
            <Form.Label column sm={2}>
              날씨
            </Form.Label>
            <Col sm={10}>
              <div className="weather-icons">
                {weatherOptions.map((w, idx) => (
                  <ToggleButton
                    key={idx}
                    id={`weather-${idx}`}
                    type="radio"
                    name="walkDiaryWeather"
                    variant="outline-light"
                    value={w.value}
                    checked={values.walkDiaryWeather === w.value}
                    /*onChange={() => onChange({ target: {name: "walkDiaryWeather", value: w.value}})}*/
                    onChange={(e) => onChange(e)}
                  >
                    {w.label}
                  </ToggleButton>
                ))}
              </div>
            </Col>
          </Form.Group>

          {/* 시간 포맷 컴포넌트 */}
          <Form.Group as={Row} controlId="time" className="mb-3">
            <Form.Label column sm={2}>
              산책 시간
            </Form.Label>
            <Col sm={4}>
              <WalkTimeSelectBox
                  item={{ name: "beginTime", defaultValue: "시작 시간" }}
                  value={values.beginTime}
    onChange={(val) => onChange({ target: { name: "beginTime", value: val } })}
              />
            </Col>

            <Col sm={4}>
              <WalkTimeSelectBox
                  item={{ name: "endTime", defaultValue: "끝 시간" }}
                  value={values.endTime}
    onChange={(val) => onChange({ target: { name: "endTime", value: val } })}
    parentStartTime={values.beginTime} // startTime 전달
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="mood" className="mb-3">
            <Form.Label column sm={2}>
              테일리의 기분
            </Form.Label>
            <Col sm={10}>
              <div className="emotion-icons">
                {emotionOptions.map((emo, idx) => (
                  <ToggleButton
                    key={idx}
                    id={`emotion-${idx}`}
                    type="radio"
                    variant="outline-light"
                    name="walkDiaryEmotion"
                    value={emo.value}
                    checked={values.walkDiaryEmotion === emo.value}
                    onChange={(e) => onChange(e)}
                  >
                    {emo.label}
                  </ToggleButton>
                ))}
              </div>
            </Col>
          </Form.Group>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default WalkDiaryInfo;
