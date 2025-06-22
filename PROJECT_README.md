# Convergence

A modern, full-stack e-commerce platform built with React and Node.js, featuring user authentication, product management, and a responsive design.

## 🚀 Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Product Management**: CRUD operations for products with user-based ownership
- **Responsive Design**: Modern UI that works on all devices
- **Security**: Password hashing, rate limiting, and input validation
- **File-based Database**: Simple JSON database using LowDB
- **Real-time Updates**: Dynamic product listing and user management

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls
- **CSS3** - Modern styling with responsive design

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **LowDB** - File-based JSON database
- **Express Rate Limit** - Rate limiting for security
- **Validator** - Input validation

## 📁 Project Structure

```
Convergence/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── App.jsx          # Main app component with routing
│   │   ├── AuthContext.js   # Authentication context provider
│   │   ├── LoginPage.js     # User login component
│   │   ├── RegisterPage.js  # User registration component
│   │   ├── DashboardPage.js # User dashboard
│   │   ├── ProductListPage.js # Product management
│   │   ├── ProtectedRoute.js # Route protection
│   │   ├── App.css          # Component styles
│   │   └── index.css        # Global styles
│   ├── package.json         # Frontend dependencies
│   └── vite.config.js       # Vite configuration
├── backend/                  # Node.js backend API
│   ├── index.js             # Main server file
│   ├── routes/
│   │   ├── authRoutes.js    # Authentication endpoints
│   │   └── shopRoutes.js    # Product management endpoints
│   ├── models/
│   │   ├── User.js          # User data model
│   │   └── Product.js       # Product data model
│   ├── middleware/
│   │   └── authMiddleware.js # JWT authentication middleware
│   ├── package.json         # Backend dependencies
│   └── db.json              # File-based database
└── PROJECT_README.md        # Project documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Convergence
   ```

2. **Set up environment variables**
   
   Create `backend/.env`:
   ```env
   JWT_SECRET=your_super_secure_jwt_secret_key_2024
   PORT=3000
   NODE_ENV=development
   ```
   
   Create `frontend/.env.local`:
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```

3. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

4. **Start the development servers**
   ```bash
   # Start backend server (from backend directory)
   npm run dev
   
   # Start frontend server (from frontend directory)
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

## 📚 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `PUT /update` - Update account (protected)
- `DELETE /delete` - Delete account (protected)

### Shop (`/api/shop`)
- `GET /` - List all products
- `GET /:id` - Get specific product
- `POST /` - Add product (protected)
- `PUT /:id` - Update product (protected, owner/admin only)
- `DELETE /:id` - Delete product (protected, owner/admin only)

## 🔧 Development

### Running Tests
```bash
cd backend
npm test
```

### Building for Production
```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
npm start
```

## 🚀 Deployment

For deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🔒 Security Features

- **Password Hashing**: All passwords are hashed using bcrypt
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Login attempts are rate-limited
- **Input Validation**: All user inputs are validated
- **CORS Protection**: Cross-origin requests are properly handled

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern Styling**: Clean, professional appearance
- **Loading States**: Visual feedback for async operations
- **Error Handling**: User-friendly error messages
- **Form Validation**: Real-time input validation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

If you encounter any issues or have questions, please:
1. Check the existing issues
2. Create a new issue with detailed information
3. Include steps to reproduce the problem

## 🔄 Version History

- **v1.0.0** - Initial release with basic e-commerce functionality
- Authentication system
- Product management
- Responsive design
- Security features

---

**Built with ❤️ using React and Node.js** 