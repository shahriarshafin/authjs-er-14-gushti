import { BASE_URL } from '@/lib/constants';

import NextAuth from 'next-auth';
import { JWT } from 'next-auth/jwt';
import Credentials from 'next-auth/providers/credentials';
// import Google from 'next-auth/providers/google';

export const BASE_PATH = '/login';

declare module 'next-auth' {
	interface User {
		accessToken?: string;
		refreshToken?: string;
		role?: string;
		permissions?: string[];
	}
}
declare module 'next-auth' {
	interface Session {
		accessToken?: string;
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		accessToken?: string;
	}
}

interface Token {
	accessToken?: string;
	refreshToken?: string;
	error?: string;
}

async function refreshAccessToken(token: Token): Promise<Token> {
	try {
		const response = await fetch(`${BASE_URL}/api/auth/refresh`, {
			// todo perform get request
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token.refreshToken}`,
			},
		});
		const data = await response.json();
		const tokens = data.data;

		if (!response.ok) {
			throw tokens;
		}

		return {
			...token,
			accessToken: tokens.accessToken,
			refreshToken: tokens.refreshToken ?? token.refreshToken, // Fall back to old refresh token
		};
	} catch (error) {
		console.log(error);

		return {
			...token,
			error: 'RefreshAccessTokenError',
		};
	}
}

export const { handlers, auth, signIn, signOut } = NextAuth({
	basePath: BASE_PATH,
	session: {
		strategy: 'jwt',
		maxAge: 30 * 24 * 60 * 60, // 30 days // todo: sync with backend token expiration
	},
	providers: [
		Credentials({
			credentials: {
				email: {
					label: 'Email',
					type: 'email',
					value: 'user@example.com',
					required: true,
				},
				password: {
					label: 'Password',
					type: 'password',
					value: 'password123',
					required: true,
				},
			},
			async authorize(credentials) {
				if (!credentials) return null;

				try {
					const response = await fetch(`${BASE_URL}/api/auth/login`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							email: credentials.email,
							password: credentials.password,
							credentials: 'include', // for cookies
						}),
					});
					if (!response.ok) {
						return null; // Authentication failed
					}
					const res = await response.json();

					const user = res.data.user;
					const accessToken = res.data.accessToken;
					const refreshToken = res.data.refreshToken;
					return user
						? {
								id: user.id,
								name: user.name,
								email: user.email,
								image: user.image,
								role: user.role,
								permissions: user.permissions,
								accessToken,
								refreshToken,
						  }
						: null;
				} catch (error) {
					console.error('Authentication error:', error);
					return null;
				}
			},
		}),
		// Google({
		// 	clientId: process.env.GOOGLE_CLIENT_ID!,
		// 	clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		// 	// This will pass the OAuth profile to the backend
		// 	async profile(profile) {
		// 		// Send OAuth data to backend to create/link user
		// 		const response = await fetch(
		// 			'http://localhost:3000/api/auth/oauth/google',
		// 			{
		// 				method: 'POST',
		// 				headers: { 'Content-Type': 'application/json' },
		// 				body: JSON.stringify({
		// 					email: profile.email,
		// 					name: profile.name,
		// 					picture: profile.picture,
		// 					provider: 'google',
		// 					providerId: profile.sub,
		// 				}),
		// 			}
		// 		);

		// 		if (!response.ok) {
		// 			throw new Error('Failed to authenticate with backend');
		// 		}

		// 		const data = await response.json();

		// 		return {
		// 			...profile,
		// 			id: data.user.id,
		// 			accessToken: data.accessToken,
		// 			exp: data.exp,
		// 		};
		// 	},
		// }),
	],
	callbacks: {
		authorized: async ({ auth }) => {
			return !!auth;
		},
		jwt: async ({ token, user }): Promise<JWT | null> => {
			if (user) {
				return {
					...token,
					accessToken: user.accessToken,
					refreshToken: user.refreshToken,
					user,
				};
			}

			// Decode the access token to get expiration
			if (token) {
				const accessToken = token.accessToken;

				if (accessToken) {
					const decodedToken = JSON.parse(atob(accessToken.split('.')[1]));
					const isExpired = decodedToken.exp
						? Math.floor(Date.now() / 1000) >= decodedToken.exp
						: true;
					if (isExpired) {
						// Refresh the access token
						const refreshedToken = await refreshAccessToken(token);

						if (refreshedToken.error) {
							return {
								...token,
								accessToken: undefined,
								refreshToken: undefined,
							};
						}
						return {
							...token,
							accessToken: refreshedToken.accessToken,
							refreshToken: refreshedToken.refreshToken,
						};
					}
				}
			}

			return token;
		},
		session: async ({ session, token }) => {
			if (token) {
				const user = token.user as {
					id: string;
					name: string;
					email: string;
					image: string;
					role?: string;
					permissions?: string[];
				};
				session.user = {
					...session.user,
					id: user.id,
					name: user.name,
					email: user.email,
					image: user.image,
					role: user.role,
					permissions: user.permissions,
				};
				session.accessToken = token.accessToken;
			}

			return session;
		},
	},
	pages: {
		signIn: '/login',
	},
	secret: process.env.NEXTAUTH_SECRET,
});
