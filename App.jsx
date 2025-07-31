// src/App.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { fetchStockData, fetchStockQuote } from './services/stockAPI';
import Dashboard from './components/Dashboard';
import StockSearch from './components/StockSearch';
import StockInfoCard from './components/StockInfoCard';
import StockChart from './components/StockChart';
import ErrorMessage from './components/ErrorMessage';
import LoadingSpinner from './components/LoadingSpinner';
import { BarChart3, RefreshCw, Home, Search } from 'lucide-react';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [symbol, setSymbol] = useState('AAPL');
  const [stockData, setStockData] = useState(null);
  const [stockQuote, setStockQuote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchData = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError(null);

    try {
      // Fetch both intraday data and quote data
      const [dataResponse, quoteResponse] = await Promise.allSettled([
        fetchStockData(symbol),
        fetchStockQuote(symbol)
      ]);

      if (dataResponse.status === 'fulfilled') {
        const timeSeries = dataResponse.value["Time Series (5min)"];
        if (timeSeries) {
          setStockData(timeSeries);
        }
      }

      if (quoteResponse.status === 'fulfilled') {
        setStockQuote(quoteResponse.value);
      }

      // If both failed, show error
      if (dataResponse.status === 'rejected' && quoteResponse.status === 'rejected') {
        throw new Error('Unable to fetch stock data. Please check the symbol and try again.');
      }

      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching stock data:', err);
      setError(err.message || 'Failed to fetch stock data');
      setStockData(null);
      setStockQuote(null);
    } finally {
      setLoading(false);
    }
  }, [symbol]);

  // Initial fetch and symbol change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchData(false); // Don't show loading spinner for auto-refresh
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchData, autoRefresh]);

  const handleSearch = () => {
    fetchData();
  };

  const handleRetry = () => {
    fetchData();
  };

  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-title">
            <BarChart3 size={32} className="header-icon" />
            <h1>Stock Tracker</h1>
          </div>
          <nav className="header-nav">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            >
              <Home size={16} />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('search')}
              className={`nav-tab ${activeTab === 'search' ? 'active' : ''}`}
            >
              <Search size={16} />
              Search
            </button>
          </nav>
          <div className="header-controls">
            <button
              onClick={toggleAutoRefresh}
              className={`auto-refresh-toggle ${autoRefresh ? 'active' : ''}`}
              title={autoRefresh ? 'Disable auto-refresh' : 'Enable auto-refresh'}
            >
              <RefreshCw size={16} />
              Auto-refresh {autoRefresh ? 'ON' : 'OFF'}
            </button>
            <button
              onClick={() => fetchData()}
              className="manual-refresh"
              disabled={loading}
              title="Refresh data"
            >
              <RefreshCw size={16} className={loading ? 'spinning' : ''} />
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          {activeTab === 'dashboard' && <Dashboard />}
          
          {activeTab === 'search' && (
            <>
              <StockSearch
                symbol={symbol}
                setSymbol={setSymbol}
                onSearch={handleSearch}
                loading={loading}
              />

              {loading && !stockData && !stockQuote && (
                <LoadingSpinner message={`Fetching data for ${symbol}...`} />
              )}

              {error && !stockData && !stockQuote && (
                <ErrorMessage message={error} onRetry={handleRetry} />
              )}

              {(stockData || stockQuote) && (
                <div className="stock-dashboard">
                  <StockInfoCard
                    data={stockData}
                    quote={stockQuote}
                    symbol={symbol}
                    lastUpdated={lastUpdated}
                  />
                  <StockChart data={stockData} symbol={symbol} />
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>
          Built with React & Chart.js • Data provided by Alpha Vantage
          {lastUpdated && (
            <span className="last-update">
              • Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </p>
      </footer>
    </div>
  );
}

export default App;