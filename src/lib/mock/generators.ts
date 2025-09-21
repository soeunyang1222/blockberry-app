// Random data generators for mock responses
import { Transaction } from './types'

// Generate random price between min and max
export const randomPrice = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Generate random percentage change
export const randomPercentage = (min: number, max: number): number => {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100
}

// Generate random transaction
export const generateRandomTransaction = (index: number): Transaction => {
  const types: ('buy' | 'sell')[] = ['buy', 'sell']
  const statuses: ('completed' | 'pending' | 'failed')[] = ['completed', 'pending', 'failed']
  const btcPrice = randomPrice(40000, 45000)
  const amount = Math.random() * 0.01 // Random amount between 0 and 0.01 BTC
  
  return {
    id: `txn-gen-${index}`,
    date: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30).toISOString(), // Random date within last 30 days
    type: types[Math.floor(Math.random() * types.length)],
    asset: 'WBTC',
    amount: Math.round(amount * 10000) / 10000, // Round to 4 decimal places
    price: btcPrice,
    total: Math.round(amount * btcPrice * 100) / 100, // Round to 2 decimal places
    status: statuses[Math.floor(Math.random() * statuses.length)]
  }
}

// Generate mock chart data
export const generateChartData = (days: number) => {
  const data = []
  const now = Date.now()
  const dayMs = 1000 * 60 * 60 * 24
  
  let value = 10000 // Starting value
  
  for (let i = days; i > 0; i--) {
    const date = new Date(now - i * dayMs)
    // Random walk for portfolio value
    value = value + (Math.random() - 0.45) * 200 // Slight upward bias
    value = Math.max(8000, Math.min(15000, value)) // Keep within bounds
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.round(value * 100) / 100
    })
  }
  
  return data
}