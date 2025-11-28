import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AskDoubt from './pages/AskDoubt';
import DoubtDetail from './pages/DoubtDetail';
import MyDoubts from './pages/MyDoubts';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/doubt/:id" element={<DoubtDetail />} />
            <Route 
              path="/ask" 
              element={
                <PrivateRoute>
                  <AskDoubt />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/my-doubts" 
              element={
                <PrivateRoute>
                  <MyDoubts />
                </PrivateRoute>
              } 
            />
          </Routes>
          <ToastContainer 
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
