# ERRS - Essential Resource Redistribution System

MERN project (MongoDB Atlas, Express, React, Node). This repository currently has **Module 1: User Management**
(SRS FR01 and FR10): register, log in, role-based access (Donor, Beneficiary, Admin), profile, and admin control of user accounts.

```
errs/
  backend/    Express + Mongoose API  (port 5000)
  frontend/   React + Vite + Tailwind CSS  (port 5173)
```

## 1. One-time setup (Windows, Command Prompt)

Install **Node.js LTS** (nodejs.org) and **Git** (git-scm.com), then check:

```
node -v
npm -v
git --version
```

### Shared MongoDB Atlas database (the team lead does this once)
1. Create a free account at mongodb.com/atlas and create a free **M0** cluster.
2. **Database Access** > Add New Database User > choose a username and a simple password (letters and numbers only). Role: Read and write to any database.
3. **Network Access** > Add IP Address > **Allow access from anywhere** (0.0.0.0/0), so all three team members can connect.
4. **Database** > Connect > Drivers > copy the connection string and add the database name before the `?`:
   `mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/resource_redistribution?retryWrites=true&w=majority`
5. Send this string and a `JWT_SECRET` (any long random text) to the other two members **privately** (not on GitHub).

## 2. Install and run

```
cd errs\backend
npm install
copy .env.example .env
notepad .env
npm run seed
npm run dev
```

In `.env`, paste the shared `MONGODB_URI` and `JWT_SECRET`. `npm run seed` creates the admin and sample users; it is safe to run more than once (it skips existing emails), and only one member needs to run it.

Open a **second** Command Prompt:

```
cd errs\frontend
npm install
npm run dev
```

Open http://localhost:5173

| Account | Email | Password |
|---|---|---|
| Admin | admin@errs.org | Admin@123 |
| Donor | green@grocers.com | Pass@123 |
| Beneficiary | hope@ngo.org | Pass@123 |

## 3. What this module does

| Feature | Who | Where |
|---|---|---|
| Register (Donor or Beneficiary), log in, log out | everyone | `/register`, `/login` |
| Role-based pages and API access | all roles | `ProtectedRoute`, `authorize()` |
| View and edit own profile, change password | logged-in users | `/profile` |
| List, search, filter, edit and delete users; change roles | Admin | `/admin/users` |
| Passwords stored as bcrypt hashes | - | `models/User.js` |

API (all under `/api`):

| Method | Path | Access |
|---|---|---|
| POST | `/auth/register`, `/auth/login` | public |
| GET | `/auth/me` | logged in |
| PUT | `/users/me`, `/users/me/password` | logged in |
| GET | `/users` (`?q=&role=`), `/users/stats`, `/users/:id` | Admin |
| PUT | `/users/:id` | Admin (cannot change own role) |
| DELETE | `/users/:id` | Admin (cannot delete self or other admins) |

## 4. Upload to GitHub (first time, by one member)

Create an **empty** repository named `errs` on github.com (do not add a README), then:

```
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
cd errs
git init
git add .
git status
git commit -m "Add User Management module (backend and frontend)"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/errs.git
git push -u origin main
```

Check that `git status` does **not** list `.env` or `node_modules` before committing (the `.gitignore` already excludes them).
On GitHub: Settings > Collaborators > add the other two members.

### Teammates
```
git clone https://github.com/YOUR-USERNAME/errs.git
cd errs
```
then follow section 2 (create your own `backend\.env`).

### Adding the next modules
```
git checkout main
git pull
git checkout -b feature/resource-management
git add .
git commit -m "Add Resource Management module"
git push -u origin feature/resource-management
```
Then open a Pull Request on GitHub and merge it into `main`.

## 5. Adding a module later
- Backend: add `models/`, `controllers/`, `routes/` files and one line in `backend/src/app.js`. Protect routes with `protect` and `authorize('Donor')` etc.
- Frontend: add a page in `frontend/src/pages/` and a `<Route>` in `frontend/src/App.jsx`.
- Deleting users: when Resource and Request modules exist, decide what happens to a deleted user's listings and requests.
