import React from 'react';
import { FaCheck } from 'react-icons/fa';

const ReplyCard = ({ reply, onUpvote, onAccept, canAccept }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`reply-item ${reply.isAccepted ? 'reply-accepted' : ''}`}>
      <div className="d-flex justify-content-between align-items-start mb-2">
        <div>
          <strong>{reply.user?.name || 'Anonymous'}</strong>
          <small className="text-muted ms-2">
            {formatDate(reply.createdAt)}
          </small>
        </div>
        
        {reply.isAccepted && (
          <span className="badge bg-success">
            <FaCheck className="me-1" />
            Accepted Answer
          </span>
        )}
      </div>
      
      <p className="mb-3">{reply.content}</p>
      
      <div className="d-flex gap-2">
        <button 
          className="btn btn-sm btn-outline-primary"
          onClick={() => onUpvote(reply._id)}
        >
          👍 Upvote ({reply.upvotes || 0})
        </button>
        
        {canAccept && !reply.isAccepted && (
          <button 
            className="btn btn-sm btn-success"
            onClick={() => onAccept(reply._id)}
          >
            <FaCheck className="me-1" />
            Accept as Solution
          </button>
        )}
      </div>
    </div>
  );
};

export default ReplyCard;
