import React from "react";
import { Container } from "react-bootstrap";
import AdminReportList from "../../components/admin/AdminReportList";

const AdminReportPage = () => {
  return (
    <Container style={{ marginTop: "120px" }}>
      <div className="mt-5 p-4">
        <h4 style={{ fontWeight: "bold" }}>신고</h4>
      </div>
      <AdminReportList />
    </Container>
  );
};

export default AdminReportPage;
