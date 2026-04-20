# Nickshan J — Portfolio

A personal developer portfolio built with **React + Vite**, featuring a deep black & electric cyan design, separate page routing, and a fully responsive layout. Each page is designed to fit the screen on desktop without requiring scrolling.

---

## 🚀 Live Features

- **Full-viewport pages** — Home, About, Skills, and Contact each fit the screen on desktop. No scrolling needed.
- **Separate page routing** — Each section is a standalone page (React Router DOM).
- **Projects tab switcher** — Click numbered tabs to switch between projects. Mini-card previews for other projects shown below.
- **Terminal card on Home** — An animated bash terminal on the right side of the home page showing skills, git log, and server status.
- **Typing animation** — Role titles cycle through: Front-End Developer → MERN Full Stack Developer → React Specialist.
- **Responsive design** — Stacks vertically on tablet and mobile. Terminal card moves below text. About image centered and full-width on smaller screens.
- **EmailJS contact form** — Working contact form with modal success/error notification.
- **Animated cyan checkmark modal** — Appears on successful message send.

- Live - https://nickshanjportfolio.netlify.app/

---

## 🎨 Design System

| Property   | Value                        |
|------------|------------------------------|
| Background | `#020207` (deep black)       |
| Accent     | `#00D4FF` (electric cyan)    |
| Heading    | Space Grotesk (700)          |
| Body       | Space Grotesk (400/500)      |
| Mono/Code  | Space Mono                   |
| Cards      | `rgba(255,255,255,0.03)` glass |
| Dot grid   | Global CSS background pattern |

---

## 📄 Pages & Components

### 🏠 Home (`/`)
- Left column: Status badge, name, typing role, description, CTA buttons (Resume + View Projects), stats (4+ Projects, 10+ Technologies, 2+ Years)
- Right column: Animated bash terminal card — shows `whoami`, `cat skills.json`, `git log`, and server status
- Terminal hidden → stacks below text on tablet/mobile

### 👤 About (`/about`)
- Left: Profile photo with cyan glow border, MERN badge, social icon links (LinkedIn, GitHub, Email, WhatsApp)
- Right: Expanded bio (3 paragraphs), 2×2 info grid (Name, Role, Location, Email), Download Resume + Get In Touch buttons
- Tablet/Mobile: Photo centred at full width, content below

### 🛠 Skills (`/skills`)
- 4-column responsive grid (3-col tablet, 2-col mobile)
- 11 skills: HTML5, CSS3, Tailwind CSS, JavaScript, React.js, Node.js, Express.js, MongoDB, MySQL, GitHub, **Postman**
- Each tile has top cyan bar sweep on hover, brand colour icon glow

### 📁 Projects (`/projects`)
- Numbered tab switcher: `01 — Vehicle Rental`, `02 — Movies Search`, `03 — Student Portal`, `04 — Event System`
- Mobile: tabs show numbers only (`01`, `02`, `03`, `04`) to save space
- Active project: large showcase split card (image left, info right)
- Mini-grid preview of the other 3 projects below
- Page is scrollable (more projects can be added easily)

**Current Projects:**
1. **Online Vehicle Rental** — MongoDB, Express, React, Node.js, Tailwind, Razorpay
2. **Movies Search App** — React, JavaScript, HTML, CSS, Tailwind CSS
3. **Student Teacher Portal** — MongoDB, Express, React, Node.js, Tailwind CSS
4. **Event Management System** — MongoDB, Express, React, Node.js, Tailwind CSS

### 📬 Contact (`/contact`)
- Left: Intro paragraph + 4 clickable contact rows (Email, LinkedIn, GitHub, WhatsApp) with hover slide animation
- Right: Glass-card form — Name, Email, Message, Send button
- Footer: copyright + social icon links
- Page fits screen on desktop without scrolling

---

## 🛠️ Technologies Used

**Frontend:** React.js, React Router DOM, Tailwind CSS, Space Grotesk, Space Mono

**Icons:** React Icons (FaLinkedin, FaGithub, SiPostman, FiSend, etc.)

**Email:** EmailJS (emailjs-com)

**Build Tool:** Vite

**Deployment:** Netlify

---

## 📂 Folder Structure

```
portfolio/
├── public/
│   └── _redirects
├── src/
│   ├── assets/
│   │   ├── icon.png
│   │   └── Resume - Nickshan J.pdf
│   ├── image/
│   │   ├── About Page.webp
│   │   ├── HomeBG.webp
│   │   ├── Vehicle Rental.png
│   │   ├── Movies Search.png
│   │   ├── Portal.png
│   │   └── Event.png
│   ├── App.css          ← Full design system (black + cyan theme)
│   ├── App.jsx          ← Root router
│   ├── main.jsx         ← Entry point
│   ├── config.js        ← EmailJS env config
│   ├── DynamicText.jsx  ← Typing animation component
│   ├── Navbar.jsx       ← Fixed navbar with mobile overlay menu
│   ├── Modal.jsx        ← Success/error modal with cyan checkmark
│   ├── Home.jsx         ← Home page (terminal card)
│   ├── About.jsx        ← About page (photo + bio)
│   ├── Skills.jsx       ← Skills grid (11 technologies)
│   ├── Projects.jsx     ← Tab-switcher project showcase
│   └── Contact.jsx      ← Contact form + footer
├── index.html
├── tailwind.config.js
├── vite.config.js
├── postcss.config.js
└── .env                 ← EmailJS keys (not in repo)
```

---

## 🌟 Getting Started

### Prerequisites
- Node.js ≥ 18
- npm

### Installation

```bash
git clone https://github.com/NickshanJ/Portfolio.git
cd portfolio
npm install
```

### Environment Setup

Create a `.env` file in the root:

```env
VITE_SERVICE_ID=your_emailjs_service_id
VITE_TEMPLATE_ID=your_emailjs_template_id
VITE_USER_ID=your_emailjs_user_id
```

### Run Locally

```bash
npm run dev
```

Visit `http://localhost:5173`

### Build for Production

```bash
npm run build
```

---

## 🛡️ Security

EmailJS credentials are stored in `.env` and excluded from version control via `.gitignore`.

---

## 📬 Contact

| Channel  | Link |
|----------|------|
| LinkedIn | [linkedin.com/in/nickshanj](https://www.linkedin.com/in/nickshanj/) |
| GitHub   | [github.com/NickshanJ](https://github.com/NickshanJ) |
| Email    | nickshan001@gmail.com |
| WhatsApp | +91 73581 76388 |

---

*Built with React & Tailwind CSS — Illustrations by [Storyset](https://storyset.com/)*
