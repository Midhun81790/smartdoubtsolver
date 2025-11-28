import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';

const AskDoubt = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: ''
  });
  const [loading, setLoading] = useState(false);
  const [predictedTags, setPredictedTags] = useState([]);
  const [similarDoubts, setSimilarDoubts] = useState([]);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const response = await api.post('/doubts', {
        title: formData.title,
        description: formData.description,
        tags: tagsArray
      });

      if (response.data.success) {
        const { doubt, similarDoubtsFound } = response.data.data;
        
        toast.success('Doubt posted successfully!');
        
        // Show predicted tags
        if (doubt.autoTags && doubt.autoTags.length > 0) {
          setPredictedTags(doubt.autoTags);
        }
        
        // Show similar doubts
        if (doubt.similarDoubts && doubt.similarDoubts.length > 0) {
          setSimilarDoubts(doubt.similarDoubts);
          toast.info(`Found ${similarDoubtsFound} similar doubts!`);
        }
        
        // Redirect after 3 seconds
        setTimeout(() => {
          navigate(`/doubt/${doubt._id}`);
        }, 3000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error posting doubt');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="shadow">
            <Card.Body className="p-4">
              <h2 className="mb-4">Ask a Doubt</h2>
              
              <Alert variant="info">
                <strong>💡 Smart Features:</strong> Our system will automatically:
                <ul className="mb-0 mt-2">
                  <li>Predict relevant tags for your doubt</li>
                  <li>Find similar previously asked doubts</li>
                  <li>Extract important keywords</li>
                </ul>
              </Alert>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Title *</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    minLength="5"
                    maxLength="200"
                    placeholder="E.g., What is the difference between stack and queue?"
                  />
                  <Form.Text className="text-muted">
                    Be specific and clear (5-200 characters)
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={6}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    minLength="10"
                    maxLength="2000"
                    placeholder="Describe your doubt in detail. Include what you've tried and what specific help you need..."
                  />
                  <Form.Text className="text-muted">
                    Provide detailed context (10-2000 characters)
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Tags (Optional)</Form.Label>
                  <Form.Control
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="E.g., dsa, java, algorithms (comma-separated)"
                  />
                  <Form.Text className="text-muted">
                    Add custom tags. Our system will also suggest tags automatically!
                  </Form.Text>
                </Form.Group>

                <Button 
                  variant="primary" 
                  type="submit" 
                  size="lg"
                  className="w-100"
                  disabled={loading}
                >
                  {loading ? 'Posting Doubt...' : 'Post Doubt'}
                </Button>
              </Form>

              {/* Show predicted tags */}
              {predictedTags.length > 0 && (
                <Alert variant="success" className="mt-4">
                  <strong>🏷️ Auto-Predicted Tags:</strong>
                  <div className="mt-2">
                    {predictedTags.map((tag, index) => (
                      <span key={index} className="tag-chip">
                        {tag}
                      </span>
                    ))}
                  </div>
                </Alert>
              )}

              {/* Show similar doubts */}
              {similarDoubts.length > 0 && (
                <Alert variant="warning" className="mt-4">
                  <strong>🔍 Similar Doubts Found:</strong>
                  <p className="mb-2">
                    We found {similarDoubts.length} similar doubts. You might find your answer there!
                  </p>
                  <ul>
                    {similarDoubts.slice(0, 3).map((item, index) => (
                      <li key={index}>
                        <a href={`/doubt/${item.doubt._id}`} target="_blank" rel="noopener noreferrer">
                          {item.doubt.title}
                        </a>
                        <span className="badge bg-warning text-dark ms-2">
                          {Math.round(item.similarityScore * 100)}% match
                        </span>
                      </li>
                    ))}
                  </ul>
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AskDoubt;
