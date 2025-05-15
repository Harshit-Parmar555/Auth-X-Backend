# Auth-X Backend

This is the **backend server** for **Auth-X**, a full-stack authentication system built with the MERN stack. It provides a boilerplate for secure user authentication and account management using **Node.js**, **Express**, **MongoDB**, and **Nodemailer** for email services.

## 📌 Features

- User Registration with email verification
- Secure Login with JWT tokens
- Password Reset via email
- Email verification using Nodemailer
- Protected routes with JWT middleware
- MongoDB database integration
- Environment-based configuration (dotenv)

## 🛠️ Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB** (Mongoose)
- **JWT (jsonwebtoken)**
- **Bcrypt.js**
- **Nodemailer**
- **dotenv**

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/auth-x-backend.git
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory with the following:

```env
PORT=4000
MONGODB_URI= your_mongo_uri
JWT_SECRET= your_jwt_secret
MAILTRAP_USER = your_mailtrap_username
MAILTRAP_PASS = your_mailtrap_password
CLIENT_URL = your_frontend_url
NODE_ENV = development
```

### 4. Start the Server

```bash
npm run dev
```

The backend will start at `http://localhost:4000`.

## 📂 API Endpoints

| Method | Endpoint                           | Description                       |
|--------|------------------------------------|-----------------------------------|
| POST   | /api/v1/auth/register              | Register new user                 |
| POST   | /api/v1/auth/verifyEmail           | Email verification                |
| POST   | /api/v1/auth/login                 | Login user                        |
| GET    | /api/v1/auth/logout                | User logout                       |
| GET    | /api/v1/auth/checkAuth             | check user auth status            |
| POST   | /api/v1/auth/forgetPassword        | Request reset password link       |
| POST   | /api/v1/auth/resetPassword/:token  | Reset user password               |

## 📁 Folder Structure

```
backend/
├── db/
│   └── connect.js
├── controllers/
├── middleware/
├── models/
├── routes/
├── utils/
├── .env
├── index.js
```

---

## ✨ Contributing

Feel free to contribute by opening a **Pull Request** or **Issue**!

---

## 🛡️ License

💡 Have suggestions or found a bug? Open a pull request or create an issue — contributions are always welcome!

---

## 📬 Contact

**Email** : parmarharshit441@gmail.com

[**LinkedIn**](https://www.linkedin.com/in/harshit-parmar-47253b282)

---

Happy Coding! 🚀
