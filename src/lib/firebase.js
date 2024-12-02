import {initializeApp} from 'firebase/app';
import {getFirestore, FieldValue} from 'firebase/firestore'; // Using modular SDK
import {getAuth} from 'firebase/auth';
// import {seedDatabase} from '../seed';

// Firebase configuration
const config = {
	apiKey: 'AIzaSyAj56J8b784Fa329_RHcp8Je1r7zg4dQhI',
	authDomain: 'instagram-9787b.firebaseapp.com',
	projectId: 'instagram-9787b',
	storageBucket: 'instagram-9787b.firebasestorage.app',
	messagingSenderId: '572721319765',
	appId: '1:572721319765:web:294cb22f9e472a74e8a9dc',
};

// Initialize Firebase App
const firebase = initializeApp(config);

// Initialize Firestore & Auth
const firestore = getFirestore(firebase); // Correct way to initialize Firestore
const auth = getAuth(firebase);

// Call seedDatabase function
// Pass firestore instance to seedDatabase
// seedDatabase(firestore);

// Export initialized services
export {firebase, firestore, auth, FieldValue};
