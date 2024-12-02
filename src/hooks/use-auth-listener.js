import {useState, useEffect, useContext} from 'react';
import {getAuth, onAuthStateChanged} from 'firebase/auth'; // Import from firebase/auth
import FirebaseContext from '../context/firebase';

const useAuthListener = () => {
	const [user, setUser] = useState(
		JSON.parse(localStorage.getItem('authUser'))
	);
	const {firebase} = useContext(FirebaseContext);

	useEffect(() => {
		const auth = getAuth(firebase); // Get auth instance from firebase
		const listener = onAuthStateChanged(auth, (authUser) => {
			if (authUser) {
				// Store user in localStorage
				localStorage.setItem('authUser', JSON.stringify(authUser));
				setUser(authUser);
			} else {
				// Remove user from localStorage if not authenticated
				localStorage.removeItem('authUser');
				setUser(null);
			}
		});

		// Cleanup listener on component unmount
		return () => listener();
	}, [firebase]);

	return {user};
};

export default useAuthListener;
