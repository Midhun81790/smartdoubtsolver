import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, InputGroup, Spinner } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import api from '../utils/api';
import DoubtCard from '../components/DoubtCard';
import TagFilter from '../components/TagFilter';
import { toast } from 'react-toastify';

const AVAILABLE_TAGS = [
  'dsa', 'oop', 'dbms', 'web-development', 'java', 'python', 
  'sql', 'os', 'networking', 'aptitude', 'machine-learning', 'git'
];

const Home = () => {
  const [doubts, setDoubts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchDoubts();
    fetchStats();
  }, [selectedTags]);

  const fetchDoubts = async () => {
    try {
      setLoading(true);
      const params = {};
      
      if (selectedTags.length > 0) {
        params.tags = selectedTags.join(',');
      }
      
      if (searchQuery) {
        params.search = searchQuery;
      }
      
      const response = await api.get('/doubts', { params });
      
      if (response.data.success) {
        setDoubts(response.data.data.doubts);
      }
    } catch (error) {
      toast.error('Error fetching doubts');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/doubts/stats/tags');
      if (response.data.success) {
        setStats(response.data.data.tagStats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDoubts();
  };

  const handleTagClick = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleClearTags = () => {
    setSelectedTags([]);
  };

  return (
    <Container className="py-4">
      {/* Hero Section */}
      <Row className="mb-4">
        <Col>
          <div className="text-center mb-4">
            <h1 className="display-4 mb-3">
              Welcome to Smart Doubt Solver
            </h1>
            <p className="lead text-muted">
              Ask doubts, get instant similar question suggestions, and smart tag predictions
            </p>
          </div>
        </Col>
      </Row>

      {/* Search Bar */}
      <Row className="mb-4">
        <Col md={8} className="mx-auto">
          <Form onSubmit={handleSearch}>
            <InputGroup size="lg">
              <InputGroup.Text>
                <FaSearch />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search doubts by keywords, title, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="btn btn-primary" type="submit">
                Search
              </button>
            </InputGroup>
          </Form>
        </Col>
      </Row>

      <Row>
        {/* Sidebar - Tag Filter */}
        <Col lg={3}>
          <div className="sticky-top" style={{ top: '20px' }}>
            <TagFilter
              tags={AVAILABLE_TAGS}
              selectedTags={selectedTags}
              onTagClick={handleTagClick}
              onClearAll={handleClearTags}
            />
            
            {/* Stats */}
            {stats && stats.length > 0 && (
              <div className="stats-card mt-4">
                <h6 className="mb-3">Popular Tags</h6>
                {stats.slice(0, 5).map((stat, index) => (
                  <div key={index} className="d-flex justify-content-between mb-2">
                    <span>{stat._id}</span>
                    <span className="badge bg-light text-dark">{stat.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Col>

        {/* Main Content - Doubts List */}
        <Col lg={9}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4>
              {selectedTags.length > 0 
                ? `Doubts filtered by: ${selectedTags.join(', ')}` 
                : 'All Doubts'
              }
            </h4>
            <span className="text-muted">
              {doubts.length} {doubts.length === 1 ? 'doubt' : 'doubts'} found
            </span>
          </div>

          {loading ? (
            <div className="spinner-container">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : doubts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">❓</div>
              <h4>No doubts found</h4>
              <p>Try adjusting your filters or search query</p>
            </div>
          ) : (
            <Row>
              {doubts.map((doubt) => (
                <Col key={doubt._id} md={6} lg={4} className="mb-4">
                  <DoubtCard doubt={doubt} />
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
