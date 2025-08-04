import React, { useState, useEffect } from 'react'
import { PlusCircle, Home, ShoppingCart, User, PiggyBank, TrendingDown } from 'lucide-react'
import ExpenseForm from './components/ExpenseForm'
import ExpenseList from './components/ExpenseList'
import Dashboard from './components/Dashboard'
import SavingsManager from './components/SavingsManager'

const EXPENSE_TYPES = {
  house: { name: 'House', icon: Home, color: '#ef4444' },
  groceries: { name: 'Groceries', icon: ShoppingCart, color: '#10b981' },
  personal: { name: 'Personal', icon: User, color: '#3b82f6' },
  saving: { name: 'Saving', icon: PiggyBank, color: '#f59e0b' },
  'from-saving': { name: 'From Saving', icon: TrendingDown, color: '#8b5cf6' }
}

function App() {
  const [expenses, setExpenses] = useState([])
  const [savings, setSavings] = useState(0)
  const [activeTab, setActiveTab] = useState('dashboard')

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedExpenses = localStorage.getItem('expenses')
    const savedSavings = localStorage.getItem('savings')
    
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses))
    }
    
    if (savedSavings) {
      setSavings(parseFloat(savedSavings))
    }
  }, [])

  // Save data to localStorage whenever expenses or savings change
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses))
  }, [expenses])

  useEffect(() => {
    localStorage.setItem('savings', savings.toString())
  }, [savings])

  const addExpense = (expense) => {
    const newExpense = {
      ...expense,
      id: Date.now(),
      date: new Date().toISOString()
    }
    
    setExpenses(prev => [newExpense, ...prev])
    
    // If expense is from saving, deduct from savings
    if (expense.type === 'from-saving') {
      setSavings(prev => Math.max(0, prev - expense.amount))
    }
    
    // If expense type is saving, add to savings
    if (expense.type === 'saving') {
      setSavings(prev => prev + expense.amount)
    }
  }

  const deleteExpense = (id) => {
    const expense = expenses.find(exp => exp.id === id)
    if (expense) {
      // Reverse the savings effect
      if (expense.type === 'from-saving') {
        setSavings(prev => prev + expense.amount)
      } else if (expense.type === 'saving') {
        setSavings(prev => Math.max(0, prev - expense.amount))
      }
      
      setExpenses(prev => prev.filter(exp => exp.id !== id))
    }
  }

  const addToSavings = (amount) => {
    setSavings(prev => prev + amount)
    
    // Also add as an expense record
    const savingExpense = {
      id: Date.now(),
      date: new Date().toISOString(),
      type: 'saving',
      amount: amount,
      description: 'Added to savings',
      denominations: {}
    }
    
    setExpenses(prev => [savingExpense, ...prev])
  }

  return (
    <div className="container">
      <header className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-4">
          Kuwaiti Expense Manager
        </h1>
        
        <nav className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('add-expense')}
            className={`btn ${activeTab === 'add-expense' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <PlusCircle size={16} />
            Add Expense
          </button>
          <button
            onClick={() => setActiveTab('expenses')}
            className={`btn ${activeTab === 'expenses' ? 'btn-primary' : 'btn-secondary'}`}
          >
            View Expenses
          </button>
          <button
            onClick={() => setActiveTab('savings')}
            className={`btn ${activeTab === 'savings' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <PiggyBank size={16} />
            Savings
          </button>
        </nav>
      </header>

      <main>
        {activeTab === 'dashboard' && (
          <Dashboard 
            expenses={expenses} 
            savings={savings} 
            expenseTypes={EXPENSE_TYPES}
          />
        )}
        
        {activeTab === 'add-expense' && (
          <ExpenseForm 
            onAddExpense={addExpense} 
            expenseTypes={EXPENSE_TYPES}
            currentSavings={savings}
          />
        )}
        
        {activeTab === 'expenses' && (
          <ExpenseList 
            expenses={expenses} 
            expenseTypes={EXPENSE_TYPES}
            onDeleteExpense={deleteExpense}
          />
        )}
        
        {activeTab === 'savings' && (
          <SavingsManager 
            savings={savings}
            onAddToSavings={addToSavings}
            expenses={expenses.filter(exp => exp.type === 'saving' || exp.type === 'from-saving')}
            expenseTypes={EXPENSE_TYPES}
          />
        )}
      </main>
    </div>
  )
}

export default App