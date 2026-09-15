# Portfolio Generator Platform

A full-stack platform where a **Superadmin** invites customers by email, and each customer builds and publishes their own portfolio website through a dashboard — personal details, projects, skills, education, work experience, achievements, resume upload, and a choice of predefined design templates.

## Features

- **Invite-only onboarding** — Superadmin invites a customer by email; customer sets up their account via a secure, time-limited link
- **Customer dashboard** — add/edit/delete projects, skills, education, work experience, and achievements
- **Resume upload** — PDF upload via Cloudinary, with view and download options on the public portfolio
- **Predefined design templates** — Minimal, Classic, Creative, Modern Dark, Personal Brand, and Aman Dev-style templates, switchable without losing data
- **Publish/unpublish control** — portfolio goes live at a public URL (`/portfolio/:slug`) only when the customer chooses
- **JWT authentication** with role-based access (`SUPERADMIN` / `CUSTOMER`)
- **Superadmin dashboard** — view all customers, their status, resend invites, disable accounts
- **Portfolio export** — download a zipped copy of the portfolio (see `utils/exportPortfolioZip.js`)

## Tech Stack

**Backend:** Java 17, Spring Boot 3.2, Spring Security, Spring Data JPA, MySQL, JWT (jjwt), Spring Mail, Cloudinary SDK
**Frontend:** React 19, React Router, Axios, Vite, Lucide icons, JSZip

## Project Structure

```
Portfolio/
├── backend/
│   ├── src/main/java/com/portfolio/
│   │   ├── config/          # CORS, security, initial superadmin seeding
│   │   ├── controller/      # Auth, Admin, Portfolio, Public, FileUpload
│   │   ├── dto/              # Request/response payloads
│   │   ├── exception/        # Global exception handling
│   │   ├── model/             # JPA entities (User, Portfolio, Project, Skill, Education, Experience, Achievement, InviteToken)
│   │   ├── repository/       # Spring Data repositories
│   │   ├── security/          # JWT filter, token provider, user details
│   │   └── service/            # Business logic (Auth, Admin, Portfolio, Email, FileStorage)
│   └── src/main/resources/application.properties
└── frontend/
    ├── src/
    │   ├── api/                # Axios instance
    │   ├── components/         # Shared UI + templates/ (one file per design template)
    │   ├── context/            # Auth + theme context
    │   ├── pages/               # Login, SetupAccount, AdminDashboard, CustomerDashboard, PublicPortfolio
    │   └── utils/                # Portfolio zip export
    └── vite.config.js
```

## Prerequisites

- Java 17+
- Maven
- Node.js 18+ and npm
- MySQL 8+ running locally (or accessible remotely)
- A Cloudinary account (for resume/image uploads)
- An SMTP account for sending invite emails (Gmail SMTP works, but requires an **app password**, not your regular password)

## Setup

### 1. Database

Create the database (or let Hibernate auto-create it — `application.properties` already has `createDatabaseIfNotExist=true`):

```sql
CREATE DATABASE portfolio_db;
```

### 2. Backend configuration

Edit `backend/src/main/resources/application.properties` (or set these as environment variables — recommended over hardcoding, especially for anything you plan to commit to version control):

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/portfolio_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=YOUR_DB_USERNAME
spring.datasource.password=YOUR_DB_PASSWORD

# JWT — use a long, random string (32+ bytes), not the placeholder below
app.jwt.secret=YOUR_JWT_SECRET
app.jwt.expiration-ms=86400000

# Frontend URL (used to build invite links in emails)
app.frontend.url=http://localhost:5173

# SMTP (example: Gmail — requires an app password, generated from your Google account security settings)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=YOUR_SMTP_EMAIL
spring.mail.password=YOUR_SMTP_APP_PASSWORD
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

# Cloudinary
cloudinary.cloud-name=YOUR_CLOUDINARY_CLOUD_NAME
cloudinary.api-key=YOUR_CLOUDINARY_API_KEY
cloudinary.api-secret=YOUR_CLOUDINARY_API_SECRET
```

> **Security note:** don't commit real values for any of the above to version control. Add `application.properties` (or a `.env` file, if you switch to reading one) to `.gitignore`, and keep a checked-in `application.properties.example` with placeholders instead.

### 3. Run the backend

```bash
cd backend
mvn spring-boot:run
```

Runs on `http://localhost:8080`. On first run, a superadmin account is auto-seeded — check the console output for the credentials, and **change the password immediately** after first login.

### 4. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173`.

## Available Scripts (frontend)

| Command | Purpose |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run oxlint |

## Core Flow

1. Superadmin logs in and invites a customer by email (`POST /api/admin/invite`)
2. Customer receives an email with a setup link (`/setup-account?token=...`), sets their password, and account activates
3. Customer logs in, fills out their portfolio via the dashboard, picks a template, and publishes
4. Portfolio is live at `/portfolio/:slug` for anyone to view

## Notes

- File uploads (images, resumes) go through Cloudinary via `FileStorageService`, with a local-storage fallback (`backend/uploads/`) if Cloudinary credentials aren't configured
- Resume uploads use `resource_type: raw` on Cloudinary — if resumes fail to display, check the Cloudinary dashboard's **Settings → Security** page to confirm PDF/ZIP delivery is enabled (disabled by default on newer accounts)