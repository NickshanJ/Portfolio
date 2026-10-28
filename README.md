# Nickshan J — Portfolio V3

A personal developer portfolio built with **React + Vite** on the frontend and **Node.js + Express + MongoDB** on the backend. This version introduces a full CMS-style **Admin Dashboard** that lets you manage every piece of content on the live site — without touching a single line of code.

🌐 **Live:** [nickshanjportfolio.netlify.app](https://nickshanjportfolio.netlify.app/)

---

## ✨ What's New in V3

The big change in V3 is that nothing on the site is hardcoded anymore. Every piece of content — role titles, bio, skills, projects, resume — is stored in **MongoDB Atlas** and served through a REST API. The frontend fetches everything at runtime, and an **admin-only dashboard** (behind JWT authentication) lets you create, edit, and delete content from a clean UI.

---

## 🗂 Project Structure

```
portfolio/
├── server/                  ← Node.js + Express backend
│   ├── middleware/
│   │   └── auth.js          ← JWT auth guard (requireAdmin)
│   ├── models/
│   │   ├── About.js         ← About page schema
│   │   ├── Project.js       ← Project schema
│   │   ├── Skill.js         ← Skill schema
│   │   └── SiteSettings.js  ← Home settings + resume URL schema
│   ├── routes/
│   │   ├── authRoutes.js         ← POST /api/auth/login
│   │   ├── aboutRoutes.js        ← Public About fetch
│   │   ├── adminAboutRoutes.js   ← Admin About CRUD
│   │   ├── projectRoutes.js      ← Public Projects fetch
│   │   ├── adminProjectRoutes.js ← Admin Projects CRUD
│   │   ├── skillRoutes.js        ← Public Skills fetch
│   │   ├── adminSkillRoutes.js   ← Admin Skills CRUD
│   │   ├── settingsRoutes.js     ← Home settings + Resume URL
│   │   └── uploadRoutes.js       ← Cloudinary image/PDF uploads
│   ├── server.js            ← Express app entry point
│   └── .env                 ← Backend secrets (not in repo)
│
├── src/                     ← React + Vite frontend
│   ├── components/
│   │   ├── ConfirmationModal.jsx ← Reusable confirm dialog
│   │   ├── DynamicText.jsx       ← Typing animation
│   │   ├── Intro.jsx             ← Animated intro/splash screen
│   │   ├── Modal.jsx             ← Success/error popup
│   │   └── Navbar.jsx            ← Responsive navigation bar
│   ├── pages/
│   │   ├── Home.jsx       ← Home page (dynamic from API)
│   │   ├── About.jsx      ← About page (dynamic from API)
│   │   ├── Skills.jsx     ← Skills grid (dynamic from API)
│   │   ├── Projects.jsx   ← Projects showcase (dynamic from API)
│   │   ├── Contact.jsx    ← Contact form (Web3Forms)
│   │   ├── Admin.jsx      ← Auth wrapper (login / dashboard)
│   │   └── admin/
│   │       ├── Login.jsx             ← Admin login form
│   │       ├── Dashboard.jsx         ← Main admin layout + sidebar
│   │       ├── HomeManagement.jsx    ← Edit Home page content
│   │       ├── AboutManagement.jsx   ← Edit About page content
│   │       ├── SkillManagement.jsx   ← Manage skills list
│   │       ├── ProjectManagement.jsx ← Manage projects
│   │       └── ResumeManagement.jsx  ← Upload/replace resume PDF
│   ├── seo/
│   │   ├── SEO.jsx        ← react-helmet-async wrapper
│   │   └── seoData.js     ← Per-page title + meta descriptions
│   ├── App.jsx            ← Router (lazy-loaded pages)
│   ├── App.css            ← Full design system (black + cyan)
│   └── main.jsx           ← Vite entry point
│
├── index.html
├── vite.config.js
└── .env                   ← Frontend secrets (not in repo)
```

---

## 🖥 Frontend Pages

### 🏠 Home (`/`)

The home page fetches four things from the API when it loads:

| Data               | Endpoint                   | What it drives                                                                                        |
| ------------------ | -------------------------- | ----------------------------------------------------------------------------------------------------- |
| Home settings      | `GET /api/settings/home`   | Role titles (typing animation), hero description, experience years stat, terminal display name        |
| Resume URL         | `GET /api/settings/resume` | The "Resume" download button (disabled if no URL is set)                                              |
| Published projects | `GET /api/projects`        | `git log` section inside the terminal card (shows up to 4 project names)                              |
| Published skills   | `GET /api/skills`          | `cat skills.json` section inside the terminal card (auto-categorised into frontend / backend / tools) |

The right side of the home page shows a **fake bash terminal** that is dynamically populated from your live database. The skills are automatically sorted into three groups using keyword lists baked into the component.

Stats in the bottom-left (`Projects Built`, `Technologies`, `Years Learning`) also update automatically from the API response.

---

### 👤 About (`/about`)

Fetches from `GET /api/about`. Everything shown is editable through the admin dashboard:

- **Profile image** — Cloudinary-hosted photo. Falls back to a local `.webp` if no image is uploaded yet.
- **Bio paragraphs** — Each paragraph is stored with an `order` field so you can rearrange them in the dashboard. Supports `**bold**` markdown syntax for highlighted text.
- **Info cards** — Key–value pairs like Name, Role, Location, Email. Shown in a responsive grid below the bio.
- **Resume download button** — Pulls the PDF URL from the same settings endpoint used by the home page.

Social links (LinkedIn, GitHub, Email, WhatsApp) are hardcoded in the component because they don't change.

---

### 🛠 Skills (`/skills`)

Fetches from `GET /api/skills`. Only skills with `published: true` are shown.

Skills are displayed in a responsive grid. Each tile shows an icon + label with a hover glow effect.

**How icons work:** Icons use the **Iconify Design API**. When you add a skill in the admin panel, you can enter either:

- A **short name** like `react`, `mysql`, `tailwind`, `docker`, `python` — the system automatically resolves it to the correct Iconify identifier via a built-in alias map (`SIMPLE_ICON_ALIASES`).
- A **full Iconify identifier** like `simple-icons:react` or `logos:docker` for any icon from any supported Iconify collection.

The Skills page constructs a URL like:

```
https://api.iconify.design/simple-icons/react.svg
```

...and renders the icon using a **CSS mask** technique: the SVG is used as a mask shape, and `backgroundColor` is set to the brand colour you picked. This means changing a skill's colour never triggers a new network request — the same icon URL is reused and only the CSS colour changes.

If an icon URL fails to load (e.g. an unknown identifier), a fallback box showing the first letter of the skill name is displayed instead of breaking silently.

There is also a `LEGACY_ICONS` mapping that translates old React Icons names (like `FaReact`) to their Iconify equivalents, so skills saved before the Iconify migration still display correctly.
---

### 📁 Projects (`/projects`)

Fetches from `GET /api/projects`. Projects are sorted by the `order` field and only published ones are shown.

- **Tab switcher** at the top — click a numbered tab to switch between projects.
- **Showcase card** — large split card with the project image on the left and title, description, tech stack chips, and links on the right.
- **Mini-grid** below shows all other projects as small clickable cards.
- On mobile, tabs show the number only (`01`, `02`, …) to save space.

Each project can have:

- Title, description, category
- Project image (Cloudinary)
- Up to 20 technology tags
- Live demo URL
- Frontend GitHub repo URL
- Backend GitHub repo URL
- A `featured` flag and a `published` flag
- An `order` number for sorting

---

### 📬 Contact (`/contact`)

The contact form uses **Web3Forms**. When someone submits the form, it posts to `https://api.web3forms.com/submit` with your access key. A success or error modal appears after submission. The form includes a honeypot field to filter spam bots.

Contact rows (Email, LinkedIn, GitHub, WhatsApp) on the left are static.

---

## 🔐 Admin Dashboard (`/admin`)

The admin panel lives at `/admin`. It's a single-page experience with a sidebar for navigation, completely separate from the public portfolio (no navbar, no intro animation).

### How authentication works

1. You go to `/admin`.
2. The app checks `sessionStorage` for a saved token and validates it against the backend. If it's valid, you're taken straight to the dashboard.
3. If not, the login form appears.
4. You enter your admin username and password. The backend compares the username against `ADMIN_USERNAME` and the password against a **bcrypt hash** stored in `ADMIN_PASSWORD_HASH` (in the server `.env`). You never store the plain-text password.
5. On success, a **JWT** (expires in 2 hours) is issued. The frontend stores it in `sessionStorage`.
6. Every admin API request sends this token in the `Authorization: Bearer <token>` header. The `requireAdmin` middleware validates it on every protected route.
7. Login attempts are rate-limited to **5 per 15 minutes** per IP using `express-rate-limit`.

### Dashboard sections

#### Overview

A summary page with three stat cards (Projects, Skills, Resume) and clickable preview cards for every content section. Click any card to jump directly to that section's editor.

#### 🏠 Home Management

Edit the content that drives the Home page:

- **Role titles** — a list of strings that cycle through the typing animation (e.g. "Front-End Developer", "MERN Full Stack Developer", "React Developer").
- **Hero description** — the paragraph shown below the role title.
- **Experience years** — the number shown in the "Years Learning" stat.
- **Terminal display name** — the name shown in the bash terminal header and `whoami` output.

All changes are saved to MongoDB with `PUT /api/settings/admin/home`.

#### 👤 About Management

- **Upload profile image** — pick a JPG/PNG/WebP (max 5 MB). It's uploaded to Cloudinary under `portfolio/about/` and the URL is saved in MongoDB.
- **Edit bio paragraphs** — a list of text areas. You can add, edit, remove, and reorder paragraphs. The `order` index is saved automatically.
- **Edit info cards** — label/value pairs like "Name → J. Nickshan". Same add/remove/reorder workflow.

Saved with `PUT /api/admin/about`.

#### ?? Skill Management

- **Add skill** — enter the skill name, an icon identifier (short name like `react` or full Iconify ID like `logos:docker`), a brand hex colour, and an order number. The order auto-increments to the next available value so you don't have to count manually.
- **Live icon preview** — as you type the icon identifier, a preview box renders the icon in real time. The resolved Iconify identifier is also shown below the input so you know exactly what gets stored.
- **Edit skill** — inline form to update any field.
- **Toggle visibility** — the `published` toggle lets you hide a skill without deleting it.
- **Delete skill** — confirmation modal before deleting.
- **Reorder** — set the `order` number for each skill to control display order on the Skills page.
- **Skill stats** — a summary line shows the total count, how many are published, and how many are drafts.

Skills API:

- `GET /api/admin/skills` — list all skills including unpublished
- `POST /api/admin/skills` — create
- `PUT /api/admin/skills/:id` — update
- `DELETE /api/admin/skills/:id` — delete

#### 📁 Project Management

Full CRUD for projects. Each project has:

- **Title** (required, max 120 chars)
- **Description** (required, max 3000 chars)
- **Image** — upload to Cloudinary (stored under `portfolio/projects/`)
- **Technologies** — up to 20 tags, shown as chips on the project card
- **Live URL** — displayed as a "Live Demo" badge on the project image
- **Frontend repo URL** + **Backend repo URL** — shown as "Frontend Code" and "Backend Code" links
- **Category** — e.g. "Web Development"
- **Order** — controls tab order on the Projects page
- **Published** toggle — draft projects are visible in the admin but not on the live site
- **Featured** flag — for future filtering

Projects API:

- `GET /api/admin/projects` — list all (including drafts)
- `POST /api/admin/projects` — create
- `PUT /api/admin/projects/:id` — update
- `DELETE /api/admin/projects/:id` — delete

#### 📄 Resume Management

- **Upload resume PDF** — pick a PDF (max 10 MB). It's uploaded to Cloudinary under `portfolio/resume/` as a raw file and the Cloudinary URL is saved in MongoDB.
- The public `GET /api/settings/resume` endpoint returns this URL to the Home and About pages, which use it for the download button.

---

## ☁️ File Storage — Cloudinary

All uploaded files (profile image, project images, resume PDF) are stored on **Cloudinary**, not on the server disk. This is important because serverless and PaaS deployments (like Render) don't have persistent file storage.

**How it works:**

1. The admin picks a file in the dashboard.
2. The frontend sends it as `multipart/form-data` to the backend upload endpoint.
3. The backend uses **Multer** (with memory storage — the file never touches disk) to parse the upload.
4. The file buffer is streamed to Cloudinary using `cloudinary.uploader.upload_stream()`.
5. Cloudinary returns a `secure_url` and a `public_id`. Both are saved to MongoDB.
6. The frontend receives the URL and displays it immediately.

**Upload limits:**

| Type          | Max Size | Allowed Formats |
| ------------- | -------- | --------------- |
| Project image | 5 MB     | JPG, PNG, WebP  |
| Profile image | 5 MB     | JPG, PNG, WebP  |
| Resume PDF    | 10 MB    | PDF             |

Cloudinary folders:

- `portfolio/projects/` — project images
- `portfolio/about/` — profile photo
- `portfolio/resume/` — resume PDF

---

## 🗄 Database — MongoDB Atlas

Four collections are used:

| Collection     | Purpose                                                                |
| -------------- | ---------------------------------------------------------------------- |
| `projects`     | All portfolio projects                                                 |
| `skills`       | All skills/technologies                                                |
| `abouts`       | The single About page document (profile image, paragraphs, info items) |
| `sitesettings` | Single global settings document (resume URL + home page config)        |

The `about` and `sitesettings` collections use a **singleton pattern** — there is only ever one document per collection, identified by a fixed `key` field (`"about"` / `"global"`). `findOneAndUpdate` with `upsert: true` is used so the document is created automatically on first save.

---

## 🔌 REST API Reference

### Public Endpoints (no auth required)

| Method | Endpoint               | Description                    |
| ------ | ---------------------- | ------------------------------ |
| GET    | `/api/projects`        | List all published projects    |
| GET    | `/api/skills`          | List all published skills      |
| GET    | `/api/about`           | Get the About page content     |
| GET    | `/api/settings/resume` | Get the resume download URL    |
| GET    | `/api/settings/home`   | Get home page settings         |
| POST   | `/api/auth/login`      | Admin login (returns JWT)      |
| GET    | `/api/health`          | Server + database health check |

### Admin Endpoints (JWT required)

| Method | Endpoint                     | Description                             |
| ------ | ---------------------------- | --------------------------------------- |
| GET    | `/api/admin/projects`        | List all projects (including drafts)    |
| POST   | `/api/admin/projects`        | Create a project                        |
| PUT    | `/api/admin/projects/:id`    | Update a project                        |
| DELETE | `/api/admin/projects/:id`    | Delete a project                        |
| GET    | `/api/admin/skills`          | List all skills (including unpublished) |
| POST   | `/api/admin/skills`          | Create a skill                          |
| PUT    | `/api/admin/skills/:id`      | Update a skill                          |
| DELETE | `/api/admin/skills/:id`      | Delete a skill                          |
| GET    | `/api/admin/about`           | Get About content                       |
| PUT    | `/api/admin/about`           | Save About content                      |
| PUT    | `/api/settings/admin/resume` | Save resume URL                         |
| PUT    | `/api/settings/admin/home`   | Save home page settings                 |
| POST   | `/api/uploads/project-image` | Upload project image to Cloudinary      |
| POST   | `/api/uploads/about-image`   | Upload profile photo to Cloudinary      |
| POST   | `/api/uploads/resume`        | Upload resume PDF to Cloudinary         |

---

## 🎨 Design System

| Property             | Value                          |
| -------------------- | ------------------------------ |
| Background           | `#020207` (deep black)         |
| Accent               | `#00D4FF` (electric cyan)      |
| Heading font         | Space Grotesk (700)            |
| Body font            | Space Grotesk (400 / 500)      |
| Mono / terminal font | Space Mono                     |
| Cards                | `rgba(255,255,255,0.03)` glass |
| Dot grid             | Global CSS background pattern  |

The admin dashboard uses **Tailwind CSS** with a dark `#030609` background, while the public portfolio uses vanilla CSS defined in `App.css`.

---

## 📦 Key Packages

### Frontend

| Package                       | Why it's used                                          |
| ----------------------------- | ------------------------------------------------------ |
| `react` + `react-dom`         | UI framework                                           |
| `react-router-dom`            | Client-side routing                                    |
| `react-icons`                 | Icon components (FiDownload, FaLinkedin, FiSend, etc.) |
| `react-helmet-async`          | Per-page SEO (title + meta description)                |
| `react-typed` / `DynamicText` | Typing animation on the home page                      |
| `tailwindcss`                 | Admin dashboard styling                                |
| `prop-types`                  | Runtime prop validation                                |
| `vite`                        | Build tool and dev server                              |

> **Icons on the Skills page** use the **Iconify Design API** (`api.iconify.design`) — not a local package. You pass an identifier like `simple-icons:react` and the API returns the SVG. This means you can use any icon from thousands of icon sets without installing anything.

### Backend

| Package              | Why it's used                                        |
| -------------------- | ---------------------------------------------------- |
| `express`            | Web framework                                        |
| `mongoose`           | MongoDB ODM                                          |
| `cloudinary`         | File uploads (images + PDF)                          |
| `multer`             | Parse `multipart/form-data` uploads (memory storage) |
| `bcryptjs`           | Hash and compare the admin password                  |
| `jsonwebtoken`       | Issue and verify JWTs for admin sessions             |
| `express-rate-limit` | Protect the login endpoint from brute force          |
| `cors`               | Allow requests from the frontend origin              |
| `dotenv`             | Load environment variables from `.env`               |

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- npm
- A MongoDB Atlas account (free tier works fine)
- A Cloudinary account (free tier works fine)
- A Web3Forms account (free) for the contact form

### 1. Clone the repo

```bash
git clone https://github.com/NickshanJ/Portfolio.git
cd Portfolio
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Install backend dependencies

```bash
cd server
npm install
```

### 4. Configure environment variables

**Frontend** — create `.env` in the project root:

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_WEB3FORMS_KEY=your_web3forms_access_key
```

**Backend** — create `server/.env`:

```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string

ADMIN_USERNAME=your_chosen_username
ADMIN_PASSWORD_HASH=your_bcrypt_hashed_password

JWT_SECRET=a_long_random_secret_string

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

> **Generating the password hash:** Run a one-off script in the `server/` directory:
>
> ```js
> import bcrypt from "bcryptjs";
> console.log(await bcrypt.hash("your_password", 12));
> ```
>
> Paste the output into `ADMIN_PASSWORD_HASH`. Never store the plain-text password anywhere.

### 5. Run locally

Open two terminals:

**Terminal 1 — Backend:**

```bash
cd server
npm run dev
```

Backend runs at `http://localhost:5000`

**Terminal 2 — Frontend:**

```bash
npm run dev
```

Frontend runs at `http://localhost:5173`

### 6. Access the admin panel

Go to `http://localhost:5173/admin` and log in with the username and password you set.

---

## 🌍 Deployment

| Service                       | What's deployed               |
| ----------------------------- | ----------------------------- |
| **Netlify**                   | Frontend (React + Vite build) |
| **Render** (or any Node host) | Backend (Express server)      |
| **MongoDB Atlas**             | Database                      |
| **Cloudinary**                | File storage                  |

For Netlify, set the `VITE_*` variables in the Netlify dashboard under **Site Settings → Environment Variables**.

For the backend host, set all `server/.env` variables in the platform's environment variable settings.

Make sure the backend's `allowedOrigins` list in `server.js` includes your Netlify domain.

---

## 🛡 Security

- Admin password is never stored in plain text — only a bcrypt hash lives in the environment variable.
- JWTs expire after **2 hours**.
- Login is rate-limited to 5 attempts per 15 minutes per IP.
- All admin routes are protected by the `requireAdmin` middleware which verifies the JWT on every request.
- CORS is configured to allow only the frontend origin (localhost in dev, Netlify URL in production).
- All secrets are in `.env` files excluded from version control via `.gitignore`.

---

## 📬 Contact

| Channel  | Link                                                                |
| -------- | ------------------------------------------------------------------- |
| LinkedIn | [linkedin.com/in/nickshanj](https://www.linkedin.com/in/nickshanj/) |
| GitHub   | [github.com/NickshanJ](https://github.com/NickshanJ)                |
| Email    | nickshan001@gmail.com                                               |
| WhatsApp | +91 73581 76388                                                     |
