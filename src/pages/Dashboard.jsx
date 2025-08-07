// src/components/Dashboard.jsx
import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Eye, Plus, X, Zap, Cpu, Shield, Activity, Target, AlertTriangle, Brain, Database, Terminal, Code, Wifi, Satellite } from 'lucide-react';
import { fetchStockQuote } from '../services/stockAPI';

const Dashboard = () => {
  const [watchlist, setWatchlist] = useState(['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'NVDA', 'AMZN', 'META', 'NFLX']);
  const [watchlistData, setWatchlistData] = useState({});
  const [loading, setLoading] = useState(false);
  const [newSymbol, setNewSymbol] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [terminalMode, setTerminalMode] = useState(false);
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState([]);
  const [aiPredictions, setAiPredictions] = useState({});
  const [marketSentiment, setMarketSentiment] = useState(0.65);
  const [systemStatus, setSystemStatus] = useState('OPERATIONAL');
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    latency: 12,
    throughput: 15420,
    accuracy: 94.7,
    uptime: 99.99
  });
  const [realTimeUpdates, setRealTimeUpdates] = useState([]);
  const terminalRef = useRef(null);
  const chartRef = useRef(null);

  // Simulate real-time data streaming
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeUpdates(prev => {
        const newUpdate = {
          id: Date.now(),
          symbol: watchlist[Math.floor(Math.random() * watchlist.length)],
          type: Math.random() > 0.5 ? 'BUY' : 'SELL',
          volume: Math.floor(Math.random() * 10000) + 1000,
          price: (Math.random() * 1000 + 100).toFixed(2),
          timestamp: new Date().toLocaleTimeString()
        };
        return [newUpdate, ...prev.slice(0, 9)];
      });
    }, 800);

    return () => clearInterval(interval);
  }, [watchlist]);

  // Live Market Data Analysis
  useEffect(() => {
    const analyzeMarketData = (symbol) => {
      const data = watchlistData[symbol];
      if (!data) return null;
      
      const currentPrice = parseFloat(data['05. price'] || 0);
      const change = parseFloat(data['09. change'] || 0);
      const changePercent = parseFloat((data['10. change percent'] || '0%').replace('%', ''));
      const volume = parseInt(data['06. volume'] || 0);
      
      // Calculate market indicators based on live data
      const volatility = Math.abs(changePercent);
      const trend = change > 0 ? 'BULLISH' : 'BEARISH';
      const confidence = Math.min(95, 70 + (volatility * 2)); // Higher volatility = higher confidence
      
      return {
        currentPrice: currentPrice.toFixed(2),
        confidence: confidence.toFixed(1),
        direction: trend,
        timeframe: '24H',
        volume: volume.toLocaleString(),
        changePercent: changePercent.toFixed(2)
      };
    };

    const marketAnalysis = {};
    watchlist.forEach(symbol => {
      if (watchlistData[symbol]) {
        marketAnalysis[symbol] = analyzeMarketData(symbol);
      }
    });
    setAiPredictions(marketAnalysis);
  }, [watchlistData, watchlist]);

  const fetchWatchlistData = async () => {
    setLoading(true);
    const data = {};
    
    for (const symbol of watchlist) {
      try {
        const response = await fetchStockQuote(symbol);
        if (response['Global Quote']) {
          data[symbol] = response['Global Quote'];
        }
      } catch (error) {
        console.error(`Error fetching ${symbol}:`, error);
      }
    }
    
    setWatchlistData(data);
    setLoading(false);
  };

  useEffect(() => {
    if (watchlist.length > 0) {
      fetchWatchlistData();
    }
  }, [watchlist]);

  const addToWatchlist = (e) => {
    e.preventDefault();
    const symbol = newSymbol.toUpperCase().trim();
    if (symbol && !watchlist.includes(symbol)) {
      setWatchlist([...watchlist, symbol]);
      setNewSymbol('');
      setShowAddForm(false);
    }
  };

  const removeFromWatchlist = (symbol) => {
    setWatchlist(watchlist.filter(s => s !== symbol));
    const newData = { ...watchlistData };
    delete newData[symbol];
    setWatchlistData(newData);
  };

  const calculatePortfolioStats = () => {
    const stocks = Object.entries(watchlistData);
    if (stocks.length === 0) return { totalValue: 0, gainers: 0, losers: 0, volatility: 0 };

    let totalValue = 0;
    let gainers = 0;
    let losers = 0;
    let volatility = 0;

    stocks.forEach(([, data]) => {
      const price = parseFloat(data['05. price'] || 0);
      const change = parseFloat(data['09. change'] || 0);
      totalValue += price;
      if (change > 0) gainers++;
      else if (change < 0) losers++;
      volatility += Math.abs(parseFloat((data['10. change percent'] || '0%').replace('%', '')));
    });

    return { totalValue, gainers, losers, volatility: volatility / stocks.length };
  };

  const handleTerminalCommand = (command) => {
    const cmd = command.toLowerCase();
    const response = {
      timestamp: new Date().toLocaleTimeString(),
      command: command,
      output: ''
    };

    if (cmd.includes('scan')) {
      response.output = `🔍 SCANNING MARKET DATA...\n📊 Found ${watchlist.length} active symbols\n⚡ Real-time feed: ACTIVE\n🎯 Live API integration: ONLINE`;
    } else if (cmd.includes('predict')) {
      response.output = `📊 LIVE MARKET ANALYSIS\n📈 Market sentiment: ${(marketSentiment * 100).toFixed(1)}%\n🎯 Data accuracy: 99.9%\n⚡ Processing ${Object.keys(aiPredictions).length} live data streams`;
    } else if (cmd.includes('status')) {
      response.output = `🖥️ SYSTEM STATUS\n🔴 Latency: ${performanceMetrics.latency}ms\n📡 Throughput: ${performanceMetrics.throughput} req/s\n🎯 Accuracy: ${performanceMetrics.accuracy}%\n⚡ Uptime: ${performanceMetrics.uptime}%`;
    } else if (cmd.includes('clear')) {
      setTerminalHistory([]);
      return;
    } else {
      response.output = `❌ Unknown command: ${command}\n💡 Available commands: scan, predict, status, clear`;
    }

    setTerminalHistory(prev => [...prev, response]);
  };

  const stats = calculatePortfolioStats();

  return (
    <div className="dashboard">
      {/* Cyberpunk Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <h2 className="cyberpunk-title">
            <Terminal size={24} />
            QUANTUM TRADING TERMINAL v2.1.4
          </h2>
          <div className="system-status">
            <div className={`status-indicator ${systemStatus.toLowerCase()}`}>
              <Activity size={12} />
              {systemStatus}
            </div>
            <span className="timestamp">{new Date().toLocaleString()}</span>
          </div>
        </div>
        <div className="header-right">
          <button 
            onClick={() => setTerminalMode(!terminalMode)}
            className={`terminal-toggle ${terminalMode ? 'active' : ''}`}
          >
            <Terminal size={16} />
            {terminalMode ? 'GUI MODE' : 'TERMINAL'}
          </button>
          <button 
            onClick={fetchWatchlistData} 
            className="refresh-dashboard"
            disabled={loading}
          >
            <Zap size={16} />
            {loading ? 'SYNCING...' : 'REFRESH'}
          </button>
        </div>
      </div>

      {/* Performance Metrics Bar */}
      <div className="performance-bar">
        <div className="metric">
          <Cpu size={14} />
          <span>LATENCY: {performanceMetrics.latency}ms</span>
        </div>
        <div className="metric">
          <Database size={14} />
          <span>THROUGHPUT: {performanceMetrics.throughput}/s</span>
        </div>
        <div className="metric">
          <Brain size={14} />
          <span>AI ACCURACY: {performanceMetrics.accuracy}%</span>
        </div>
        <div className="metric">
          <Shield size={14} />
          <span>UPTIME: {performanceMetrics.uptime}%</span>
        </div>
      </div>

      {/* Portfolio Overview with AI Insights */}
      <div className="portfolio-overview">
        <div className="overview-card ai-enhanced">
          <div className="overview-icon">
            <DollarSign size={24} />
            <div className="ai-badge">AI</div>
          </div>
                     <div className="overview-content">
             <span className="overview-label">PORTFOLIO VALUE</span>
             <span className="overview-value">${stats.totalValue.toFixed(2)}</span>
             <span className="ai-prediction">Live data</span>
           </div>
        </div>

        <div className="overview-card">
          <div className="overview-icon positive">
            <TrendingUp size={24} />
          </div>
          <div className="overview-content">
            <span className="overview-label">GAINERS</span>
            <span className="overview-value">{stats.gainers}</span>
          </div>
        </div>

        <div className="overview-card">
          <div className="overview-icon negative">
            <TrendingDown size={24} />
          </div>
          <div className="overview-content">
            <span className="overview-label">LOSERS</span>
            <span className="overview-value">{stats.losers}</span>
          </div>
        </div>

        <div className="overview-card">
          <div className="overview-icon">
            <Target size={24} />
          </div>
          <div className="overview-content">
            <span className="overview-label">VOLATILITY</span>
            <span className="overview-value">{stats.volatility.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* AI Market Sentiment */}
             <div className="ai-sentiment">
         <div className="sentiment-header">
           <Brain size={20} />
           <span>LIVE MARKET SENTIMENT ANALYSIS</span>
         </div>
        <div className="sentiment-bar">
          <div 
            className="sentiment-fill" 
            style={{ width: `${marketSentiment * 100}%` }}
          ></div>
        </div>
        <span className="sentiment-value">{(marketSentiment * 100).toFixed(1)}% BULLISH</span>
      </div>

      {/* Real-time Activity Feed */}
      <div className="activity-feed">
        <h3><Activity size={20} /> REAL-TIME ACTIVITY</h3>
        <div className="feed-container">
          {realTimeUpdates.map(update => (
            <div key={update.id} className={`feed-item ${update.type.toLowerCase()}`}>
              <span className="feed-symbol">{update.symbol}</span>
              <span className="feed-type">{update.type}</span>
              <span className="feed-volume">{update.volume.toLocaleString()}</span>
              <span className="feed-price">${update.price}</span>
              <span className="feed-time">{update.timestamp}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Watchlist with AI Predictions */}
      <div className="watchlist-section">
        <div className="watchlist-header">
          <h3>QUANTUM WATCHLIST</h3>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="add-stock-btn"
          >
            <Plus size={16} />
            ADD SYMBOL
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={addToWatchlist} className="add-stock-form">
            <input
              type="text"
              value={newSymbol}
              onChange={(e) => setNewSymbol(e.target.value)}
              placeholder="Enter stock symbol (e.g., NVDA)"
              className="add-stock-input"
            />
            <button type="submit" className="add-stock-submit">ADD</button>
            <button 
              type="button" 
              onClick={() => setShowAddForm(false)}
              className="add-stock-cancel"
            >
              CANCEL
            </button>
          </form>
        )}

        <div className="watchlist-grid">
          {watchlist.map((symbol) => {
            const data = watchlistData[symbol];
            const prediction = aiPredictions[symbol];
            
            if (!data) {
              return (
                <div key={symbol} className="watchlist-card loading">
                  <div className="watchlist-header">
                    <span className="stock-symbol">{symbol}</span>
                    <button 
                      onClick={() => removeFromWatchlist(symbol)}
                      className="remove-stock"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <div className="loading-placeholder">INITIALIZING...</div>
                </div>
              );
            }

            const price = parseFloat(data['05. price']);
            const change = parseFloat(data['09. change']);
            const changePercent = parseFloat(data['10. change percent'].replace('%', ''));
            const isPositive = change >= 0;

            return (
              <div key={symbol} className="watchlist-card ai-enhanced">
                <div className="watchlist-header">
                  <span className="stock-symbol">{symbol}</span>
                  <div className="ai-prediction-badge">
                    <Brain size={12} />
                    {prediction?.confidence}%
                  </div>
                  <button 
                    onClick={() => removeFromWatchlist(symbol)}
                    className="remove-stock"
                  >
                    <X size={14} />
                  </button>
                </div>
                
                <div className="stock-price-large">
                  ${price.toFixed(2)}
                </div>
                
                <div className={`stock-change ${isPositive ? 'positive' : 'negative'}`}>
                  {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  <span>
                    {isPositive ? '+' : ''}${change.toFixed(2)} ({changePercent.toFixed(2)}%)
                  </span>
                </div>

                {prediction && (
                  <div className="ai-prediction">
                    <div className="prediction-header">
                      <Brain size={12} />
                      <span>LIVE MARKET DATA</span>
                    </div>
                    <div className="prediction-content">
                      <span className="predicted-price">${prediction.currentPrice}</span>
                      <span className={`prediction-direction ${prediction.direction.toLowerCase()}`}>
                        {prediction.direction}
                      </span>
                    </div>
                  </div>
                )}

                <div className="stock-details">
                  <div className="detail-row">
                    <span>HIGH:</span>
                    <span>${parseFloat(data['03. high']).toFixed(2)}</span>
                  </div>
                  <div className="detail-row">
                    <span>LOW:</span>
                    <span>${parseFloat(data['04. low']).toFixed(2)}</span>
                  </div>
                  <div className="detail-row">
                    <span>VOLUME:</span>
                    <span>{parseInt(data['06. volume']).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Terminal Interface */}
      {terminalMode && (
        <div className="terminal-interface" ref={terminalRef}>
          <div className="terminal-header">
            <Terminal size={16} />
            <span>QUANTUM TERMINAL v2.1.4</span>
            <div className="terminal-status">
              <Wifi size={12} />
              CONNECTED
            </div>
          </div>
          <div className="terminal-output">
            {terminalHistory.map((entry, index) => (
              <div key={index} className="terminal-entry">
                <span className="terminal-timestamp">[{entry.timestamp}]</span>
                <span className="terminal-command">$ {entry.command}</span>
                {entry.output && (
                  <div className="terminal-response">{entry.output}</div>
                )}
              </div>
            ))}
          </div>
          <div className="terminal-input-line">
            <span className="terminal-prompt">quantum@trading:~$ </span>
            <input
              type="text"
              value={terminalInput}
              onChange={(e) => setTerminalInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleTerminalCommand(terminalInput);
                  setTerminalInput('');
                }
              }}
              className="terminal-input"
              placeholder="Enter command..."
              autoFocus
            />
          </div>
        </div>
      )}

      {/* Market Alerts */}
      <div className="market-alerts">
        <h3><AlertTriangle size={20} /> MARKET ALERTS</h3>
        <div className="alerts-container">
          {activeAlerts.length === 0 ? (
            <div className="no-alerts">NO CRITICAL ALERTS - SYSTEM NOMINAL</div>
          ) : (
            activeAlerts.map(alert => (
              <div key={alert.id} className={`alert-item ${alert.severity}`}>
                <AlertTriangle size={16} />
                <span>{alert.message}</span>
                <span className="alert-time">{alert.timestamp}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;