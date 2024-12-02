import {
	getFirestore,
	collection,
	query,
	where,
	getDocs,
	limit,
	doc,
	updateDoc,
	arrayUnion,
	arrayRemove,
} from 'firebase/firestore';
import {firebase} from '../lib/firebase';

export async function getUserByUsername(username) {
	const firestore = getFirestore(firebase);
	const usersRef = collection(firestore, 'users');
	const q = query(usersRef, where('username', '==', username.toLowerCase()));
	const result = await getDocs(q);

	return result.docs.map((item) => ({
		...item.data(),
		docId: item.id,
	}));
}

// Function to check if a username exists
export async function doesUsernameExist(username) {
	const firestore = getFirestore(firebase);
	const usersCollectionRef = collection(firestore, 'users');
	const usernameQuery = query(
		usersCollectionRef,
		where('username', '==', username)
	);
	const querySnapshot = await getDocs(usernameQuery);
	return !querySnapshot.empty;
}

// Function to get user by userId
export async function getUserByUserId(userId) {
	const firestore = getFirestore(firebase);
	const usersCollectionRef = collection(firestore, 'users');
	const userIdQuery = query(
		usersCollectionRef,
		where('userId', '==', userId)
	);
	const querySnapshot = await getDocs(userIdQuery);

	if (!querySnapshot.empty) {
		const userDoc = querySnapshot.docs[0];
		return {
			...userDoc.data(),
			docId: userDoc.id,
		};
	}

	return null;
}

// Function to get suggested profiles
export async function getSuggestedProfiles(userId, following) {
	const firestore = getFirestore(firebase);
	const usersCollectionRef = collection(firestore, 'users');
	const suggestedProfilesQuery = query(usersCollectionRef, limit(10));
	const querySnapshot = await getDocs(suggestedProfilesQuery);

	return querySnapshot.docs
		.map((userDoc) => ({
			...userDoc.data(),
			docId: userDoc.id,
		}))
		.filter(
			(profile) =>
				profile.userId !== userId && !following.includes(profile.userId)
		);
}

// Function to update the following list of the logged-in user
export async function updateLoggedInUserFollowing(
	loggedInUserDocId,
	profileId,
	isFollowingProfile
) {
	const firestore = getFirestore(firebase);
	const userDocRef = doc(firestore, 'users', loggedInUserDocId);

	await updateDoc(userDocRef, {
		following: isFollowingProfile
			? arrayRemove(profileId)
			: arrayUnion(profileId),
	});
}

// Function to update the followers list of the followed user
export async function updateFollowedUserFollowers(
	profileDocId,
	loggedInUserDocId,
	isFollowingProfile
) {
	const firestore = getFirestore(firebase);
	const profileDocRef = doc(firestore, 'users', profileDocId);

	await updateDoc(profileDocRef, {
		followers: isFollowingProfile
			? arrayRemove(loggedInUserDocId)
			: arrayUnion(loggedInUserDocId),
	});
}

// Function to get photos from followed users
export async function getPhotos(userId, following) {
	const db = getFirestore(firebase);

	// Reference to 'photos' collection
	const photosRef = collection(db, 'photos');

	// Create a query to get photos where userId is in the following array
	const q = query(photosRef, where('userId', 'in', following));

	// Get the query result
	const result = await getDocs(q);

	// Map the result docs to get the photo data
	const userFollowedPhotos = result.docs.map((photo) => ({
		...photo.data(),
		docId: photo.id,
	}));

	// console.log('user followed photos->', userFollowedPhotos);

	// Fetch user details for each followed photo and check if the current user liked it
	const photosWithUserDetails = await Promise.all(
		userFollowedPhotos.map(async (photo) => {
			// Check if the current user liked the photo
			const userLikedPhoto = photo.likes.includes(userId);

			// Get user details based on userId
			const user = await getUserByUserId(photo.userId);
			// console.log('user name is -> ', user);
			// Extract the username from the user object (safe destructuring with fallback)
			const username = user.username || 'Unknown User';

			// Return the photo data along with the username and userLikedPhoto flag
			return {username, ...photo, userLikedPhoto};
		})
	);

	return photosWithUserDetails;
}

export async function getUserPhotosByUserId(userId) {
	const firestore = getFirestore(firebase);
	const photosCollectionRef = collection(firestore, 'photos');
	const photosQuery = query(
		photosCollectionRef,
		where('userId', '==', userId)
	);
	const querySnapshot = await getDocs(photosQuery);

	return querySnapshot.docs.map((photo) => ({
		...photo.data(),
		docId: photo.id,
	}));
}

// Function to check if the logged-in user follows a profile
export async function isUserFollowingProfile(
	loggedInUserUsername,
	profileUserId
) {
	const firestore = getFirestore(firebase);
	const usersCollectionRef = collection(firestore, 'users');
	const followingQuery = query(
		usersCollectionRef,
		where('username', '==', loggedInUserUsername),
		where('following', 'array-contains', profileUserId)
	);
	const querySnapshot = await getDocs(followingQuery);

	if (!querySnapshot.empty) {
		const [response] = querySnapshot.docs.map((doc) => ({
			...doc.data(),
			docId: doc.id,
		}));
		return response?.userId || null;
	}

	return null;
}

// Function to toggle follow/unfollow for a user
export async function toggleFollow(
	isFollowingProfile,
	activeUserDocId,
	profileDocId,
	profileUserId,
	followingUserId
) {
	await updateLoggedInUserFollowing(
		activeUserDocId,
		profileUserId,
		isFollowingProfile
	);

	await updateFollowedUserFollowers(
		profileDocId,
		followingUserId,
		isFollowingProfile
	);
}
