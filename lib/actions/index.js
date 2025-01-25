'use server';

import { signIn, signOut } from '@/auth';
import { revalidatePath } from 'next/cache';

// not used yet
export async function handleLogout() {
	await signOut({ redirectTo: '/' });
}

export async function handleCredentialLogin(formData) {
	console.log('formData', formData);

	try {
		const response = await signIn('credentials', {
			email: formData.get('email'),
			password: formData.get('password'),
			redirect: false,
		});
		revalidatePath('/');
		return response;
	} catch (err) {
		throw err;
	}
}
