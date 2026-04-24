# College File Approval System - Next.js + Supabase

A modern, role-based file approval workflow system built with **Next.js 14**, **Supabase**, and **Tailwind CSS**. No backend server required—everything runs on Supabase!

## 🎯 Project Overview

This system enables a three-stage file approval workflow:

1. **Staff** - Upload files for approval
2. **Principal** - Review and approve/reject with remarks
3. **President** - Final approval authority

### Key Features

✅ **Zero Backend Required** - Uses Supabase as the only backend
✅ **Next.js 14 (App Router)** - Modern React framework
✅ **Row-Level Security (RLS)** - Database-level access control
✅ **Real-time Approvals** - Instant workflow updates
✅ **Full Audit Trail** - Complete approval history
✅ **Secure File Storage** - Supabase Storage with RLS
✅ **Responsive Design** - Mobile-friendly UI with Tailwind CSS

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier available at https://supabase.com)

### Installation

1. **Navigate to project**
   ```bash
   cd "f:/Projects/Amrit Administration/college-file-approval-system/frontend"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Get Supabase credentials**
   - Go to https://supabase.com
   - Create a new project
   - Go to Settings → API
   - Copy your **Project URL** and **Anon Key**

4. **Create `.env.local` file**
   ```bash
   cp .env.example .env.local
   ```

5. **Fill in `.env.local`**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

6. **Set up Supabase Database**
   - In Supabase Dashboard, go to SQL Editor
   - Open file: `../SUPABASE_SCHEMA.sql` (in project root)
   - Copy all SQL and execute in the SQL Editor
   - This creates tables, RLS policies, and functions

7. **Create Storage Bucket**
   - In Supabase Dashboard, go to Storage
   - Click "Create New Bucket"
   - Name: `documents`
   - Make it **Private**

8. **Add RLS Policies to Storage**
   - Go to Storage → documents bucket → Policies
   - Add upload, download, and delete policies as documented in SQL file

9. **Start the development server**
   ```bash
   npm run dev
   ```

10. **Open in browser**
    - Navigate to `http://localhost:3000`
    - Sign up or login

## 📁 Project Structure

```
frontend/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home/landing page
│   ├── login/
│   │   └── page.tsx         # Login page
│   ├── dashboard/
│   │   └── page.tsx         # Route based on role
│   ├── staff/
│   │   └── page.tsx         # Staff dashboard
│   ├── principal/
│   │   └── page.tsx         # Principal dashboard
│   └── president/
│       └── page.tsx         # President dashboard
├── components/              # Reusable components
│   ├── Navbar.tsx
│   ├── FileCard.tsx
│   ├── FileDetailsModal.tsx
│   ├── UploadModal.tsx
│   └── ApprovalModal.tsx
├── lib/
│   ├── supabaseClient.ts
│   └── supabaseService.ts
├── types/
│   └── index.ts
├── styles/
│   └── globals.css
├── package.json
├── next.config.js
├── tsconfig.json
└── .env.local
```

## 🔄 Workflow

```
Staff Upload File
    ↓
Principal Review (current_stage = 'principal')
    ├─→ Approve → President Stage
    └─→ Reject → Return to Staff
    
President Review (current_stage = 'president')
    ├─→ Approve → Completed
    └─→ Reject → Rejected
```

## 📊 Database Tables

1. **profiles** - Users with roles
2. **files** - Document records with approval status
3. **approval_history** - Complete audit trail

All tables have RLS policies for security.

## 🔒 Security

- Email/password authentication via Supabase Auth
- JWT token-based API calls
- Row-Level Security (RLS) on all tables
- Secure file storage with signed URLs
- Role-based access control

## 🛠 npm Commands

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run linter
```

## 🌐 Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://[project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
```

## 📚 Resources

- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)

---

**Built with Next.js, Supabase, and Tailwind CSS**
│   │   │   ├── FileComponents.tsx
│   │   │   ├── FileDetailsModal.tsx
│   │   │   └── ApprovalModal.tsx
│   │   ├── pages/
│   │   │   ├── HomePage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── StaffDashboard.tsx
│   │   │   ├── PrincipalDashboard.tsx
│   │   │   └── PresidentDashboard.tsx
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   ├── services/
│   │   │   ├── supabaseClient.ts
│   │   │   └── apiClient.ts
│   │   ├── hooks/
│   │   │   └── useApi.ts
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── .env.example
│
├── DATABASE_SCHEMA.sql              # Database table definitions
├── RLS_POLICIES.sql                 # Row Level Security policies
├── SUPABASE_STORAGE_SETUP.sql       # Storage bucket setup
└── README.md                        # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Supabase account (free at supabase.com)
- Git

### Installation

#### 1. Clone and Setup Backend

```bash
cd backend

# Copy environment file
cp .env.example .env

# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate
```

#### 2. Clone and Setup Frontend

```bash
cd frontend

# Copy environment file
cp .env.example .env

# Install dependencies
npm install
```

#### 3. Configure Supabase

1. **Create Supabase Project**:
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Enter project details

2. **Get Credentials**:
   - In Supabase dashboard, go to **Settings → API**
   - Copy:
     - `Project URL` → `SUPABASE_URL`
     - `anon public` → `SUPABASE_ANON_KEY`
     - `service_role secret` → `SUPABASE_SERVICE_KEY`
   - In database settings, copy `Connection string (pooling)` → `DATABASE_URL`

3. **Setup Database**:
   - Go to **SQL Editor** in Supabase dashboard
   - Run `DATABASE_SCHEMA.sql`
   - Run `RLS_POLICIES.sql`
   - Run `SUPABASE_STORAGE_SETUP.sql`

4. **Update Environment Files**:

   **backend/.env**:
   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_KEY=your-service-role-key
   DATABASE_URL=postgresql://...
   PORT=5000
   ```

   **frontend/.env**:
   ```
   REACT_APP_SUPABASE_URL=https://your-project.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=your-anon-key
   REACT_APP_API_URL=http://localhost:5000/api
   ```

#### 4. Push Database Schema

```bash
cd backend
npm run prisma:push
```

### Running the System

#### Terminal 1 - Backend Server
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

#### Terminal 2 - Frontend Dev Server
```bash
cd frontend
npm start
# App runs on http://localhost:3000
```

## 👥 User Roles & Workflows

### Staff
- Upload files for approval
- View status of their files
- See remarks from approvers
- Download approved/rejected files

**Dashboard**: `/staff`

### Principal
- View files awaiting their approval
- Approve → forwards to President
- Reject → marks as rejected, visible to staff
- Add remarks for each decision

**Dashboard**: `/principal`

### President
- View files awaiting final approval
- Final approve → completes workflow
- Final reject → marks as rejected
- See full approval history
- Add final remarks

**Dashboard**: `/president`

## 🔄 Approval Workflow

```
1. Staff uploads file
   ↓
   Status: PENDING | Stage: PRINCIPAL

2. Principal reviews and decides
   ├→ APPROVE → Stage: PRESIDENT (Staff & Principal can view)
   └→ REJECT → Stage: COMPLETED, Status: REJECTED

3. If at President stage:
   ├→ APPROVE → Stage: COMPLETED, Status: APPROVED
   └→ REJECT → Stage: COMPLETED, Status: REJECTED

4. On Completion:
   - Visible to: Staff (creator), Principal, President
   - History shows all actions and remarks
```

## 📊 Database Schema

### Tables

#### user_profiles
- `id` (UUID) - Primary key, references auth.users
- `name` - User's full name
- `role` - 'staff' | 'principal' | 'president'
- `email` - User's email (unique)
- `created_at` - Timestamp
- `updated_at` - Timestamp

#### files
- `id` (UUID) - Primary key
- `title` - File title
- `description` - File description
- `file_url` - Supabase Storage URL
- `file_name` - Original filename
- `created_by` (UUID) - Foreign key to user_profiles
- `current_stage` - 'principal' | 'president' | 'completed'
- `status` - 'pending' | 'approved' | 'rejected'
- `visible_to` (UUID[]) - Array of user IDs who can view
- `created_at` - Upload timestamp
- `updated_at` - Last update timestamp

#### approval_history
- `id` (UUID) - Primary key
- `file_id` (UUID) - Foreign key to files
- `action_by` (UUID) - Foreign key to user_profiles
- `role` - Role of person who took action
- `action` - 'uploaded' | 'approved' | 'rejected'
- `remark` - Optional comment
- `created_at` - Action timestamp

## 🔐 Security Features

### Row Level Security (RLS)
- Staff can only see their own files
- Principal sees files at principal stage
- President sees files at president stage
- Completed files visible to all relevant parties
- Service role used for backend operations

### Authentication
- Supabase Auth with email/password
- JWT tokens for API requests
- Token stored in localStorage (frontend)
- Middleware validates tokens (backend)

### File Upload
- Files stored in Supabase Storage (documents bucket)
- Public URL generation after upload
- Original filename preserved
- CORS protection enforced

## 🛠️ API Endpoints

### Authentication
```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - Login user
GET    /api/auth/me                - Get current user
PUT    /api/auth/profile/:userId   - Update profile
GET    /api/auth/users             - Get all users (president)
```

### Files
```
POST   /api/files/upload           - Upload file (staff)
GET    /api/files/my-files         - Get files by role
GET    /api/files/:fileId          - Get file details
GET    /api/files/:fileId/history  - Get approval history
```

### Approvals
```
POST   /api/files/:fileId/approve-principal   - Principal approve
POST   /api/files/:fileId/reject-principal    - Principal reject
POST   /api/files/:fileId/approve-president   - President approve
POST   /api/files/:fileId/reject-president    - President reject
```

## 🧪 Testing

### Demo Credentials
After registering demo users, use these for testing:

```
Staff:      staff@college.edu / password
Principal:  principal@college.edu / password
President:  president@college.edu / password
```

### Test Workflow
1. Login as Staff → Upload file
2. Login as Principal → Approve/Reject
3. If approved, Login as President → Final Decision
4. Staff sees final result

## 📦 Building for Production

### Backend

```bash
# Build
npm run build

# Start production server
npm run start

# Or use PM2 for process management
npm install -g pm2
pm2 start dist/index.js --name "approval-api"
```

### Frontend

```bash
# Build
npm run build

# Deploy build/ folder to hosting
# (Vercel, Netlify, AWS S3, etc.)
```

## 🚨 Troubleshooting

### "Module not found" errors
```bash
npm install
npm run prisma:generate
```

### Database connection fails
- Check `DATABASE_URL` is correct
- Verify IP is whitelisted in Supabase
- Ensure credentials have correct permissions

### Permission denied errors
- Verify RLS policies are applied
- Check user role in `user_profiles` table
- Ensure token is valid (not expired)

### CORS errors
- Check `CORS_ORIGIN` in backend .env
- Should match frontend URL (http://localhost:3000 for dev)

### Files not uploading
- Check `MAX_FILE_SIZE` in backend .env
- Verify storage bucket exists
- Check CORS policies on storage bucket

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [React Documentation](https://react.dev)
- [Express Documentation](https://expressjs.com)

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

We welcome improvements! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📧 Support

For issues or questions:
1. Check the troubleshooting section
2. Review Supabase logs in dashboard
3. Check backend server logs
4. Check browser console for frontend errors

---

Built with ❤️ for educational institutions and organizations.
