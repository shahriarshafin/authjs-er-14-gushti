import { signOut } from '@/auth';

export default function SignOutButton() {
	return (
		<form
			action={async () => {
				'use server';
				await signOut();
			}}
		>
			<button type='submit' className='text-white'>
				Sign Out
			</button>
		</form>
	);
}
