import Link from 'next/link';
import SignOutButton from './signout-button';
const Navbar = () => {
	return (
		<>
			<nav className='bg-gray-800 flex items-center justify-between p-3'>
				<Link className='text-white hover:underline' href='/'>
					Home
				</Link>
				<Link className='text-white hover:underline' href='/profile'>
					Profile (🔐)
				</Link>
				<Link className='text-white hover:underline' href='/contact'>
					Contact
				</Link>
				<Link className='text-white hover:underline' href='/dashboard'>
					Dashboard (🔐+👥)
				</Link>
				<SignOutButton />
			</nav>
		</>
	);
};

export default Navbar;
