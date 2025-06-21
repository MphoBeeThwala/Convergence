# Convergence

My personal e-commerce platform project. Started this as a way to learn full-stack development, and it actually turned out pretty decent! 

## What This Is

Basically, I wanted to build something real instead of just following tutorials. This is a full e-commerce site where users can:
- Sign up and log in (with proper security)
- Add/edit/delete products (if they own them)
- Browse all products
- Manage their profile

## Tech Stack (What I Used)

### Frontend
- **React 19** - Because I wanted to use the latest stuff
- **Vite** - Super fast development server
- **React Router** - For navigation
- **Axios** - For API calls (fetch is cool but axios is easier)
- **CSS** - Just regular CSS, no frameworks (wanted to learn it properly)

### Backend  
- **Node.js + Express** - The classic combo
- **JWT** - For authentication (tokens are cool)
- **bcrypt** - Password hashing (security first!)
- **LowDB** - Simple JSON database (no SQL setup needed)
- **Rate limiting** - Prevent brute force attacks
- **Input validation** - Because users will try to break things

## Project Structure

```
Convergence/
├── frontend/                 # React app
│   ├── src/
│   │   ├── App.jsx          # Main app with routing
│   │   ├── AuthContext.js   # Auth state management
│   │   ├── LoginPage.js     # Login form
│   │   ├── RegisterPage.js  # Registration form
│   │   ├── DashboardPage.js # User dashboard
│   │   ├── ProductListPage.js # Product management
│   │   ├── ProtectedRoute.js # Route protection
│   │   ├── App.css          # Component styles
│   │   └── index.css        # Global styles
│   └── package.json
├── backend/                  # Express API
│   ├── index.js             # Server setup
│   ├── routes/
│   │   ├── authRoutes.js    # Auth endpoints
│   │   └── shopRoutes.js    # Product endpoints
│   ├── models/
│   │   ├── User.js          # User model
│   │   └── Product.js       # Product model
│   ├── middleware/
│   │   └── authMiddleware.js # JWT verification
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (I used v16, but newer should work)
- npm (comes with Node)

### Setup

1. **Clone this thing**
   ```bash
   git clone <your-repo-url>
   cd convergence
   ```

2. **Environment files** (create these manually)
   
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

3. **Install everything**
   ```bash
   npm run setup
   ```

4. **Start development**
   ```bash
   npm run dev
   ```

5. **Check it out**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3000

## API Stuff

### Auth Routes (`/api/auth`)
- `POST /register` - Create account
- `POST /login` - Log in
- `PUT /update` - Update profile (needs auth)
- `DELETE /delete` - Delete account (needs auth)

### Shop Routes (`/api/shop`)
- `GET /` - Get all products
- `GET /:id` - Get specific product
- `POST /` - Add product (needs auth)
- `PUT /:id` - Update product (owner only)
- `DELETE /:id` - Delete product (owner only)

## Development Notes

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

## Security Features

- **Password hashing** - bcrypt with salt
- **JWT tokens** - Stateless auth
- **Rate limiting** - 5 login attempts per 15 minutes
- **Input validation** - Server-side validation
- **CORS** - Properly configured

## UI/UX Features

- **Responsive** - Works on mobile and desktop
- **Loading states** - Users know something's happening
- **Error handling** - Clear error messages
- **Form validation** - Real-time feedback

## Things I Learned

- JWT authentication flow
- React Context for state management
- Express middleware patterns
- File-based database with LowDB
- Rate limiting and security best practices
- Vite vs Create React App differences

## Future Improvements (TODO)

- [ ] Add image upload functionality
- [ ] Implement search and filtering
- [ ] Add pagination for products
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Admin panel
- [ ] Payment integration (Stripe?)
- [ ] Better error logging
- [ ] Unit tests for frontend
- [ ] Docker setup

## Known Issues

- Sometimes the backend crashes on Windows (path-to-regexp issue)
- No image validation (users can put any URL)
- No pagination (could be slow with many products)
- Basic styling (not production-ready)

## Contributing

This is my personal project, but if you find bugs or have suggestions, feel free to:
1. Fork it
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

ISC License - basically do whatever you want with it.

---

**Built with ❤️ and lots of coffee while learning full-stack development** 