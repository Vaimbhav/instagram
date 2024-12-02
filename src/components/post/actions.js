import {useState, useContext} from 'react';
import PropTypes from 'prop-types';
import FirebaseContext from '../../context/firebase';
import UserContext from '../../context/user';
import {
	doc,
	updateDoc,
	arrayRemove,
	arrayUnion,
	getFirestore,
} from 'firebase/firestore'; // Firebase v11+ imports

export default function Actions({docId, totalLikes, likedPhoto, handleFocus}) {
	const {user} = useContext(UserContext); // Access the user context
	const userId = user?.uid || ''; // Safely access userId, default to an empty string if user is null

	const [toggleLiked, setToggleLiked] = useState(likedPhoto);
	const [likes, setLikes] = useState(totalLikes);
	const {firebase} = useContext(FirebaseContext);

	// Get the Firestore instance using the modular approach
	const db = getFirestore(firebase);

	// Handle the like/unlike functionality
	const handleToggleLiked = async () => {
		if (!userId) {
			console.error('User not logged in. Cannot like/unlike.');
			return; // Prevent further execution if user is not logged in
		}

		setToggleLiked((prevState) => !prevState);

		try {
			// Firestore reference to the photo document
			const photoRef = doc(db, 'photos', docId);

			// Update the likes field in the document
			await updateDoc(photoRef, {
				likes: toggleLiked ? arrayRemove(userId) : arrayUnion(userId),
			});

			// Update the local like count
			setLikes((prevLikes) =>
				toggleLiked ? prevLikes - 1 : prevLikes + 1
			);
		} catch (error) {
			console.error('Error updating likes:', error);
		}
	};

	return (
		<>
			<div className="flex justify-between p-4">
				<div className="flex">
					{/* Like Button */}
					<svg
						onClick={handleToggleLiked}
						onKeyDown={(event) => {
							if (event.key === 'Enter') {
								handleToggleLiked();
							}
						}}
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						tabIndex={0}
						className={`w-8 mr-4 select-none cursor-pointer focus:outline-none ${
							toggleLiked
								? 'fill-red text-red-primary'
								: 'text-black-light'
						}`}
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
						/>
					</svg>

					{/* Comment Button */}
					<svg
						onClick={handleFocus}
						onKeyDown={(event) => {
							if (event.key === 'Enter') {
								handleFocus();
							}
						}}
						className="w-8 text-black-light select-none cursor-pointer focus:outline-none"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						tabIndex={0}
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
						/>
					</svg>
				</div>
			</div>

			<div className="p-4 py-0">
				{/* Likes Text */}
				<p className="font-bold">
					{likes === 1 ? `${likes} like` : `${likes} likes`}
				</p>
			</div>
		</>
	);
}

Actions.propTypes = {
	docId: PropTypes.string.isRequired,
	totalLikes: PropTypes.number.isRequired,
	likedPhoto: PropTypes.bool.isRequired,
	handleFocus: PropTypes.func.isRequired,
};
