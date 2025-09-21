import { NextRequest, NextResponse } from 'next/server'
import { getDCAOrders, addDCAOrder, updateDCAOrderStatus } from '@/lib/mock/database'

// GET - Fetch all DCA orders
export async function GET() {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100))

    // Get DCA orders from SQLite database
    const orders = getDCAOrders()

    return NextResponse.json({
      success: true,
      data: {
        orders
      }
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch DCA orders'
      },
      { status: 500 }
    )
  }
}

// POST - Create a new DCA order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const { frequency, amount, fromAsset, toAsset } = body
    
    if (!frequency || !amount || !fromAsset || !toAsset) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: frequency, amount, fromAsset, toAsset'
        },
        { status: 400 }
      )
    }
    
    // Validate frequency
    if (!['daily', 'weekly', 'monthly'].includes(frequency)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid frequency. Must be daily, weekly, or monthly'
        },
        { status: 400 }
      )
    }
    
    // Validate amount
    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid amount. Must be a positive number'
        },
        { status: 400 }
      )
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200))
    
    // Create new order
    const newOrder = addDCAOrder({
      frequency,
      amount,
      fromAsset,
      toAsset,
      status: 'active'
    })
    
    return NextResponse.json({
      success: true,
      data: {
        order: newOrder
      },
      message: 'DCA order created successfully'
    }, { status: 201 })
    
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create DCA order'
      },
      { status: 500 }
    )
  }
}

// PATCH - Update DCA order status (pause/resume)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, status } = body
    
    if (!orderId || !status) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: orderId, status'
        },
        { status: 400 }
      )
    }
    
    // Validate status
    if (!['active', 'paused', 'completed'].includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid status. Must be active, paused, or completed'
        },
        { status: 400 }
      )
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100))

    // Update order status in SQLite database
    const success = updateDCAOrderStatus(orderId, status)

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Order not found'
        },
        { status: 404 }
      )
    }

    // Get updated order
    const orders = getDCAOrders()
    const order = orders.find(o => o.id === orderId)

    return NextResponse.json({
      success: true,
      data: {
        order
      },
      message: `DCA order ${status === 'active' ? 'resumed' : status}`
    })
    
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update DCA order'
      },
      { status: 500 }
    )
  }
}