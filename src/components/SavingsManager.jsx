import React, { useState } from 'react'
import { format } from 'date-fns'
import { PiggyBank, Plus, TrendingUp, TrendingDown, Calculator } from 'lucide-react'

// Kuwaiti Dinar denominations (same as in ExpenseForm)
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

function SavingsManager({ savings, onAddToSavings, expenses, expenseTypes }) {
  const [amount, setAmount] = useState('')
  const [useCalculator, setUseCalculator] = useState(false)
  const [denominationCounts, setDenominationCounts] = useState({})

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
    
    setAmount(totalAmount.toFixed(3))
  }

  const handleAddToSavings = (e) => {
    e.preventDefault()
    
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount')
      return
    }

    onAddToSavings(parseFloat(amount))
    setAmount('')
    setDenominationCounts({})
    setUseCalculator(false)
    alert('Amount added to savings successfully!')
  }

  // Calculate savings statistics
  const savingsTransactions = expenses.filter(exp => exp.type === 'saving')
  const fromSavingsTransactions = expenses.filter(exp => exp.type === 'from-saving')
  
  const totalSaved = savingsTransactions.reduce((sum, exp) => sum + exp.amount, 0)
  const totalSpentFromSavings = fromSavingsTransactions.reduce((sum, exp) => sum + exp.amount, 0)

  // Recent savings-related transactions
  const recentSavingsTransactions = expenses
    .filter(exp => exp.type === 'saving' || exp.type === 'from-saving')
    .slice(0, 10)

  return (
    <div className="space-y-6">
      {/* Savings Overview */}
      <div className="grid grid-3">
        <div className="card text-center">
          <div className="flex items-center justify-center mb-4">
            <PiggyBank className="text-green-500" size={32} />
          </div>
          <h3 className="text-lg font-bold text-green-600">Current Savings</h3>
          <p className="text-2xl font-bold">{savings.toFixed(3)} KWD</p>
        </div>

        <div className="card text-center">
          <div className="flex items-center justify-center mb-4">
            <TrendingUp className="text-blue-500" size={32} />
          </div>
          <h3 className="text-lg font-bold text-blue-600">Total Saved</h3>
          <p className="text-2xl font-bold">{totalSaved.toFixed(3)} KWD</p>
          <p className="text-sm text-gray-600">{savingsTransactions.length} deposits</p>
        </div>

        <div className="card text-center">
          <div className="flex items-center justify-center mb-4">
            <TrendingDown className="text-red-500" size={32} />
          </div>
          <h3 className="text-lg font-bold text-red-600">Spent from Savings</h3>
          <p className="text-2xl font-bold">{totalSpentFromSavings.toFixed(3)} KWD</p>
          <p className="text-sm text-gray-600">{fromSavingsTransactions.length} withdrawals</p>
        </div>
      </div>

      {/* Add to Savings Form */}
      <div className="card">
        <h3 className="text-xl font-bold mb-6">Add to Savings</h3>
        
        <form onSubmit={handleAddToSavings}>
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
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="form-input"
                placeholder="0.000"
                step="0.001"
                min="0"
                required
              />
            ) : (
              <div>
                <div className="text-lg font-bold mb-4">
                  Total: {amount || '0.000'} KWD
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

          <button type="submit" className="btn btn-primary">
            <Plus size={16} />
            Add to Savings
          </button>
        </form>
      </div>

      {/* Savings History */}
      <div className="card">
        <h3 className="text-xl font-bold mb-6">Savings History</h3>
        
        {recentSavingsTransactions.length > 0 ? (
          <div className="space-y-3">
            {recentSavingsTransactions.map(transaction => {
              const typeInfo = expenseTypes[transaction.type]
              const IconComponent = typeInfo?.icon
              const isDeposit = transaction.type === 'saving'
              
              return (
                <div key={transaction.id} className={`expense-item expense-type-${transaction.type}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {IconComponent && <IconComponent size={20} style={{ color: typeInfo.color }} />}
                      <div>
                        <h4 className="font-semibold">{transaction.description}</h4>
                        <p className="text-sm text-gray-600">
                          {typeInfo?.name || transaction.type} • {format(new Date(transaction.date), 'MMM dd, yyyy HH:mm')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold text-lg ${isDeposit ? 'text-green-600' : 'text-red-600'}`}>
                        {isDeposit ? '+' : '-'}{transaction.amount.toFixed(3)} KWD
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">
            No savings transactions yet. Start by adding money to your savings!
          </p>
        )}
      </div>

      {/* Savings Tips */}
      <div className="card">
        <h3 className="text-xl font-bold mb-4">💡 Savings Tips</h3>
        <div className="space-y-3 text-sm">
          <div className="p-3 bg-blue-50 rounded-lg">
            <p><strong>Track your progress:</strong> Your current savings rate shows how well you're building your financial cushion.</p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <p><strong>Use "From Saving" wisely:</strong> Only use saved money for emergencies or planned major purchases.</p>
          </div>
          <div className="p-3 bg-yellow-50 rounded-lg">
            <p><strong>Regular deposits:</strong> Try to add a fixed amount to savings each month to build a consistent habit.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SavingsManager