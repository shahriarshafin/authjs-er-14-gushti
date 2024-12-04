'use client';
import type { Session } from 'next-auth';

const ProfileClient = ({ session }: { session: Session | null }) => {
	return (
		<div className='border bg-orange-300'>
			<h2 className='text-lg'>Session - Client Component </h2>
			<pre>{JSON.stringify(session)}</pre>
		</div>
	);
};

export default ProfileClient;
