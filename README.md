# 🌐 LinkMe

**LinkMe** is a full-stack web application that allows users to create customizable, shareable link profiles — similar to Linktree. Users can manage their bio, profile picture, and social/media links. Profiles can be public or private, and users can securely register and log in to manage their content.

---

## 🚀 Features

- **User Authentication (JWT-based login & registration)**
- **Profile Management:** name, bio, avatar, and links
- **Public/Private Profile Visibility**
- **Image Upload & Storage (MongoDB)**
- **Responsive UI with React & Bootstrap**
- **Exportable Profile Card as PDF**

---

## 🛠️ Tech Stack

### Frontend

- **React.js**
- **Bootstrap CSS**
- **Axios**
- **React Router**

### Backend

- **Node.js**
- **Express.js**
- **MongoDB (via Mongoose)**
- **JWT (jsonwebtoken)**
- **Multer (image upload)**
- **Dotenv**

---

## 📂 Folder Structure

```
LinkMe/
├── client/                   # React frontend
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
│       │   └── Login.js
│       └── App.js
│
├── server/                   # Node.js backend
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── linkRoutes.js
│   │   └── userRoutes.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── controllers/
│   │   └── authController.js
│   │   └── linkController.js
│   │   └── userController.js
│   └── server.js
│
├── LICENSE
└── README.md
```

---

## 📡 API Endpoints

### Auth Routes

#### `POST /api/auth/register`

- **Description:** Register a new user.
- **Auth:** Not required  
- **Request Body:**
```
{
  "username": "Johm Doe",
  "email": "john@example.com",
  "password": "securePassword"
}
```
- **Response:**
```
{
  "message": "User registered successfully",
  "token": "JWT_TOKEN_HERE"
}
```

---

#### `POST /api/auth/login`

- **Description:** Log in a user and return a JWT token.
- **Auth:** Not required
- **Request Body:**
```
{
  "email": "john@example.com",
  "password": "securePassword"
}
```
- **Response:**
```
{
  "message": "Login successful",
  "token": "JWT_TOKEN_HERE"
}
```

---

### Profile Routes

#### `GET /api/users/profile`

- **Description:** Get current user's profile.
- **Auth:** Required (JWT in `Authorization: Bearer <token>`)
- **Response:**
```
{
  "username": "John Doe,
  "email": "john@example.com",
  "bio": "Web developer",
  "links": [
    { "name": "GitHub", "url": "https://github.com/johndoe", }
  ],
  "name": "Jonny"
  "avatarUrl": "BASE64_OR_IMAGE_URL",
  "isPublic": true
}
```

---

#### `PUT /api/users/profile`

- **Description:** Update user profile.
- **Auth:** Required
- **Request Body:**
```
{
  "name": "John Updated",
  "bio": "Updated bio",
  "isPublic": true
}
```
- **Response:**
```
{
  "username": "John Doe,
  "email": "john@example.com",
  "bio": "Web developer",
  "links": [
    { "name": "GitHub", "url": "https://github.com/johndoe", }
  ],
  "name": "Jonny"
  "avatarUrl": "BASE64_OR_IMAGE_URL",
  "isPublic": true
}
```

---

#### `GET api/user/public-profiles`

- **Description:** View a public or private profile by username.
- **Auth:** Not required
- **Response:**
```
{
  "name": "John Doe",
  "bio": "Web developer",
  "links": [...],
  "avatarUrl": "...",
  "isPublic": true
}
```

---

### Image Upload

#### `POST /api/users/avatar`

- **Description:** Upload avatar image.
- **Auth:** Required
- **Headers:** `Content-Type: multipart/form-data`
- **Form Data:**
  - `avatar`: (File - Image)
- **Response:**
```
{
  "message": "Avatar uploaded successfully"
}
```

---

## 📘 MongoDB Schema (`User.js`)

```
{
  username: String,
  email: String,
  password: String, // Hashed
  name: String,
  bio: String,
  avatarUrl: Buffer, // or base64
  links: [
    {
      name: String,
      url: String
    }
  ],
  isPublic: Boolean
}
```

---

## 🧪 Running Locally

```
# Clone the repository
git clone https://github.com/rohit220604/linkme.git
cd linkme

# Backend setup
cd server
npm install
npm run dev

# Frontend setup
cd ../client
npm install
npm start
```

> **Create a `.env` file inside `/server` with the following:**

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

---

## 🧠 Future Enhancements

- **Click tracking and link analytics**
- **QR code generation for profiles**
- **Drag-and-drop UI for link reordering**
- **Custom profile themes and backgrounds**

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).

---

## 👤 Author

**Rohit Jaliminchi**  
GitHub: [@rohit220604](https://github.com/rohit220604)
LinkedIn: [@RohitJaliminchi](https://linkedin.com/in/rohit-jaliminchi-98555224b)
