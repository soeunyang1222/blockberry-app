import { NextRequest, NextResponse } from 'next/server';

// Mock vaults data
let mockVaults = [
  {
    id: 1,
    user_id: 1,
    vault_name: 'BTC Savings',
    target_token: 'WBTC',
    amount_fiat: 100,
    fiat_symbol: 'USDC',
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

export async function GET(
  request: NextRequest,
  { params }: { params: { vault_id: string } }
) {
  try {
    const vaultId = parseInt(params.vault_id, 10);
    const vault = mockVaults.find(v => v.id === vaultId);

    if (!vault) {
      return NextResponse.json(
        { success: false, error: 'Vault not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: vault,
    });
  } catch (error) {
    console.error('Error fetching vault:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch vault' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { vault_id: string } }
) {
  try {
    const vaultId = parseInt(params.vault_id, 10);
    const body = await request.json();

    const index = mockVaults.findIndex(v => v.id === vaultId);
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Vault not found' },
        { status: 404 }
      );
    }

    mockVaults[index] = {
      ...mockVaults[index],
      ...body,
      updated_at: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: mockVaults[index],
    });
  } catch (error) {
    console.error('Error updating vault:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update vault' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { vault_id: string } }
) {
  try {
    const vaultId = parseInt(params.vault_id, 10);
    const index = mockVaults.findIndex(v => v.id === vaultId);

    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Vault not found' },
        { status: 404 }
      );
    }

    mockVaults.splice(index, 1);

    return NextResponse.json({
      success: true,
      message: 'Vault deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting vault:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete vault' },
      { status: 500 }
    );
  }
}