import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <Navbar />
      
      <div className="not-found-container">
        <div className="not-found-content">
          <h1>404</h1>
          <h2>Page Not Found</h2>
          <p>The page you are looking for doesn't exist or has been moved.</p>
          
          <div className="not-found-actions">
            <Link to="/" className="primary-button">
              Go to Homepage
            </Link>
            <Link to="/dashboard" className="secondary-button">
              Go to Dashboard
            </Link>
          </div>
        </div>
        
        <div className="not-found-illustration">
          {/* You could add an SVG illustration here */}
          <div className="lost-icon">
            <span className="icon-compass"></span>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default NotFoundPage;