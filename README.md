# V-Ride 🚗

> **Ride together. Pay less.**
> A premium ride-sharing web app for VIT-AP students travelling between Vijayawada, Guntur, Mangalagiri and nearby locations and VIT-AP University. Same route. Same destination. Share the ride. Split the cost.

Built with **Next.js 16 + TypeScript + Tailwind CSS 4 + Prisma + NextAuth + Framer Motion**. SQLite for local development. Production-ready.

---

## ✨ Features

### Core ride-sharing
- 🏠 **Home** — Hero, problem statement, how-it-works, savings calculator, route preview, testimonials
- 🔍 **Find Ride** — Vehicle selection (🏍️ Bike / 🚗 Car / 🛺 Auto), pickup + destination, recent + saved locations, route preview, fare breakdown, cost-split table, smart matching with match scores
- 📝 **Offer Ride** — Create your own ride, live per-head preview, success confirmation
- 🚗 **Ride Details** — Full route, vehicle number (demo), distance, ETA, fare breakdown, passenger list, payment split with Mark-as-Paid
- ✅ **Confirm Ride** — Final summary before joining, success animation
- 💬 **Chat** — Message bubbles, typing dots, quick replies, auto-reply simulation
- 🛰️ **Live Ride** — Animated vehicle marker moving along the route, status state machine (confirmed → arriving → started → on_the_way → arriving_soon → completed), remaining km/min, skip-to-arrival demo control
- 📜 **Ride History** — Filter (All/Upcoming/Completed/Cancelled), search by route, status badges
- 👤 **Profile** — Google profile picture, name, email, VIT-AP badge, ride stats, savings, login count, saved locations, vehicle preferences, reviews
- 🛡️ **Trust & Safety**, ℹ️ **About**, ❓ **How It Works** — Informational pages

### Authentication
- 🔐 **Google OAuth** via NextAuth v4 (server-side authorization-code flow — no tokens in browser)
- 🎓 **VIT-AP student verification** — exact domain check (`@vitapstudent.ac.in`), no substring matching
- 👑 **Admin authentication** — separate from Google, env-var driven password (link is at the bottom of every page in the footer)
- 🚪 **Protected routes** — Edge middleware protects `/admin/*` + `/api/admin/*`; client AuthGate protects SPA views
- 🍪 **Session persistence** — JWT cookies, survives refresh
- 🚪 **Logout** — proper session invalidation, success toast, redirect to login

### Admin dashboard
- 📊 6 summary cards (Total Customers, VIT-AP Students, Other Users, Total Rides, Active Rides, Completed Rides)
- 🔎 Customer table with search (name/email), filters (all/VIT-AP/non-VIT-AP/recent/most-rides), sorts (latest/oldest/most-rides/name)
- 👤 Customer details page (profile, stats, savings, login history, activity breakdown)
- 🛡️ Server-side protected — `/admin` cannot be accessed without the admin cookie

---

## 🚀 Windows Setup (Quick Start)

### Step 1 — Install Node.js 18+ (LTS recommended)

1. Go to https://nodejs.org/
2. Download the **Windows Installer (LTS)** — pick the 64-bit `.msi`
3. Run the installer — accept all defaults (this also installs `npm`)
4. Open **PowerShell** and verify:
   ```powershell
   node --version    # should print v18.x.x or higher
   npm --version
   ```

### Step 2 — Extract the project

1. Right-click the `v-ride.zip` file → **Extract All…** → choose a folder like `C:\Users\YourName\v-ride`
2. Open **PowerShell** and navigate into the project folder:
   ```powershell
   cd C:\Users\YourName\v-ride
   ```

### Step 3 — Install dependencies

```powershell
npm install
```

This also auto-runs `prisma generate` (via the `postinstall` hook) to set up the Prisma Client.

> ⏱️ Takes 2–5 minutes the first time. No action needed — just wait.

### Step 4 — Create your `.env` file

```powershell
# In PowerShell, from the project root:
Copy-Item .env.example .env
```

Now open the `.env` file in your text editor (VS Code, Notepad, etc.) and fill in the values:

```env
# SQLite database — RELATIVE path (works on Windows automatically)
DATABASE_URL=file:./db/custom.db

# NextAuth session secret — required for login to work.
# Generate one in PowerShell with this command:
#   [Convert]::ToBase64String((1..32 | ForEach-Object {Get-Random -Maximum 256}) -as [byte[]])
# Copy the output and paste below.
AUTH_SECRET=<paste your random string here>

# Google OAuth — Client ID is already filled in. Client Secret is required for Google login.
GOOGLE_CLIENT_ID=88169519604-8l8enudk3ofqifabbmjug2cel8a11hg4.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=<paste your Google Client Secret here>

# Admin dashboard password (already set — change in production)
ADMIN_PASSWORD=401840401840

# NextAuth URL — your deployment URL (local dev = localhost)
NEXTAUTH_URL=http://localhost:3000
```

> ⚠️ **Never commit `.env` to git.** It's already in `.gitignore`.

### Step 5 — Set up the database

```powershell
npm run db:push
```

This creates a `db\custom.db` SQLite file in the project folder with the full User schema. The `db\` folder is created automatically.

### Step 6 — Run the dev server

```powershell
npm run dev
```

Open **http://localhost:3000** in your browser. 🎉

> All npm scripts in this project are **Windows-compatible** — no `tee`, `cp`, or Unix-only commands. The scripts use plain `next dev`, `next build`, `next start`.

---

## 🌐 URLs (after `npm run dev`)

| URL | What |
|---|---|
| http://localhost:3000 | V-Ride main app (Home) |
| http://localhost:3000/#find | Find Ride |
| http://localhost:3000/#offer | Offer Ride |
| http://localhost:3000/#dashboard | Dashboard (requires login) |
| http://localhost:3000/#history | Ride History (requires login) |
| http://localhost:3000/#profile | Profile (requires login) |
| http://localhost:3000/login | Google login + role selection |
| http://localhost:3000/admin/login | Admin login (password: `401840401840`) — also linked from the **footer of every page** |
| http://localhost:3000/admin | Admin dashboard (requires admin cookie) |

---

## 🔧 Setting up Google OAuth (so students can sign in with their VIT-AP email)

If you want students to actually sign in with their VIT-AP email, configure Google OAuth:

### 1. Get your Google Client Secret

1. Go to https://console.cloud.google.com/apis/credentials
2. Find the OAuth 2.0 Client ID `88169519604-8l8enudk3ofqifabbmjug2cel8a11hg4.apps.googleusercontent.com`
3. Click it → **Client secret** → reveal and copy the value
4. Paste it into your `.env` file as `GOOGLE_CLIENT_SECRET=...`

### 2. Configure authorized origins + redirect URIs

In the same Google Cloud Console page, under **"Authorized JavaScript origins"** and **"Authorized redirect URIs"**, add:

**Authorized JavaScript origins:**
- `http://localhost:3000` (local dev)
- `https://v-ride.site.je` (production)

**Authorized redirect URIs:**
- `http://localhost:3000/api/auth/callback/google` (local dev)
- `https://v-ride.site.je/api/auth/callback/google` (production)

### 3. Restart the dev server

```powershell
# Press Ctrl+C to stop the current dev server, then:
npm run dev
```

Now visit http://localhost:3000/login → click "Continue with Google" → sign in with a `@vitapstudent.ac.in` email → VIT-AP badge unlocks ✅.

---

## 🛡️ VIT-AP Student Verification

The verification is centralized in `src/lib/auth-utils.ts`:

```typescript
isVitApStudent("lokesh@vitapstudent.ac.in")                  // true  ✅
isVitApStudent("lokesh@gmail.com")                           // false ❌
isVitApStudent("user@vitapstudent.ac.in.attacker.com")      // false ❌  (NOT substring — exact domain check)
```

The badge appears consistently in: navbar, profile, ride cards, ride details, passenger list, chat, dashboard, admin.

---

## 👑 Admin Dashboard

The admin dashboard lets you see all the customers who signed in via Google.

### Login

1. **Option A:** Visit http://localhost:3000/admin/login directly
2. **Option B:** Scroll to the bottom of any V-Ride page → click **"Admin Login"** in the footer
3. Enter password: `401840401840` (or whatever you set in `ADMIN_PASSWORD` env var)
4. Click "Enter admin dashboard"

### What you can do

- See 6 summary stat cards
- Search customers by name or email
- Filter by All / VIT-AP students / Non-VIT-AP / Recently active / Most rides
- Sort by Latest login / Oldest login / Most rides / Name A–Z
- Click a customer to see their full profile (rides, savings, login history, activity breakdown)

### Security

- The admin password is read from `ADMIN_PASSWORD` env var — **never** exposed to the browser bundle
- The admin cookie is HttpOnly, SameSite=Lax, Secure in production, HMAC-SHA256 signed
- `/admin/*` and `/api/admin/*` routes are server-side protected by Edge middleware — typing `/admin` in the URL bar without authentication redirects to `/admin/login`
- A normal Google user cannot become an admin

---

## 📁 Project Structure

```
v-ride/
├── .env.example               ← copy to .env and fill in
├── .env                       ← your secrets (gitignored)
├── package.json               ← Windows-compatible scripts
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── postcss.config.mjs
├── eslint.config.mjs
├── components.json
├── prisma/
│   └── schema.prisma          ← User model (auth + ride stats)
├── public/
│   ├── logo.svg
│   └── robots.txt
└── src/
    ├── app/
    │   ├── page.tsx           ← main SPA (V-Ride V3.0)
    │   ├── layout.tsx         ← fonts + toaster
    │   ├── globals.css        ← V-Ride theme
    │   ├── login/page.tsx     ← Google + role selection
    │   ├── admin/
    │   │   ├── login/page.tsx
    │   │   ├── page.tsx       ← admin dashboard
    │   │   └── customer/[id]/page.tsx  ← customer details
    │   └── api/
    │       ├── auth/[...nextauth]/route.ts  ← NextAuth
    │       ├── auth/config/route.ts         ← OAuth config check
    │       ├── me/route.ts                  ← current user
    │       └── admin/
    │           ├── login/route.ts           ← admin auth
    │           ├── customers/route.ts       ← customer list
    │           └── customer/[id]/route.ts  ← customer details
    ├── middleware.ts          ← protects /admin + /api/admin (Edge)
    ├── lib/
    │   ├── auth.ts            ← NextAuth config (Google + admin)
    │   ├── auth-utils.ts     ← isVitApStudent() exact domain check
    │   ├── admin-token.ts    ← Edge-compatible HMAC tokens
    │   ├── db.ts              ← Prisma client
    │   ├── mock.ts            ← V-Ride mock data
    │   ├── store.ts          ← Zustand store
    │   ├── types.ts
    │   ├── format.ts
    │   └── motion.ts
    ├── hooks/
    │   ├── use-current-user.ts   ← /api/me client hook
    │   ├── use-hash-route.ts     ← SPA routing
    │   ├── use-mobile.ts
    │   ├── use-local-storage.ts
    │   └── use-toast.ts
    └── components/
        ├── vride/             ← 22 reusable V-Ride components (Navbar, Footer with Admin link, Hero, RideCard, SearchForm, VehicleSelector, FareBreakdown, CostSplitTable, RouteVisualization, ChatPanel, LiveRideTracker, StatusBadge, AuthGate, etc.)
        └── views/             ← 13 page views
```

---

## 🧪 Testing the Full Flow

### Admin flow (works immediately, no Google needed)

1. Visit http://localhost:3000/admin/login (or scroll to footer → "Admin Login")
2. Enter password: `401840401840`
3. See the admin dashboard with stat cards + customer list
4. Search/filter/sort customers
5. Click a customer to see their full profile
6. Click Logout → returns to admin login

### Student flow (requires Google OAuth configured per the steps above)

1. Visit http://localhost:3000/login
2. Pick role: Student Customer or Driver
3. Click "Continue with Google"
4. Sign in with Google (use a `@vitapstudent.ac.in` email to unlock the VIT-AP badge)
5. Land on Home → "Good morning, [Your Name] 👋"
6. Click **Find Ride** → choose vehicle → enter pickup + destination → search → see matches
7. Click a ride → see details → click **Join this Ride** → confirm
8. Open Chat → send messages → see auto-replies
9. Click **Start demo live ride** → watch the vehicle marker move along the route
10. Ride completes → see payment split → mark your payment as Paid
11. Visit Dashboard → see live ride banner, stats, recent rides
12. Visit Profile → see your Google picture, name, VIT-AP badge, ride stats
13. Click Logout → returns to login page

---

## 🚀 Production Deployment

### Vercel (recommended, easiest)

1. Push the project to GitHub
2. Go to https://vercel.com → "New Project" → import your repo
3. Add environment variables in Vercel dashboard:
   - `DATABASE_URL` — set to a persistent Postgres URL (Vercel Postgres, Supabase, Neon, etc.)
   - `AUTH_SECRET` — generate with `openssl rand -base64 32` (use WSL or online generator)
   - `GOOGLE_CLIENT_ID` — `88169519604-8l8enudk3ofqifabbmjug2cel8a11hg4.apps.googleusercontent.com`
   - `GOOGLE_CLIENT_SECRET` — from Google Cloud Console
   - `ADMIN_PASSWORD` — your admin password
   - `NEXTAUTH_URL` — `https://your-domain.vercel.app` (or your custom domain)
4. Run `prisma db push` once (Vercel supports this via the build command: `npx prisma db push && next build`)
5. Deploy — Vercel handles the rest

> ⚠️ For production, **switch from SQLite to a real Postgres** database. SQLite doesn't persist across serverless function invocations. Vercel Postgres, Supabase, or Neon all work with Prisma — just change the `DATABASE_URL` and the `provider` in `prisma/schema.prisma` from `sqlite` to `postgresql`.

### Custom domain (`v-ride.site.je`)

1. Deploy to Vercel → get your `*.vercel.app` URL
2. Add a custom domain `v-ride.site.je` in Vercel project settings
3. In Google Cloud Console, add to authorized redirect URIs:
   - `https://v-ride.site.je/api/auth/callback/google`
4. Update `NEXTAUTH_URL` env var to `https://v-ride.site.je`

---

## 🛠️ Available Scripts (all Windows-compatible)

| Command | What it does |
|---|---|
| `npm run dev` | Start dev server on http://localhost:3000 |
| `npm run build` | Production build (creates `.next/` folder) |
| `npm run start` | Run production server (after `npm run build`) |
| `npm run lint` | Run ESLint to check code quality |
| `npm run db:push` | Apply Prisma schema to SQLite database |
| `npm run db:generate` | Regenerate Prisma Client |
| `npm run db:migrate` | Create a new Prisma migration |
| `npm run db:reset` | Reset the database (destroys all data!) |

> No `tee`, `cp`, `NODE_ENV=production` inline, or Unix-only commands. Just plain `next dev`, `next build`, `next start`.

---

## ⚠️ Common Issues

| Problem | Fix |
|---|---|
| `'tee' is not recognized` | Already fixed in V3.0 — scripts are Windows-compatible |
| `EADDRINUSE :3000` | Another process is using port 3000 — kill it or change port in `package.json` |
| `PrismaClientInitializationError` | Run `npm run db:push` first to create the SQLite file |
| Google login button shows error | `GOOGLE_CLIENT_SECRET` is missing in `.env` |
| `OAuth: redirect_uri_mismatch` | Add `http://localhost:3000/api/auth/callback/google` to Google Cloud Console authorized redirect URIs |
| Session lost on refresh | `AUTH_SECRET` is missing or empty |
| Admin login fails | Make sure `ADMIN_PASSWORD` env var is set (default: `401840401840`) |
| `/admin` redirects to `/admin/login` | You're not authenticated — go to `/admin/login` first (or use the footer link) |
| `'openssl' is not recognized` | Use the PowerShell command in Step 4 instead: `[Convert]::ToBase64String((1..32 | ForEach-Object {Get-Random -Maximum 256}) -as [byte[]])` |

---

## 🎨 Design System

- **Color palette:** emerald + lime accent on dark ink (NO blue/indigo)
- **Typography:** Plus Jakarta Sans (display) + Inter (body)
- **Spacing:** Tailwind's default spacing scale
- **Border radius:** rounded-2xl (1rem) for cards, rounded-3xl (1.5rem) for panels
- **Shadows:** Soft shadows + glow effects
- **Animations:** Framer Motion for page transitions, card hovers, status pulses, route line drawing

---

## 🔐 Security Notes

- Google OAuth uses server-side authorization-code flow — no tokens in browser
- `GOOGLE_CLIENT_SECRET` is read from env, never in client bundle
- `ADMIN_PASSWORD` is read from env, never in client bundle
- Admin cookie is HttpOnly, SameSite=Lax, Secure in production, HMAC-SHA256 signed
- Middleware runs in Edge Runtime — uses Web Crypto (SubtleCrypto)
- VIT-AP verification uses exact domain === check (not substring) — rejects `attacker.com` suffix
- Unique constraints on `googleId` + `email` prevent duplicate customer records
- No Google passwords or tokens stored in the database

---

## 📝 License

Prototype for the VIT-AP pitch battle. Free to use for educational / demo purposes.

---

<p align="center">
  Made for VIT-AP students ❤️<br>
  <strong>V-Ride — Ride together. Pay less.</strong>
</p>
