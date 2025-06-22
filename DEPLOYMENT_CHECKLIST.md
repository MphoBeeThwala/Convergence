# Deployment Checklist for Convergence

Use this checklist to ensure your project is ready for deployment to Vercel and Render.

## ✅ Pre-Deployment Checklist

### 1. Project Structure & Naming
- [x] Project renamed from "UnifiedECommerce" to "Convergence"
- [x] All package.json files have consistent naming
- [x] All references updated in code and documentation
- [x] Project structure is clean and organized

### 2. Configuration Files
- [x] `vercel.json` created for frontend deployment
- [x] `render.yaml` created for backend deployment
- [x] `DEPLOYMENT.md` created with detailed instructions
- [x] Root `package.json` has deployment scripts

### 3. Environment Variables
- [ ] Backend `.env` file created (not committed to Git)
- [ ] Frontend `.env.local` file created (not committed to Git)
- [ ] Production environment variables prepared

### 4. Dependencies
- [x] All dependencies listed in respective package.json files
- [x] No missing dependencies
- [x] Build scripts are working locally

### 5. Database
- [x] LowDB configuration is production-ready
- [x] Database file will be created automatically
- [x] No hardcoded database paths

### 6. Security
- [x] JWT secret will be set via environment variables
- [x] CORS is properly configured
- [x] Rate limiting is enabled
- [x] Input validation is in place

### 7. Build & Test
- [ ] Frontend builds successfully: `npm run build`
- [ ] Backend starts successfully: `npm start`
- [ ] All tests pass: `npm test`
- [ ] No linting errors

## 🚀 Deployment Steps

### Step 1: Prepare Environment Variables

**Backend (Render)**
```env
NODE_ENV=production
JWT_SECRET=your_super_secure_jwt_secret_key_production_2024
PORT=10000
```

**Frontend (Vercel)**
```env
VITE_API_URL=https://your-render-backend-url.onrender.com/api
```

### Step 2: Deploy Backend to Render

1. Go to [render.com](https://render.com)
2. Create new Web Service
3. Connect your GitHub repository
4. Configure:
   - **Name**: `convergence-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free
5. Add environment variables
6. Deploy

### Step 3: Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Create new project
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add environment variables
6. Deploy

## 🧪 Post-Deployment Testing

### Backend Testing
- [ ] Health check endpoint responds: `GET /`
- [ ] API endpoints are accessible
- [ ] CORS is working
- [ ] Database operations work

### Frontend Testing
- [ ] Application loads without errors
- [ ] Can connect to backend API
- [ ] User registration works
- [ ] User login works
- [ ] Product management works
- [ ] Responsive design works on mobile

### Integration Testing
- [ ] Full user flow works end-to-end
- [ ] Authentication persists across page reloads
- [ ] Error handling works properly
- [ ] Loading states display correctly

## 🚨 Common Issues to Watch For

### Backend Issues
- **Port conflicts**: Ensure PORT is set to 10000 in Render
- **Database permissions**: LowDB should create files automatically
- **Environment variables**: Check all are set correctly
- **Dependencies**: Ensure all are in package.json

### Frontend Issues
- **API URL**: Verify VITE_API_URL points to correct backend
- **Build errors**: Check for missing dependencies
- **CORS errors**: Backend should allow all origins
- **Environment variables**: Must be prefixed with VITE_

### General Issues
- **Git repository**: Ensure all changes are committed and pushed
- **Branch**: Deployments use main/master branch
- **File permissions**: Should be handled by platforms
- **SSL/HTTPS**: Both platforms provide this automatically

## 📊 Monitoring Setup

### Render Monitoring
- [ ] Set up log monitoring
- [ ] Configure resource usage alerts
- [ ] Set up downtime notifications

### Vercel Monitoring
- [ ] Enable analytics
- [ ] Set up performance monitoring
- [ ] Configure error tracking

## 🔒 Security Review

- [ ] JWT secret is strong and unique
- [ ] No secrets committed to Git
- [ ] HTTPS is enabled
- [ ] Rate limiting is active
- [ ] Input validation is working

## 📞 Support Resources

- **Render Docs**: [docs.render.com](https://docs.render.com)
- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Project Issues**: GitHub repository issues
- **Community**: Stack Overflow, Discord, etc.

---

**✅ Ready for Deployment!**

Once all checklist items are completed, your project should deploy successfully to both platforms. 