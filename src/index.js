import React from 'react';
import ReactDOM from 'react-dom/client'; // Import from 'react-dom/client' in React 18+
import App from './App';
import FirebaseContext from './context/firebase';
import {firebase, FieldValue} from './lib/firebase';
import './styles/app.css';
// Create a root element and render the app
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
	<FirebaseContext.Provider value={{firebase, FieldValue}}>
		<App />
	</FirebaseContext.Provider>
);
