import { NextResponse } from 'next/server';
import { registerUserRow, checkUserExistsByEmail, verifyUserLogin } from '@/lib/users';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, role, phone, password, action } = body;

    if (!email) {
      return NextResponse.json({ success: false, message: 'Email address is required' }, { status: 400 });
    }

    // 1. Action: Check if user exists
    if (action === 'check_exists') {
      const exists = await checkUserExistsByEmail(email);
      return NextResponse.json({
        success: true,
        exists,
      });
    }

    // 2. Action: Verify credentials / login
    if (action === 'login') {
      const loginRes = await verifyUserLogin(email, password || '');
      return NextResponse.json(loginRes);
    }

    // 2. Action: Register user row in DB
    if (!name || !role) {
      return NextResponse.json({ success: false, message: 'Name and Role are required for user registration' }, { status: 400 });
    }

    const result = await registerUserRow({
      name,
      email,
      password,
      role,
      phone,
    });

    if (!result.success && result.isExisting) {
      return NextResponse.json(
        {
          success: false,
          isExisting: true,
          message: 'Account already registered with this email. Please log in.',
        },
        { status: 409 }
      );
    }

    return NextResponse.json({
      success: true,
      user: result.user,
      database: result.database,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
