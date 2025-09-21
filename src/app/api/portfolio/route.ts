import { NextResponse } from 'next/server'
import { getPortfolio } from '@/lib/mock/database'

export async function GET() {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100))

    // Get portfolio from SQLite database
    const portfolio = getPortfolio()

    return NextResponse.json({
      success: true,
      data: portfolio
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch portfolio data'
      },
      { status: 500 }
    )
  }
}