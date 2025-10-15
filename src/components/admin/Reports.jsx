import React, { useEffect, useState } from "react";
import { Card, Table, Pagination } from "react-bootstrap";
import api from "../../config/apiConfig";
import UserSearchBar from "./UserSearchBar";
import ReportInfoModal from "./ReportInfoModal";

const Reports = () => {
  const [reportList, setReportList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // 신고 리스트 조회
  const fetchReports = async (searchKeyword = "", page = 1) => {
    setLoading(true);
    try {
      const params = { page, size: pageSize };
      if (searchKeyword.trim() !== "") params.keyword = searchKeyword.trim();

      const response = await api.get("/api/admin/reports", { params });
      const reports = Array.isArray(response.data.data.reports)
        ? response.data.data.reports
        : [];
      setReportList(reports);
      setTotalCount(response.data.data.totalCount || 0);
      setCurrentPage(page);
    } catch (error) {
      console.error("신고 리스트 조회 실패", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleSearch = (searchKeyword) => {
    setKeyword(searchKeyword);
    fetchReports(searchKeyword, 1);
  };

  const totalPages = Math.ceil(totalCount / pageSize);
  const paginationItems = [];
  for (let number = 1; number <= totalPages; number++) {
    paginationItems.push(
      <Pagination.Item
        key={number}
        active={number === currentPage}
        onClick={() => fetchReports(keyword, number)}
      >
        {number}
      </Pagination.Item>
    );
  }

  const handleReportClick = (report) => {
    setSelectedReport(report);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedReport(null);
  };

  // 유저 제재
  const handleSuspendUser = async (userId, days) => {
    if (!selectedReport) return;

    try {
      await api.post(`/api/admin/reports/${selectedReport.id}/suspend`, null, {
        params: { days },
      });

      // 리스트 상태 업데이트
      setReportList((prev) =>
        prev.map((r) =>
          r.id === selectedReport.id ? { ...r, state: "RESOLVED" } : r
        )
      );
      alert(days > 0 ? "제재 적용 완료" : "신고만 처리 완료");
      handleCloseModal();
    } catch (error) {
      console.error("제재 실패", error);
      alert("제재 처리에 실패했습니다.");
    }
  };

  if (loading) return <p>신고 리스트를 불러오는 중...</p>;

  return (
    <>
      <UserSearchBar value={keyword} onSearch={handleSearch} />

      <div className="report-list">
        {reportList.length === 0 ? (
          <p className="text-center">신고가 없습니다.</p>
        ) : (
          <Card className="p-3 w-100">
            <Table hover responsive style={{ minWidth: "600px" }}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>신고자</th>
                  <th>피신고자</th>
                  <th>내용</th>
                  <th>상태</th>
                  <th>생성일</th>
                </tr>
              </thead>
              <tbody>
                {reportList.map((report, index) => (
                  <tr
                    key={report.id || index}
                    onClick={() => handleReportClick(report)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{index + 1}</td>
                    <td>{report.reporterNickname}</td>
                    <td>{report.reportedNickname}</td>
                    <td>{report.content}</td>
                    <td>
                      {report.state === "PENDING"
                        ? "처리 전"
                        : report.state === "RESOLVED"
                        ? "처리 완료"
                        : report.state}
                    </td>
                    <td>
                      {new Date(report.createdAt).toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {totalPages >= 1 && (
              <Pagination className="justify-content-center mt-3">
                {paginationItems}
              </Pagination>
            )}
          </Card>
        )}
      </div>

      <ReportInfoModal
        show={showModal}
        handleClose={handleCloseModal}
        report={selectedReport}
        onSuspendUser={handleSuspendUser}
      />
    </>
  );
};

export default Reports;
