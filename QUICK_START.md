# 🚀 Quick Start Guide - Next.js + Supabase

Get the **College File Approval System** running in **5 minutes**!

## ✅ What You Get

- Zero backend server needed ✅
- Next.js 14 modern framework ✅
- Secure Supabase database ✅
- Ready for production ✅

## 🎯 5-Minute Setup

### Step 1: Create Supabase Project (2 min)

1. Go to **https://supabase.com**
2. Click "Start your project" → Sign up/Login
3. Create project:
   - Name: `college-approval` (or your choice)
   - Password: (save it!)
   - Region: Closest to you
4. Wait for creation (2-3 min)

### Step 2: Set Up Database (1 min)

1. In Supabase Dashboard → **SQL Editor**
2. Open file: `SUPABASE_SCHEMA.sql` (in project root)
3. Copy all SQL and paste into SQL Editor
4. Click **Run** ✅
   - Tables created
   - RLS policies added
   - Functions created

### Step 3: Create Storage Bucket (30 sec)

1. **Storage** → **Create New Bucket**
2. Name: `documents`
3. Make it **Private** ← Important!

### Step 4: Get Credentials (30 sec)

1. **Settings** → **API**
2. Copy these:
   - **Project URL**: `https://[project-id].supabase.co`
   - **Anon Key**: `eyJ...` (public key)

### Step 5: Add Credentials & Run (1 min)

1. Create `frontend/.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

2. In terminal:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. Open **http://localhost:3000** ✅

## 🧪 Test the Workflow

### Create Test Users

1. **Sign Up as Staff**
   - Email: `staff@example.com`
   - Password: `Test123456`
   - Click "Staff" role
   - Create account

2. **Sign Up as Principal**
   - Email: `principal@example.com`
   - Password: `Test123456`
   - Click "Principal" role
   - Create account

3. **Sign Up as President**
   - Email: `president@example.com`
   - Password: `Test123456`
   - Click "President" role
   - Create account

### Test Approval Flow

1. **As Staff**:
   - Login with staff@example.com
   - Click "Upload File"
   - Upload a file (any PDF, DOC, etc.)
   - See file shows "With Principal" status

2. **As Principal**:
   - Logout, login as principal@example.com
   - See the uploaded file
   - Click "Approve" or "Reject"
   - If approved, file goes to President

3. **As President**:
   - Logout, login as president@example.com
   - See Principal's approved files
   - "Approve" = File completed ✅
   - "Reject" = File rejected ❌

## 📁 Project Layout

```
frontend/
├── app/              # Next.js pages
├── components/       # 5 reusable components
├── lib/
│   ├── supabaseClient.ts      # Client setup
│   └── supabaseService.ts     # All queries
├── types/            # TypeScript types
├── styles/           # Tailwind + custom CSS
└── .env.local       # Your credentials (CREATE THIS)
```

## 🔄 How It Works

**No Express backend!** Everything goes through Supabase:

```
Frontend (Next.js)
    ↓
Supabase Client (@supabase/supabase-js)
    ↓
Supabase
    ├─ PostgreSQL (tables, RLS)
    ├─ Auth (email/password)
    └─ Storage (file uploads)
```

## 🎨 Pages in App

| URL | Role | Purpose |
|-----|------|---------|
| `/` | Anyone | Landing page |
| `/login` | Anyone | Sign up / Login |
| `/dashboard` | Logged in | Route to role page |
| `/staff` | Staff | Upload & track files |
| `/principal` | Principal | Review & approve |
| `/president` | President | Final approval |

## 💾 Database Tables

1. **profiles** - Users (id, name, email, role)
2. **files** - Documents (title, file_url, status, stage)
3. **approval_history** - Audit trail (who did what, when)

All secured with Row-Level Security (RLS).

## ⚠️ Common Issues

**"Cannot find module '@supabase/supabase-js'"**
```bash
cd frontend
npm install
```

**"Missing environment variables"**
- Check `.env.local` exists
- Variables start with `NEXT_PUBLIC_`
- Restart dev server after creating file

**"Access denied" in console**
- SQL script may not have run fully
- Try running SQL from `SUPABASE_SCHEMA.sql` again
- Check SQL executed without errors

## 🚀 Next Steps

### Deploy to Production

**Easiest: Vercel (by Nextjs creators)**
1. Push code to GitHub
2. Connect to Vercel
3. Add `.env.local` values as env vars
4. Deploy ✅

**Alternative: Any Node host**
- Runs with: `npm run build && npm start`

### Add More Users

- Only sign up users with correct roles
- No admin panel yet (you can add one!)

### Customize

- Change colors in `tailwind.config.js`
- Modify tables in Supabase SQL Editor  
- Add fields to `types/index.ts`

## 📖 Full Documentation

See `README.md` for:
- Complete setup steps
- Architecture details
- All function documentation
- Troubleshooting guide

## ✅ You're All Set!

Your file approval system is ready to use.

**Questions?** Check README.md or Supabase docs at https://supabase.com/docs

Happy approving! 📝

4. Go to **Storage** → Create bucket named: `documents` → **Public**

## Step 3: Setup Backend (2 min)

```bash
cd backend

# Copy environment file
cp .env.example .env

# Edit .env with your Supabase credentials from Step 2:
# SUPABASE_URL=https://your-project.supabase.co
# SUPABASE_ANON_KEY=eyJ...
# SUPABASE_SERVICE_KEY=eyJ...
# DATABASE_URL=postgresql://...

# Install & initialize
npm install
npm run prisma:generate
npm run prisma:push

# Start backend
npm run dev
```

**✓ Backend running on http://localhost:5000**

## Step 4: Setup Frontend (2 min)

In a **new terminal**:

```bash
cd frontend

# Copy environment file
cp .env.example .env

# Edit .env with your Supabase credentials:
# REACT_APP_SUPABASE_URL=https://your-project.supabase.co
# REACT_APP_SUPABASE_ANON_KEY=eyJ...

# Install & start
npm install
npm start
```

**✓ Frontend running on http://localhost:3000**

## Step 5: Test the Workflow (5 min)

### Register & Test Users

1. **Create Staff User**:
   - Go to http://localhost:3000/login
   - Register: `staff@college.edu` / `password` / Name / Role=Staff
   - Upload a file

2. **Create Principal User**:
   - New tab: http://localhost:3000/login
   - Register: `principal@college.edu` / `password` / Name / Role=Principal
   - See pending file from staff
   - Click to approve → add remark → submit

3. **Create President User**:
   - New tab: http://localhost:3000/login
   - Register: `president@college.edu` / `password` / Name / Role=President
   - See file awaiting final approval
   - Click to approve → submit

4. **Back to Staff**:
   - Refresh Staff Dashboard
   - See final approval status ✓

---

## 🎉 Complete! Everything is Running

### Quick Reference

| Component | URL | Status |
|-----------|-----|--------|
| Frontend | http://localhost:3000 | ✓ Running |
| Backend | http://localhost:5000 | ✓ Running |
| Database | Supabase Cloud | ✓ Connected |
| Storage | Supabase Cloud | ✓ Ready |

### Try These Features

- ✅ Upload files as Staff
- ✅ Approve/Reject as Principal
- ✅ Final approve as President
- ✅ View approval history
- ✅ Download files
- ✅ See remarks on each stage

---

## 📚 Next Steps

1. **Explore the full README**: See [README.md](./README.md)
2. **API Reference**: Check [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
3. **Detailed Setup**: Read [COMPLETE_SETUP_GUIDE.md](./COMPLETE_SETUP_GUIDE.md)
4. **Deploy to Production**: See deployment section in main README

---

## 🚨 Troubleshooting

### "Module not found" error
```bash
cd backend
npm install
npm run prisma:generate
```

### Database connection error
- Check DATABASE_URL is correct
- Verify credentials in .env
- Make sure Supabase project is active

### CORS error
- Check CORS_ORIGIN in backend/.env matches http://localhost:3000
- Restart backend server

### Files not uploading
- Check file size (max 10MB)
- Verify "documents" bucket exists in Storage
- Check browser console for errors

---

## 📖 Architecture

```
User Browser
    ↓
React App (Port 3000)
    ↓
Express API (Port 5000)
    ↓
Supabase PostgreSQL
```

## 🔐 Security Note

- **Development**: URLs are hardcoded (OK for local testing)
- **Production**: Use environment variables and HTTPS
- See [COMPLETE_SETUP_GUIDE.md](./COMPLETE_SETUP_GUIDE.md) for security checklist

---

## 💡 Tips

- **Clear browser cache** if seeing old data: Ctrl+Shift+Delete
- **Check logs** if something breaks: Look at terminal output
- **Enable browser DevTools**: F12 to debug errors
- **Use Supabase dashboard**: View data directly in tables

---

**Congratulations! You have a fully functional file approval system!** 🎊

For production deployment, advanced features, or integration, see the detailed documentation.
