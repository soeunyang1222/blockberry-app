import { NextRequest, NextResponse } from 'next/server';
import { savingsVaultService } from '@/lib/services/savings-vault.service';

interface RouteParams {
  params: {
    vault_id: string;
  };
}

/**
 * @swagger
 * /api/savings-vault/{vault_id}:
 *   get:
 *     tags: [SavingsVault]
 *     summary: 특정 저금통 조회
 *     description: 저금통 ID로 특정 저금통 정보를 조회합니다.
 *     parameters:
 *       - in: path
 *         name: vault_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 저금통 ID
 *         example: 1
 *     responses:
 *       200:
 *         description: 저금통 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/SavingsVault'
 *       400:
 *         description: 잘못된 저금통 ID
 *       404:
 *         description: 저금통을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
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
    
    const savingsVault = await savingsVaultService.findOne(vault_id);
    
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

/**
 * @swagger
 * /api/savings-vault/{vault_id}:
 *   delete:
 *     tags: [SavingsVault]
 *     summary: 저금통 삭제
 *     description: 특정 저금통을 삭제합니다.
 *     parameters:
 *       - in: path
 *         name: vault_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 저금통 ID
 *     responses:
 *       200:
 *         description: 저금통 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Savings vault deleted successfully"
 *       400:
 *         description: 잘못된 요청
 *       404:
 *         description: 저금통을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
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

