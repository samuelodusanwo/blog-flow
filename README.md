# 📘 BlogFlow - Full Stack Blog Application

A complete MERN stack blog application built with **React (Frontend)**, **Node.js/Express (Backend)**, and **MongoDB (Database)**.

---

## 🚀 Tech Stack

### **Frontend**
- React 18  
- React Router DOM  
- Axios  
- Context API  
- CSS3  

### **Backend**
- Node.js  
- Express.js  
- MongoDB + Mongoose  
- JWT Authentication  
- bcryptjs  
- Express Validator  

---

## 📁 Project Structure
blog-app/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── context/          # State management
│   │   ├── services/         # API calls
│   │   └── App.jsx          # Main app component
│   └── package.json
└── backend/                  # Node.js API
    ├── controllers/          # Route controllers
    ├── models/              # MongoDB models
    ├── routes/              # Express routes
    ├── middleware/          # Custom middleware
    └── server.js           # Server entry point

---

## ⚙️ Setup Instructions

### ✅ **Backend Setup**

```bash
cd backend
npm install
cp .env.example .env
```

Fill your .env file with:
```bash
NODE_ENV=development  
PORT=5000  
MONGODB_URI=mongodb://localhost:27017/blogdb  
JWT_SECRET=your_super_secret_jwt_key_here  
JWT_EXPIRE=30d  
```

To generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Start the backend:
```bash
npm run dev   # Development
npm start     # Production
```

Backend runs on: http://localhost:5000

### ✅ **Frontend Setup**
```bash
cd frontend
npm install
```

Update API base URL in src/services/api.js if needed:
```javascript
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});
```

Start frontend:

```bash
npm run dev
```


Frontend runs on: http://localhost:3000


## 🎯 **Features**
✅ **Frontend**

- Responsive design
- User authentication
- CRUD for posts
- Category & tag filtering
- Search functionality
- Protected routes
- Error & loading handling

✅ **Backend**

- RESTful API
- JWT-based authentication
- Secure password hashing
- Input validation
- Helmet, CORS & rate limiting


## 📝 Scripts
**Backend**

```bash
npm run dev      # Start with nodemon
npm start        # Production
```

**Frontend**
```bash
npm run dev
npm run build
npm run preview
```

## 🌐 Deployment
**Backend**

- Platforms: Heroku, Railway, DigitalOcean
- Set environment variables
- Update CORS for production domain

**Frontend**

- Platforms: Vercel, Netlify
- Build: npm run build
- Update API base URL for production

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

Samuel Odusanwo