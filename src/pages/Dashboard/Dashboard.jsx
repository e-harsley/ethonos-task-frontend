import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { walletAPI, transactionAPI, cardAPI } from '../../services/api';
import { Eye, EyeOff, ArrowUpRight, ArrowDownLeft, Plus } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [primaryCard, setPrimaryCard] = useState(null);

  useEffect(() => {
    fetchDashboardData();
    fetchPrimaryCard();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await walletAPI.getDashboard();
      setDashboardData(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPrimaryCard = async () => {
    try {
      const response = await cardAPI.getCards();
      const primary = response.data.find(card => card.is_primary);
      setPrimaryCard(primary || response.data[0]);
    } catch (error) {
      console.error('Failed to fetch cards:', error);
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'income':
      case 'transfer_in':
        return <ArrowDownLeft size={20} />;
      case 'expense':
      case 'transfer_out':
        return <ArrowUpRight size={20} />;
      default:
        return <Plus size={20} />;
    }
  };

  const getTransactionIconBg = (type) => {
    switch (type) {
      case 'income':
      case 'transfer_in':
        return '#D1FAE5';
      case 'expense':
      case 'transfer_out':
        return '#FEE2E2';
      default:
        return '#E0E7FF';
    }
  };

  const getTransactionIconColor = (type) => {
    switch (type) {
      case 'income':
      case 'transfer_in':
        return '#10B981';
      case 'expense':
      case 'transfer_out':
        return '#EF4444';
      default:
        return '#4F7CFF';
    }
  };

  const getTransactionAmount = (transaction) => {
    if (transaction.transaction_type === 'income' || transaction.transaction_type === 'transfer_in') {
      return `+${formatAmount(transaction.amount)}`;
    }
    return `-${formatAmount(transaction.amount)}`;
  };

  const getTransactionAmountClass = (type) => {
    if (type === 'income' || type === 'transfer_in') {
      return 'amount-positive';
    }
    return 'amount-negative';
  };

  const maskCardNumber = (cardNumber) => {
    if (!cardNumber) return '';
    const lastFour = cardNumber.slice(-4);
    return `**** **** **** ${lastFour}`;
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ height: '100vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h2>Total Balance</h2>
          <div className="balance-row">
            <h1 className="balance-amount">
              {balanceVisible
                ? formatAmount(dashboardData?.wallet?.balance || 0)
                : '₦***,***.**'}
            </h1>
            <button
              className="btn-icon visibility-toggle"
              onClick={() => setBalanceVisible(!balanceVisible)}
            >
              {balanceVisible ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
      </div>

      {primaryCard && (
        <div className="credit-card" onClick={() => navigate('/cards')}>
          <div className="card-header">
            <span className="card-bank">{primaryCard.bank_name}</span>
            <div className="card-logo">
              <div className="mastercard-logo">
                <div className="circle circle-1"></div>
                <div className="circle circle-2"></div>
              </div>
            </div>
          </div>
          <div className="credit-card-number">
            {maskCardNumber(primaryCard.card_number)}
          </div>
          <div className="credit-card-footer">
            <div>
              <div className="card-label">Card Holder</div>
              <div className="card-value">{primaryCard.card_holder_name}</div>
            </div>
            <div>
              <div className="card-label">Expires</div>
              <div className="card-value">{primaryCard.expiry_date || 'N/A'}</div>
            </div>
          </div>
        </div>
      )}

      <div className="overview-cards">
        <div className="overview-card income-card">
          <div className="overview-icon">
            <ArrowDownLeft size={24} />
          </div>
          <div>
            <div className="overview-label">Income</div>
            <div className="overview-value">
              {formatAmount(dashboardData?.stats?.total_income || 0)}
            </div>
          </div>
        </div>

        <div className="overview-card expense-card">
          <div className="overview-icon">
            <ArrowUpRight size={24} />
          </div>
          <div>
            <div className="overview-label">Expense</div>
            <div className="overview-value">
              {formatAmount(dashboardData?.stats?.total_expense || 0)}
            </div>
          </div>
        </div>
      </div>

      <div className="transactions-section">
        <div className="section-header">
          <h3>My savings plans</h3>
          <button className="view-all-btn" onClick={() => navigate('/statistics')}>
            View All
          </button>
        </div>

        <div className="savings-plans">
          <div className="saving-plan">
            <div className="plan-info">
              <div className="plan-icon">🏡</div>
              <div>
                <div className="plan-name">New car</div>
                <div className="plan-target">Target: ₦20M - Payment: Monthly</div>
              </div>
            </div>
            <button className="plan-btn">▶</button>
          </div>

          <div className="saving-plan">
            <div className="plan-info">
              <div className="plan-icon">🏠</div>
              <div>
                <div className="plan-name">New House</div>
                <div className="plan-target">Target: ₦20M - Payment: Monthly</div>
              </div>
            </div>
            <button className="plan-btn">▶</button>
          </div>
        </div>
      </div>

      <div className="transactions-section">
        <div className="section-header">
          <h3>Recent Activity</h3>
          <button className="view-all-btn" onClick={() => navigate('/statistics')}>
            View All
          </button>
        </div>

        <div className="transactions-list">
          {dashboardData?.recent_transactions?.length > 0 ? (
            dashboardData.recent_transactions.slice(0, 5).map((transaction) => (
              <div key={transaction.id} className="transaction-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    className="transaction-icon"
                    style={{
                      background: getTransactionIconBg(transaction.transaction_type),
                      color: getTransactionIconColor(transaction.transaction_type),
                    }}
                  >
                    {getTransactionIcon(transaction.transaction_type)}
                  </div>
                  <div className="transaction-details">
                    <div className="transaction-title">{transaction.description}</div>
                    <div className="transaction-date">
                      {formatDate(transaction.created_at)}
                      {transaction.category && ` • ${transaction.category}`}
                    </div>
                  </div>
                </div>
                <div
                  className={`transaction-amount ${getTransactionAmountClass(
                    transaction.transaction_type
                  )}`}
                >
                  {getTransactionAmount(transaction)}
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>No recent transactions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
