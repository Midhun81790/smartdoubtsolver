import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const SimilarDoubtCard = ({ doubt, similarityScore }) => {
  const getScoreColor = (score) => {
    if (score >= 0.7) return 'danger';
    if (score >= 0.5) return 'warning';
    return 'info';
  };

  const getScoreLabel = (score) => {
    if (score >= 0.7) return 'Highly Similar';
    if (score >= 0.5) return 'Moderately Similar';
    return 'Somewhat Similar';
  };

  return (
    <Card className="mb-3 border-start border-4" style={{ borderLeftColor: '#667eea' }}>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Link 
            to={`/doubt/${doubt._id}`} 
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <h6 className="mb-0">{doubt.title}</h6>
          </Link>
          <Badge bg={getScoreColor(similarityScore)} className="ms-2">
            {Math.round(similarityScore * 100)}%
          </Badge>
        </div>
        
        <p className="text-muted small mb-2">
          {doubt.description?.substring(0, 100)}...
        </p>
        
        <div className="d-flex justify-content-between align-items-center">
          <div>
            {doubt.tags?.slice(0, 3).map((tag, index) => (
              <span key={index} className="badge bg-light text-dark me-1">
                {tag}
              </span>
            ))}
          </div>
          <small className="text-muted">
            {getScoreLabel(similarityScore)}
          </small>
        </div>
      </Card.Body>
    </Card>
  );
};

export default SimilarDoubtCard;
