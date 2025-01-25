import type { NextAuthConfig } from 'next-auth';

import { BASE_URL } from '@/lib/constants';
import Credentials from 'next-auth/providers/credentials';
// import Google from 'next-auth/providers/google';

export default {
	providers: [
		Credentials({
			// credentials: {
			// 	email: {
			// 		label: 'Email',
			// 		type: 'email',
			// 		value: 'user@example.com',
			// 		required: true,
			// 	},
			// 	password: {
			// 		label: 'Password',
			// 		type: 'password',
			// 		value: 'password123',
			// 		required: true,
			// 	},
			// },
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
} satisfies NextAuthConfig;
