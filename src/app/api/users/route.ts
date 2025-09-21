import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const CreateUserSchema = z.object({
  wallet_address: z.string().min(1, 'Wallet address is required'),
  virtual_account_address: z.string().optional(),
});

// Mock data
let mockUsers: Array<{
  id: number;
  wallet_address: string;
  virtual_account_address: string | null;
  created_at: string;
}> = [
  {
    id: 1,
    wallet_address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    virtual_account_address: '0xvirtual123',
    created_at: new Date().toISOString(),
  }
];

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: 모든 사용자 조회
 *     description: 등록된 모든 사용자 목록을 조회합니다.
 *     responses:
 *       200:
 *         description: 사용자 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: mockUsers,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch users',
      },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/users:
 *   post:
 *     tags: [Users]
 *     summary: 새 사용자 생성
 *     description: 새로운 사용자를 등록합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - wallet_address
 *             properties:
 *               wallet_address:
 *                 type: string
 *                 description: 사용자 지갑 주소
 *                 example: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
 *               virtual_account_address:
 *                 type: string
 *                 description: 가상 계정 주소 (선택사항)
 *                 example: "0xVirtualAccount123"
 *     responses:
 *       201:
 *         description: 사용자 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: 잘못된 요청 (유효성 검증 실패)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: 이미 존재하는 사용자
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = CreateUserSchema.parse(body);

    // Check if user already exists
    const existingUser = mockUsers.find(u => u.wallet_address === validatedData.wallet_address);
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'User with this wallet address already exists',
        },
        { status: 409 }
      );
    }

    // Create new user
    const newUser = {
      id: mockUsers.length + 1,
      wallet_address: validatedData.wallet_address,
      virtual_account_address: validatedData.virtual_account_address || null,
      created_at: new Date().toISOString(),
    };

    mockUsers.push(newUser);

    return NextResponse.json({
      success: true,
      data: newUser,
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: error.errors[0].message,
        },
        { status: 400 }
      );
    }

    console.error('Error creating user:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create user',
      },
      { status: 500 }
    );
  }
}