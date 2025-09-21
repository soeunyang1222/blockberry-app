import { NextResponse } from 'next/server';

export async function POST() {
  // Demo reset is disabled in production builds
  return NextResponse.json(
    {
      success: false,
      error: 'Demo reset is not available in production builds'
    },
    { status: 400 }
  );
}