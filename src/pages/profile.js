import {useParams, useNavigate} from 'react-router-dom';
import {useState, useEffect} from 'react';
import {getUserByUsername} from '../services/firebase';
import * as ROUTES from '../constants/routes';
import Header from '../components/header';
import UserProfile from '../components/profile';

const Profile = () => {
	const {username} = useParams();
	const [user, setUser] = useState(null);
	const navigate = useNavigate(); // Replaced useHistory with useNavigate

	useEffect(() => {
		async function checkUserExists() {
			const [user] = await getUserByUsername(username);
			if (user?.userId) {
				setUser(user);
			} else {
				navigate(ROUTES.NOT_FOUND); // Use navigate() instead of history.push()
			}
		}

		checkUserExists();
	}, [username, navigate]); // Added navigate to the dependency array

	return user?.username ? (
		<div className="bg-gray-background">
			<Header />
			<div className="mx-auto max-w-screen-lg">
				<UserProfile user={user} />
			</div>
		</div>
	) : null;
};

export default Profile;
