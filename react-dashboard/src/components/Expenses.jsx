import { useState, useEffect } from 'react'
import { Edit, Trash2 } from 'lucide-react'
import TransactionModal from './TransactionModal'
import ExpenseChart from './ExpenseChart'

const Expenses = ({ transactions, addTransaction, updateTransaction, deleteTransaction }) => {
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [selectedMonth, setSelectedMonth] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [filteredExpenseTransactions, setFilteredExpenseTransactions] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [monthlyExpenses, setMonthlyExpenses] = useState(0)

  useEffect(() => {
    const filtered = transactions.filter(tx => {
      const txDate = new Date(tx.date)
      const selectedDate = selectedMonth ? new Date(selectedMonth + '-01') : null

      const matchesMonth = selectedDate ? 
        txDate.getMonth() === selectedDate.getMonth() && txDate.getFullYear() === selectedDate.getFullYear() : true
      
      const matchesSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            tx.category.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = selectedCategory ? tx.category === selectedCategory : true

      return tx.type === 'expense' && matchesMonth && matchesSearch && matchesCategory
    })
    setFilteredExpenseTransactions(filtered)
    calculateExpenses(filtered)
  }, [transactions, selectedMonth, searchTerm, selectedCategory])

  const calculateExpenses = (transactionsToCalculate) => {
    let expenses = 0
    
    transactionsToCalculate.forEach(tx => {
      expenses += tx.amount
    })

    setMonthlyExpenses(expenses)
  }

  const handleAddOrUpdateTransaction = async (transactionData) => {
    if (editingTransaction) {
      await updateTransaction(editingTransaction._id, transactionData);
    } else {
      await addTransaction(transactionData);
    }
    setEditingTransaction(null);
    setShowModal(false);
  };

  const handleEditClick = (transaction) => {
    console.log('Editing transaction:', transaction);
    setEditingTransaction(transaction);
    setShowModal(true);
  };

  const handleDeleteClick = async (id) => {
    await deleteTransaction(id);
  };

  

  const handleCloseModal = () => {
    setEditingTransaction(null);
    setShowModal(false);
  };

  const expenseTransactions = transactions.filter(tx => tx.type === 'expense')

  return (
    <div>
      <div className="month-selector-container">
        <label htmlFor="monthSelect">Select Month:</label>
        <input 
          type="month" 
          id="monthSelect" 
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="month-selector-input"
        />
      </div>

      <section className="cards">
        <div className="card">
          <p>Monthly Expenses</p>
          <h3>${monthlyExpenses.toFixed(2)}</h3>
        </div>
      </section>

      <section className="transactions">
        <div className="transactions-header">
          <h2>Expense Transactions</h2>
          <div className="transactions-controls">
            <input 
              type="text" 
              placeholder="Search transactions..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {[...new Set(transactions.filter(tx => tx.type === 'expense').map(tx => tx.category))].map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <button onClick={() => { setEditingTransaction(null); setShowModal(true); }}>+ Add Transaction</button>
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
            {filteredExpenseTransactions.map(tx => (
              <tr key={tx.id}>
                <td>{new Date(tx.date).toLocaleDateString()}</td>
                <td>{tx.description}</td>
                <td>{tx.category}</td>
                <td className="minus">-${tx.amount.toFixed(2)}</td>
                <td>
                  <Edit 
                    style={{ marginRight: '10px', cursor: 'pointer' }} 
                    onClick={() => handleEditClick(tx)}
                  />
                  <Trash2 
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleDeleteClick(tx._id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="analytics">
        <h2>Analytics</h2>
        <ExpenseChart transactions={expenseTransactions} />
      </section>

      {showModal && (
        <TransactionModal 
          onClose={() => { setEditingTransaction(null); setShowModal(false); }}
          onSubmit={handleAddOrUpdateTransaction}
          initialData={editingTransaction}
        />
      )}
    </div>
  )
}

export default Expenses