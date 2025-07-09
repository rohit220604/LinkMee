
# 🌐 LinkMe

![Vercel](https://img.shields.io/badge/Deployed-Vercel-brightgreen)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)

[Live Demo](https://link-me-vert.vercel.app) 🚀

👉 **Tip:** Use Google login to sign up instantly — no manual OTP needed.


LinkMe is a full-stack web application that lets users create customizable, shareable link profiles . Users can manage their bio, profile picture, and social/media links. Profiles can be public or private, and users can securely register and log in via Email/OTP, JWT, or Google OAuth.

---

## 📑 Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Folder Structure](#folder-structure)
4. [API Endpoints](#api-endpoints)
    - [Auth Routes](#auth-routes)
    - [Profile Routes](#profile-routes)
    - [Link Routes](#link-routes)
    - [Image Upload](#image-upload)
5. [MongoDB Schema](#mongodb-schema-userjs)
6. [Environment Variables](#️-env-examples)
7. [Running Locally](#running-locally)
8. [API Keys](#api-keys)
9. [Live Deployment](#live-deployment)
10. [Future Enhancements](#future-enhancements)
11. [License](#license)
12. [Author](#author)

---

## 🚀 Features

- User Authentication (JWT, Email/OTP & Google OAuth)
- Profile Management: name, bio, avatar, and links
- Public/Private Profile Visibility
- Image Upload & Storage (MongoDB)
- Responsive UI with React & Bootstrap
- Exportable Profile Card as PDF
- Deployed on Vercel (Frontend) & Render (Backend)

---

## 🛠️ Tech Stack

**Frontend**
- React.js
- Bootstrap CSS
- Axios
- React Router

**Backend**
- Node.js
- Express.js
- MongoDB (via Mongoose)
- JWT (jsonwebtoken)
- Google OAuth (Passport.js)
- Multer (image upload)
- Dotenv

---

## 📂 Folder Structure

```

LinkMe/
├── client/
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── About.js
│       │   ├── Dashboard.js
│       │   ├── EditProfile.js
│       │   ├── Footer.js
│       │   ├── Home.js
│       │   ├── Navbar.js
│       │   ├── ProfileCard.js
│       │   ├── ProfileCardPDF.js
│       │   ├── TokenHandler.js
│       │   ├── NotFound.js
│       │   └── Login.js
│       └── App.js
├── server/
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── linkRoutes.js
│   │   └── userRoutes.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── linkController.js
│   │   └── userController.js
│   ├── config/
│   │   └── googleAuth.js
│   └── server.js
├── vercel.json
├── LICENSE
└── README.md

```

---

## 📡 API Endpoints

### Auth Routes

- **POST `/api/auth/register`**  
  Register new user via Email/OTP.  
  Auth: Not required  
  **Request Body:**  
```

{ "username": "John Doe", "email": "john@example.com", "password": "securePassword" }

```
**Response:**  
```

{ "message": "OTP sent to your email" }

```

- **POST `/api/auth/verify-otp`**  
Verify signup OTP.  
Auth: Not required  
**Request Body:**  
```

{ "email": "john@example.com", "otp": "123456" }

```
**Response:**  
```

{ "message": "Account verified successfully", "token": "JWT_TOKEN_HERE" }

```

- **POST `/api/auth/login`**  
Log in user with email & password.  
Auth: Not required  
**Request Body:**  
```

{ "email": "john@example.com", "password": "securePassword" }

```
**Response:**  
```

{ "message": "Login successful", "token": "JWT_TOKEN_HERE" }

```

- **GET `/api/auth/google`**  
Start Google OAuth flow.  
Auth: Not required — redirects user to Google consent screen.

- **GET `/api/auth/google/callback`**  
Google OAuth callback — handles response and logs user in.

---

### Profile Routes

- **GET `/api/users/profile`**  
Get current user’s profile.  
Auth: Required (JWT in Authorization: Bearer <token>)  
**Response:**  
```

{
"username": "John Doe",
"email": "john@example.com",
"bio": "Web developer",
"links": [{ "name": "GitHub", "url": "https://github.com/johndoe" }],
"name": "Johnny",
"avatarUrl": "BASE64_OR_IMAGE_URL",
"isPublic": true
}

```

- **PUT `/api/users/profile`**  
Update user profile.  
Auth: Required  
**Request Body:**  
```

{ "name": "Updated Name", "bio": "Updated bio", "isPublic": true }

```
**Response:**  
```

{
"username": "John Doe",
"email": "john@example.com",
"bio": "Updated bio",
"links": [...],
"name": "Updated Name",
"avatarUrl": "...",
"isPublic": true
}

```

- **GET `/api/users/public-profiles`**  
List all public profiles.  
Auth: Not required  
**Response:**  
```

[
{ "name": "John Doe", "bio": "Web developer", "links": [...], "avatarUrl": "...", "isPublic": true }
]

```

---

### Link Routes

- **POST `/api/links`**  
Add new link.  
Auth: Required  
**Request Body:**  
```

{ "name": "GitHub", "url": "https://github.com/johndoe" }

```
**Response:**  
```

{ "message": "Link added", "links": [...] }

```

- **GET `/api/links`**  
Get all your links.  
Auth: Required

- **DELETE `/api/links/:id`**  
Delete link by ID.  
Auth: Required

---

### Image Upload

- **POST `/api/users/avatar`**  
Upload avatar.  
Auth: Required — Content-Type: multipart/form-data  
**Form Data:**  
- avatar: (File - Image)  
**Response:**  
```

{ "message": "Avatar uploaded successfully" }

```

**Note:**
> For all API endpoints that require authentication, you must include your JWT (JSON Web Token) in the `Authorization` header of your HTTP requests, formatted as:
>
``` Authorization: Bearer <your_jwt_token> ```
>
> Replace `<your_jwt_token>` with the token you receive upon successful login or registration.
---


## 📘 MongoDB Schema (`User.js`)

```

{
username: String,
email: String,
password: String, // Hashed
name: String,
bio: String,
avatar: { data: Buffer, contentType: String },
links: [ { name: String, url: String } ],
isPublic: Boolean
}

```

---

## ⚙️ .env Examples

**Backend (`/server/.env`):**

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLIENT_URL=http://localhost:3000
PORT=5000
```

**Frontend (`/client/.env`):**

```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
```

---

## 🧪 Running Locally

```

git clone https://github.com/rohit220604/linkme.git
cd linkme

# Backend

cd server
npm install
npm run dev

# Frontend

cd ../client
npm install
npm start

```

---

## 🔑 API Keys

- **Google OAuth Credentials:** Required for Google login.
  - [Google Cloud Console](https://console.cloud.google.com/) → Create a project → Enable OAuth consent screen → Create OAuth 2.0 Client ID → Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to `backend/.env` and `GOOGLE_CLIENT_ID` to `frontend/.env`.

---

## 🌐 Live Deployment

- **Frontend:** [https://link-me-vert.vercel.app](https://link-me-vert.vercel.app)
- **Backend:** Hosted securely on **Render**

---

## 🧠 Future Enhancements

- Click tracking & analytics
- QR code for profiles
- Drag-and-drop link sorting
- Profile themes

---

## 📄 License

Licensed under [MIT License](./LICENSE)

---

## 👤 Author

**Rohit Jaliminchi**  
GitHub: [@rohit220604](https://github.com/rohit220604)  
LinkedIn: [@RohitJaliminchi](https://www.linkedin.com/in/rohitjaliminchi)

---

✨ Happy Linking with LinkMe!