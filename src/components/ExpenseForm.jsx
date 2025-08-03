import React, { useState } from 'react'
import { Calculator, Save } from 'lucide-react'

// Kuwaiti Dinar denominations
const KWD_DENOMINATIONS = {
  notes: [
    { value: 20, label: '20 KWD', type: 'note' },
    { value: 10, label: '10 KWD', type: 'note' },
    { value: 5, label: '5 KWD', type: 'note' },
    { value: 1, label: '1 KWD', type: 'note' },
    { value: 0.5, label: '500 Fils', type: 'note' }
  ],
  coins: [
    { value: 0.1, label: '100 Fils', type: 'coin' },
    { value: 0.05, label: '50 Fils', type: 'coin' },
    { value: 0.02, label: '20 Fils', type: 'coin' },
    { value: 0.01, label: '10 Fils', type: 'coin' },
    { value: 0.005, label: '5 Fils', type: 'coin' }
  ]
}

function ExpenseForm({ onAddExpense, expenseTypes, currentSavings }) {
  const [formData, setFormData] = useState({
    type: 'house',
    amount: '',
    description: '',
    denominations: {}
  })

  const [useCalculator, setUseCalculator] = useState(false)
  const [denominationCounts, setDenominationCounts] = useState({})

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleDenominationChange = (denominationValue, count) => {
    const newCounts = {
      ...denominationCounts,
      [denominationValue]: parseInt(count) || 0
    }
    
    setDenominationCounts(newCounts)
    
    // Calculate total amount from denominations
    const totalAmount = Object.entries(newCounts).reduce((sum, [value, count]) => {
      return sum + (parseFloat(value) * count)
    }, 0)
    
    setFormData(prev => ({
      ...prev,
      amount: totalAmount.toFixed(3),
      denominations: newCounts
    }))
  }

  const resetForm = () => {
    setFormData({
      type: 'house',
      amount: '',
      description: '',
      denominations: {}
    })
    setDenominationCounts({})
    setUseCalculator(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert('Please enter a valid amount')
      return
    }

    if (!formData.description.trim()) {
      alert('Please enter a description')
      return
    }

    // Check if trying to spend from savings but insufficient funds
    if (formData.type === 'from-saving' && parseFloat(formData.amount) > currentSavings) {
      alert(`Insufficient savings! Available: ${currentSavings.toFixed(3)} KWD`)
      return
    }

    onAddExpense({
      ...formData,
      amount: parseFloat(formData.amount)
    })

    resetForm()
    alert('Expense added successfully!')
  }

  const allDenominations = [...KWD_DENOMINATIONS.notes, ...KWD_DENOMINATIONS.coins]

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-6">Add New Expense</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-2 mb-6">
          <div className="form-group">
            <label className="form-label">Expense Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="form-select"
              required
            >
              {Object.entries(expenseTypes).map(([key, type]) => (
                <option key={key} value={key}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter expense description"
              required
            />
          </div>
        </div>

        <div className="form-group mb-6">
          <div className="flex items-center gap-4 mb-4">
            <label className="form-label">Amount (KWD)</label>
            <button
              type="button"
              onClick={() => setUseCalculator(!useCalculator)}
              className={`btn ${useCalculator ? 'btn-primary' : 'btn-secondary'}`}
            >
              <Calculator size={16} />
              {useCalculator ? 'Manual Entry' : 'Use Denominations'}
            </button>
          </div>

          {!useCalculator ? (
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              className="form-input"
              placeholder="0.000"
              step="0.001"
              min="0"
              required
            />
          ) : (
            <div>
              <div className="text-lg font-bold mb-4">
                Total: {formData.amount || '0.000'} KWD
              </div>
              
              <div className="mb-4">
                <h4 className="font-bold mb-2">Notes</h4>
                <div className="denomination-grid">
                  {KWD_DENOMINATIONS.notes.map(denom => (
                    <div key={denom.value} className="denomination-item">
                      <div className="font-bold">{denom.label}</div>
                      <input
                        type="number"
                        min="0"
                        value={denominationCounts[denom.value] || ''}
                        onChange={(e) => handleDenominationChange(denom.value, e.target.value)}
                        className="form-input mt-2"
                        placeholder="0"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-bold mb-2">Coins</h4>
                <div className="denomination-grid">
                  {KWD_DENOMINATIONS.coins.map(denom => (
                    <div key={denom.value} className="denomination-item">
                      <div className="font-bold">{denom.label}</div>
                      <input
                        type="number"
                        min="0"
                        value={denominationCounts[denom.value] || ''}
                        onChange={(e) => handleDenominationChange(denom.value, e.target.value)}
                        className="form-input mt-2"
                        placeholder="0"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {formData.type === 'from-saving' && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> This expense will be deducted from your savings.
              <br />
              Available savings: <strong>{currentSavings.toFixed(3)} KWD</strong>
            </p>
          </div>
        )}

        <div className="flex gap-4">
          <button type="submit" className="btn btn-primary">
            <Save size={16} />
            Add Expense
          </button>
          <button type="button" onClick={resetForm} className="btn btn-secondary">
            Reset
          </button>
        </div>
      </form>
    </div>
  )
}

export default ExpenseForm