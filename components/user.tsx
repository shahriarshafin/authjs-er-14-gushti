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
		<div className='bg-green-100'>
			<h1>{JSON.stringify(profile)}</h1>
		</div>
	);
};

export default User;
