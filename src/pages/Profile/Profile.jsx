import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { walletAPI } from '../../services/api';
import { ArrowLeft, User, Mail, Phone, LogOut, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [wallet, setWallet] = useState(null);

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      const response = await walletAPI.getWallet();
      setWallet(response.data);
    } catch (error) {
      console.error('Failed to fetch wallet:', error);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  return (
    <div className="profile-container">
      <div className="page-header">
        <button className="btn-icon" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <h2>Profile</h2>
        <div style={{ width: '40px' }}></div>
      </div>

      <div className="profile-card">
        <div className="profile-avatar">
          <User size={48} />
        </div>
        <h3 className="profile-name">
          {user?.first_name} {user?.last_name}
        </h3>
        <p className="profile-email">{user?.email}</p>
      </div>

      <div className="profile-section">
        <h4 className="section-title">Account Information</h4>

        <div className="info-card">
          <div className="info-item">
            <div className="info-icon">
              <Mail size={20} />
            </div>
            <div>
              <div className="info-label">Email Address</div>
              <div className="info-value">{user?.email}</div>
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon">
              <Phone size={20} />
            </div>
            <div>
              <div className="info-label">Phone Number</div>
              <div className="info-value">{user?.phone_number || 'Not provided'}</div>
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon">
              <Wallet size={20} />
            </div>
            <div>
              <div className="info-label">Wallet Balance</div>
              <div className="info-value">{formatAmount(wallet?.balance || 0)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-section">
        <h4 className="section-title">Receive Money</h4>

        <div className="qr-card">
          <p className="qr-description">
            Share this QR code to receive money from other Teggar users
          </p>

          <div className="qr-code-container">
            <QRCodeSVG
              value={user?.email || ''}
              size={200}
              level="H"
              includeMargin={true}
            />
          </div>

          <div className="uid-container">
            <span className="uid-label">UID:</span>
            <span className="uid-value">{user?.id}</span>
          </div>
        </div>
      </div>

      <div className="profile-section">
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
