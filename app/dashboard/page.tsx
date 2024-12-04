import { auth } from '@/auth';

export default async function Dashboard() {
	const session = await auth();
	const user = session?.user;

	const routes = [
		{
			title: 'Analytics',
			path: '/analytics',
			permissions: ['view:analytics'],
		},
		{
			title: 'User List',
			path: '/users',
			permissions: ['view:users'],
		},
		{
			title: 'Events',
			path: '/Events',
			permissions: ['view:events'],
		},
		{
			title: 'Tickets',
			path: '/tickets',
			permissions: ['view:tickets'],
		},
	];

	// // Filter accessible routes based on user permissions
	// const accessibleRoutes = user
	// 	? routes.filter((route) =>
	// 			route.permissions.some((permission) =>
	// 				user.permissions?.includes(permission)
	// 			)
	// 	  )
	// 	: [];
	return (
		<>
			<h1 className='text-lg py-4'>Accessible Routes based on permission:</h1>

			{/* <ul>
				{accessibleRoutes.map((route) => (
					<li key={route.path}>
						<a href={route.path}>{route.title}</a>
					</li>
				))}
			</ul> */}
			<ul className='space-y-3'>
				{routes.map((route) => (
					<li key={route.path}>
						<a
							href={route.path}
							className={`font-medium ${
								route.permissions.some((permission) =>
									user?.permissions?.includes(permission)
								)
									? 'text-blue-800'
									: 'text-gray-800'
							}`}
						>
							{route.title}

							{route.permissions.some((permission) =>
								user?.permissions?.includes(permission)
							)
								? ' ✅'
								: ' ❌'}
						</a>
					</li>
				))}
			</ul>
		</>
	);
}
