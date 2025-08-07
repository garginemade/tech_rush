import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Zap, 
  Brain, 
  TrendingUp, 
  Shield, 
  Cpu, 
  Activity,
  ArrowRight,
  Play,
  BarChart3,
  List
} from 'lucide-react';

const Home = () => {
  return (
    <div className="home-page">
      <div className="grid-bg"></div>
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <Zap size={16} />
            <span>LIVE API TRADING</span>
          </div>
          
          <h1 className="hero-title">
            QUANTUM TRADING
            <span className="hero-subtitle">TERMINAL</span>
          </h1>
          
          <p className="hero-description">
            The most advanced live API-powered trading platform with real-time market data, 
            live analytics and performance monitoring.
          </p>
          
          <div className="hero-actions">
            <Link to="/dashboard" className="btn-primary">
              <Play size={18} />
              <span>Launch Dashboard</span>
            </Link>
            
            <Link to="/watchlist" className="btn-secondary">
              <List size={18} />
              <span>View Watchlist</span>
            </Link>
          </div>
        </div>
        
        <div className="hero-visual">
          <div className="terminal-preview">
            <div className="terminal-header">
              <div className="terminal-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span>QUANTUM TERMINAL v2.1.4</span>
            </div>
            <div className="terminal-content">
              <div className="terminal-line">
                <span className="prompt">$</span>
                <span className="command">quantum_scan --market=all</span>
              </div>
              <div className="terminal-output">
                <div className="output-line">Scanning 15,000+ markets...</div>
                <div className="output-line">Live API Data: 99.9% accuracy</div>
                <div className="output-line"> Top Opportunities: AAPL, TSLA, NVDA</div>
                <div className="output-line">Latency: 2.3ms | Throughput: 1.2M ops/s</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Advanced Features</h2>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <Brain size={32} />
            </div>
            <h3>Live Market Analytics</h3>
            <p>Real-time market data analysis with 99.9% accuracy from live financial APIs.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <Activity size={32} />
            </div>
            <h3>Real-Time Streaming</h3>
            <p>Ultra-low latency data streaming with 2.3ms response times and 1.2M operations per second.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <Cpu size={32} />
            </div>
            <h3>Quantum Terminal</h3>
            <p>Advanced command-line interface with AI-powered trading commands and market analysis.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <Shield size={32} />
            </div>
            <h3>Security & Compliance</h3>
            <p>Bank-grade security with SOC 2 compliance and real-time threat detection.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <TrendingUp size={32} />
            </div>
            <h3>Performance Metrics</h3>
            <p>Comprehensive analytics dashboard with portfolio tracking and risk management.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <BarChart3 size={32} />
            </div>
            <h3>Market Sentiment</h3>
            <p>AI-driven market sentiment analysis with social media integration and news correlation.</p>
          </div>
        </div>
      </section>
      
      
      
    
    </div>
  );
};



export default Home; 



