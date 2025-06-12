import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken'; 

interface JwtPayload {
  role: string;
  // Các thuộc tính khác trong payload nếu có
}

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  if (!token) {
    // Nếu không có token, chuyển hướng đến trang login
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    // Giải mã token JWT và xác định kiểu trả về là JwtPayload
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as JwtPayload;

    // Kiểm tra vai trò của người dùng trong payload
    if (decodedToken.role !== 'ADMIN') {
      // Nếu vai trò không phải là ADMIN, chuyển hướng đến trang chính hoặc trang cấm
      return NextResponse.redirect(new URL('/', req.url));
    }
  } catch (error) {
    console.error('Error decoding token:', error);
    // Nếu token không hợp lệ, chuyển hướng đến trang login
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Cho phép yêu cầu tiếp tục nếu người dùng có quyền admin
  return NextResponse.next();
}

// Áp dụng middleware chỉ cho các route liên quan đến admin
export const config = {
  matcher: ['/admin/:path*'], // Áp dụng middleware chỉ cho các route /admin
};
