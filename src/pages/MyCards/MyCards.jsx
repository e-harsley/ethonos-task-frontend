import { useState, useEffect } from 'react';
import { cardAPI } from '../../services/api';
import { ArrowLeft, Plus, Trash2, Edit2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './MyCards.css';

const MyCards = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    card_number: '',
    card_type: 'debit',
    card_holder_name: '',
    expiry_date: '',
    bank_name: '',
    is_primary: false,
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const response = await cardAPI.getCards();
      setCards(response.data);
    } catch (error) {
      console.error('Failed to fetch cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCard = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await cardAPI.createCard(formData);
      setSuccessMessage('Card added successfully!');
      setShowAddModal(false);
      setFormData({
        card_number: '',
        card_type: 'debit',
        card_holder_name: '',
        expiry_date: '',
        bank_name: '',
        is_primary: false,
      });
      fetchCards();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to add card');
    }
  };

  const handleDeleteCard = async (cardId) => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      try {
        await cardAPI.deleteCard(cardId);
        setSuccessMessage('Card deleted successfully!');
        fetchCards();
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        setError('Failed to delete card');
      }
    }
  };

  const handleSetPrimary = async (cardId) => {
    try {
      await cardAPI.updateCard(cardId, { is_primary: true });
      setSuccessMessage('Primary card updated!');
      fetchCards();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setError('Failed to update card');
    }
  };

  const maskCardNumber = (cardNumber) => {
    if (!cardNumber) return '';
    const lastFour = cardNumber.slice(-4);
    return `**** **** **** ${lastFour}`;
  };

  const getCardGradient = (type, index) => {
    const gradients = [
      'linear-gradient(135deg, #4F7CFF 0%, #6B8FFF 100%)',
      'linear-gradient(135deg, #F97316 0%, #FB923C 100%)',
      'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
      'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
    ];
    return gradients[index % gradients.length];
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ height: '100vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="cards-container">
      <div className="page-header">
        <button className="btn-icon" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <h2>My Cards</h2>
        <button className="btn-icon" onClick={() => setShowAddModal(true)}>
          <Plus size={20} />
        </button>
      </div>

      {successMessage && <div className="success-message">{successMessage}</div>}
      {error && <div className="error-message">{error}</div>}

      <div className="cards-grid">
        {cards.map((card, index) => (
          <div key={card.id} className="card-wrapper">
            <div
              className="credit-card"
              style={{ background: getCardGradient(card.card_type, index) }}
            >
              <div className="card-header">
                <span className="card-bank">{card.bank_name}</span>
                <div className="card-logo">
                  <div className="mastercard-logo">
                    <div className="circle circle-1"></div>
                    <div className="circle circle-2"></div>
                  </div>
                </div>
              </div>
              <div className="credit-card-number">{maskCardNumber(card.card_number)}</div>
              <div className="credit-card-footer">
                <div>
                  <div className="card-label">Card Holder</div>
                  <div className="card-value">{card.card_holder_name}</div>
                </div>
                <div>
                  <div className="card-label">Expires</div>
                  <div className="card-value">{card.expiry_date || 'N/A'}</div>
                </div>
              </div>
              {card.is_primary && <div className="primary-badge">Primary</div>}
            </div>
            <div className="card-actions">
              {!card.is_primary && (
                <button
                  className="action-btn primary-btn"
                  onClick={() => handleSetPrimary(card.id)}
                >
                  Set as Primary
                </button>
              )}
              <button
                className="action-btn delete-btn"
                onClick={() => handleDeleteCard(card.id)}
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        ))}

        {cards.length === 0 && (
          <div className="empty-state">
            <p>No cards added yet</p>
            <button className="btn btn-primary mt-2" onClick={() => setShowAddModal(true)}>
              <Plus size={18} /> Add Your First Card
            </button>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Add New Card</h3>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>
                ×
              </button>
            </div>

            <form onSubmit={handleAddCard}>
              <div className="input-group">
                <label>Card Number</label>
                <input
                  type="text"
                  value={formData.card_number}
                  onChange={(e) =>
                    setFormData({ ...formData, card_number: e.target.value })
                  }
                  placeholder="1234 5678 9012 3456"
                  required
                  maxLength="19"
                />
              </div>

              <div className="input-group">
                <label>Card Holder Name</label>
                <input
                  type="text"
                  value={formData.card_holder_name}
                  onChange={(e) =>
                    setFormData({ ...formData, card_holder_name: e.target.value })
                  }
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="input-group">
                <label>Bank Name</label>
                <input
                  type="text"
                  value={formData.bank_name}
                  onChange={(e) =>
                    setFormData({ ...formData, bank_name: e.target.value })
                  }
                  placeholder="Zenith Bank"
                  required
                />
              </div>

              <div className="form-row">
                <div className="input-group">
                  <label>Card Type</label>
                  <select
                    value={formData.card_type}
                    onChange={(e) =>
                      setFormData({ ...formData, card_type: e.target.value })
                    }
                  >
                    <option value="debit">Debit</option>
                    <option value="credit">Credit</option>
                    <option value="bank">Bank Account</option>
                  </select>
                </div>

                <div className="input-group">
                  <label>Expiry Date</label>
                  <input
                    type="text"
                    value={formData.expiry_date}
                    onChange={(e) =>
                      setFormData({ ...formData, expiry_date: e.target.value })
                    }
                    placeholder="MM/YY"
                    maxLength="5"
                  />
                </div>
              </div>

              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="is_primary"
                  checked={formData.is_primary}
                  onChange={(e) =>
                    setFormData({ ...formData, is_primary: e.target.checked })
                  }
                />
                <label htmlFor="is_primary">Set as primary card</label>
              </div>

              <button type="submit" className="btn btn-primary btn-block">
                Add Card
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCards;
