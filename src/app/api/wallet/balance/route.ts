import { NextResponse } from 'next/server'
import { getWalletBalances } from '@/lib/mock/database'

export async function GET() {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100))

    // Get balances from SQLite database
    const balances = getWalletBalances()

    // Calculate total value
    const totalValue = balances.reduce((sum, balance) => sum + balance.value, 0)

    return NextResponse.json({
      success: true,
      data: {
        balances,
        totalValue: Math.round(totalValue * 100) / 100 // Round to 2 decimal places
      }
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch wallet balance'
      },
      { status: 500 }
    )
  }
}