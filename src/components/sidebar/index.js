import React from 'react';
import useUser from '../../hooks/use-user';
import User from './user';
import Suggestions from './suggestions';

const Sidebar = () => {
	// Use the custom hook to get the user object
	const {user} = useUser();
	// console.log('user is ->>>', user);

	// If there's no user data yet, handle it gracefully
	if (!user) {
		return <div className="p-4">Loading...</div>;
	}

	// Destructure the user object only if it exists
	const {docId, fullName = '', username = '', userId, following} = user || {};

	return (
		<div className="p-4">
			<User username={username} fullName={fullName} />
			{/* Ensure correct prop name */}
			<Suggestions
				userId={userId}
				following={following}
				loggedInUserDocId={docId}
			/>
		</div>
	);
};

export default Sidebar;
