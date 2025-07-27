import { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Income from './components/Income'
import Expenses from './components/Expenses'
import Analytics from './components/Analytics'
import Reports from './components/Reports'
import Login from './components/Login'
import { api } from './services/api'
import './App.css'

function AppContent() {
  const { user, loading } = useAuth()
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [transactions, setTransactions] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)

  const handleAddOrUpdateTransaction = async (transaction) => {
    if (editingTransaction) {
      await updateTransaction(editingTransaction._id, transaction)
    } else {
      await addTransaction(transaction)
    }
    setEditingTransaction(null)
    setShowModal(false)
  }

  useEffect(() => {
    if (user) {
      loadTransactions()
    }
  }, [user])

  const loadTransactions = async () => {
    try {
      const data = await api.getTransactions(user.id)
      setTransactions(data)
    } catch (error) {
      console.error('Failed to load transactions:', error)
    }
  }

  const addTransaction = async (transaction) => {
    try {
      const transactionData = {
        ...transaction,
        userId: user.id,
        amount: parseFloat(transaction.amount)
      }
      
      const newTransaction = await api.createTransaction(transactionData)
      setTransactions([...transactions, newTransaction])
    } catch (error) {
      console.error('Failed to add transaction:', error)
      alert('Failed to add transaction. Please try again.')
    }
  }

  const updateTransaction = async (id, updatedTransaction) => {
    console.log('Updating transaction with ID:', id, 'Data:', updatedTransaction);
    try {
      const transactionData = {
        ...updatedTransaction,
        userId: user.id,
        amount: parseFloat(updatedTransaction.amount)
      }
      const response = await api.updateTransaction(id, transactionData)
      setTransactions(transactions.map(tx => tx._id === id ? response : tx))
    } catch (error) {
      console.error('Failed to update transaction:', error)
      alert('Failed to update transaction. Please try again.')
    }
  }

  const deleteTransaction = async (id) => {
    try {
      await api.deleteTransaction(id)
      setTransactions(transactions.filter(tx => tx._id !== id))
    } catch (error) {
      console.error('Failed to delete transaction:', error)
      alert('Failed to delete transaction. Please try again.')
    }
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  if (!user) {
    return <Login />
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard 
          transactions={transactions} 
          addTransaction={addTransaction} 
          updateTransaction={updateTransaction}
          deleteTransaction={deleteTransaction}
        />
      case 'income':
        return <Income 
          transactions={transactions} 
          addTransaction={addTransaction} 
          updateTransaction={updateTransaction}
          deleteTransaction={deleteTransaction} 
        />
      case 'expenses':
        return <Expenses 
          transactions={transactions} 
          addTransaction={addTransaction} 
          updateTransaction={updateTransaction}
          deleteTransaction={deleteTransaction} 
        />
      case 'analytics':
        return <Analytics transactions={transactions} />
      case 'reports':
        return <Reports />
      default:
        return <Dashboard 
          transactions={transactions} 
          addTransaction={addTransaction} 
          updateTransaction={updateTransaction}
          deleteTransaction={deleteTransaction}
        />
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

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App