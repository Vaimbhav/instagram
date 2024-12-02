// import React, {lazy, Suspense} from 'react';
// import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
// import * as ROUTES from './constants/routes';
// import UserContext from './context/user';
// import useAuthListener from './hooks/use-auth-listener';
// import ProtectedRoute from './helpers/protected-route';
// import IsUserLoggedIn from './helpers/is-user-logged-in';

// const Login = lazy(() => import('./pages/login'));
// const Signup = lazy(() => import('./pages/sign-up'));
// const Dashboard = lazy(() => import('./pages/dashboard'));
// const NotFound = lazy(() => import('./pages/not-found'));
// const Profile = lazy(() => import('./pages/profile'));

// const App = () => {
// 	const {user} = useAuthListener();

// 	return (
// 		<UserContext.Provider value={{user}}>
// 			<Router>
// 				<Suspense fallback={<p>Loading...</p>}>
// 					<Routes>
// 						<Route
// 							path={ROUTES.LOGIN}
// 							element={
// 								<IsUserLoggedIn
// 									user={user}
// 									loggedInPath={ROUTES.DASHBOARD}
// 								>
// 									<Login />
// 								</IsUserLoggedIn>
// 							}
// 						/>
// 						<Route
// 							path={ROUTES.SIGN_UP}
// 							element={
// 								<IsUserLoggedIn
// 									user={user}
// 									loggedInPath={ROUTES.DASHBOARD}
// 								>
// 									<Signup />
// 								</IsUserLoggedIn>
// 							}
// 						/>
// 						<Route path={ROUTES.PROFILE} element={<Profile />} />
// 						<Route
// 							path={ROUTES.DASHBOARD}
// 							element={
// 								<ProtectedRoute user={user}>
// 									<Dashboard />
// 								</ProtectedRoute>
// 							}
// 						/>
// 						<Route element={<Login />} />
// 					</Routes>
// 				</Suspense>
// 			</Router>
// 		</UserContext.Provider>
// 	);
// };

// export default App;

import React, {lazy, Suspense} from 'react';
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from 'react-router-dom';
import * as ROUTES from './constants/routes';
import UserContext from './context/user';
import useAuthListener from './hooks/use-auth-listener';
import ProtectedRoute from './helpers/protected-route';
import IsUserLoggedIn from './helpers/is-user-logged-in';
import {DotLoader} from 'react-spinners';

const Login = lazy(() => import('./pages/login'));
const Signup = lazy(() => import('./pages/sign-up'));
const Dashboard = lazy(() => import('./pages/dashboard'));
const NotFound = lazy(() => import('./pages/not-found'));
const Profile = lazy(() => import('./pages/profile'));

const App = () => {
	const {user, loading} = useAuthListener(); // Get the loading state

	// If loading is true, show a loading screen or spinner
	if (loading) {
		return <DotLoader />;
	}

	return (
		<UserContext.Provider value={{user}}>
			<Router>
				<Suspense fallback={<DotLoader />}>
					<Routes>
						<Route
							path={ROUTES.LOGIN}
							element={
								<IsUserLoggedIn
									user={user}
									loggedInPath={ROUTES.DASHBOARD}
								>
									<Login />
								</IsUserLoggedIn>
							}
						/>
						<Route
							path={ROUTES.SIGN_UP}
							element={
								<IsUserLoggedIn
									user={user}
									loggedInPath={ROUTES.DASHBOARD}
								>
									<Signup />
								</IsUserLoggedIn>
							}
						/>
						<Route
							path={ROUTES.PROFILE}
							element={
								user ? (
									<Profile />
								) : (
									<Navigate to={ROUTES.LOGIN} />
								)
							}
						/>
						<Route
							path={ROUTES.DASHBOARD}
							element={
								user ? (
									<ProtectedRoute user={user}>
										<Dashboard />
									</ProtectedRoute>
								) : (
									<Navigate to={ROUTES.LOGIN} />
								)
							}
						/>
						<Route path="*" element={<NotFound />} />
					</Routes>
				</Suspense>
			</Router>
		</UserContext.Provider>
	);
};

export default App;
