import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp, faArrowDown, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import TransactionModal from './TransactionModal'
import IncomeExpenseChart from './IncomeExpenseChart'

const Dashboard = () => {
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      date: '2024-01-15',
      description: 'Monthly Salary',
      category: 'Income',
      amount: 5000,
      type: 'income'
    },
    {
      id: 2,
      date: '2024-01-14',
      description: 'Grocery Shopping',
      category: 'Food',
      amount: 125.50,
      type: 'expense'
    }
  ])
  
  const [selectedMonth, setSelectedMonth] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [stats, setStats] = useState({
    totalBalance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    savingsRate: 0
  })

  useEffect(() => {
    calculateStats()
  }, [transactions, selectedMonth])

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

  const addTransaction = (transaction) => {
    const newTransaction = {
      ...transaction,
      id: Date.now(),
      amount: parseFloat(transaction.amount)
    }
    setTransactions([...transactions, newTransaction])
  }

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(tx => tx.id !== id))
  }

  return (
    <div>
      <div className="month-selector">
        <label htmlFor="monthSelect">Select Month:</label>
        <input 
          type="month" 
          id="monthSelect" 
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        />
      </div>

      <section className="cards">
        <div className="card" id="balanceCard">
          <p>Total Balance</p>
          <h3>${stats.totalBalance.toFixed(2)}</h3>
          <div className="change_positive">
            <FontAwesomeIcon icon={faArrowUp} /> 12.5%
          </div>
        </div>
        
        <div className="card">
          <p>Monthly Income</p>
          <h3>${stats.monthlyIncome.toFixed(2)}</h3>
          <div className="change_positive">
            <FontAwesomeIcon icon={faArrowUp} /> 8.2%
          </div>
        </div>
        
        <div className="card">
          <p>Monthly Expenses</p>
          <h3>${stats.monthlyExpenses.toFixed(2)}</h3>
          <div className="change_negative">
            <FontAwesomeIcon icon={faArrowDown} /> 3.1%
          </div>
        </div>
        
        <div className="card">
          <p>Savings Rate</p>
          <h3>{stats.savingsRate}%</h3>
          <div className="change_positive">
            <FontAwesomeIcon icon={faArrowUp} /> 2.4%
          </div>
        </div>
      </section>

      <section className="transactions">
        <div className="transactions-header">
          <h2>Transactions</h2>
          <div className="transactions-controls">
            <input type="text" placeholder="Search transactions..." />
            <select>
              <option>Type</option>
            </select>
            <select>
              <option>Category</option>
            </select>
            <input type="date" />
            <button onClick={() => setShowModal(true)}>+ Add Transaction</button>
          </div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(tx => (
              <tr key={tx.id}>
                <td>{new Date(tx.date).toLocaleDateString()}</td>
                <td>{tx.description}</td>
                <td>{tx.category}</td>
                <td className={tx.type === 'income' ? 'plus' : 'minus'}>
                  {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                </td>
                <td>
                  <FontAwesomeIcon icon={faEdit} style={{ marginRight: '10px', cursor: 'pointer' }} />
                  <FontAwesomeIcon 
                    icon={faTrashAlt} 
                    style={{ cursor: 'pointer' }}
                    onClick={() => deleteTransaction(tx.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="analytics">
        <h2>Analytics</h2>
        <IncomeExpenseChart transactions={transactions} />
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