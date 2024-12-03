'use server';

import { signIn, signOut } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function doLogout() {
	await signOut({ redirectTo: '/' });
}

// todo: change the name of this function
export async function doCredentialLogin(formData) {
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
