import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaEye, FaComments, FaClock } from 'react-icons/fa';

const DoubtCard = ({ doubt }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'solved': return 'success';
      case 'closed': return 'secondary';
      default: return 'primary';
    }
  };

  return (
    <Card className="doubt-card h-100">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Link 
            to={`/doubt/${doubt._id}`} 
            style={{ textDecoration: 'none', color: 'inherit', flex: 1 }}
          >
            <Card.Title className="mb-2">
              {doubt.title}
            </Card.Title>
          </Link>
          <Badge bg={getStatusColor(doubt.status)} className="ms-2">
            {doubt.status}
          </Badge>
        </div>
        
        <Card.Text className="text-muted">
          {doubt.description.substring(0, 150)}
          {doubt.description.length > 150 && '...'}
        </Card.Text>
        
        {/* Tags */}
        <div className="mb-3">
          {doubt.tags?.slice(0, 4).map((tag, index) => (
            <span key={index} className="tag-chip">
              {tag}
            </span>
          ))}
          {doubt.tags?.length > 4 && (
            <span className="tag-chip">+{doubt.tags.length - 4}</span>
          )}
        </div>
        
        {/* Similar doubts indicator */}
        {doubt.similarDoubts && doubt.similarDoubts.length > 0 && (
          <div className="mb-2">
            <span className="similarity-badge">
              {doubt.similarDoubts.length} Similar Doubts Found
            </span>
          </div>
        )}
        
        {/* Footer */}
        <div className="d-flex justify-content-between align-items-center text-muted small">
          <span>
            <FaClock className="me-1" />
            {formatDate(doubt.createdAt)}
          </span>
          <div>
            <span className="me-3">
              <FaEye className="me-1" />
              {doubt.views || 0}
            </span>
            <span>
              <FaComments className="me-1" />
              {doubt.replies?.length || 0}
            </span>
          </div>
        </div>
        
        <div className="text-muted small mt-2">
          Asked by: <strong>{doubt.user?.name || 'Anonymous'}</strong>
        </div>
      </Card.Body>
    </Card>
  );
};

export default DoubtCard;
