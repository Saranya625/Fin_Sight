import { Home, Wallet, CreditCard, LineChart, FileText, LogOut } from 'lucide-react'
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ currentPage, setCurrentPage }) => {
  const { user, logout } = useAuth();
  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'income', icon: Wallet, label: 'Income' },
    { id: 'expenses', icon: CreditCard, label: 'Expenses' },
    { id: 'analytics', icon: LineChart, label: 'Analytics' },
    { id: 'reports', icon: FileText, label: 'Reports' }
  ]

  const handleLogout = async () => {
    await api.logout();
    logout();
  };

  return (
    <aside className="sidebar">
      <div className="logo-section">
        <h2>FinSight</h2>
        <small>Financial Dashboard</small>
      </div>
      
      <ul className="nav-links">
        {navItems.map(item => (
          <li key={item.id} className={currentPage === item.id ? 'active' : ''}>
            <a href="#" onClick={(e) => {
              e.preventDefault()
              setCurrentPage(item.id)
            }}>
              {item.icon && <item.icon size={18} />} {/* Render Lucide icon component */}
              <span>{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
      
      <div className="user-info">
        {user && (
          <>
            <p>{user.name}</p>
            <small>{user.email}</small>
          </>
        )}
        <button onClick={handleLogout} className="logout-button">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar