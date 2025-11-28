import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { FaEye, FaComments, FaClock, FaUser } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import ReplyCard from '../components/ReplyCard';
import SimilarDoubtCard from '../components/SimilarDoubtCard';

const DoubtDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [doubt, setDoubt] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchDoubt();
    fetchReplies();
  }, [id]);

  const fetchDoubt = async () => {
    try {
      const response = await api.get(`/doubts/${id}`);
      if (response.data.success) {
        setDoubt(response.data.data.doubt);
      }
    } catch (error) {
      toast.error('Error fetching doubt');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReplies = async () => {
    try {
      const response = await api.get(`/replies/${id}`);
      if (response.data.success) {
        setReplies(response.data.data.replies);
      }
    } catch (error) {
      console.error('Error fetching replies:', error);
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please login to reply');
      return;
    }

    setSubmitting(true);

    try {
      const response = await api.post(`/replies/${id}`, {
        content: replyText
      });

      if (response.data.success) {
        toast.success('Reply added successfully!');
        setReplyText('');
        fetchReplies();
      }
    } catch (error) {
      toast.error('Error adding reply');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpvote = async (replyId) => {
    try {
      const response = await api.patch(`/replies/${replyId}/upvote`);
      if (response.data.success) {
        toast.success('Upvoted!');
        fetchReplies();
      }
    } catch (error) {
      toast.error('Error upvoting reply');
    }
  };

  const handleAccept = async (replyId) => {
    try {
      const response = await api.patch(`/replies/${replyId}/accept`);
      if (response.data.success) {
        toast.success('Reply accepted as solution!');
        fetchReplies();
        fetchDoubt();
      }
    } catch (error) {
      toast.error('Error accepting reply');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'solved': return 'success';
      case 'closed': return 'secondary';
      default: return 'primary';
    }
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (!doubt) {
    return (
      <Container className="py-4">
        <Alert variant="danger">Doubt not found</Alert>
      </Container>
    );
  }

  const canAcceptReplies = user && doubt.user._id === user.id;

  return (
    <Container className="py-4">
      <Row>
        {/* Main Content */}
        <Col lg={8}>
          {/* Doubt Card */}
          <Card className="shadow mb-4">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h2 className="mb-0">{doubt.title}</h2>
                <Badge bg={getStatusColor(doubt.status)} className="ms-2">
                  {doubt.status}
                </Badge>
              </div>

              <div className="d-flex gap-3 text-muted small mb-3">
                <span>
                  <FaUser className="me-1" />
                  {doubt.user.name}
                </span>
                <span>
                  <FaClock className="me-1" />
                  {formatDate(doubt.createdAt)}
                </span>
                <span>
                  <FaEye className="me-1" />
                  {doubt.views} views
                </span>
                <span>
                  <FaComments className="me-1" />
                  {replies.length} replies
                </span>
              </div>

              <Card.Text className="mb-4" style={{ whiteSpace: 'pre-wrap' }}>
                {doubt.description}
              </Card.Text>

              {/* Tags */}
              <div className="mb-3">
                <strong className="me-2">Tags:</strong>
                {doubt.tags?.map((tag, index) => (
                  <span key={index} className="tag-chip">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Auto Tags */}
              {doubt.autoTags && doubt.autoTags.length > 0 && (
                <div className="mb-3">
                  <strong className="me-2">🤖 Auto-Predicted Tags:</strong>
                  {doubt.autoTags.map((tag, index) => (
                    <span key={index} className="tag-chip">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Keywords */}
              {doubt.keywords && doubt.keywords.length > 0 && (
                <div>
                  <strong className="me-2">🔑 Keywords:</strong>
                  {doubt.keywords.slice(0, 8).map((keyword, index) => (
                    <span key={index} className="keyword-highlight me-2">
                      {keyword}
                    </span>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Replies Section */}
          <Card className="shadow mb-4">
            <Card.Body className="p-4">
              <h4 className="mb-4">
                Replies ({replies.length})
              </h4>

              {replies.length === 0 ? (
                <div className="text-center text-muted py-4">
                  <p>No replies yet. Be the first to help!</p>
                </div>
              ) : (
                <div>
                  {replies.map((reply) => (
                    <ReplyCard
                      key={reply._id}
                      reply={reply}
                      onUpvote={handleUpvote}
                      onAccept={handleAccept}
                      canAccept={canAcceptReplies}
                    />
                  ))}
                </div>
              )}

              {/* Add Reply Form */}
              {isAuthenticated ? (
                <div className="mt-4">
                  <h5 className="mb-3">Add Your Reply</h5>
                  <Form onSubmit={handleReplySubmit}>
                    <Form.Group className="mb-3">
                      <Form.Control
                        as="textarea"
                        rows={4}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write your answer here..."
                        required
                      />
                    </Form.Group>
                    <Button 
                      type="submit" 
                      variant="primary"
                      disabled={submitting}
                    >
                      {submitting ? 'Submitting...' : 'Submit Reply'}
                    </Button>
                  </Form>
                </div>
              ) : (
                <Alert variant="info" className="mt-4">
                  Please <a href="/login">login</a> to add a reply
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Sidebar */}
        <Col lg={4}>
          {/* Similar Doubts */}
          {doubt.similarDoubts && doubt.similarDoubts.length > 0 && (
            <Card className="shadow mb-4">
              <Card.Body>
                <h5 className="mb-3">🔍 Similar Doubts</h5>
                <p className="text-muted small">
                  Found {doubt.similarDoubts.length} similar doubts based on content analysis
                </p>
                {doubt.similarDoubts.map((item, index) => (
                  <SimilarDoubtCard
                    key={index}
                    doubt={item.doubt}
                    similarityScore={item.similarityScore}
                  />
                ))}
              </Card.Body>
            </Card>
          )}

          {/* Doubt Stats */}
          <Card className="shadow">
            <Card.Body>
              <h5 className="mb-3">Doubt Statistics</h5>
              <div className="d-flex justify-content-between mb-2">
                <span>Views:</span>
                <strong>{doubt.views}</strong>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Replies:</span>
                <strong>{replies.length}</strong>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Status:</span>
                <Badge bg={getStatusColor(doubt.status)}>
                  {doubt.status}
                </Badge>
              </div>
              <div className="d-flex justify-content-between">
                <span>Created:</span>
                <small>{new Date(doubt.createdAt).toLocaleDateString()}</small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DoubtDetail;
