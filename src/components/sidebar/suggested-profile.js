import {useState} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {
	updateLoggedInUserFollowing,
	updateFollowedUserFollowers,
} from '../../services/firebase';
import {DEFAULT_IMAGE_PATH} from '../../constants/paths';

export default function SuggestedProfile({
	profileDocId,
	username,
	profileId,
	userId,
	loggedInUserDocId,
}) {
	const [followed, setFollowed] = useState(false);
	async function handleFollowUser() {
		setFollowed(true);
		await updateLoggedInUserFollowing(loggedInUserDocId, profileId, false);
		await updateFollowedUserFollowers(profileDocId, userId, false);
	}

	return !followed ? (
		<div className="flex flex-row items-center align-items justify-between">
			<div className="flex items-center justify-between">
				<img
					className="rounded-full h-8 w-8 flex"
					src={`/images/avatars/${username}.jpg`}
					alt={`${username}'s avatar`}
					onError={(e) => {
						e.target.src = DEFAULT_IMAGE_PATH;
					}}
				/>
				<Link to={`/p/${username}`}>
					<p className="px-2 font-bold text-sm">{username}</p>
				</Link>
			</div>
			<button
				className="text-xs font-bold text-blue-medium"
				type="button"
				onClick={handleFollowUser}
			>
				Follow
			</button>
		</div>
	) : null;
}

SuggestedProfile.propTypes = {
	profileDocId: PropTypes.string.isRequired,
	username: PropTypes.string.isRequired,
	profileId: PropTypes.string.isRequired,
	userId: PropTypes.string.isRequired,
	loggedInUserDocId: PropTypes.string.isRequired,
};
