import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Clock,
  DollarSign,
  Activity,
  Target
} from 'lucide-react';
import { fetchStockQuote, fetchChartData } from '../services/stockAPI';
import StockChart from '../components/StockChart';

const StockDetail = () => {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeframe, setTimeframe] = useState('1D');

  useEffect(() => {
    const loadStockData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchStockQuote(symbol);
        setStockData(data['Global Quote']);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (symbol) {
      loadStockData();
    }
  }, [symbol]);

  // Auto-refresh every 5 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      if (symbol && !loading) {
        try {
          const data = await fetchStockQuote(symbol);
          setStockData(data['Global Quote']);
        } catch (err) {
          console.error('Error refreshing stock data:', err);
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [symbol, loading]);

  if (loading) {
    return (
      <div className="stock-detail-page">
        <div className="grid-bg"></div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <span>Loading {symbol} data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stock-detail-page">
        <div className="grid-bg"></div>
        <div className="error-container">
          <span>Error loading {symbol}: {error}</span>
          <button onClick={() => navigate('/watchlist')} className="btn-primary">
            <ArrowLeft size={16} />
            Back to Watchlist
          </button>
        </div>
      </div>
    );
  }

  if (!stockData) {
    return (
      <div className="stock-detail-page">
        <div className="grid-bg"></div>
        <div className="error-container">
          <span>No data available for {symbol}</span>
          <button onClick={() => navigate('/watchlist')} className="btn-primary">
            <ArrowLeft size={16} />
            Back to Watchlist
          </button>
        </div>
      </div>
    );
  }

  const price = parseFloat(stockData['05. price']);
  const change = parseFloat(stockData['09. change']);
  const changePercent = parseFloat(stockData['10. change percent'].replace('%', ''));
  const isPositive = change >= 0;

  return (
    <div className="stock-detail-page">
      <div className="grid-bg"></div>
      
      <div className="stock-detail-container">
        {/* Header */}
        <div className="detail-header">
          <button onClick={() => navigate('/watchlist')} className="back-btn">
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          
          <div className="stock-info">
            <h1 className="stock-symbol">{symbol}</h1>
            <div className="stock-price-large">
              ${price.toFixed(2)}
            </div>
            <div className={`stock-change ${isPositive ? 'positive' : 'negative'}`}>
              {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span>
                {isPositive ? '+' : ''}${change.toFixed(2)} ({changePercent.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon">
              <DollarSign size={20} />
            </div>
            <div className="metric-content">
              <span className="metric-label">Open</span>
              <span className="metric-value">${parseFloat(stockData['02. open']).toFixed(2)}</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">
              <TrendingUp size={20} />
            </div>
            <div className="metric-content">
              <span className="metric-label">High</span>
              <span className="metric-value">${parseFloat(stockData['03. high']).toFixed(2)}</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">
              <TrendingDown size={20} />
            </div>
            <div className="metric-content">
              <span className="metric-label">Low</span>
              <span className="metric-value">${parseFloat(stockData['04. low']).toFixed(2)}</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">
              <Activity size={20} />
            </div>
            <div className="metric-content">
              <span className="metric-label">Volume</span>
              <span className="metric-value">{parseInt(stockData['06. volume']).toLocaleString()}</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">
              <Clock size={20} />
            </div>
            <div className="metric-content">
              <span className="metric-label">Previous Close</span>
              <span className="metric-value">${parseFloat(stockData['08. previous close']).toFixed(2)}</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">
              <Target size={20} />
            </div>
            <div className="metric-content">
              <span className="metric-label">Trading Day</span>
              <span className="metric-value">{stockData['07. latest trading day']}</span>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="chart-section">
          <div className="chart-header">
            <h2>Price Chart</h2>
            <div className="timeframe-controls">
              <button 
                className={`timeframe-btn ${timeframe === '1D' ? 'active' : ''}`}
                onClick={() => setTimeframe('1D')}
              >
                1 Day
              </button>
              <button 
                className={`timeframe-btn ${timeframe === '1W' ? 'active' : ''}`}
                onClick={() => setTimeframe('1W')}
              >
                1 Week
              </button>
              <button 
                className={`timeframe-btn ${timeframe === '1M' ? 'active' : ''}`}
                onClick={() => setTimeframe('1M')}
              >
                1 Month
              </button>
            </div>
          </div>
          
          <div className="chart-wrapper">
            <StockChart symbol={symbol} timeframe={timeframe} />
          </div>
        </div>

        {/* Auto-refresh indicator */}
        <div className="refresh-indicator">
          <Activity size={14} />
          <span>Auto-refreshing every 5 seconds</span>
        </div>
      </div>
    </div>
  );
};

export default StockDetail; 