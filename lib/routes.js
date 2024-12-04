export const LOGIN = '/login';
export const ROOT = '/';

export const PUBLIC_ROUTES = [
	'/login',
	'/register',
	'/api/auth/callback/google',
	// -----------------------------
	'/contact',
];
// todo: add dynamic routes /about/:id and check if it works
export const PROTECTED_SUB_ROUTES = ['/about', '/dashboard'];
