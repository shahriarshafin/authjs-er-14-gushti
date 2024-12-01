import { auth } from '@/auth';
import ProfileClient from '@/components/profile.client';
import SignInButton from '@/components/signin-button';
import SignOutButton from '@/components/signout-button';

export default async function Home() {
	const session = await auth();
	const user = session?.user;

	// Define routes with required permissions
	const routes = [
		{
			title: 'Home',
			path: '/',
			permissions: ['view:dashboard'],
		},
		{
			title: 'About',
			path: '/about',
			permissions: ['view:about'],
		},
		{
			title: 'Contact',
			path: '/contact',
			permissions: ['view:contact'],
		},
	];

	// Filter accessible routes based on user permissions
	const accessibleRoutes = user
		? routes.filter((route) =>
				route.permissions.some((permission) =>
					user.permissions?.includes(permission)
				)
		  )
		: [];

	return (
		<main>
			{/* Debugging session details */}
			<pre>{JSON.stringify(session, null, 2)}</pre>

			{/* Authentication buttons */}
			{!session ? <SignInButton /> : <SignOutButton />}

			{/* Render accessible routes */}
			{user && (
				<div>
					<h2>Accessible Routes:</h2>
					<ul>
						{accessibleRoutes.map((route) => (
							<li key={route.path}>
								<a href={route.path}>{route.title}</a>
							</li>
						))}
					</ul>

					{/* Demonstrate specific permission checks */}
					{user.permissions?.includes('view:comments') && (
						<p>Has permission to view comments</p>
					)}
					{user.permissions?.includes('create:comments') && (
						<p>Has permission to create comments</p>
					)}
				</div>
			)}

			{/* Profile client component */}
			<ProfileClient session={session} />
		</main>
	);
}
