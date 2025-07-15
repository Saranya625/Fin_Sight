import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faHome, 
  faMoneyBillWave, 
  faMoneyCheckAlt, 
  faChartLine, 
  faFileAlt 
} from '@fortawesome/free-solid-svg-icons'

const Sidebar = ({ currentPage, setCurrentPage }) => {
  const navItems = [
    { id: 'dashboard', icon: faHome, label: 'Dashboard' },
    { id: 'income', icon: faMoneyBillWave, label: 'Income' },
    { id: 'expenses', icon: faMoneyCheckAlt, label: 'Expenses' },
    { id: 'analytics', icon: faChartLine, label: 'Analytics' },
    { id: 'reports', icon: faFileAlt, label: 'Reports' }
  ]

  return (
    <aside className="sidebar">
      <div className="logo-section">
        <h2>FinanceApp</h2>
        <small>Financial Dashboard</small>
      </div>
      
      <ul className="nav-links">
        {navItems.map(item => (
          <li key={item.id} className={currentPage === item.id ? 'active' : ''}>
            <a href="#" onClick={(e) => {
              e.preventDefault()
              setCurrentPage(item.id)
            }}>
              <FontAwesomeIcon icon={item.icon} />
              <span>{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
      
      <div className="user-info">
        <p>John Doe</p>
        <small>john@example.com</small>
      </div>
    </aside>
  )
}

export default Sidebar