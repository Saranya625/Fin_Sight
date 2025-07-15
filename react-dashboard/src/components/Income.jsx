import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import TransactionModal from './TransactionModal'
import IncomeChart from './IncomeChart'

const Income = () => {
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      date: '2024-01-15',
      description: 'Monthly Salary',
      category: 'Income',
      amount: 5000,
      type: 'income'
    }
  ])
  
  const [selectedMonth, setSelectedMonth] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [monthlyIncome, setMonthlyIncome] = useState(0)

  useEffect(() => {
    calculateIncome()
  }, [transactions, selectedMonth])

  const calculateIncome = () => {
    let income = 0
    
    const selectedDate = selectedMonth ? new Date(selectedMonth + '-01') : new Date()
    const selectedMonthNum = selectedDate.getMonth()
    const selectedYear = selectedDate.getFullYear()

    transactions.forEach(tx => {
      const txDate = new Date(tx.date)
      if (txDate.getMonth() === selectedMonthNum && txDate.getFullYear() === selectedYear) {
        if (tx.type === 'income') {
          income += tx.amount
        }
      }
    })

    setMonthlyIncome(income)
  }

  const addTransaction = (transaction) => {
    const newTransaction = {
      ...transaction,
      id: Date.now(),
      amount: parseFloat(transaction.amount),
      type: 'income' // Force income type for this page
    }
    setTransactions([...transactions, newTransaction])
  }

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(tx => tx.id !== id))
  }

  const incomeTransactions = transactions.filter(tx => tx.type === 'income')

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
        <div className="card">
          <p>Monthly Income</p>
          <h3>${monthlyIncome.toFixed(2)}</h3>
        </div>
      </section>

      <section className="transactions">
        <div className="transactions-header">
          <h2>Income Transactions</h2>
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
            {incomeTransactions.map(tx => (
              <tr key={tx.id}>
                <td>{new Date(tx.date).toLocaleDateString()}</td>
                <td>{tx.description}</td>
                <td>{tx.category}</td>
                <td className="plus">+${tx.amount.toFixed(2)}</td>
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
        <IncomeChart transactions={incomeTransactions} />
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

export default Income