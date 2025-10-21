# UNZA Complaint & Meeting System

This is a full-stack web application for managing complaints, meetings, and notifications at UNZA. It consists of a Node.js/Express backend and a React frontend.

## Prerequisites

- Node.js (v18 or newer recommended)
- npm (v9 or newer)
- MySQL database

## Backend Setup

1. Navigate to the backend folder:
	```sh
	cd backend
	```
2. Install dependencies:
	```sh
	npm install
	```
3. Create a `.env` file (see `.env.example` if available) and configure your database and Twilio credentials.
4. Start the backend server:
	```sh
	npm run dev
	```
	or for production:
	```sh
	npm start
	```

### Backend Packages
- express, cors, helmet, morgan, dotenv, mysql2, bcrypt, jsonwebtoken, express-rate-limit, multer, twilio, validator, body-parser, isomorphic-dompurify, express-validator

## Frontend Setup

1. Navigate to the frontend folder:
	```sh
	cd frontend
	```
2. Install dependencies:
	```sh
	npm install
	```
3. Start the frontend development server:
	```sh
	npm start
	```
	The app will run at [http://localhost:3000](http://localhost:3000)

### Frontend Packages
- react, react-dom, react-scripts, axios, react-router-dom, react-redux, @reduxjs/toolkit, react-hook-form, yup, react-toastify, date-fns, @hookform/resolvers

## Operation

1. Start the backend server (see above).
2. Start the frontend server (see above).
3. Access the app at [http://localhost:3000](http://localhost:3000).
4. Log in as a user, staff, or admin to access different features:
	- Submit and track complaints
	- Book and manage meetings
	- Receive notifications
	- Admins can assign complaints and manage users

## Database Setup

Create a MySQL database and configure the connection in your backend `.env` file. Run any provided migration scripts to set up tables for users, complaints, meetings, and notifications.

## Additional Notes

- For Twilio SMS notifications, configure your Twilio credentials in `.env`.
- For production, build the frontend with `npm run build` and serve it with a static server or via the backend.

---
For more details, see the source code and comments in each folder.

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
