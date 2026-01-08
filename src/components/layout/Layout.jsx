import { NavLink, Outlet } from 'react-router-dom';
import { Home, BarChart3, CreditCard, User, ScanLine, Wallet } from 'lucide-react';
import './Layout.css';

const Layout = () => {
  return (
    <div className="layout">
      {/* Desktop Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <Wallet size={32} />
            <span>Teggar</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/" className="sidebar-nav-item" end>
            <Home size={22} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/statistics" className="sidebar-nav-item">
            <BarChart3 size={22} />
            <span>Statistics</span>
          </NavLink>

          <NavLink to="/scan" className="sidebar-nav-item">
            <ScanLine size={22} />
            <span>Send & Receive</span>
          </NavLink>

          <NavLink to="/cards" className="sidebar-nav-item">
            <CreditCard size={22} />
            <span>My Cards</span>
          </NavLink>

          <NavLink to="/profile" className="sidebar-nav-item">
            <User size={22} />
            <span>Profile</span>
          </NavLink>
        </nav>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="bottom-nav">
        <NavLink to="/" className="nav-item" end>
          <Home size={24} />
          <span>Home</span>
        </NavLink>

        <NavLink to="/statistics" className="nav-item">
          <BarChart3 size={24} />
          <span>Statistics</span>
        </NavLink>

        <NavLink to="/scan" className="nav-item scan-btn">
          <div className="scan-icon">
            <ScanLine size={28} />
          </div>
        </NavLink>

        <NavLink to="/cards" className="nav-item">
          <CreditCard size={24} />
          <span>My Cards</span>
        </NavLink>

        <NavLink to="/profile" className="nav-item">
          <User size={24} />
          <span>Profile</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Layout;
