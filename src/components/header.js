import {useContext, useEffect, useState} from 'react';
import FirebaseContext from '../context/firebase';
import UserContext from '../context/user';
import {Link} from 'react-router-dom';
import * as ROUTES from '../constants/routes';
import {getAuth, signOut} from 'firebase/auth'; // Import the necessary functions from Firebase v9+
import {getUserByUserId} from '../services/firebase';

const Header = () => {
	const {firebase} = useContext(FirebaseContext); // Firebase context with initialized app
	const {user} = useContext(UserContext); // User context to track the logged-in user

	const [username, setUserName] = useState(null);

	useEffect(() => {
		const fetchUserName = async () => {
			if (user?.uid) {
				try {
					const userData = await getUserByUserId(user.uid);
					const username = userData?.username || 'Unknown'; // Safely access username
					setUserName(username);
				} catch (error) {
					console.error('Error fetching user data:', error);
					setUserName('Unknown'); // Fallback in case of an error
				}
			}
		};

		fetchUserName();
	}, [user]);

	const handleSignOut = async () => {
		const auth = getAuth(firebase); // Get the auth instance using getAuth
		await signOut(auth); // Use the signOut function from Firebase v9+ modular SDK
	};

	return (
		<header className="pt-3 h-16 bg-white border-b border-gray-primary mb-8">
			<div className="container mx-auto max-w-screen-lg">
				<div className="flex justify-between h-full">
					<div className="text-gray-700 text-center flex items-center align-items cursor-pointer">
						<h1 className="flex justify-center w-full">
							<Link
								to={ROUTES.DASHBOARD}
								aria-label="Instagram Logo"
							>
								<img
									src="/images/logo.png"
									alt="Instagram"
									className="mt-2 w-6/12"
								/>
							</Link>
						</h1>
					</div>

					<div className="text-gray-700 text-center flex items-center align-items">
						{user ? (
							<>
								<Link
									to={ROUTES.DASHBOARD}
									aria-label="Dashboard"
								>
									<svg
										className="w-8 mr-6 text-black-light cursor-pointer"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
										/>
									</svg>
								</Link>

								<button
									type="button"
									title="Sign Out"
									onClick={handleSignOut} // Call handleSignOut when the button is clicked
									onKeyDown={(event) => {
										if (event.key === 'Enter') {
											handleSignOut();
										}
									}}
								>
									<svg
										className="w-8 mr-6 text-black-light cursor-pointer"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
										/>
									</svg>
								</button>

								<div className="flex items-center cursor-pointer">
									<Link to={`/p/${username}`}>
										<img
											className="rounded-full h-8 w-8 flex"
											src={`/images/avatars/${username}.jpg`}
											alt={`${username} profile`}
											onError={(e) => {
												e.target.src =
													'/images/avatars/default.jpg';
											}}
										/>
									</Link>
								</div>
							</>
						) : (
							<>
								<Link to={ROUTES.LOGIN}>
									<button
										type="button"
										className="bg-blue-medium font-bold text-sm rounded text-white w-20 h-8"
									>
										Log In
									</button>
								</Link>
								<Link to={ROUTES.SIGN_UP}>
									<button
										type="button"
										className="font-bold text-sm rounded text-blue-medium w-20 h-8"
									>
										Sign Up
									</button>
								</Link>
							</>
						)}
					</div>
				</div>
			</div>
		</header>
	);
};

export default Header;
