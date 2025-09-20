import { NextRequest, NextResponse } from 'next/server'
import { getTransactions } from '@/lib/mock/database'

export async function GET(request: NextRequest) {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100))

    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Get transactions from SQLite database
    const transactions = getTransactions()

    // Paginate the results
    const paginatedTransactions = transactions.slice(offset, offset + limit)

    return NextResponse.json({
      success: true,
      data: {
        transactions: paginatedTransactions,
        total: transactions.length,
        limit,
        offset
      }
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch transactions'
      },
      { status: 500 }
    )
  }
}