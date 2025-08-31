Full Stack Note-Taking Application
Project Overview
This is a full-stack note-taking application built with the MERN stack (MongoDB, Express, React, Node.js). The application is designed to be a secure and user-friendly platform where individuals can register, authenticate, and manage their personal notes. The project adheres to a modern, responsive design and utilizes a JSON Web Token (JWT) for secure, session-based authorization.

Live Application Links
Frontend: https://note-taking-app-three-henna.vercel.app/

Backend: https://note-taking-app-1-b0bt.onrender.com

Features
User Authentication: The application supports user registration and sign-in via an email and a one-time password (OTP) flow. It is also prepared for authentication through a Google account.

Data Validation: All user inputs for sign-up are properly validated to ensure data integrity and to prevent errors.

Secure Authorization: The system uses JWTs to authorize users, ensuring that only authenticated users can perform actions on their own notes.

Note Management: Authenticated users can create new notes, retrieve a list of their existing notes, and delete specific notes from their collection.

Responsive Design: The user interface is designed to be mobile-friendly and closely replicates the provided design specifications across various screen sizes.

Technology Stack
The project is built using the following technologies:

Frontend: ReactJS with TypeScript

Backend: Node.js with Express and TypeScript

Database: MongoDB, MySQL, or PostgreSQL

Authentication: JWT, bcryptjs, and the Google OAuth library

Development Tools: npm, Git

How to Run the Project Locally
Prerequisites
To run this project, you must have the following software installed:

Node.js (version 14 or higher)

npm (Node Package Manager)

A MongoDB instance (local or via MongoDB Atlas)

A Google Cloud Console project with OAuth credentials configured

Backend Setup
Clone the repository to your local machine.

Navigate to the backend directory.

Install the necessary dependencies: npm install

Create a .env file in the root of the backend directory with the following variables. Replace the placeholder values with your actual credentials.

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

Start the backend server in development mode: npm run dev

Frontend Setup
Navigate to the frontend directory.

Install the necessary dependencies: npm install

Create a .env.local file in the root of the frontend directory with the following variable:

VITE_GOOGLE_CLIENT_ID=your_google_client_id

Start the frontend development server: npm run dev

The application will be accessible at http://localhost:5173.
