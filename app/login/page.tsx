'use client';

import { handleCredentialLogin } from '@/lib/actions/';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';

const Login = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get('callbackUrl');

	const [error, setError] = useState('');

	async function onSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		try {
			const formData = new FormData(event.currentTarget);

			const response = await handleCredentialLogin(formData);

			if (!!response.error) {
				console.error(response.error);
				setError(response.error.message);
			} else {
				if (callbackUrl) {
					router.push(callbackUrl);
				} else {
					router.push('/');
				}
			}
		} catch (e) {
			console.error(e);
			setError('Check your Credentials');
		}
	}
	return (
		<>
			<p>{error}</p>
			<form onSubmit={onSubmit}>
				<div className='my-2'>
					<label htmlFor='email'>Email</label>
					<input
						className='border mx-2 border-gray-500 rounded'
						type='email'
						name='email'
						id='email'
						defaultValue={`user@example.com`}
					/>
				</div>

				<div className='my-2'>
					<label htmlFor='password'>Pass</label>
					<input
						className='border mx-2 border-gray-500 rounded'
						type='password'
						name='password'
						id='password'
						defaultValue={`password123`}
					/>
				</div>
				<button className='bg-green-200' type='submit'>
					Login
				</button>
			</form>
		</>
	);
};

export default Login;
