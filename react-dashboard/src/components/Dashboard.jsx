import { useState, useEffect } from 'react'
import { ArrowUp, ArrowDown, Edit, Trash2 } from 'lucide-react'
import TransactionModal from './TransactionModal'

const Dashboard = ({ transactions, addTransaction, updateTransaction, deleteTransaction }) => {
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [selectedMonth, setSelectedMonth] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [filteredTransactions, setFilteredTransactions] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [stats, setStats] = useState({
    totalBalance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    savingsRate: 0,
    incomeChange: 0,
    expensesChange: 0,
    savingsRateChange: 0,
    totalBalanceChange: 0,
  })


  const calculatePercentageChange = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0; // If previous was 0 and current is positive, 100% increase. If current is also 0, 0% change.
    return ((current - previous) / previous) * 100;
  };

  useEffect(() => {
    const filtered = transactions.filter(tx => {
      const txDate = new Date(tx.date)
      const selectedDate = selectedMonth ? new Date(selectedMonth + '-01') : null

      const matchesMonth = selectedDate ? 
        txDate.getMonth() === selectedDate.getMonth() && txDate.getFullYear() === selectedDate.getFullYear() : true
      
      const matchesSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = selectedCategory ? tx.category === selectedCategory : true

      return matchesMonth && matchesSearch && matchesCategory
    })
    setFilteredTransactions(filtered)
    calculateStats(filtered)
  }, [transactions, selectedMonth, searchTerm, selectedCategory])

  const calculateStats = (transactionsToCalculate) => {
    let income = 0;
    let expenses = 0;

    transactionsToCalculate.forEach(tx => {
      if (tx.type === 'income') {
        income += tx.amount;
      } else {
        expenses += tx.amount;
      }
    });

    const totalBalance = transactionsToCalculate.reduce((acc, tx) =>
      tx.type === 'income' ? acc + tx.amount : acc - tx.amount, 0
    );

    const savingsRate = income === 0 ? 0 : Math.round(((income - expenses) / income) * 100);

    // Calculate previous month's stats
    let prevMonthIncome = 0;
    let prevMonthExpenses = 0;
    let prevMonthSavingsRate = 0;
    let prevMonthTotalBalance = 0;

    if (selectedMonth) {
      const currentMonthDate = new Date(selectedMonth + '-01');
      const prevMonthDate = new Date(currentMonthDate);
      prevMonthDate.setMonth(currentMonthDate.getMonth() - 1);

      const prevMonthTransactions = transactions.filter(tx => {
        const txDate = new Date(tx.date);
        return txDate.getMonth() === prevMonthDate.getMonth() && txDate.getFullYear() === prevMonthDate.getFullYear();
      });

      prevMonthTransactions.forEach(tx => {
        if (tx.type === 'income') {
          prevMonthIncome += tx.amount;
        } else {
          prevMonthExpenses += tx.amount;
        }
      });
      prevMonthSavingsRate = prevMonthIncome === 0 ? 0 : Math.round(((prevMonthIncome - prevMonthExpenses) / prevMonthIncome) * 100);
      prevMonthTotalBalance = prevMonthTransactions.reduce((acc, tx) =>
        tx.type === 'income' ? acc + tx.amount : acc - tx.amount, 0
      );
    }

    // Calculate changes
    const incomeChange = calculatePercentageChange(income, prevMonthIncome);
    const expensesChange = calculatePercentageChange(expenses, prevMonthExpenses);
    const savingsRateChange = calculatePercentageChange(savingsRate, prevMonthSavingsRate);
    const totalBalanceChange = calculatePercentageChange(totalBalance, prevMonthTotalBalance);

    setStats({
      totalBalance,
      monthlyIncome: income,
      monthlyExpenses: expenses,
      savingsRate,
      incomeChange: isNaN(incomeChange) ? 0 : incomeChange,
      expensesChange: isNaN(expensesChange) ? 0 : expensesChange,
      savingsRateChange: isNaN(savingsRateChange) ? 0 : savingsRateChange,
      totalBalanceChange: isNaN(totalBalanceChange) ? 0 : totalBalanceChange,
    });
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
        <div className="card" id="balanceCard">
          <p>Total Balance</p>
          <h3>${stats.totalBalance.toFixed(2)}</h3>
          <div className={stats.totalBalanceChange >= 0 ? "change_positive" : "change_negative"}>
            {stats.totalBalanceChange >= 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />} {Math.abs(stats.totalBalanceChange).toFixed(1)}%
          </div>
        </div>
        
        <div className="card">
          <p>Monthly Income</p>
          <h3>${stats.monthlyIncome.toFixed(2)}</h3>
          <div className={stats.incomeChange >= 0 ? "change_positive" : "change_negative"}>
            {stats.incomeChange >= 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />} {Math.abs(stats.incomeChange).toFixed(1)}%
          </div>
        </div>
        
        <div className="card">
          <p>Monthly Expenses</p>
          <h3>${stats.monthlyExpenses.toFixed(2)}</h3>
          <div className={stats.expensesChange <= 0 ? "change_positive" : "change_negative"}>
            {stats.expensesChange <= 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />} {Math.abs(stats.expensesChange).toFixed(1)}%
          </div>
        </div>
        
        <div className="card">
          <p>Savings Rate</p>
          <h3>{stats.savingsRate}%</h3>
          <div className={stats.savingsRateChange >= 0 ? "change_positive" : "change_negative"}>
            {stats.savingsRateChange >= 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />} {Math.abs(stats.savingsRateChange).toFixed(1)}%
          </div>
        </div>
      </section>

      <section className="transactions">
        <div className="transactions-header">
          <h2>Transactions</h2>
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
              {[...new Set(transactions.map(tx => tx.category))].map(category => (
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
            {filteredTransactions.map(tx => (
              <tr key={tx.id}>
                <td>{new Date(tx.date).toLocaleDateString()}</td>
                <td>{tx.description}</td>
                <td>{tx.category}</td>
                <td className={tx.type === 'income' ? 'plus' : 'minus'}>
                  {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                </td>
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

export default Dashboard