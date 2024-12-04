import { auth } from '@/auth';
import { BASE_URL } from '@/lib/constants';

const User = async () => {
	const session = await auth();

	const data = await fetch(`${BASE_URL}/api/users/me`, {
		headers: {
			Authorization: `Bearer ${session?.accessToken}`,
		},
	});
	const profile = await data.json();

	return (
		<div className='border bg-purple-300'>
			<h2 className='text-lg'>Fetch - Server Side</h2>
			<pre>{JSON.stringify(profile)}</pre>
		</div>
	);
};

export default User;
