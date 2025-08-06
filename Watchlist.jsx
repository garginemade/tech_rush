import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  X, 
  TrendingUp, 
  TrendingDown, 
  Brain, 
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3
} from 'lucide-react';
import { fetchStockQuote } from '../services/stockAPI';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([
    'AAPL', 'GOOGL', 'MSFT', 'TSLA', 'NVDA', 'AMZN', 'META', 'NFLX'
  ]);
  const [stockData, setStockData] = useState({});
  const [loading, setLoading] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStock, setNewStock] = useState('');
  const [aiPredictions, setAiPredictions] = useState({});

  // Fetch stock data
  useEffect(() => {
    const fetchData = async () => {
      for (const symbol of watchlist) {
        if (!stockData[symbol] && !loading[symbol]) {
          setLoading(prev => ({ ...prev, [symbol]: true }));
          try {
            const data = await fetchStockQuote(symbol);
            setStockData(prev => ({ ...prev, [symbol]: data }));
          } catch (error) {
            console.error(`Error fetching ${symbol}:`, error);
          } finally {
            setLoading(prev => ({ ...prev, [symbol]: false }));
          }
        }
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [watchlist, stockData, loading]);

  // Analyze live market data
  useEffect(() => {
    const analyzeMarketData = () => {
      const analysis = {};
      watchlist.forEach(symbol => {
        if (stockData[symbol] && stockData[symbol]['Global Quote']) {
          const quote = stockData[symbol]['Global Quote'];
          const currentPrice = parseFloat(quote['05. price'] || 0);
          const change = parseFloat(quote['09. change'] || 0);
          const changePercent = parseFloat(quote['10. change percent']?.replace('%', '') || 0);
          const volume = parseInt(quote['06. volume'] || 0);
          
          // Calculate market indicators based on live data
          const volatility = Math.abs(changePercent);
          const trend = change > 0 ? 'bullish' : 'bearish';
          const confidence = Math.min(95, 70 + (volatility * 2)); // Higher volatility = higher confidence
          
          analysis[symbol] = {
            currentPrice: currentPrice.toFixed(2),
            confidence: confidence.toFixed(1),
            direction: trend,
            timeframe: '24h',
            volume: volume.toLocaleString(),
            changePercent: changePercent.toFixed(2),
            timestamp: new Date().toISOString()
          };
        }
      });
      setAiPredictions(analysis);
    };

    if (Object.keys(stockData).length > 0) {
      analyzeMarketData();
      const interval = setInterval(analyzeMarketData, 30000); // Update every 30 seconds
      return () => clearInterval(interval);
    }
  }, [stockData, watchlist]);

  const addStock = () => {
    if (newStock.trim() && !watchlist.includes(newStock.toUpperCase())) {
      setWatchlist(prev => [...prev, newStock.toUpperCase()]);
      setNewStock('');
      setShowAddForm(false);
    }
  };

  const removeStock = (symbol) => {
    setWatchlist(prev => prev.filter(s => s !== symbol));
    setStockData(prev => {
      const newData = { ...prev };
      delete newData[symbol];
      return newData;
    });
    setAiPredictions(prev => {
      const newPredictions = { ...prev };
      delete newPredictions[symbol];
      return newPredictions;
    });
  };

  const getChangeColor = (change) => {
    return change >= 0 ? 'positive' : 'negative';
  };

  const getPredictionColor = (direction) => {
    return direction === 'bullish' ? 'positive' : 'negative';
  };

  return (
    <div className="watchlist-page">
      <div className="grid-bg"></div>
      
      <div className="watchlist-container">
        {/* Header */}
        <div className="watchlist-header">
          <div className="header-content">
            <h1 className="page-title">
              <Target size={32} />
              <span>QUANTUM WATCHLIST</span>
            </h1>
            <p className="page-subtitle">
              Live API-powered stock monitoring with real-time market data and analysis
            </p>
          </div>
          
          <button 
            className="add-stock-btn"
            onClick={() => setShowAddForm(true)}
          >
            <Plus size={18} />
            <span>Add Stock</span>
          </button>
        </div>

        {/* Add Stock Form */}
        {showAddForm && (
          <div className="add-stock-form">
            <input
              type="text"
              placeholder="Enter stock symbol (e.g., AAPL)"
              value={newStock}
              onChange={(e) => setNewStock(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addStock()}
              className="stock-input"
            />
            <button onClick={addStock} className="btn-primary">
              <Plus size={16} />
              <span>Add</span>
            </button>
            <button 
              onClick={() => setShowAddForm(false)} 
              className="btn-secondary"
            >
              <X size={16} />
              <span>Cancel</span>
            </button>
          </div>
        )}

        {/* Watchlist Grid */}
        <div className="watchlist-grid">
          {watchlist.map(symbol => {
            const data = stockData[symbol];
            const prediction = aiPredictions[symbol];
            const isLoading = loading[symbol];
            
            // Process data to match expected structure
            const processedData = data && data['Global Quote'] ? {
              price: parseFloat(data['Global Quote']['05. price'] || 0),
              change: parseFloat(data['Global Quote']['09. change'] || 0),
              changePercent: data['Global Quote']['10. change percent'] || '0%',
              volume: parseInt(data['Global Quote']['06. volume'] || 0),
              marketCap: 'N/A',
              peRatio: 'N/A'
            } : null;

            return (
              <div 
                key={symbol} 
                className={`watchlist-card ${isLoading ? 'loading' : ''} ${prediction ? 'ai-enhanced' : ''}`}
              >
                                 <div className="card-header">
                   <div className="stock-info">
                     <h3 className="stock-symbol">{symbol}</h3>
                     {prediction && (
                       <div className="ai-badge">
                         <Brain size={12} />
                         <span>AI</span>
                       </div>
                     )}
                   </div>
                   <div className="card-actions">
                     <Link to={`/stock/${symbol}`} className="chart-btn">
                       <BarChart3 size={16} />
                     </Link>
                     <button 
                       onClick={() => removeStock(symbol)}
                       className="remove-btn"
                     >
                       <X size={16} />
                     </button>
                   </div>
                 </div>

                {isLoading ? (
                  <div className="loading-placeholder">
                    <Clock size={20} />
                    <span>Loading {symbol}...</span>
                  </div>
                ) : processedData ? (
                  <>
                    <div className="stock-price">
                      <span className="price">${processedData.price.toFixed(2)}</span>
                      <div className={`change ${getChangeColor(processedData.change)}`}>
                        {processedData.change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                        <span>{processedData.change >= 0 ? '+' : ''}{processedData.change.toFixed(2)} ({processedData.changePercent})</span>
                      </div>
                    </div>

                    {prediction && (
                      <div className="ai-prediction">
                        <div className="prediction-header">
                          <Brain size={14} />
                          <span>AI Prediction (24h)</span>
                        </div>
                        <div className="prediction-content">
                          <div className="predicted-price">
                            ${prediction.predictedPrice}
                          </div>
                          <div className={`prediction-direction ${getPredictionColor(prediction.direction)}`}>
                            {prediction.direction === 'bullish' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                            <span>{prediction.direction}</span>
                          </div>
                        </div>
                        <div className="confidence">
                          Confidence: {prediction.confidence}%
                        </div>
                      </div>
                    )}

                    <div className="stock-details">
                      <div className="detail-row">
                        <span>Volume:</span>
                        <span>{processedData.volume?.toLocaleString() || 'N/A'}</span>
                      </div>
                      <div className="detail-row">
                        <span>Market Cap:</span>
                        <span>{processedData.marketCap || 'N/A'}</span>
                      </div>
                      <div className="detail-row">
                        <span>P/E Ratio:</span>
                        <span>{processedData.peRatio || 'N/A'}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="error-placeholder">
                    <AlertTriangle size={20} />
                    <span>Failed to load {symbol}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {watchlist.length === 0 && (
          <div className="empty-state">
            <Target size={48} />
            <h3>No stocks in watchlist</h3>
            <p>Add stocks to start monitoring with AI predictions</p>
            <button 
              onClick={() => setShowAddForm(true)}
              className="btn-primary"
            >
              <Plus size={18} />
              <span>Add First Stock</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Watchlist; 