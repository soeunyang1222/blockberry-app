import { NextRequest, NextResponse } from 'next/server';
import { savingsVaultService } from '@/lib/services/savings-vault.service';
import { z } from 'zod';

const CreateSavingsVaultSchema = z.object({
  user_id: z.number().positive('User ID must be positive'),
  vault_name: z.string().min(1, 'Vault name is required'),
  target_token: z.string().min(1, 'Target token is required'),
  interval_days: z.number().positive('Interval days must be positive'),
  amount_fiat: z.number().positive('Amount must be positive'),
  fiat_symbol: z.string().min(1, 'Fiat symbol is required'),
  duration_days: z.number().positive('Duration days must be positive'),
  active: z.boolean().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');
    const available = searchParams.get('available');

    let savingsVaults;
    
    // 조회 가능한 저금통만 조회 (active = true)
    if (available === 'true') {
      if (user_id) {
        savingsVaults = await savingsVaultService.findAvailableVaultsByUser(parseInt(user_id));
      } else {
        savingsVaults = await savingsVaultService.findAllAvailableVaults();
      }
    } else {
      // 모든 저금통 조회
      if (user_id) {
        savingsVaults = await savingsVaultService.findByUserId(parseInt(user_id));
      } else {
        savingsVaults = await savingsVaultService.findAll();
      }
    }

    return NextResponse.json({
      success: true,
      data: savingsVaults,
    });
  } catch (error) {
    console.error('Error fetching savings vaults:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch savings vaults',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 입력 데이터 검증
    const validatedData = CreateSavingsVaultSchema.parse(body);
    
    const savingsVault = await savingsVaultService.create(validatedData);
    
    return NextResponse.json(
      {
        success: true,
        data: savingsVault,
        message: 'Savings vault created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating savings vault:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          details: error.errors,
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create savings vault',
      },
      { status: 500 }
    );
  }
}
