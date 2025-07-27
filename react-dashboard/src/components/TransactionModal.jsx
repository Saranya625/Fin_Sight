import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

const TransactionModal = ({ onClose, onSubmit, initialData, goals }) => {
  const [formData, setFormData] = useState(initialData || {
    date: '',
    description: '',
    category: '',
    amount: '',
    type: 'income',
    goalId: '',
  })

  

  const [selectedQuickAmount, setSelectedQuickAmount] = useState(null)

  useEffect(() => {
    if (initialData) {
      const formattedDate = initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : '';
      setFormData({
        ...initialData,
        date: formattedDate,
        amount: initialData.amount.toString() 
      });
    } else {
      setFormData({
        date: '',
        description: '',
        category: '',
        amount: '',
        type: 'income',
        goalId: '',
      });
    }
  }, [initialData]);

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

  const title = initialData ? 'Edit Transaction' : 'Add Transaction';
  const submitButtonText = initialData ? 'Update Transaction' : 'Add Transaction';

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-btn" onClick={onClose}>
          <X />
        </span>
        <h3>{title}</h3>
        
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

          <div className="amount-type-group">
            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={formData.amount}
              onChange={handleInputChange}
              required
            />
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              required
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>


          <div className="quick-amounts">
            <button
              type="button"
              onClick={() => handleQuickAmount(10)}
            >
              +10
            </button>
            <button
              type="button"
              onClick={() => handleQuickAmount(100)}
            >
              +100
            </button>
            <button
              type="button"
              onClick={() => handleQuickAmount(1000)}
            >
              +1000
            </button>
          </div>

          <button type="submit">{submitButtonText}</button>
        </form>
      </div>
    </div>
  )
}

export default TransactionModal