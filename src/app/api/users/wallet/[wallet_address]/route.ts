import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/lib/services/user.service';

interface RouteParams {
  params: {
    wallet_address: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { wallet_address } = params;
    
    const user = await userService.findByWalletAddress(wallet_address);
    
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found',
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Error fetching user by wallet address:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch user',
      },
      { status: 500 }
    );
  }
}
