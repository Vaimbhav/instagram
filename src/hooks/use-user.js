import {useState, useEffect, useContext} from 'react';
import UserContext from '../context/user';
import {getUserByUserId} from '../services/firebase';

const useUser = () => {
	const [activeUser, setActiveUser] = useState({}); // Default to null instead of empty object
	const {user} = useContext(UserContext);

	useEffect(() => {
		async function getUserObjByUserId() {
			// Fetch the user data from Firestore
			const response = await getUserByUserId(user.uid);

			// Check if the response is valid and set the state
			if (response) {
				setActiveUser(response);
			}
		}

		if (user?.uid) {
			getUserObjByUserId();
		}
	}, [user]);

	return {user: activeUser};
};

export default useUser;
