// protected route
import { auth } from '@/auth';
import ProfileClient from '@/components/profile.client';
import User from '@/components/user';

export default async function Profile() {
	const session = await auth();

	return (
		<main>
			<User />

			<div className='border bg-green-300'>
				<h2 className='text-lg'>Session - Server Component </h2>
				<pre>{JSON.stringify(session, null, 2)}</pre>
			</div>

			<ProfileClient session={session} />
		</main>
	);
}
