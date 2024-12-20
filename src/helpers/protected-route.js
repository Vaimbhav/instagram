import React from 'react';
import PropTypes from 'prop-types';
import {Navigate} from 'react-router-dom';
import * as ROUTES from '../constants/routes';

export default function ProtectedRoute({user, children}) {
	return user ? children : <Navigate to={ROUTES.LOGIN} />;
}

ProtectedRoute.propTypes = {
	user: PropTypes.object,
	children: PropTypes.node.isRequired,
};
