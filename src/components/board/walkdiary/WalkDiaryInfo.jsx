import React, { useState } from "react";
import { Form, Card, Row, Col, ToggleButton, ButtonGroup } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import WalkTimeSelectBox from "../../board/walkdiary/WalkTimeSelectBox";

const WalkDiaryInfo = () => {
    const [date, setDate] = useState("");

    
    // 산책 날씨
    const [weather, setWeather] = useState("SUNNY");
    const weatherOptions = [
        { value: "SUNNY", label: "☀️" },
        { value: "CLOUDY", label: "⛅" },
        { value: "RAINY", label: "🌧️" },
        { value: "SNOWY", label: "❄️" }
    ];

    // 산책 시간
    const [times, setTimes] = useState({
        startTime: "",
        endTime: ""
    });

    const [emotion, setEmotion] = useState("LOVE");
    const emotionOptions = [
        { value: "LOVE", label: "😍"},
        { value: "SMILE", label: "🙂"},
        { value: "NEUTRAL", label: "😐"},
        { value: "SAD", label: "😟"},
        { value: "ANGRY", label: "😡"}
    ];



    // 산책 일지 작성 처리
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("폼 제출!", times);
    }

    return (
        <Card className="mb-4">
            <Card.Header>오늘의 정보</Card.Header>
            <Card.Body>
                {/* 에러 메시지 표시 - ErrorAlert 컴포넌트 */}

                <Form onSubmit={handleSubmit}>
                    {/* 날짜 */}
                    <Form.Group as={Row} controlId="date" className="mb-3">
                        <Form.Label column sm={2}>날짜</Form.Label>
                        <Col sm={10}>
                            <Form.Control 
                                type="date" 
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="weather" className="mb-3">
                        <Form.Label column sm={2}>날씨</Form.Label>
                        <Col sm={10}>
                            <ButtonGroup>
                                {weatherOptions.map((w, idx) => (
                                    <ToggleButton
                                        key={idx}
                                        id={`weather-${idx}`}
                                        type="radio"
                                        variant={weather === w.value ? "primary" : "outline-secondary"}
                                        name="weather"
                                        value={w.value}
                                        checked={weather === w.value}
                                        onChange={(e) => setWeather(e.currentTarget.value)}
                                        // style={{ fontSize: "2rem"}}
                                    >
                                        {w.label}
                                    </ToggleButton>
                                ))}
                            </ButtonGroup>
                        </Col>
                    </Form.Group>

                    {/* 시간 포맷 컴포넌트 */}
                    <Form.Group as={Row} controlId="time" className="mb-3">
                        <Form.Label column sm={2}>산책 시간</Form.Label>
                        <Col sm={4}>
                            <WalkTimeSelectBox 
                                item={{ name: "startTime", defaultValue: "시작 시간" }}
                                times={times}
                                setTimes={setTimes}
                            />
                        </Col>

                        <Col sm={4}>
                            <WalkTimeSelectBox 
                                item={{ name: "endTime", defaultValue: "끝 시간" }}
                                times={times}
                                setTimes={setTimes}
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="mood" className="mb-3">
                        {/* 구현 시 뽀삐에 반려 동물 이름 */}
                        <Form.Label column sm={2}>뽀삐의 기분</Form.Label>
                        <Col sm={10}>
                            <ButtonGroup>
                                {emotionOptions.map((emo, idx) => (
                                    <ToggleButton 
                                        key={idx}
                                        id={`emotion-${idx}`}
                                        type="radio"
                                        variant={emotion === emo.value? "primary" : "outline-secondary"}
                                        name="emotion"
                                        value={emo.value}
                                        checked={emotion === emo.value}
                                        onChange={(e) => setEmotion(e.currentTarget.value)}
                                        // style={{fontSize: "2rem"}}
                                    >
                                        {emo.label}
                                    </ToggleButton>
                                ))}
                            </ButtonGroup>
                        </Col>
                    </Form.Group>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default WalkDiaryInfo;
