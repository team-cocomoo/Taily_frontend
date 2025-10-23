import React, { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import SummaryCards from "../../components/board/walkDiary/SummaryCards";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/walkdiary/WalkDiaryStatistics.css";
import WalkCharts from "../../components/board/walkDiary/WalkCharts";
import ReminderCard from "../../components/board/walkDiary/ReminderCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import api from "../../config/apiConfig";
import { useNavigate } from "react-router-dom";

const WalkDiaryStatisticsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 서버에서 통계 데이터 가져오기
    const fetchStats = async () => {
      try {
        const response = await api.get("/api/walk-diaries/stats");
        if (response.data.success) {
          console.log("response.data.data", response.data.data);

          setStats(response.data.data);
        }
      } catch (error) {
        console.error("데이터를 불러오는 데 실패했습니다.", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner message="산책 통계를 불러오는 중..." />;

  return (
    <div className="row justify-content-center">
      <Card className="mb-3 stat-box">
        <Card.Header>통계</Card.Header>
        <Card.Body>
          {/* 이번 달 통계 요약 */}
          <SummaryCards stats={stats} />

          {/* 날짜별 그래프 */}
          <WalkCharts stats={stats} />
        </Card.Body>
      </Card>

      {/* 동기 부여 메시지 */}
      <ReminderCard stats={stats} />
      <Button
        variant="outline-secondary"
        onClick={() => navigate(-1)}
        style={{ width: "60px" }}
      >
        뒤로
      </Button>
    </div>
  );
};

export default WalkDiaryStatisticsPage;
