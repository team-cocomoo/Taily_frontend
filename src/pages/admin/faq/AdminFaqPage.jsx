import { PencilFill } from 'react-bootstrap-icons';
import AdminFaqList from '../../../components/admin/AdminFaqList';
import { Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const AdminFaqPage = () => {
    const navigate = useNavigate();
    return (
        <Container style={{ marginTop: "120px" }}>
            <div className="mt-5 p-4">
                <h4 style={{fontWeight:"bold"}}>FAQ</h4>
            </div>
            <AdminFaqList />

            
            <Button onClick={() => navigate("/admin/main/faqs/write")} variant="link" className="text-dark ms-2">
                <PencilFill size={16} />
            </Button>
        </Container>
    );
};

export default AdminFaqPage;