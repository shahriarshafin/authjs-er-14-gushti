import { auth, BASE_PATH } from '@/auth';
import { PROTECTED_SUB_ROUTES, PUBLIC_ROUTES, ROOT } from '@/lib/routes';
import { NextResponse } from 'next/server';

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
// todo: repeated check
export default auth((req) => {
	const reqUrl = new URL(req.url);
	const { nextUrl } = req;
	const isPublicRoute =
		(PUBLIC_ROUTES.find((route) => nextUrl.pathname.startsWith(route)) ||
			nextUrl.pathname === ROOT) &&
		!PROTECTED_SUB_ROUTES.find((route) => nextUrl.pathname.includes(route));

	if (!req.auth && req.nextUrl.pathname !== '/login' && !isPublicRoute) {
		return NextResponse.redirect(
			new URL(
				`${BASE_PATH}/?callbackUrl=${encodeURIComponent(reqUrl?.pathname)}`,
				req.url
			)
		);
	}
});
