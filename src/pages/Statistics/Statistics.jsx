import { useState, useEffect } from 'react';
import { walletAPI, transactionAPI } from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowLeft, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Statistics.css';

const Statistics = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonths, setSelectedMonths] = useState(6);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchStats();
    fetchTransactions();
  }, [selectedMonths]);

  const fetchStats = async () => {
    try {
      const response = await walletAPI.getStats(selectedMonths);
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await transactionAPI.getTransactions(100, 0);
      setTransactions(response.data);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatChartData = () => {
    if (!stats?.monthly_stats) return [];

    return stats.monthly_stats.map(month => ({
      month: month.month,
      Income: parseFloat(month.income),
      Expense: parseFloat(month.expense),
    }));
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ height: '100vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="statistics-container">
      <div className="page-header">
        <button className="btn-icon" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <h2>Statistics</h2>
        <div style={{ width: '40px' }}></div>
      </div>

      <div className="stats-header">
        <div>
          <h1 className="total-balance">₦{parseFloat(stats?.wallet?.balance || 0).toLocaleString()}.00</h1>
          <p className="balance-label">Total Balance</p>
        </div>
        <select
          className="month-select"
          value={selectedMonths}
          onChange={(e) => setSelectedMonths(Number(e.target.value))}
        >
          <option value={3}>Last 3 Months</option>
          <option value={6}>Last 6 Months</option>
          <option value={12}>Last 12 Months</option>
        </select>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab ${activeTab === 'activity' ? 'active' : ''}`}
          onClick={() => setActiveTab('activity')}
        >
          Activity Log
        </button>
      </div>

      {activeTab === 'overview' ? (
        <>
          <div className="chart-container">
            <h3>Income vs Expense</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={formatChartData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value) => formatAmount(value)}
                  contentStyle={{
                    background: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="Income" fill="#10B981" radius={[8, 8, 0, 0]} />
                <Bar dataKey="Expense" fill="#EF4444" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="summary-cards">
            <div className="summary-card income-summary">
              <div className="summary-header">
                <div className="summary-icon">↓</div>
                <span className="summary-label">Total Income</span>
              </div>
              <div className="summary-amount">{formatAmount(stats?.total_income || 0)}</div>
            </div>

            <div className="summary-card expense-summary">
              <div className="summary-header">
                <div className="summary-icon">↑</div>
                <span className="summary-label">Total Expense</span>
              </div>
              <div className="summary-amount">{formatAmount(stats?.total_expense || 0)}</div>
            </div>
          </div>

          {stats?.top_categories && stats.top_categories.length > 0 && (
            <div className="categories-section">
              <h3>Top Spending Categories</h3>
              <div className="categories-list">
                {stats.top_categories.map((cat, index) => (
                  <div key={index} className="category-item">
                    <div className="category-info">
                      <div className="category-name">{cat.category || 'Uncategorized'}</div>
                      <div className="category-amount">{formatAmount(cat.total)}</div>
                    </div>
                    <div className="category-bar">
                      <div
                        className="category-progress"
                        style={{
                          width: `${(cat.total / stats.total_expense) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="activity-log">
          <h3>Spending Activity</h3>
          <div className="transactions-list">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="activity-item">
                <div className="activity-info">
                  <div className="activity-icon">
                    {transaction.transaction_type === 'income' || transaction.transaction_type === 'transfer_in' ? '↓' : '↑'}
                  </div>
                  <div>
                    <div className="activity-title">{transaction.description}</div>
                    <div className="activity-date">
                      {new Date(transaction.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                      {transaction.category && ` • ${transaction.category}`}
                    </div>
                  </div>
                </div>
                <div
                  className={`activity-amount ${
                    transaction.transaction_type === 'income' || transaction.transaction_type === 'transfer_in'
                      ? 'positive'
                      : 'negative'
                  }`}
                >
                  {transaction.transaction_type === 'income' || transaction.transaction_type === 'transfer_in'
                    ? '+'
                    : '-'}
                  {formatAmount(transaction.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Statistics;
