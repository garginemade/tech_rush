// src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Eye, Plus, X } from 'lucide-react';
import { fetchStockQuote } from '../services/stockAPI';

const Dashboard = () => {
  const [watchlist, setWatchlist] = useState(['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN']);
  const [watchlistData, setWatchlistData] = useState({});
  const [loading, setLoading] = useState(false);
  const [newSymbol, setNewSymbol] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

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
    if (stocks.length === 0) return { totalValue: 0, gainers: 0, losers: 0 };

    let totalValue = 0;
    let gainers = 0;
    let losers = 0;

    stocks.forEach(([, data]) => {
      const price = parseFloat(data['05. price']);
      const change = parseFloat(data['09. change']);
      totalValue += price;
      if (change > 0) gainers++;
      else if (change < 0) losers++;
    });

    return { totalValue, gainers, losers };
  };

  const stats = calculatePortfolioStats();

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Market Dashboard</h2>
        <button 
          onClick={fetchWatchlistData} 
          className="refresh-dashboard"
          disabled={loading}
        >
          <BarChart3 size={16} />
          {loading ? 'Updating...' : 'Refresh All'}
        </button>
      </div>

      {/* Portfolio Overview */}
      <div className="portfolio-overview">
        <div className="overview-card">
          <div className="overview-icon">
            <DollarSign size={24} />
          </div>
          <div className="overview-content">
            <span className="overview-label">Total Watchlist Value</span>
            <span className="overview-value">${stats.totalValue.toFixed(2)}</span>
          </div>
        </div>

        <div className="overview-card">
          <div className="overview-icon positive">
            <TrendingUp size={24} />
          </div>
          <div className="overview-content">
            <span className="overview-label">Gainers</span>
            <span className="overview-value">{stats.gainers}</span>
          </div>
        </div>

        <div className="overview-card">
          <div className="overview-icon negative">
            <TrendingDown size={24} />
          </div>
          <div className="overview-content">
            <span className="overview-label">Losers</span>
            <span className="overview-value">{stats.losers}</span>
          </div>
        </div>

        <div className="overview-card">
          <div className="overview-icon">
            <Eye size={24} />
          </div>
          <div className="overview-content">
            <span className="overview-label">Watching</span>
            <span className="overview-value">{watchlist.length}</span>
          </div>
        </div>
      </div>

      {/* Watchlist Management */}
      <div className="watchlist-section">
        <div className="watchlist-header">
          <h3>My Watchlist</h3>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="add-stock-btn"
          >
            <Plus size={16} />
            Add Stock
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
            <button type="submit" className="add-stock-submit">Add</button>
            <button 
              type="button" 
              onClick={() => setShowAddForm(false)}
              className="add-stock-cancel"
            >
              Cancel
            </button>
          </form>
        )}

        <div className="watchlist-grid">
          {watchlist.map((symbol) => {
            const data = watchlistData[symbol];
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
                  <div className="loading-placeholder">Loading...</div>
                </div>
              );
            }

            const price = parseFloat(data['05. price']);
            const change = parseFloat(data['09. change']);
            const changePercent = parseFloat(data['10. change percent'].replace('%', ''));
            const isPositive = change >= 0;

            return (
              <div key={symbol} className="watchlist-card">
                <div className="watchlist-header">
                  <span className="stock-symbol">{symbol}</span>
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

                <div className="stock-details">
                  <div className="detail-row">
                    <span>High:</span>
                    <span>${parseFloat(data['03. high']).toFixed(2)}</span>
                  </div>
                  <div className="detail-row">
                    <span>Low:</span>
                    <span>${parseFloat(data['04. low']).toFixed(2)}</span>
                  </div>
                  <div className="detail-row">
                    <span>Volume:</span>
                    <span>{parseInt(data['06. volume']).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Market Movers */}
      <div className="market-movers">
        <h3>Top Performers Today</h3>
        <div className="movers-grid">
          {Object.entries(watchlistData)
            .sort(([, a], [, b]) => 
              parseFloat(b['10. change percent']) - parseFloat(a['10. change percent'])
            )
            .slice(0, 3)
            .map(([symbol, data]) => {
              const changePercent = parseFloat(data['10. change percent'].replace('%', ''));
              const isPositive = changePercent >= 0;
              
              return (
                <div key={symbol} className={`mover-card ${isPositive ? 'positive' : 'negative'}`}>
                  <div className="mover-symbol">{symbol}</div>
                  <div className="mover-change">
                    {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    <span>{changePercent.toFixed(2)}%</span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;