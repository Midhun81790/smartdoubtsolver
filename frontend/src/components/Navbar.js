import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar as BSNavbar, Container, Nav, Button } from 'react-bootstrap';
import { FaQuestionCircle, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <BSNavbar bg="white" expand="lg" className="shadow-sm mb-4">
      <Container>
        <BSNavbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <FaQuestionCircle className="me-2" size={28} />
          <span style={{ fontSize: '1.5rem' }}>Smart Doubt Solver</span>
        </BSNavbar.Brand>
        
        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
        
        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            
            {isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/ask">
                  <Button variant="primary" size="sm">
                    Ask Doubt
                  </Button>
                </Nav.Link>
                
                <Nav.Link as={Link} to="/my-doubts">
                  My Doubts
                </Nav.Link>
                
                <Nav.Link className="d-flex align-items-center">
                  <FaUser className="me-2" />
                  {user?.name}
                </Nav.Link>
                
                <Nav.Link onClick={handleLogout}>
                  <Button variant="outline-danger" size="sm">
                    <FaSignOutAlt className="me-1" />
                    Logout
                  </Button>
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  <Button variant="outline-primary" size="sm">
                    Login
                  </Button>
                </Nav.Link>
                
                <Nav.Link as={Link} to="/register">
                  <Button variant="primary" size="sm">
                    Register
                  </Button>
                </Nav.Link>
              </>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
};

export default Navbar;
