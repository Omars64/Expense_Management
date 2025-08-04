# Kuwaiti Expense Manager

A comprehensive expense management application built with React, specifically designed for Kuwaiti Dinar (KWD) currency with full denomination support.

## Features

### 📊 Multiple Expense Categories
- **House**: Home-related expenses (rent, utilities, maintenance)
- **Groceries**: Food and household items
- **Personal**: Personal expenses (clothing, entertainment, etc.)
- **Saving**: Money added to savings
- **From Saving**: Expenses paid using saved money

### 💰 Kuwaiti Dinar Support
- Full KWD denomination system with notes and coins
- Notes: 20 KWD, 10 KWD, 5 KWD, 1 KWD, 500 Fils
- Coins: 100 Fils, 50 Fils, 20 Fils, 10 Fils, 5 Fils
- Smart denomination calculator for precise amount entry

### 💳 Savings Management
- Track current savings balance
- Add money to savings with denomination breakdown
- Record expenses from savings (with balance validation)
- Complete savings transaction history
- Savings tips and insights

### 📈 Dashboard & Analytics
- Real-time expense summaries by category
- Monthly spending analysis
- Recent transaction history
- Average daily spending calculations
- Visual expense breakdown with percentages

### 🔍 Advanced Expense Management
- Search and filter expenses by type or description
- Sort by date, amount, type, or description
- View denomination breakdown for each transaction
- Delete expenses with automatic savings adjustment
- Responsive design for all devices

### 💾 Data Persistence
- All data stored locally using browser localStorage
- No data loss between sessions
- Automatic saving of all transactions and settings

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. Clone or download the project
2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

## Usage Guide

### Adding Expenses
1. Navigate to "Add Expense" tab
2. Select expense type (House, Groceries, Personal, Saving, From Saving)
3. Enter description
4. Choose amount entry method:
   - **Manual Entry**: Type the amount directly
   - **Denominations**: Select specific notes and coins
5. Submit the expense

### Managing Savings
1. Go to "Savings" tab
2. View current savings balance and statistics
3. Add money to savings using the form
4. View savings transaction history
5. Use "From Saving" expense type to spend saved money

### Viewing Reports
1. Visit the "Dashboard" for overview statistics
2. Check "View Expenses" for detailed transaction history
3. Use filters and search to find specific transactions
4. Sort by various criteria for better organization

## Technical Details

### Built With
- **React 18** - Frontend framework
- **Vite** - Build tool and development server
- **Lucide React** - Icon library
- **date-fns** - Date formatting utilities

### Architecture
- Component-based React architecture
- Local state management with React hooks
- localStorage for data persistence
- Responsive CSS with modern design patterns

### Currency Precision
- All amounts stored and calculated with 3 decimal places (fils precision)
- Proper handling of floating-point arithmetic
- Accurate denomination calculations

## Browser Support
- Chrome (recommended)
- Firefox
- Safari
- Edge

## Data Privacy
- All data is stored locally in your browser
- No data is sent to external servers
- Clear browser data to reset the application

## Contributing
This is a standalone application. Feel free to modify and enhance according to your needs.

## License
Open source - use and modify as needed.