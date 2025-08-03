import React, { useState } from 'react'
import { format } from 'date-fns'
import { Trash2, Filter, Search, Eye } from 'lucide-react'

function ExpenseList({ expenses, expenseTypes, onDeleteExpense }) {
  const [filterType, setFilterType] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState('desc')
  const [showDenominations, setShowDenominations] = useState({})

  // Filter and sort expenses
  const filteredExpenses = expenses
    .filter(expense => {
      const matchesType = filterType === 'all' || expense.type === filterType
      const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesType && matchesSearch
    })
    .sort((a, b) => {
      let aValue, bValue
      
      switch (sortBy) {
        case 'amount':
          aValue = a.amount
          bValue = b.amount
          break
        case 'type':
          aValue = expenseTypes[a.type]?.name || a.type
          bValue = expenseTypes[b.type]?.name || b.type
          break
        case 'description':
          aValue = a.description
          bValue = b.description
          break
        default: // date
          aValue = new Date(a.date)
          bValue = new Date(b.date)
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

  const toggleDenominations = (expenseId) => {
    setShowDenominations(prev => ({
      ...prev,
      [expenseId]: !prev[expenseId]
    }))
  }

  const handleDelete = (expense) => {
    if (window.confirm(`Are you sure you want to delete "${expense.description}"?`)) {
      onDeleteExpense(expense.id)
    }
  }

  const totalAmount = filteredExpenses
    .filter(exp => exp.type !== 'saving')
    .reduce((sum, exp) => sum + exp.amount, 0)

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Expense History</h2>
        <div className="text-sm text-gray-600">
          {filteredExpenses.length} transactions • Total: {totalAmount.toFixed(3)} KWD
        </div>
      </div>

      {/* Filters and Search */}
      <div className="grid grid-2 mb-6">
        <div className="flex gap-4">
          <div className="form-group flex-1">
            <label className="form-label">Filter by Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="form-select"
            >
              <option value="all">All Types</option>
              {Object.entries(expenseTypes).map(([key, type]) => (
                <option key={key} value={key}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group flex-1">
            <label className="form-label">Search</label>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10"
                placeholder="Search descriptions..."
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="form-group flex-1">
            <label className="form-label">Sort by</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-select"
            >
              <option value="date">Date</option>
              <option value="amount">Amount</option>
              <option value="type">Type</option>
              <option value="description">Description</option>
            </select>
          </div>

          <div className="form-group flex-1">
            <label className="form-label">Order</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="form-select"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Expense List */}
      <div className="space-y-3">
        {filteredExpenses.map(expense => {
          const typeInfo = expenseTypes[expense.type]
          const IconComponent = typeInfo?.icon
          const hasDenominations = expense.denominations && 
            Object.values(expense.denominations).some(count => count > 0)
          
          return (
            <div key={expense.id} className={`expense-item expense-type-${expense.type}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3 flex-1">
                  {IconComponent && <IconComponent size={20} style={{ color: typeInfo.color }} />}
                  <div className="flex-1">
                    <h4 className="font-semibold">{expense.description}</h4>
                    <p className="text-sm text-gray-600">
                      {typeInfo?.name || expense.type} • {format(new Date(expense.date), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className={`font-bold text-lg ${expense.type === 'saving' ? 'text-green-600' : 'text-red-600'}`}>
                      {expense.type === 'saving' ? '+' : '-'}{expense.amount.toFixed(3)} KWD
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    {hasDenominations && (
                      <button
                        onClick={() => toggleDenominations(expense.id)}
                        className="btn btn-secondary"
                        title="View denominations"
                      >
                        <Eye size={14} />
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleDelete(expense)}
                      className="btn btn-danger"
                      title="Delete expense"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Denominations breakdown */}
              {showDenominations[expense.id] && hasDenominations && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <h5 className="font-semibold mb-2">Denominations Used:</h5>
                  <div className="grid grid-3 gap-2 text-sm">
                    {Object.entries(expense.denominations)
                      .filter(([value, count]) => count > 0)
                      .map(([value, count]) => {
                        const denominationValue = parseFloat(value)
                        let label
                        
                        if (denominationValue >= 1) {
                          label = `${denominationValue} KWD`
                        } else if (denominationValue >= 0.1) {
                          label = `${denominationValue * 1000} Fils`
                        } else {
                          label = `${denominationValue * 1000} Fils`
                        }
                        
                        return (
                          <div key={value} className="flex justify-between">
                            <span>{label}:</span>
                            <span className="font-semibold">{count}x</span>
                          </div>
                        )
                      })}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {filteredExpenses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-2">No expenses found</p>
          <p className="text-gray-400">
            {expenses.length === 0 
              ? "Start by adding your first expense" 
              : "Try adjusting your filters or search term"
            }
          </p>
        </div>
      )}
    </div>
  )
}

export default ExpenseList