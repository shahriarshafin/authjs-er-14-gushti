'use client';
import type { Session } from 'next-auth';

const ProfileClient = ({ session }: { session: Session | null }) => {
	return (
		<div>
			<h2 className='w-full bg-red-300'>Client Comp</h2>
			<h1>{JSON.stringify(session, null, 2)}</h1>
		</div>
	);
};

export default ProfileClient;
