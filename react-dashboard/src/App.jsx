import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Income from './components/Income'
import Expenses from './components/Expenses'
import Analytics from './components/Analytics'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'income':
        return <Income />
      case 'expenses':
        return <Expenses />
      case 'analytics':
        return <Analytics />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="container">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="main-content">
        {renderCurrentPage()}
      </main>
    </div>
  )
}

export default App