import {useState, useEffect, useContext} from 'react';
import {getPhotos, getUserByUserId} from '../services/firebase';
import UserContext from '../context/user';

const usePhotos = () => {
	const [photos, setPhotos] = useState([]);
	const {
		user: {uid: userId = ''},
	} = useContext(UserContext);

	useEffect(() => {
		async function getTimelinePhotos() {
			const calling = await getUserByUserId(userId);
			const following = calling.following;
			let followedUserPhotos = [];
			if (following.length > 0) {
				followedUserPhotos = await getPhotos(userId, following);
			}
			followedUserPhotos.sort((a, b) => b.dateCreated > a.dateCreated);
			setPhotos(followedUserPhotos);
		}
		getTimelinePhotos();
	}, [userId]);

	return {photos};
};

export default usePhotos;
