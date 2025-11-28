import React from 'react';

const TagFilter = ({ tags, selectedTags, onTagClick, onClearAll }) => {
  return (
    <div className="mb-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Filter by Tags</h5>
        {selectedTags.length > 0 && (
          <button 
            className="btn btn-sm btn-outline-secondary"
            onClick={onClearAll}
          >
            Clear All
          </button>
        )}
      </div>
      
      <div className="tag-cloud">
        {tags.map((tag, index) => (
          <span
            key={index}
            className={`tag-chip ${selectedTags.includes(tag) ? 'selected' : ''}`}
            onClick={() => onTagClick(tag)}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TagFilter;
