import React from "react";
import { Container } from "react-bootstrap";
import AdminInquiryList from "../../components/admin/AdminInquiryList";
const AdminInquiryPage = () => {
  return (
    <Container style={{ marginTop: "120px" }}>
      <div className="mt-5 p-4">
        <h4 style={{ fontWeight: "bold" }}>신고</h4>
      </div>
      <AdminInquiryList />
    </Container>
  );
};

export default AdminInquiryPage;
