import {collection, addDoc} from 'firebase/firestore'; // Import necessary functions

export function seedDatabase(firestore) {
	const users = [
		{
			userId: '1',
			username: 'karl',
			fullName: 'Karl Hadwen',
			emailAddress: 'karlhadwen@gmail.com',
			following: ['2'],
			followers: ['2', '3', '4'],
			dateCreated: Date.now(),
		},
		{
			userId: 'xS41CDhEhIhVcLeV2UhcFPtBwyB3',
			username: 'yadav_boi',
			fullName: 'Jesus Yadav',
			emailAddress: 'test@gmail.com',
			following: ['2'],
			followers: ['2', '3', '4'],
			dateCreated: Date.now(),
		},
		{
			userId: '2',
			username: 'raphael',
			fullName: 'Raffaello Sanzio da Urbino',
			emailAddress: 'raphael@sanzio.com',
			following: ['1', 'xS41CDhEhIhVcLeV2UhcFPtBwyB3'],
			followers: ['1', 'xS41CDhEhIhVcLeV2UhcFPtBwyB3'],
			dateCreated: Date.now(),
		},
		{
			userId: '3',
			username: 'dali',
			fullName: 'Salvador Dalí',
			emailAddress: 'salvador@dali.com',
			following: ['1', 'xS41CDhEhIhVcLeV2UhcFPtBwyB3'],
			followers: ['1'],
			dateCreated: Date.now(),
		},
		{
			userId: '4',
			username: 'orwell',
			fullName: 'George Orwell',
			emailAddress: 'george@orwell.com',
			following: ['1', 'xS41CDhEhIhVcLeV2UhcFPtBwyB3'],
			followers: ['1'],
			dateCreated: Date.now(),
		},
	];

	// Add users to the "users" collection
	for (let k = 0; k < users.length; k++) {
		const usersRef = collection(firestore, 'users');
		addDoc(usersRef, users[k]);
	}

	// Add photos to the "photos" collection
	for (let i = 1; i <= 5; ++i) {
		const photosRef = collection(firestore, 'photos');
		addDoc(photosRef, {
			photoId: i,
			userId: '2',
			imageSrc: `/images/users/raphael/${i}.jpg`,
			caption: 'Saint George and the Dragon',
			likes: [],
			comments: [
				{
					displayName: 'dali',
					comment: 'Love this place, looks like my animal farm!',
				},
				{
					displayName: 'orwell',
					comment: 'Would you mind if I used this picture?',
				},
			],
			userLatitude: '40.7128°',
			userLongitude: '74.0060°',
			dateCreated: Date.now(),
		});
	}
}
