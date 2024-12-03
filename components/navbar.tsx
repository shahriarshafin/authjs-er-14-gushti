import Link from 'next/link';
const Navbar = () => {
	return (
		<>
			<nav className='bg-gray-800'>
				<Link className='text-white p-3 hover:underline' href='/'>
					Home
				</Link>
				<Link className='text-white p-3 hover:underline' href='/about'>
					About (🔐)
				</Link>
				<Link className='text-white p-3 hover:underline' href='/contact'>
					Contact
				</Link>
			</nav>
		</>
	);
};

export default Navbar;
