import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

const TransactionModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    date: '',
    description: '',
    category: '',
    amount: '',
    type: 'income'
  })

  const [selectedQuickAmount, setSelectedQuickAmount] = useState(null)

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleQuickAmount = (amount) => {
    const currentAmount = parseFloat(formData.amount || 0)
    setFormData({
      ...formData,
      amount: (currentAmount + amount).toString()
    })
    setSelectedQuickAmount(amount)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.date || !formData.description || !formData.category || !formData.amount || !formData.type) {
      alert('Please fill all fields.')
      return
    }

    onSubmit(formData)
    onClose()
  }

  return (
    <div className="modal" style={{ display: 'flex' }}>
      <div className="modal-content">
        <span className="close-btn" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </span>
        <h3>Add Transaction</h3>
        
        <form onSubmit={handleSubmit}>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            required
          />

          <input
            type="text"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />

          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Category</option>
            <option value="Income">Income</option>
            <option value="Food">Food</option>
            <option value="Rent">Rent</option>
            <option value="Transport">Transport</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Other">Other</option>
          </select>

          <input
            type="number"
            name="amount"
            placeholder="Enter Amount"
            value={formData.amount}
            onChange={handleInputChange}
            required
          />

          <div className="quick-amounts">
            <button
              type="button"
              className={selectedQuickAmount === 10 ? 'selected' : ''}
              onClick={() => handleQuickAmount(10)}
            >
              +10
            </button>
            <button
              type="button"
              className={selectedQuickAmount === 100 ? 'selected' : ''}
              onClick={() => handleQuickAmount(100)}
            >
              +100
            </button>
            <button
              type="button"
              className={selectedQuickAmount === 1000 ? 'selected' : ''}
              onClick={() => handleQuickAmount(1000)}
            >
              +1000
            </button>
          </div>

          <select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            required
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <button type="submit">Add</button>
        </form>
      </div>
    </div>
  )
}

export default TransactionModal