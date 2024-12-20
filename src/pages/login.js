import React, {useState, useContext, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import FirebaseContext from '../context/firebase';
import * as ROUTES from '../constants/routes';
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth'; // Import the required functions from Firebase v9+

const Login = () => {
	const navigate = useNavigate();
	const {firebase} = useContext(FirebaseContext);

	const [emailAddress, setEmailAddress] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const isInvalid = password === '' || emailAddress === '';

	const handleLogin = async (event) => {
		event.preventDefault();

		try {
			const auth = getAuth(firebase); // Initialize auth using firebase instance from context
			await signInWithEmailAndPassword(auth, emailAddress, password); // Perform sign in with modular function
			navigate(ROUTES.DASHBOARD); // Redirect on successful login
		} catch (error) {
			setEmailAddress('');
			setPassword('');
			setError(error.message); // Show error message
		}
	};

	useEffect(() => {
		document.title = 'Login - Instagram';
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

					<form onSubmit={handleLogin} method="POST">
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
							Login
						</button>
					</form>
				</div>
				<div className="flex justify-center items-center flex-col w-full bg-white p-4 border border-gray-primary">
					<p className="text-sm">
						{' '}
						Don't have an account?{' '}
						<Link
							to={ROUTES.SIGN_UP}
							className="font-bold text-blue-medium"
						>
							Signup
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Login;
