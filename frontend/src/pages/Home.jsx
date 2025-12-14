import React from 'react'
import { Link } from 'react-router-dom'
import './Home.css'

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-content">
        <div className="home-header">
          <h1>🛒 Gourmet Marketplace</h1>
          <p className="subtitle">Management System</p>
        </div>
        
        <div className="login-options">
          <Link to="/admin/login" className="login-option-card admin">
            <div className="option-icon">👨‍💼</div>
            <h2>Admin Login</h2>
            <p>Access the management dashboard</p>
            <span className="arrow">→</span>
          </Link>
          
          <Link to="/customer/login" className="login-option-card customer">
            <div className="option-icon">👤</div>
            <h2>Customer Login</h2>
            <p>Place orders and view your history</p>
            <span className="arrow">→</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home

