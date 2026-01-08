import { useAuth } from '../../context/AuthContext';
import { Bell, Settings } from 'lucide-react';
import './DesktopHeader.css';

const DesktopHeader = ({ title }) => {
  const { user } = useAuth();

  return (
    <header className="desktop-header">
      <div className="header-left">
        <h1 className="header-title">{title}</h1>
      </div>
      <div className="header-right">
        <button className="header-icon-btn">
          <Bell size={20} />
        </button>
        <button className="header-icon-btn">
          <Settings size={20} />
        </button>
        <div className="header-user">
          <div className="user-avatar">
            {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
          </div>
          <div className="user-info">
            <div className="user-name">{user?.first_name} {user?.last_name}</div>
            <div className="user-email">{user?.email}</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DesktopHeader;
