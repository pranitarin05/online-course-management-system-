# Online Course Management System

This repository contains a Django backend and a React (Vite) frontend for an online course management platform.

## Structure

- `ocms/` - Django project and apps (accounts, courses, dashboard, enrollments, reviews, etc.)
- `ocms-frontend/` - React/Vite frontend for the application
- `static-frontend/` - Static HTML/CSS/JS version of the frontend
- `env/` - Python virtual environment (should be ignored)

## Setup

1. **Backend**
   - Create and activate a virtual environment (already in `env/`)
   - Install dependencies: `pip install -r requirements.txt` (you may need to create this file if missing)
   - Run migrations: `python manage.py migrate`
   - Start development server: `python manage.py runserver`

2. **Frontend**
   - Navigate to `ocms-frontend/`
   - Install packages: `npm install`
   - Start dev server: `npm run dev`

## Notes

- Remember to keep sensitive information out of version control. Use environment variables for secrets.
- The `.gitignore` already excludes common generated files, virtual environments, and node modules.

Enjoy developing!