# Online Course Management System

A comprehensive Django backend and React (Vite) frontend for an enterprise-grade online course management platform. This system enables educators to create and manage courses, while students can enroll, learn, and provide feedback.

## 📋 Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Technology Stack](#technology-stack)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- **User Management**: Role-based access control (Teachers, Students, Admins)
- **Course Management**: Create, edit, and organize courses with modules and lessons
- **Student Enrollment**: Easy course enrollment and progress tracking
- **Dashboard**: Interactive dashboard for both teachers and students
- **Reviews & Ratings**: Students can review and rate courses
- **RESTful API**: Complete REST API built with Django REST Framework
- **JWT Authentication**: Secure token-based authentication
- **Responsive UI**: Modern, mobile-friendly frontend with React and Tailwind CSS
- **Database**: PostgreSQL for reliable data management

## 📁 Project Structure

```
.
├── ocms/                      # Django backend
│   ├── accounts/              # User management and authentication
│   ├── courses/               # Course management
│   ├── dashboard/             # Dashboard views
│   ├── enrollments/           # Enrollment management
│   ├── reviews/               # Reviews and ratings
│   ├── ocms/                  # Project settings and configuration
│   ├── manage.py              # Django management script
│   └── static/                # Static files (CSS, JS, images)
├── ocms-frontend/             # React/Vite frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/             # Page components
│   │   ├── api/               # API integration
│   │   ├── context/           # React context for state management
│   │   └── hooks/             # Custom React hooks
│   ├── public/                # Public assets
│   └── package.json           # NPM dependencies
├── static-frontend/           # Static HTML alternative frontend
├── docker-compose.yml         # Docker configuration
├── .gitignore                 # Git ignore rules
└── README.md                  # This file
```

## 📦 Prerequisites

- **Python**: 3.9 or higher
- **Node.js**: 16 or higher
- **npm**: 8 or higher
- **PostgreSQL**: 12 or higher (or SQLite for development)
- **Git**: For version control

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd "Online course management system"
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd ocms

# Create and activate virtual environment (if not already done)
python -m venv ../env
# On Windows:
..\env\Scripts\activate
# On macOS/Linux:
source ../env/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Run database migrations
python manage.py migrate

# Create a superuser (admin account)
python manage.py createsuperuser

# Start the development server
python manage.py runserver
```

The backend will be available at `http://localhost:8000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ocms-frontend

# Install Node dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173` (or another port if 5173 is in use)

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the `ocms/` directory:

```env
DEBUG=True
SECRET_KEY=your-secret-key-here
DATABASE_URL=postgresql://user:password@localhost/ocms_db
ALLOWED_HOSTS=localhost,127.0.0.1

# JWT Settings
JWT_SECRET_KEY=your-jwt-secret-key
JWT_ALGORITHM=HS256

# Email Configuration (optional)
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
```

### Admin Panel

Access the Django admin panel at `http://localhost:8000/admin` with your superuser credentials.

## 🏃 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd ocms
source ../env/bin/activate  # or ..\env\Scripts\activate on Windows
python manage.py runserver
```

**Terminal 2 - Frontend:**
```bash
cd ocms-frontend
npm run dev
```

### Docker Deployment

```bash
docker-compose up -d
```

## 🛠️ Technology Stack

### Backend
- **Django**: Web framework
- **Django REST Framework**: REST API development
- **Django JWT**: Authentication
- **PostgreSQL**: Database
- **Celery**: Async task processing
- **Django Filter**: Advanced filtering

### Frontend
- **React**: UI library
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client
- **React Router**: Client-side routing
- **Context API**: State management

## 📚 API Documentation

API endpoints are available at:
- Main API: `http://localhost:8000/api/`
- Admin Panel: `http://localhost:8000/admin/`
- API Documentation: `http://localhost:8000/api/docs/`

### Key Endpoints

- `/api/accounts/` - User management
- `/api/courses/` - Course management
- `/api/enrollments/` - Student enrollments
- `/api/reviews/` - Course reviews

Authentication requires a JWT token in the `Authorization` header:
```
Authorization: Bearer <your_jwt_token>
```

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📧 Support

For support, email support@onlinecourses.com or open an issue in the repository.

---

**Happy Learning! 🎓**