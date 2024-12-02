import {useState, useContext} from 'react';
import PropTypes from 'prop-types';
import FirebaseContext from '../../context/firebase';
import UserContext from '../../context/user';
import {doc, updateDoc, arrayUnion, getFirestore} from 'firebase/firestore'; // Modular Firestore SDK

export default function AddComment({
	docId,
	comments,
	setComments,
	commentInput,
}) {
	const [comment, setComment] = useState('');
	const {firebase} = useContext(FirebaseContext); // Firebase instance from context
	const {user} = useContext(UserContext); // Current user info from context

	// Ensure that the user is available before accessing their displayName
	const displayName = user?.displayName;

	if (!user) {
		// If there is no user, prevent commenting
		return <p>You need to be logged in to add a comment.</p>;
	}

	const db = getFirestore(firebase); // Get Firestore instance

	const handleSubmitComment = async (event) => {
		event.preventDefault();

		if (!comment.trim()) return;

		// Update local state with the new comment
		setComments([...comments, {displayName, comment}]);
		setComment('');

		// Reference to the Firestore document
		const photoRef = doc(db, 'photos', docId);

		// Update the comments field in Firestore
		await updateDoc(photoRef, {
			comments: arrayUnion({displayName, comment}),
		});
	};

	return (
		<div className="border-t border-gray-primary">
			<form
				className="flex justify-between pl-0 pr-5"
				method="POST"
				onSubmit={(event) =>
					comment.length >= 1
						? handleSubmitComment(event)
						: event.preventDefault()
				}
			>
				<input
					aria-label="Add a comment"
					autoComplete="off"
					className="text-sm text-gray-base w-full mr-3 py-5 px-4"
					type="text"
					name="add-comment"
					placeholder="Add a comment..."
					value={comment}
					onChange={({target}) => setComment(target.value)}
					ref={commentInput}
				/>
				<button
					className={`text-sm font-bold text-blue-medium ${!comment && 'opacity-25'}`}
					type="button"
					disabled={comment.length < 1}
					onClick={handleSubmitComment}
				>
					Post
				</button>
			</form>
		</div>
	);
}

AddComment.propTypes = {
	docId: PropTypes.string.isRequired, // Firestore document ID
	comments: PropTypes.array.isRequired, // Current comments array
	setComments: PropTypes.func.isRequired, // State setter for comments
	commentInput: PropTypes.object, // Ref for input field
};
