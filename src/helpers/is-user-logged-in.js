import React from 'react';
import PropTypes from 'prop-types';
import {Navigate} from 'react-router-dom';

export default function IsUserLoggedIn({user, loggedInPath, children}) {
	return !user ? children : <Navigate to={loggedInPath} />;
}

IsUserLoggedIn.propTypes = {
	user: PropTypes.object,
	loggedInPath: PropTypes.string.isRequired,
	children: PropTypes.node.isRequired,
};
