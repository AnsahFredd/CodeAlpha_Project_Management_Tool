# Deployment Checklist

Follow this checklist to deploy your full-stack application safely to Render (Backend) and Vercel (Frontend).

## 1. Backend (Render / Node.js)

### Environment Variables on Render

Go to Dashboard -> Your Web Service -> Environment -> Add Environment Variables:

- [ ] `NODE_ENV`: `production`
- [ ] `PORT`: `10000` (or leave default, Render sets this automatically)
- [ ] `MONGODB_URI`: Your MongoDB Atlas connection string.
- [ ] `JWT_SECRET`: A long, random string.
- [ ] `FRONTEND_URL`: Your Vercel production URL (e.g., `https://your-app.vercel.app`).
- [ ] `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name.
- [ ] `CLOUDINARY_API_KEY`: Your Cloudinary API key.
- [ ] `CLOUDINARY_API_SECRET`: Your Cloudinary API secret.
- [ ] `EMAIL_USER`: Your email address.
- [ ] `EMAIL_PASS`: Your email app password.

### Build Settings

- [ ] **Build Command**: `cd backend && npm install && npm run build`
- [ ] **Start Command**: `cd backend && npm start`

---

## 2. Frontend (Vercel / React + Vite)

### Environment Variables on Vercel

Go to Dashboard -> Your Project -> Settings -> Environment Variables:

- [ ] `VITE_API_URL`: Your Render backend API URL (e.g., `https://your-backend.onrender.com/api`).
- [ ] `VITE_APP_NAME`: `Project Management Tool`

### Build Settings

Vercel should detect the Vite app automatically, but ensure:

- [ ] **Root Directory**: `frontend`
- [ ] **Build Command**: `npm run build`
- [ ] **Output Directory**: `dist`

---

## 3. Post-Deployment Verification

- [ ] Verify frontend loads correctly at the Vercel URL.
- [ ] Verify API calls work (Login/Register).
- [ ] Check Render logs for any connection errors (DB, Cloudinary).
- [ ] Test image uploads to ensure Cloudinary is working in production.
- [ ] Test email sending if applicable.
- [ ] Verify that no `.env` files are in your Git repository.
