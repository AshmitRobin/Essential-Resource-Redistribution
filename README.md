# ERR – Essential Resource Redistribution

A MERN-based web application designed to connect donors with beneficiaries by making essential resources available to people and organisations in need.

The platform supports three user roles: **Donor, Beneficiary, and Admin**. It provides user authentication, role-based access, profile management, and administrative control over user accounts.

---

## 1. Project Overview

**Project Name:** Essential Resource Redistribution  
**Abbreviation:** ERR  
**Technology Stack:** MERN (MongoDB, Express.js, React.js, Node.js)

The system aims to simplify the redistribution of essential resources by providing a platform where users can register, manage their profiles, and access features according to their assigned roles.

### User Roles

- **Donor:** Individuals or organisations that have resources to contribute.
- **Beneficiary:** Individuals or organisations seeking essential resources.
- **Admin:** Manages user accounts and oversees platform access.

---

## 2. Technology Stack

### Frontend
- React.js
- JavaScript
- HTML5
- CSS3
- Axios

### Backend
- Node.js
- Express.js
- Mongoose

### Database
- MongoDB Atlas

### Authentication and Security
- JSON Web Tokens (JWT)
- bcryptjs for password hashing
- Email OTP verification
- Nodemailer for sending emails
- AES-256-GCM encryption for protected OTP payloads

---

## 3. Project Modules

The application is developed using separate modules to organise its functionality.

### Module 1: User Management

This module handles user registration, login, profile management, and administrative control of user accounts.

**Features:**
- User registration
- Email OTP verification
- User login and logout
- Role-based access control
- Profile management
- Admin management of user accounts
- Password hashing and secure authentication

**Supported Roles:**
- Donor
- Beneficiary
- Admin

---

## 4. Authentication Workflow

The application uses email-based OTP verification for account registration and password recovery.

### Registration

1. The user enters their registration details.
2. The backend validates the submitted information.
3. A six-digit OTP is generated.
4. The OTP is sent to the user's registered email address.
5. The user enters the OTP for verification.
6. After successful verification, the account is created.
7. The user receives an authentication token and can access the application.

### Login

1. The user enters their email address and password.
2. The backend verifies the credentials.
3. The system checks whether the email has been verified.
4. A JWT is generated after successful authentication.

### Forgot Password

1. The user enters their registered email address.
2. A password-reset OTP is sent to that email.
3. The user enters the received OTP.
4. The backend verifies the OTP.
5. After successful verification, the user can create a new password.

**Note:** Authentication and password recovery use email OTP only. Phone/SMS OTP and Twilio integration are not used.

---

## 5. Project Structure

```text
ERR/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── authController.js
│   │   │
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── EmailOtp.js
│   │   │
│   │   ├── routes/
│   │   │   └── authRoutes.js
│   │   │
│   │   ├── services/
│   │   │   └── email.js
│   │   │
│   │   ├── utils/
│   │   │   ├── crypto.js
│   │   │   └── validate.js
│   │   │
│   │   └── middleware/
│   │
│   ├── .env
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── index.html
│   └── package.json
│
└── README.md
```

*The structure above describes the main project organisation. Additional files and folders may exist in the repository.*

---

## 6. Installation and Setup

### Prerequisites

Install the following before running the project:

- Node.js
- npm
- MongoDB Atlas account
- Git

### Step 1: Clone the Repository

```bash
git clone <your-github-repository-url>
```

Navigate into the project:

```bash
cd ERR
```

### Step 2: Backend Setup

Open the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the backend directory.

### Step 3: Configure Environment Variables

Add the following configuration to `backend/.env`:

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_secure_jwt_secret

EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_APP_PASSWORD=your_google_app_password
EMAIL_FROM=Essential Resource Redistribution <your_email@gmail.com>
```

Replace the placeholder values with your own credentials.

**Important:**
- Use a Google App Password for Gmail SMTP authentication, not your regular Gmail password.
- Keep `.env` private.
- Never upload database credentials, JWT secrets, or email passwords to GitHub.
- Add `.env` to `.gitignore`.

### Step 4: Start the Backend

```bash
npm run dev
```

The backend will run on the configured port, usually:

```text
http://localhost:5000
```

### Step 5: Frontend Setup

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

The React application will generally be available at:

```text
http://localhost:5173
```

---

## 7. Authentication API Endpoints

The following endpoints handle user authentication and account management.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register/start` | Initiates registration and sends email OTP |
| POST | `/auth/register/verify` | Verifies registration OTP and creates account |
| POST | `/auth/login` | Authenticates an existing user |
| POST | `/auth/password/forgot` | Initiates password recovery |
| POST | `/auth/password/verify` | Verifies password-reset OTP |
| POST | `/auth/password/reset` | Updates the user's password |
| GET | `/auth/me` | Retrieves the authenticated user's details |

---

## 8. Database Collections

The application uses MongoDB to store user and verification information.

### Users Collection

Stores registered user information, including:

- Name
- Email
- Password (hashed)
- Mobile number (optional contact information)
- Email verification status
- User role

### EmailOtps Collection

Temporarily stores email OTP verification information, including:

- Email address
- OTP purpose
- Hashed OTP
- Encrypted registration payload, when applicable
- Expiration time
- Verification attempts

OTP records are deleted after successful verification. Expired records are automatically removed through MongoDB TTL functionality.

---

## 9. Security Features

- Passwords are hashed using bcrypt.
- JWT-based authentication.
- Role-based access control.
- Email OTP verification.
- OTP expiration and attempt limits.
- Hashed OTP storage.
- Encrypted registration payloads.
- Protected backend routes.
- Environment variables for sensitive configuration.

---

## 10. Future Enhancements

The following features can be introduced in future development stages:

- Resource listing and management.
- Donor and beneficiary matching.
- Resource request management.
- Donation tracking.
- Admin dashboard and analytics.
- Notifications and communication.
- Resource availability monitoring.

---

## 11. Running the Application

To run the complete application locally:

**Terminal 1 – Backend**

```bash
cd backend
npm install
npm run dev
```

**Terminal 2 – Frontend**

```bash
cd frontend
npm install
npm run dev
```

Open the frontend URL displayed in the terminal to access the application.

---

## 12. Project Information

**Project Title:** Essential Resource Redistribution  
**Project Abbreviation:** ERR  
**Architecture:** MERN Stack  
**Database:** MongoDB Atlas  
**Authentication:** JWT and Email OTP Verification

---

*ERR – Essential Resource Redistribution*

*Connecting resources with those who need them.*