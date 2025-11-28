import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import DoubtCard from '../components/DoubtCard';

const MyDoubts = () => {
  const { user } = useAuth();
  const [doubts, setDoubts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyDoubts();
  }, []);

  const fetchMyDoubts = async () => {
    try {
      const response = await api.get('/doubts');
      
      if (response.data.success) {
        // Filter doubts by current user
        const myDoubts = response.data.data.doubts.filter(
          doubt => doubt.user._id === user.id
        );
        setDoubts(myDoubts);
      }
    } catch (error) {
      toast.error('Error fetching your doubts');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h2>My Doubts</h2>
          <p className="text-muted">
            You have asked {doubts.length} {doubts.length === 1 ? 'doubt' : 'doubts'}
          </p>
        </Col>
      </Row>

      {doubts.length === 0 ? (
        <Alert variant="info">
          <h5>No doubts yet</h5>
          <p className="mb-0">
            You haven't asked any doubts yet. <a href="/ask">Ask your first doubt</a>
          </p>
        </Alert>
      ) : (
        <Row>
          {doubts.map((doubt) => (
            <Col key={doubt._id} md={6} lg={4} className="mb-4">
              <DoubtCard doubt={doubt} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default MyDoubts;
