import { BASE_URL } from '@/lib/constants';
import NextAuth from 'next-auth';
import 'next-auth/jwt';
import Credentials from 'next-auth/providers/credentials';
import GitHub from 'next-auth/providers/github';

export const BASE_PATH = '/api/auth';

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

export const { handlers, auth, signIn, signOut } = NextAuth({
	basePath: BASE_PATH,
	session: {
		strategy: 'jwt',
	},
	providers: [
		Credentials({
			credentials: {
				email: {
					label: 'Email',
					type: 'email',
					value: 'admin@wanderwomanbd.com',
					required: true,
				},
				password: {
					label: 'Password',
					type: 'password',
					value: 'sadman3500!',
					required: true,
				},
			},
			async authorize(credentials) {
				if (!credentials) return null;

				const response = await fetch(`${BASE_URL}/users/auth/login`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						email: credentials.email,
						password: credentials.password,
						credentials: 'include',
					}),
				});

				const data = await response.json();

				const user = data.responseObject.user;
				const accessToken = data.responseObject.token;
				const refreshToken = data.responseObject.user.passwordResetToken;
				return user
					? {
							id: user.id,
							name: user.name,
							email: user.email,
							image: user.profilePic,
							role: user.role,
							permissions: ['view:dashboard', 'view:about', 'view:contact'],
							accessToken,
							refreshToken,
					  }
					: null;
			},
		}),
		GitHub,
	],
	callbacks: {
		authorized: async ({ auth }) => {
			return !!auth;
		},
		jwt: async ({ token, user }) => {
			if (user) {
				return {
					...token,
					accessToken: user.accessToken,
					refreshToken: user.refreshToken,
					user,
				};
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
		// signIn: '/login',
	},
	// secret: process.env.NEXTAUTH_SECRET,
});
