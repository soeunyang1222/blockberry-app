import { NextRequest, NextResponse } from 'next/server';
import { savingsVaultService } from '@/lib/services/savings-vault.service';
import { z } from 'zod';

const UpdateSavingsVaultSchema = z.object({
  vault_name: z.string().min(1).optional(),
  target_token: z.string().min(1).optional(),
  interval_days: z.number().positive().optional(),
  amount_fiat: z.number().positive().optional(),
  fiat_symbol: z.string().min(1).optional(),
  duration_days: z.number().positive().optional(),
  active: z.boolean().optional(),
});

interface RouteParams {
  params: {
    vault_id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const vault_id = parseInt(params.vault_id);
    const { searchParams } = new URL(request.url);
    const withDetails = searchParams.get('with_details');
    
    if (isNaN(vault_id)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid vault ID',
        },
        { status: 400 }
      );
    }
    
    let savingsVault;
    
    // 상세 정보 포함 조회
    if (withDetails === 'true') {
      savingsVault = await savingsVaultService.findVaultWithDetails(vault_id);
    } else {
      savingsVault = await savingsVaultService.findOne(vault_id);
    }
    
    if (!savingsVault) {
      return NextResponse.json(
        {
          success: false,
          error: 'Savings vault not found',
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: savingsVault,
    });
  } catch (error) {
    console.error('Error fetching savings vault:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch savings vault',
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const vault_id = parseInt(params.vault_id);
    
    if (isNaN(vault_id)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid vault ID',
        },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    const validatedData = UpdateSavingsVaultSchema.parse(body);
    
    const updatedSavingsVault = await savingsVaultService.update(vault_id, validatedData);
    
    if (!updatedSavingsVault) {
      return NextResponse.json(
        {
          success: false,
          error: 'Savings vault not found',
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: updatedSavingsVault,
      message: 'Savings vault updated successfully',
    });
  } catch (error) {
    console.error('Error updating savings vault:', error);
    
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
        error: 'Failed to update savings vault',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const vault_id = parseInt(params.vault_id);
    
    if (isNaN(vault_id)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid vault ID',
        },
        { status: 400 }
      );
    }
    
    await savingsVaultService.remove(vault_id);
    
    return NextResponse.json({
      success: true,
      message: 'Savings vault deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting savings vault:', error);
    
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Savings vault not found',
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete savings vault',
      },
      { status: 500 }
    );
  }
}
