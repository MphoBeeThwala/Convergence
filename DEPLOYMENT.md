# Deployment Guide for Convergence

This guide covers deploying the Convergence e-commerce platform to Vercel (frontend) and Render (backend).

## 🚀 Deployment Overview

- **Frontend**: Deploy to Vercel (React + Vite)
- **Backend**: Deploy to Render (Node.js + Express)
- **Database**: File-based JSON database (LowDB)

## 📋 Prerequisites

1. **GitHub Repository**: Ensure your code is pushed to GitHub
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **Render Account**: Sign up at [render.com](https://render.com)
4. **Environment Variables**: Prepare your production environment variables

## 🔧 Environment Variables Setup

### Backend (Render)
Set these environment variables in your Render dashboard:

```env
NODE_ENV=production
JWT_SECRET=your_super_secure_jwt_secret_key_production_2024
PORT=10000
```

### Frontend (Vercel)
Set these environment variables in your Vercel dashboard:

```env
VITE_API_URL=https://your-render-backend-url.onrender.com/api
```

## 🎯 Step-by-Step Deployment

### 1. Deploy Backend to Render

1. **Connect Repository**:
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Service**:
   - **Name**: `convergence-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free

3. **Set Environment Variables**:
   - Add the environment variables listed above
   - Make sure `JWT_SECRET` is a strong, unique value

4. **Deploy**:
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note your backend URL (e.g., `https://convergence-backend.onrender.com`)

### 2. Deploy Frontend to Vercel

1. **Connect Repository**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

3. **Set Environment Variables**:
   - Add `VITE_API_URL` with your Render backend URL
   - Format: `https://your-render-backend-url.onrender.com/api`

4. **Deploy**:
   - Click "Deploy"
   - Wait for deployment to complete
   - Your frontend will be available at the provided URL

## 🔄 Automatic Deployments

Both platforms support automatic deployments:

- **Vercel**: Automatically deploys on every push to main branch
- **Render**: Automatically deploys on every push to main branch

## 🧪 Testing Deployment

1. **Backend Health Check**:
   ```bash
   curl https://your-render-backend-url.onrender.com/
   ```
   Should return: `{"status":"Convergence backend is running.",...}`

2. **Frontend**:
   - Visit your Vercel URL
   - Test registration and login
   - Test product management features

## 🚨 Common Issues & Solutions

### Backend Issues

1. **Port Issues**:
   - Ensure `PORT` is set to `10000` in Render
   - Backend uses `process.env.PORT || 3000`

2. **Database Issues**:
   - LowDB creates `db.json` automatically
   - File is persistent in Render's file system

3. **CORS Issues**:
   - Backend has CORS enabled for all origins
   - If issues persist, check frontend API URL

### Frontend Issues

1. **API Connection**:
   - Verify `VITE_API_URL` is correct
   - Check that backend is running and accessible

2. **Build Issues**:
   - Ensure all dependencies are installed
   - Check for TypeScript/ESLint errors

## 📊 Monitoring

### Render Monitoring
- View logs in Render dashboard
- Monitor resource usage
- Set up alerts for downtime

### Vercel Monitoring
- View deployment logs
- Monitor performance
- Check analytics

## 🔒 Security Considerations

1. **JWT Secret**: Use a strong, unique secret in production
2. **Environment Variables**: Never commit secrets to Git
3. **HTTPS**: Both platforms provide HTTPS by default
4. **Rate Limiting**: Backend has rate limiting enabled

## 🆘 Troubleshooting

### Backend Won't Start
1. Check Render logs for errors
2. Verify environment variables
3. Ensure all dependencies are in `package.json`

### Frontend Can't Connect to Backend
1. Verify `VITE_API_URL` is correct
2. Check backend is running
3. Test backend URL directly

### Database Issues
1. Check if `db.json` is being created
2. Verify file permissions
3. Check for disk space issues

## 📞 Support

- **Render Support**: [docs.render.com](https://docs.render.com)
- **Vercel Support**: [vercel.com/docs](https://vercel.com/docs)
- **Project Issues**: Create an issue in the GitHub repository

---

**Happy Deploying! 🚀** 