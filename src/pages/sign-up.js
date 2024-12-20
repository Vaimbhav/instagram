import React, {useState, useContext, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom'; // useNavigate hook from React Router v6
import FirebaseContext from '../context/firebase';
import * as ROUTES from '../constants/routes';
import {
	getAuth,
	createUserWithEmailAndPassword,
	updateProfile,
} from 'firebase/auth'; // Import from firebase/auth
import {getFirestore, collection, addDoc} from 'firebase/firestore'; // Import Firestore methods from firebase/firestore
import {doesUsernameExist} from '../services/firebase';

const Signup = () => {
	const navigate = useNavigate(); // useNavigate hook for navigation in React Router v6
	const {firebase} = useContext(FirebaseContext);

	const [username, setUsername] = useState('');
	const [fullName, setfullName] = useState('');
	const [emailAddress, setEmailAddress] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const isInvalid = password === '' || emailAddress === '';

	const handleSignUp = async (event) => {
		event.preventDefault();

		// Check if the username already exists
		const usernameExists = await doesUsernameExist(username);
		if (usernameExists) {
			setUsername('');
			setError('That username is already taken, Please try another');
			return;
		}

		try {
			// Get auth instance from Firebase
			const auth = getAuth(firebase);

			// Create a user with email and password
			const createdUserResult = await createUserWithEmailAndPassword(
				auth,
				emailAddress,
				password
			);

			// Update user profile with the username
			await updateProfile(createdUserResult.user, {
				displayName: username,
			});

			// Initialize Firestore
			const firestore = getFirestore(firebase);

			// Add user to Firestore users collection
			await addDoc(collection(firestore, 'users'), {
				userId: createdUserResult.user.uid,
				username: username.toLowerCase(),
				fullName,
				emailAddress: emailAddress.toLowerCase(),
				following: [],
				followers: [],
				dateCreated: Date.now(),
			});

			// Redirect to dashboard
			navigate(ROUTES.DASHBOARD); // Use navigate() to change routes in React Router v6
		} catch (error) {
			setfullName('');
			setEmailAddress('');
			setPassword('');
			setError(error.message); // Show error message if any exception occurs
		}
	};

	useEffect(() => {
		document.title = 'Sign Up - Instagram';
	}, []);

	return (
		<div className="container flex mx-auto max-w-screen-md items-center h-screen">
			<div className="flex w-3/5 ">
				<img
					src="/images/iphone-with-profile.jpg"
					alt="I-Phone with Instagram app"
				/>
			</div>
			<div className="flex flex-col w-2/5">
				<div className="flex flex-col items-center bg-white p-4 border border-gray-primary mb-4">
					<h1 className="flex justify-center w-full">
						<img
							src="/images/logo.png"
							alt="Instagram"
							className="mt-2 w-6/12 mb-4"
						/>
					</h1>
					{error && (
						<p className="mb-4 text-xs text-red-primary">{error}</p>
					)}

					<form onSubmit={handleSignUp} method="POST">
						<input
							aria-label="Enter your username"
							type="text"
							placeholder="Username"
							className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
							onChange={({target}) => setUsername(target.value)}
							value={username}
						/>

						<input
							aria-label="Enter your full name"
							type="text"
							placeholder="Full name"
							className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
							onChange={({target}) => setfullName(target.value)}
							value={fullName}
						/>

						<input
							aria-label="Enter your email address"
							type="text"
							placeholder="Email Address"
							className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
							onChange={({target}) =>
								setEmailAddress(target.value)
							}
							value={emailAddress}
						/>

						<input
							aria-label="Enter your Password"
							type="password"
							placeholder="Password"
							className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
							onChange={({target}) => setPassword(target.value)}
							value={password}
						/>

						<button
							disabled={isInvalid}
							type="submit"
							className={`bg-blue-medium text-white w-full rounded h-8 font-bold ${isInvalid && 'opacity-50'}`}
						>
							Signup
						</button>
					</form>
				</div>
				<div className="flex justify-center items-center flex-col w-full bg-white p-4 border border-gray-primary">
					<p className="text-sm">
						{' '}
						Have an account?{' '}
						<Link
							to={ROUTES.LOGIN}
							className="font-bold text-blue-medium"
						>
							Login
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Signup;
