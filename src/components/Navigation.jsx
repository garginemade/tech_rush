import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart3, List } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/" className="brand-link">
            <span className="brand-icon">⚡</span>
            <span className="brand-text">QUANTUM TRADING</span>
          </Link>
        </div>
        
        <div className="nav-links">
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            <Home size={18} />
            <span>Home</span>
          </Link>
          
          <Link 
            to="/dashboard" 
            className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
          >
            <BarChart3 size={18} />
            <span>Dashboard</span>
          </Link>
          
          <Link 
            to="/watchlist" 
            className={`nav-link ${isActive('/watchlist') ? 'active' : ''}`}
          >
            <List size={18} />
            <span>Watchlist</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 