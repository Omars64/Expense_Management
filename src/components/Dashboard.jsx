import React from 'react'
import { format } from 'date-fns'
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react'

function Dashboard({ expenses, savings, expenseTypes }) {
  // Calculate totals by expense type
  const expensesByType = expenses.reduce((acc, expense) => {
    if (!acc[expense.type]) {
      acc[expense.type] = []
    }
    acc[expense.type].push(expense)
    return acc
  }, {})

  const totalsByType = Object.entries(expensesByType).map(([type, typeExpenses]) => ({
    type,
    total: typeExpenses.reduce((sum, exp) => sum + exp.amount, 0),
    count: typeExpenses.length,
    typeInfo: expenseTypes[type]
  }))

  // Calculate this month's expenses
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  
  const thisMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date)
    return expenseDate.getMonth() === currentMonth && 
           expenseDate.getFullYear() === currentYear &&
           expense.type !== 'saving' // Exclude savings additions
  })

  const thisMonthTotal = thisMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0)

  // Calculate total expenses (excluding savings)
  const totalExpenses = expenses
    .filter(exp => exp.type !== 'saving')
    .reduce((sum, exp) => sum + exp.amount, 0)

  // Recent expenses (last 5)
  const recentExpenses = expenses.slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-3">
        <div className="card text-center">
          <div className="flex items-center justify-center mb-4">
            <DollarSign className="text-green-500" size={32} />
          </div>
          <h3 className="text-lg font-bold text-green-600">Current Savings</h3>
          <p className="text-2xl font-bold">{savings.toFixed(3)} KWD</p>
        </div>

        <div className="card text-center">
          <div className="flex items-center justify-center mb-4">
            <TrendingDown className="text-red-500" size={32} />
          </div>
          <h3 className="text-lg font-bold text-red-600">This Month</h3>
          <p className="text-2xl font-bold">{thisMonthTotal.toFixed(3)} KWD</p>
          <p className="text-sm text-gray-600">{thisMonthExpenses.length} transactions</p>
        </div>

        <div className="card text-center">
          <div className="flex items-center justify-center mb-4">
            <TrendingUp className="text-blue-500" size={32} />
          </div>
          <h3 className="text-lg font-bold text-blue-600">Total Expenses</h3>
          <p className="text-2xl font-bold">{totalExpenses.toFixed(3)} KWD</p>
          <p className="text-sm text-gray-600">{expenses.filter(exp => exp.type !== 'saving').length} transactions</p>
        </div>
      </div>

      {/* Expenses by Type */}
      <div className="card">
        <h3 className="text-xl font-bold mb-6">Expenses by Category</h3>
        <div className="grid grid-2">
          {totalsByType.map(({ type, total, count, typeInfo }) => {
            const IconComponent = typeInfo?.icon
            return (
              <div 
                key={type} 
                className={`expense-item expense-type-${type}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {IconComponent && <IconComponent size={24} style={{ color: typeInfo.color }} />}
                    <div>
                      <h4 className="font-bold">{typeInfo?.name || type}</h4>
                      <p className="text-sm text-gray-600">{count} transactions</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{total.toFixed(3)} KWD</p>
                    <p className="text-sm text-gray-600">
                      {totalExpenses > 0 ? ((total / totalExpenses) * 100).toFixed(1) : 0}%
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        
        {totalsByType.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            No expenses recorded yet. Add your first expense to see the breakdown.
          </p>
        )}
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <h3 className="text-xl font-bold mb-6">Recent Transactions</h3>
        <div className="space-y-3">
          {recentExpenses.map(expense => {
            const typeInfo = expenseTypes[expense.type]
            const IconComponent = typeInfo?.icon
            
            return (
              <div key={expense.id} className="expense-item">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {IconComponent && <IconComponent size={20} style={{ color: typeInfo.color }} />}
                    <div>
                      <h4 className="font-semibold">{expense.description}</h4>
                      <p className="text-sm text-gray-600">
                        {typeInfo?.name || expense.type} • {format(new Date(expense.date), 'MMM dd, yyyy HH:mm')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${expense.type === 'saving' ? 'text-green-600' : 'text-red-600'}`}>
                      {expense.type === 'saving' ? '+' : '-'}{expense.amount.toFixed(3)} KWD
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        
        {recentExpenses.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            No transactions yet. Start by adding an expense or saving money.
          </p>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-2">
        <div className="card">
          <h4 className="font-bold mb-4">Average Daily Spending</h4>
          <p className="text-xl font-bold text-blue-600">
            {thisMonthExpenses.length > 0 
              ? (thisMonthTotal / new Date().getDate()).toFixed(3) 
              : '0.000'} KWD
          </p>
          <p className="text-sm text-gray-600">This month</p>
        </div>

        <div className="card">
          <h4 className="font-bold mb-4">Largest Expense</h4>
          {expenses.length > 0 ? (
            <>
              <p className="text-xl font-bold text-red-600">
                {Math.max(...expenses.filter(exp => exp.type !== 'saving').map(exp => exp.amount)).toFixed(3)} KWD
              </p>
              <p className="text-sm text-gray-600">
                {expenses.find(exp => exp.amount === Math.max(...expenses.filter(exp => exp.type !== 'saving').map(exp => exp.amount)))?.description}
              </p>
            </>
          ) : (
            <p className="text-xl font-bold text-gray-400">0.000 KWD</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard