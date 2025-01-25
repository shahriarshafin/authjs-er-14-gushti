import { auth, BASE_PATH } from '@/auth';
import { PROTECTED_ROUTES, PUBLIC_ROUTES } from '@/lib/routes';
import { NextResponse } from 'next/server';

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

export default auth((req) => {
	const reqUrl = new URL(req.url);
	const { nextUrl } = req;

	const isPublicRoute =
		PUBLIC_ROUTES.find((route) => nextUrl.pathname.startsWith(route)) &&
		!PROTECTED_ROUTES.find((route) => nextUrl.pathname.includes(route));

	if (!req.auth && !isPublicRoute) {
		return NextResponse.redirect(
			new URL(
				`${BASE_PATH}/?callbackUrl=${encodeURIComponent(reqUrl?.pathname)}`,
				req.url
			)
		);
	}
});
