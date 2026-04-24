# 🔄 Migration Guide: Express → Next.js + Supabase

This document explains what changed when the project was refactored from a traditional Express backend + React frontend to a unified Next.js + Supabase architecture.

## 📊 Architecture Comparison

### Before (Old Stack)

```
┌─────────────────┐
│  React Frontend │ (Port 3000)
│  (react-scripts)│
└────────┬────────┘
         │ Axios HTTP
         ↓
┌─────────────────┐
│ Express Backend │ (Port 5000)
│  + TypeScript   │
└────────┬────────┘
         │ Prisma ORM
         ↓
┌─────────────────┐
│  Supabase       │
│  (DB + Auth)    │
└─────────────────┘
```

### After (New Stack) ✅

```
┌──────────────────────┐
│   Next.js 14         │
│   (Full Stack)       │
│  - Pages (App Router)│
│  - Components        │
│  - Queries           │
└──────────┬───────────┘
           │ Supabase Client (@supabase/supabase-js)
           ↓
┌──────────────────────┐
│   Supabase           │
│  - Auth              │
│  - PostgreSQL DB     │
│  - Storage           │
└──────────────────────┘
```

## 🗑️ What Was Removed

### Backend Folder ❌
- `backend/src/index.ts` - Express server entry point
- `backend/src/config/supabase.ts` - Supabase config
- `backend/src/middleware/auth.ts` - JWT middleware
- `backend/src/controllers/authController.ts` - Auth endpoints
- `backend/src/controllers/fileController.ts` - File endpoints
- `backend/src/routes/authRoutes.ts` - Auth routes
- `backend/src/routes/fileRoutes.ts` - File routes
- `backend/prisma/schema.prisma` - Prisma model definitions
- `backend/package.json` - Backend dependencies

### Frontend Changes (Cleaned Up)
- `frontend/src/services/apiClient.ts` - REST API client
- `frontend/src/context/AuthContext.tsx` - (replaced with Supabase client)
- `frontend/src/index.tsx` - Old React entry point
- `frontend/public/index.html` - Old React HTML template
- Removed `react-router-dom` dependency
- Removed `axios` dependency
- Removed `react-scripts` dependency

### Dependencies Removed

**Backend packages**:
- `express`, `cors`, `multer`
- `@prisma/client`, `prisma`
- `@supabase/supabase-js` (backend version)
- `jsonwebtoken`
- Authentication middleware

**Frontend packages**:
- `react-scripts` (create-react-app)
- `react-router-dom` (routing)
- `axios` (HTTP client)

## ✨ What Was Added

### New Next.js Structure

```
frontend/app/
├── page.tsx                    # Landing page (/)
├── login/page.tsx             # Login page (/login)
├── dashboard/page.tsx         # Dashboard (/dashboard)
├── staff/page.tsx             # Staff dashboard (/staff)
├── principal/page.tsx         # Principal dashboard (/principal)
└── president/page.tsx         # President dashboard (/president)
```

### New Components Library

```
frontend/components/
├── Navbar.tsx                 # Navigation bar
├── FileCard.tsx              # File display component
├── FileDetailsModal.tsx       # File details & history
├── UploadModal.tsx           # File upload dialog
└── ApprovalModal.tsx         # Approval/rejection modal
```

### Core Service Layer

```
frontend/lib/
├── supabaseClient.ts         # Supabase initialization
└── supabaseService.ts        # All Supabase queries (11 functions)
```

### Type System

```
frontend/types/
└── index.ts                  # TypeScript interfaces
```

### New Configuration Files

- `next.config.js` - Next.js configuration
- `tailwind.config.js` - Updated for app router
- `tsconfig.json` - Next.js TypeScript config
- `postcss.config.js` - CSS processing

## 🔄 How Queries Changed

### Before (Express + Prisma)

```typescript
// Backend: authentication/controller.ts
export async function registerUser(req, res) {
  const { email, password, name } = req.body;
  
  const user = await supabase.auth.signUp({
    email, password,
    data: { name, role: 'staff' }
  });
  
  res.json({ user });
}

// Frontend: axios call
const response = await api.post('/auth/register', {
  email, password, name
});
```

### After (Next.js + Supabase Direct)

```typescript
// Frontend: lib/supabaseService.ts (called directly from component)
export async function signUp(
  email: string,
  password: string,
  name: string,
  role: string = 'staff'
) {
  const { data, error } = await supabase.auth.signUp({
    email, password,
    options: {
      data: { name, role }
    }
  });
  if (error) throw error;
  return data;
}

// Component usage:
const user = await signUp(email, password, name, role);
```

## 📈 Benefits of the New Architecture

| Aspect | Before | After |
|--------|--------|-------|
| **Deployment** | 3 services (frontend, backend, DB) | 1 service (Next.js) |
| **Authentication** | JWT + middleware | Supabase Auth (built-in) |
| **Database Queries** | Prisma ORM | Direct Supabase queries |
| **Security** | API auth + middleware | RLS at database level |
| **Real-time Events** | Via polling | Supabase subscriptions ready |
| **Hosting** | Separate frontend/backend | Single Vercel deploy |
| **Complexity** | Higher | Lower |
| **Performance** | More hops | Direct to Supabase |
| **Maintenance** | Multiple codebases | Single codebase |

## 🔐 Security Model Changes

### Before
```
Frontend Request
  ↓ (with JWT token)
Express Middleware (verify token)
  ↓
Controller logic (access control)
  ↓
Prisma (no RLS)
  ↓
PostgreSQL (unprotected)
```

### After
```
Frontend Request
  ↓ (with Supabase session)
Supabase Client (JWT in cookie)
  ↓
PostgreSQL (RLS policies)
  ← Database enforces access control
```

The new model pushes security to the database level, which is better.

## 📝 Function Mapping

### Auth Functions

| Task | Before | After |
|------|--------|-------|
| Register | POST `/auth/register` | `signUp()` in supabaseService.ts |
| Login | POST `/auth/login` | `signIn()` in supabaseService.ts |
| Logout | POST `/auth/logout` | `signOut()` in supabaseService.ts |
| Get Profile | GET `/auth/profile` | `getUserProfile()` in supabaseService.ts |

### File Functions

| Task | Before | After |
|------|--------|-------|
| Upload | POST `/files/upload` | `uploadFile()` in supabaseService.ts |
| Get By Role | GET `/files/by-role` | `getFilesByRole()` in supabaseService.ts |
| Get Details | GET `/files/:id` | `getFileById()` in supabaseService.ts |
| Get History | GET `/files/:id/history` | `getApprovalHistory()` in supabaseService.ts |

### Approval Functions

| Task | Before | After |
|------|--------|-------|
| Principal Approve | POST `/files/:id/approve-principal` | `approveByPrincipal()` in supabaseService.ts |
| Principal Reject | POST `/files/:id/reject-principal` | `rejectByPrincipal()` in supabaseService.ts |
| President Approve | POST `/files/:id/approve-president` | `approveByPresident()` in supabaseService.ts |
| President Reject | POST `/files/:id/reject-president` | `rejectByPresident()` in supabaseService.ts |

## 🧵 Routing Changes

### Before (React Router)

```typescript
<BrowserRouter>
  <Routes>
    <Route path="/staff" element={<PrivateRoute><StaffDashboard/></PrivateRoute>} />
    <Route path="/principal" element={<PrivateRoute><PrincipalDashboard/></PrivateRoute>} />
  </Routes>
</BrowserRouter>
```

### After (Next.js App Router)

```
app/staff/page.tsx         → /staff
app/principal/page.tsx     → /principal
app/president/page.tsx     → /president
app/login/page.tsx         → /login
app/dashboard/page.tsx     → /dashboard
```

Files are automatically routed. Middleware can protect routes if needed.

## 🚀 Migration Checklist

If you had custom modifications, update them:

- ✅ API endpoints → Direct Supabase queries
- ✅ JWT handling → Supabase Auth session
- ✅ Database ORM → Supabase queries
- ✅ File uploads → Supabase Storage API
- ✅ Error handling → Try/catch with Supabase errors

## 💡 Performance Impact

**Build time**: Slightly faster (no backend build)
**Runtime**: Similar (Supabase is optimized)
**Cold start**: Better (serverless deployment)
**Bundle size**: Smaller frontend (less code)

## 🔮 Future Improvements

The new architecture makes these easier:

- ✅ Add real-time updates (Supabase subscriptions)
- ✅ Add analytics (Supabase logs)
- ✅ Add admin panel (Next.js route + RLS)
- ✅ Add email notifications (Supabase functions)
- ✅ Scale horizontally (already serverless)

## ❓ FAQ

**Q: Can I add an Express API later?**
A: Yes, but it's not needed. You can add custom routes if required.

**Q: How do I debug queries?**
A: Check browser Network tab → Supabase requests, or use Supabase Dashboard.

**Q: Is this production-ready?**
A: Yes! Deploy to Vercel and you're live.

**Q: What about the backend database?**
A: Single Supabase project - same database, same RLS.

---

**Migration complete!** 🎉 You're now on a modern, serverless, scalable architecture.
