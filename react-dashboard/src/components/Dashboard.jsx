import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp, faArrowDown, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '../context/AuthContext'
import { api } from '../services/api'
import TransactionModal from './TransactionModal'
import IncomeExpenseChart from './IncomeExpenseChart'

const Dashboard = () => {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState([
    // Sample data - will be replaced by API data
  ])
  
  const [selectedMonth, setSelectedMonth] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [stats, setStats] = useState({
    totalBalance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    savingsRate: 0
  })

  // Load transactions from API
  useEffect(() => {
    if (user) {
      loadTransactions()
    }
  }, [user])

  useEffect(() => {
    calculateStats()
  }, [transactions, selectedMonth])

  const loadTransactions = async () => {
    try {
      const data = await api.getTransactions(user.id)
      setTransactions(data)
    } catch (error) {
      console.error('Failed to load transactions:', error)
    }
  }

  const calculateStats = () => {
    let income = 0
    let expenses = 0
    
    const selectedDate = selectedMonth ? new Date(selectedMonth + '-01') : new Date()
    const selectedMonthNum = selectedDate.getMonth()
    const selectedYear = selectedDate.getFullYear()

    transactions.forEach(tx => {
      const txDate = new Date(tx.date)
      if (txDate.getMonth() === selectedMonthNum && txDate.getFullYear() === selectedYear) {
        if (tx.type === 'income') {
          income += tx.amount
        } else {
          expenses += tx.amount
        }
      }
    })

    const totalBalance = transactions.reduce((acc, tx) => 
      tx.type === 'income' ? acc + tx.amount : acc - tx.amount, 0
    )
    
    const savingsRate = income === 0 ? 0 : Math.round(((income - expenses) / income) * 100)

    setStats({
      totalBalance,
      monthlyIncome: income,
      monthlyExpenses: expenses,
      savingsRate
    })
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

  const deleteTransaction = async (id) => {
    try {
      await api.deleteTransaction(id)
      setTransactions(transactions.filter(tx => tx.id !== id))
    } catch (error) {
      console.error('Failed to delete transaction:', error)
      alert('Failed to delete transaction. Please try again.')
    }
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <div>
      <div className="month-selector">
        <input 
          type="month" 
          id="monthSelect" 
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          style={{backgroundColor: '#8db1e0', padding: '0.5vh 0.5vw', borderRadius: '0.3vw', color: '#1a0b35', fontWeight: '600'}}
        />
      </div>

      <section className="cards">
        <div className="card" id="balanceCard">
          <p style={{fontSize: '1.2em', fontWeight: '500'}}>Total Balance</p>
          <h3 style={{fontSize: '1.5em', fontWeight: 'bold'}}>${stats.totalBalance.toFixed(2)}</h3>
          <div className="change_positive" style={{fontSize: '1.2em', fontWeight: 'bold'}}>
            <FontAwesomeIcon icon={faArrowUp} /> 12.5%
          </div>
        </div>
        
        <div className="card">
          <p style={{fontSize: '1.2em', fontWeight: '500'}}>Monthly Income</p>
          <h3 style={{fontSize: '1.5em', fontWeight: 'bold'}}>${stats.monthlyIncome.toFixed(2)}</h3>
          <div className="change_positive" style={{fontSize: '1.2em', fontWeight: 'bold'}}>
            <FontAwesomeIcon icon={faArrowUp} /> 8.2%
          </div>
        </div>
        
        <div className="card">
          <p style={{fontSize: '1.2em', fontWeight: '500'}}>Monthly Expenses</p>
          <h3 style={{fontSize: '1.5em', fontWeight: 'bold'}}>${stats.monthlyExpenses.toFixed(2)}</h3>
          <div className="change_negative" style={{fontSize: '1.2em', fontWeight: 'bold'}}>
            <FontAwesomeIcon icon={faArrowDown} /> 3.1%
          </div>
        </div>
        
        <div className="card">
          <p style={{fontSize: '1.2em', fontWeight: '500'}}>Savings Rate</p>
          <h3 style={{fontSize: '1.5em', fontWeight: 'bold'}}>{stats.savingsRate}%</h3>
          <div className="change_positive" style={{fontSize: '1.2em', fontWeight: 'bold'}}>
            <FontAwesomeIcon icon={faArrowUp} /> 2.4%
          </div>
        </div>
      </section>

      <section className="transactions">
        <div className="transactions-header">
          <h2 style={{fontWeight: '600'}}>Transactions</h2>
          <div className="transactions-controls">
            <input type="text" placeholder="Search transactions" style={{backgroundColor: '#8db1e0', color: '#1a0b35', fontWeight: '600'}}/>
            <select style={{backgroundColor: '#8db1e0', color: '#1a0b35', fontWeight: '600', padding: '1vh 1vw'}}>
              <option>Type</option>
            </select>
            <select style={{backgroundColor: '#8db1e0', color: '#1a0b35', fontWeight: '600'}}>
              <option>Category</option>
            </select>
            <input type="date" value={today} style={{backgroundColor: '#8db1e0', color: '#1a0b35', fontWeight: '600'}}/>
            <button onClick={() => setShowModal(true)} style={{backgroundColor: '#8db1e0', color: '#1a0b35', fontWeight: '600'}}>+ Add Transaction</button>
          </div>
        </div>
        
        <table style={{padding: '5vh 5vw', backgroundColor: '#1a0b35', borderRadius: '0.5vw', fontSize: '1.5em', fontWeight: 'normal', border: 'none'}}>
          <thead>
            <tr>
              <th style={{paddingTop: '2vh', paddingLeft: '2vw', color: '#8db1e0', fontWeight: '500'}}>Date</th>
              <th style={{color: '#8db1e0', fontWeight: '500'}}>Description</th>
              <th style={{color: '#8db1e0', fontWeight: '500'}}>Category</th>
              <th style={{color: '#8db1e0', fontWeight: '500'}}>Amount</th>
              <th style={{color: '#8db1e0', fontWeight: '500'}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(tx => (
              <tr key={tx.id} className="tableData">
                <td style={{padding: '2vh 2vw', border: 'none'}}>{new Date(tx.date).toLocaleDateString()}</td>
                <td style={{border: 'none'}}>{tx.description}</td>
                <td style={{border: 'none'}}>{tx.category}</td>
                <td className={tx.type === 'income' ? 'plus' : 'minus'} style={{border: 'none', fontWeight: 'bold'}}>
                  {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                </td>
                <td style={{border: 'none'}}>
                  <FontAwesomeIcon icon={faEdit} style={{ marginRight: '10px', cursor: 'pointer', paddingRight: '2vw'}} />
                  <FontAwesomeIcon 
                    icon={faTrashAlt} 
                    style={{ cursor: 'pointer', color: '#d41a1abe' }}
                    onClick={() => deleteTransaction(tx.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="analytics" style={{paddingBottom: '5vh'}}>
        <h2>Analytics</h2>
        <div style={{backgroundColor: '#1a0b35', borderRadius: '0.5vw'}}>
          <IncomeExpenseChart transactions={transactions}/>
        </div>
      </section>

      {showModal && (
        <TransactionModal 
          onClose={() => setShowModal(false)}
          onSubmit={addTransaction}
        />
      )}
    </div>
  )
}

export default Dashboard