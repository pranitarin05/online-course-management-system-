# OCMS - Online Course Management System
## Complete Project Flow & Architecture Presentation

---

## 📊 **PROJECT OVERVIEW**

**OCMS** is a **full-stack web application** for managing online courses. It combines a **robust Django REST API backend** with a **modern, premium frontend** built with HTML, CSS, and Vanilla JavaScript.

### Key Metrics:
- **Users**: Can register, login, enroll in courses, write reviews
- **Instructors**: Can create and manage courses
- **Courses**: Full course management with descriptions, pricing, ratings
- **Reviews**: Students can rate and review courses
- **Enrollments**: Track student progress in courses
- **Authentication**: JWT-based (industry standard)

---

## 🏗️ **ARCHITECTURE OVERVIEW**

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT SIDE (Frontend)                    │
│  HTML + CSS + Vanilla JavaScript (Modern & Responsive)      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Landing Page (/) ────────────────────────────────┐      │
│     - Hero section, Features, Testimonials           │      │
│     - Browse courses without login                   │      │
│                                                     │      │
│  2. Login/Registration Modal                        │      │
│     - JWT token handling                            │      │
│     - Auto-refresh token on expiry                  │      │
│                                                     │      │
│  3. Protected Dashboard (/dashboard/)               ├──────┤
│     - My Courses, My Reviews                        │  API │
│     - Enrollment history                            │ Calls│
│                                                     │      │
│  4. Course Detail Page (/course/<id>/)              │      │
│     - Course info, Enroll button                    │      │
│     - Write reviews, View reviews                   │      │
│                                                     │      │
└─────────────────────────────────────────────────────┼──────┘
                                                      │
                    HTTP/HTTPS (JSON)                │
                    JWT Bearer Token                 │
                                                      │
┌────────────────────────────────────────────────────┴──────┐
│              SERVER SIDE (Django REST API)                │
├───────────────────────────────────────────────────────────┤
│                                                           │
│  API ENDPOINTS:                                         │
│  ├─ /api/token/          → Login (get JWT)             │
│  ├─ /api/token/refresh/  → Refresh token              │
│  ├─ /api/register/       → Create user account        │
│  ├─ /courses/            → List/Create courses        │
│  ├─ /courses/<id>/       → Get/Update course          │
│  ├─ /enrollments/        → Manage enrollments         │
│  ├─ /reviews/            → Manage reviews             │
│  └─ /accounts/           → User profiles              │
│                                                        │
├───────────────────────────────────────────────────────┤
│  AUTHENTICATION: JWT (JSON Web Tokens)                │
│  ├─ Access Token (short-lived, encoded)              │
│  ├─ Refresh Token (long-lived)                       │
│  └─ Auto-refresh mechanism                           │
│                                                        │
└────────────────────────────│──────────────────────────┘
                              │
                    PostgreSQL Database
                              │
┌────────────────────────────┴──────────────────────────┐
│              DATABASE (PostgreSQL)                     │
├───────────────────────────────────────────────────────┤
│                                                       │
│  Tables:                                             │
│  ├─ auth_user                (Django Users)         │
│  ├─ accounts_profile         (User Profiles)        │
│  ├─ courses_course           (Courses)              │
│  ├─ enrollments_enrollment   (Enrollments)          │
│  ├─ reviews_review           (Reviews)              │
│  ├─ dashboard_*              (Dashboard data)       │
│                                                       │
└───────────────────────────────────────────────────────┘
```

---

## 👥 **USER JOURNEY & FLOW**

### **STEP 1: First-Time Visitor**
```
Visitor lands on "/" (Landing Page)
    ↓
Sees:
  • Hero Section: "Build skills. Launch careers..."
  • Feature Cards: 6 key features explained
  • Testimonials Carousel: Student reviews
  • Courses Grid: Browse available courses
  • Contact Section
    ↓
No login needed yet → Just browsing
    ↓
Click "Sign Up" button → Opens Registration Modal
```

### **STEP 2: Registration**
```
User fills registration form:
  ├─ Username: (unique, required)
  ├─ Email: (unique, required)
  ├─ Password: (secure, required)
  ├─ Role: (student or instructor)
  └─ Phone: (optional)
    ↓
Frontend sends POST to /api/register/
    ↓
Backend:
  1. Validates all fields
  2. Checks if username/email already exists
  3. Creates Django User
  4. Creates Profile (role, phone)
  5. Returns user data + created flag
    ↓
Frontend:
  1. Auto-logs user in (calls /api/token/)
  2. Stores JWT tokens in localStorage
  3. Shows "Account created! Signing in..."
  4. Redirects to Dashboard
    ↓
Status: ✅ User fully registered and authenticated
```

### **STEP 3: Login** (Existing Users)
```
User clicks "Login" button
    ↓
Modal opens with:
  ├─ Username field
  └─ Password field
    ↓
Frontend sends POST to /api/token/
  Payload: { "username": "john", "password": "pass123" }
    ↓
Backend (djangorestframework-simplejwt):
  1. Validates credentials
  2. Generates JWT tokens
  3. Returns: { "access": "...token...", "refresh": "...token..." }
    ↓
Frontend:
  1. Stores tokens in localStorage
  2. Shows "Signed in" message
  3. Updates navbar (shows "Account" + "Logout")
  4. Reloads courses (now with auth header)
    ↓
Status: ✅ User logged in, can access protected endpoints
```

### **STEP 4: Browse Courses**
```
Authenticated user sees courses grid with:
  ├─ Course cover image
  ├─ Course title
  ├─ Short description
  └─ "View" button → Click to see details
    ↓
Frontend retrieves from: GET /courses/ (with JWT header)
    ↓
Backend:
  1. Authenticates user (checks JWT)
  2. Returns paginated course list
  3. Includes: { results: [...], count: 42, next: "...", etc }
    ↓
Frontend displays courses in responsive grid
    ↓
Status: ✅ Courses loaded and ready
```

### **STEP 5: Course Detail & Enrollment**
```
User clicks "View" on a course
    ↓
Navigates to: /course/{id}/
    ↓
Frontend loads:
  1. Course full details (title, description)
  2. Course cover image
  3. "Enroll Now" button
  4. Reviews from other students
    ↓
User clicks "Enroll Now"
    ↓
Frontend sends POST to /api/enrollments/
  Payload: { "course": 5 }
    ↓
Backend:
  1. Authenticates user (JWT)
  2. Creates Enrollment record linking user + course
  3. Returns enrollment data
    ↓
Frontend shows: "Enrolled!" (button disabled)
    ↓
Status: ✅ User enrolled in course
```

### **STEP 6: Write & View Reviews**
```
User scrolls to review section
    ↓
Sees existing reviews:
  • "Amazing course!" - Ahmed (5 stars)
  • "Great! Learned a lot" - Zainab (4 stars)
    ↓
Frontend retrieves from: GET /reviews/ (filtered)
    ↓
User fills review form:
  ├─ Rating: (1-5 stars)
  └─ Review text: (min 10 characters)
    ↓
Clicks "Submit Review"
    ↓
Frontend sends POST to /api/reviews/
  Payload: { "course": 5, "rating": 5, "body": "Excellent course!" }
    ↓
Backend:
  1. Validates (rating 1-5, body length)
  2. Creates Review record
  3. Associates with user + course
  4. Returns review data
    ↓
Frontend:
  1. Shows success message
  2. Reloads reviews list
  3. User's review now visible to all
    ↓
Status: ✅ Review posted
```

### **STEP 7: Protected Dashboard**
```
User clicks "My Courses" in navbar
    ↓
Navigates to: /dashboard/
    ↓
Frontend checks: Is user logged in?
  ├─ YES → Render dashboard
  └─ NO  → Redirect to "/" (landing page)
    ↓
Dashboard displays:
  1. "My Learning Journey" hero section
  2. "Your Courses" grid (only enrolled courses)
  3. "Your Reviews" list (only user's reviews)
    ↓
Frontend retrieves:
  • GET /api/enrollments/ → Shows my enrollments
  • GET /api/reviews/ → Shows my reviews
    ↓
All requests sent with JWT authorization header:
  Authorization: Bearer {{access_token}}
    ↓
Backend validates JWT on each request
    ↓
Status: ✅ Protected data displayed securely
```

### **STEP 8: Token Refresh** (Background)
```
User is on dashboard
    ↓
After 5 minutes, access token expires
    ↓
Next API call is made → 401 Unauthorized response
    ↓
Frontend automatically:
  1. Detects 401 status
  2. Calls /api/token/refresh/ with refresh token
  3. Gets new access token
  4. Retries original request
    ↓
User doesn't notice anything!
(Seamless token refresh)
    ↓
Status: ✅ Session extended, user stays logged in
```

### **STEP 9: Logout**
```
User clicks "Logout" button
    ↓
Frontend:
  1. Clears tokens from localStorage
  2. Clears user state
  3. Redirects to "/" (landing page)
    ↓
All subsequent requests have no JWT header
    ↓
User can still browse courses but can't enroll/review
    ↓
Back to Step 1 (First-Time Visitor)
    ↓
Status: ✅ User logged out safely
```

---

## 🗄️ **DATABASE SCHEMA**

```
┌──────────────────────────────────────────────────────┐
│                   auth_user                          │
├──────────────────────────────────────────────────────┤
│ id (PK)          │ username ✓ unique                │
│ email ✓ unique   │ password (hashed)                │
│ first_name       │ last_name                        │
│ is_active        │ created_at                       │
└──────────────────────────────────────────────────────┘
              ↓ One-to-One
┌──────────────────────────────────────────────────────┐
│               accounts_profile                       │
├──────────────────────────────────────────────────────┤
│ id (PK)      │ user_id (FK → auth_user)            │
│ role         │ (student / instructor)              │
│ phone        │                                      │
└──────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────┐
│                courses_course                        │
├──────────────────────────────────────────────────────┤
│ id (PK)          │ title                            │
│ description      │ price                            │
│ created_by (FK)  │ created_at                       │
│ updated_at       │                                  │
└──────────────────────────────────────────────────────┘
              ↓ One-to-Many
┌──────────────────────────────────────────────────────┐
│           enrollments_enrollment                     │
├──────────────────────────────────────────────────────┤
│ id (PK)      │ user_id (FK → auth_user)            │
│ course_id    │ (FK → courses_course)                │
│ enrolled_at  │ progress (%)                         │
│ completed    │ completed_at                         │
└──────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────┐
│               reviews_review                         │
├──────────────────────────────────────────────────────┤
│ id (PK)      │ user_id (FK → auth_user)            │
│ course_id    │ (FK → courses_course)                │
│ rating       │ (1-5 integer)                        │
│ body         │ (review text)                        │
│ created_at   │ updated_at                           │
└──────────────────────────────────────────────────────┘
```

---

## 🔐 **AUTHENTICATION & SECURITY FLOW**

### **JWT Token Lifecycle**

```
1️⃣ USER REGISTERS/LOGS IN
   Username + Password sent to /api/token/
         ↓
2️⃣ SERVER VALIDATES
   - Django authenticates user
   - Found? Continue to step 3
   - Not found? Return 401 Unauthorized
         ↓
3️⃣ TOKENS GENERATED
   JWT Library creates two tokens:
   
   ACCESS TOKEN (short-lived: 5 min)
   ├─ Header: { "typ": "JWT", "alg": "HS256" }
   ├─ Payload: { "user_id": 5, "username": "john", ... }
   └─ Signature: (encoded with Django SECRET_KEY)
   
   REFRESH TOKEN (long-lived: 7 days)
   ├─ Header: { "typ": "JWT", ... }
   ├─ Payload: { "user_id": 5, "exp": future_date, ... }
   └─ Signature: (encoded with SECRET_KEY)
         ↓
4️⃣ TOKENS SENT TO FRONTEND
   Response: {
     "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   }
         ↓
5️⃣ FRONTEND STORES TOKENS
   localStorage.ocms_tokens = { access: "...", refresh: "..." }
         ↓
6️⃣ EVERY API REQUEST INCLUDES TOKEN
   Header: Authorization: Bearer {{access_token}}
   
   GET /api/courses/
   Headers: {
     "Authorization": "Bearer eyJhbGci...",
     "Content-Type": "application/json"
   }
         ↓
7️⃣ SERVER VALIDATES TOKEN
   On each request:
   ├─ Decode JWT signature
   ├─ Check if expired
   ├─ Extract user_id
   ├─ Attach user object to request
   └─ Process request (user is authenticated!)
         ↓
8️⃣ TOKEN EXPIRY HANDLING
   When access token expires:
   
   Frontend gets: 401 Unauthorized
         ↓
   Frontend calls: POST /api/token/refresh/
   With: { "refresh": "eyJ..." }
         ↓
   Server validates refresh token
   ├─ Still valid? → Generate new access token
   └─ Expired? → Return 401 (user must login again)
         ↓
   Frontend updates token:
   localStorage.ocms_tokens.access = "new_token"
         ↓
   Retry original request with new token ✅
         ↓
9️⃣ LOGOUT
   Frontend clears localStorage.ocms_tokens
   No more tokens = No authentication = Access denied
```

---

## 🎨 **FRONTEND ARCHITECTURE**

### **Pages & Components**

```
index.html (Landing Page)
├─ Header (Navbar)
│  ├─ Logo
│  ├─ Nav Links
│  ├─ Login Button
│  ├─ Sign Up Button
│  └─ User Menu (when logged in)
│
├─ Hero Section
│  ├─ Headline
│  ├─ Subheadline
│  ├─ CTA Buttons
│  └─ Stats (Courses, Students, Reviews)
│
├─ Features Section (6 cards)
│  ├─ Fast Onboarding
│  ├─ Expert Instructors
│  ├─ Secure & Reliable
│  ├─ ... etc
│
├─ About Section (split layout)
│  ├─ Image (left)
│  └─ Text + List (right)
│
├─ Courses Grid
│  ├─ Course Card (multiple)
│  │  ├─ Image
│  │  ├─ Title
│  │  ├─ Description
│  │  └─ "View" Button → Links to /course/<id>/
│
├─ Testimonials Carousel
│  └─ Auto-scrolling reviews
│
├─ Contact Section
│  ├─ Contact Form
│  └─ Social Links
│
└─ Footer
   ├─ Copyright
   └─ Links


dashboard.html (Protected - After Login)
├─ Navbar (similar, but with "My Courses" link)
│
├─ Dashboard Hero
│  ├─ "My Learning Journey"
│  └─ "Track your progress..."
│
├─ My Courses Grid
│  ├─ Shows only enrolled courses
│  └─ Each card shows enrollment date
│
└─ My Reviews List
   └─ Shows only user's reviews


course-detail.html (Protected)
├─ Course Header
│  ├─ Cover Image
│  ├─ Title
│  ├─ Description
│  └─ "Enroll Now" Button
│
├─ Course Meta (info section)
│
├─ Reviews Section
│  └─ List of all reviews for this course
│
└─ Write Review Form
   ├─ Rating (1-5)
   ├─ Review Text
   └─ Submit Button
```

### **JavaScript Logic Flow**

```
app.js (Main Landing Page Logic)
├─ Auth Management
│  ├─ saveTokens()      → Store JWT in localStorage
│  ├─ loadTokens()      → Retrieve JWT from localStorage
│  ├─ clearTokens()     → Remove JWT on logout
│  ├─ refreshAccess()   → Call /api/token/refresh/
│  └─ authorizedFetch() → Wrapper for all API calls
│
├─ UI Interactions
│  ├─ Mobile menu toggle (hamburger)
│  ├─ Smooth scroll to sections
│  ├─ Scroll reveal animations (fade-in)
│  └─ Modal controls (login/register)
│
├─ Login Modal Handler
│  └─ Collect credentials → POST /api/token/ → Save tokens
│
├─ Register Modal Handler
│  └─ Collect data → POST /api/register/ → Auto-login
│
├─ Data Loading
│  ├─ loadCourses()      → GET /api/courses/ (paginated)
│  └─ loadStats()        → GET /api/reviews/ + random count
│
└─ Auth UI Updates
   ├─ showAuthUI()       → Show/hide login or account menu
   └─ Toggle on login/logout


dashboard.js (Dashboard Page Logic)
├─ Auth Check
│  └─ redirectToLogin() → Check tokens, redirect if missing
│
├─ Protected Data Loading
│  ├─ loadMyEnrollments() → GET /api/enrollments/
│  └─ loadMyReviews()     → GET /api/reviews/
│
└─ Logout Handler
   └─ clearTokens() + redirect to "/"


course-detail.js (Course Detail Page Logic)
├─ Get Course ID from URL parameters
│
├─ Load Course Data
│  └─ GET /api/courses/{id}/ → Display details
│
├─ Enroll Button Handler
│  └─ POST /api/enrollments/ → Create enrollment
│
├─ Load Reviews
│  └─ GET /api/reviews/ → Display course reviews
│
└─ Submit Review Form
   └─ POST /api/reviews/ → Create review
```

---

## 🚀 **REQUEST-RESPONSE CYCLE (Example)**

### **Example: Enrolling in a Course**

```
┌─────────────────────────────────────────────────────┐
│          CLIENT (Browser)                           │
└─────────────────────────────────────────────────────┘
            ↓
User clicks "Enroll Now" button on /course/5/
            ↓
JavaScript event captured: click on #enrollBtn
            ↓
authorizedFetch() called with:
  - URL: /api/enrollments/
  - Method: POST
  - Headers: {
      "Authorization": "Bearer eyJhbGci...",
      "Content-Type": "application/json"
    }
  - Body: { "course": 5 }
            ↓
Sending...
            ↓
          HTTP (HTTPS in production)
          ──────────────────────────
            ↓
┌─────────────────────────────────────────────────────┐
│          SERVER (Django)                            │
└─────────────────────────────────────────────────────┘
            ↓
Django URL Router:
  POST /api/enrollments/ → enrollments.views.enrollment_list
            ↓
Middleware processes request:
  1. Extract token from Authorization header
  2. Decode JWT signature
  3. Find matching user
  4. Attach user object to request
            ↓
enrollment_list() view called with:
  - request.user = <User: john>
  - request.data = {"course": 5}
            ↓
Request.method == 'POST'? Yes
            ↓
Create EnrollmentSerializer(request.data)
            ↓
Validate:
  - course_id exists? ✅
  - user not already enrolled? ✅
  - all required fields present? ✅
            ↓
serializer.save() executes:
  Enrollment.objects.create(
    user=request.user,      # john
    course_id=5,            # Web Dev 101
    created_at=now()
  )
            ↓
Query executed on PostgreSQL:
  INSERT INTO enrollments_enrollment
    (user_id, course_id, created_at)
  VALUES (3, 5, '2026-02-27 10:30:00')
            ↓
Database returns: Enrollment object created ✅
            ↓
Serialize response:
  {
    "id": 42,
    "user": 3,
    "course": 5,
    "created_at": "2026-02-27T10:30:00Z",
    "progress": 0,
    "completed": false
  }
            ↓
HTTP 201 Created response sent
            ↓
          HTTP Response
          ───────────────
            ↓
┌─────────────────────────────────────────────────────┐
│          CLIENT (Browser)                           │
└─────────────────────────────────────────────────────┘
            ↓
authorizedFetch() receives response
            ↓
STATUS 201? Yes ✅
            ↓
Parse JSON response
            ↓
Update UI:
  button.textContent = "Enrolled!"
  button.disabled = true
            ↓
Show success message
            ↓
User sees: "Enrolled!" (button now disabled)
            ↓
✅ COMPLETE
```

---

## 📱 **RESPONSIVE DESIGN FLOW**

```
Desktop (1200px+)
├─ 3-column grid for courses
├─ Navbar horizontal layout
├─ Hero section with 2 columns (text + image)
└─ All features visible at once

Tablet (768px - 1200px)
├─ 2-column grid for courses
├─ Navbar still horizontal
├─ Hero section stacked but readable
└─ Most features visible

Mobile (< 768px)
├─ 1-column grid for courses
├─ Hamburger menu (toggle nav)
├─ Hero section fully stacked (vertical)
├─ Feature cards stack
├─ Touch-friendly buttons (larger)
└─ Optimized spacing & padding
```

---

## 🎯 **KEY FEATURES SUMMARY**

| Feature | Frontend | Backend | Database |
|---------|----------|---------|----------|
| **User Registration** | Modal form | `/api/register/` validation | Creates User + Profile |
| **Login with JWT** | Modal form | `/api/token/` generates tokens | Validates credentials |
| **Token Refresh** | Auto on 401 | `/api/token/refresh/` | Extends session |
| **Course Browsing** | Grid display | `GET /courses/` | Course queries |
| **Enroll in Course** | Button + Modal | `POST /enrollments/` | Create enrollment record |
| **Write Reviews** | Form input | `POST /reviews/` | Store review + rating |
| **View Reviews** | List display | `GET /reviews/` | Query reviews |
| **Protected Pages** | Auth check + redirect | JWT validation | User-specific queries |
| **Responsive Design** | CSS grid/flex | N/A | N/A |
| **Animations** | Scroll reveal, hover | N/A | N/A |

---

## 🔄 **COMPLETE USER LIFECYCLE**

```
┌──────────────────────────────────────────────────────┐
│  FIRST VISIT                                         │
├──────────────────────────────────────────────────────┤
│  User lands on /                                      │
│      ↓                                                │
│  Browse landing page (no login needed)               │
│      ↓                                                │
│  Click "Sign Up" or "Login"                          │
└──────────────────────┬───────────────────────────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
        ↓ (new user)         ↓ (existing)
    REGISTER                  LOGIN
        │                      │
        ├─POST /api/register   ├─POST /api/token/
        ├─Create User/Profile  ├─Validate creds
        ├─Auto-login           └─Get JWT tokens
        │                         │
        └─────────────┬───────────┘
                      │
                ↓ (logged in)
        ┌──────────────────────────┐
        │  AUTHENTICATED STATE     │
        │                          │
        │  ✅ JWT in localStorage  │
        │  ✅ Navbar shows Account │
        │  ✅ Can call APIs        │
        └──┬───────────────────────┘
           │
      ┌────┴────┬──────────┬──────────┐
      ↓         ↓          ↓          ↓
   BROWSE    ENROLL    WRITE      VIEW
   COURSES   COURSES   REVIEWS    DASHBOARD
      │         │         │         │
      ├─────────┴─────────┴─────────┤
      │                             │
      ↓ (anytime)                   │
   LOGOUT LOGIN                      │
      ↓         │                    │
   TOKEN      ┌─┴────┐               │
   CLEARED    │ AUTO │               │
      ↓       │REFRESH               │
   BACK TO   └──────┘               │
   LOGIN PAGE (behind scenes)       │
                                    │
        (Token expires)             │
        Auto-refresh if refresh ────┘
        token still valid
```

---

## 💾 **DATA FLOW EXAMPLE: Creating a Review**

```
FRONTEND                           BACKEND                        DATABASE
─────────────────────────────────────────────────────────────────────────────

User is on /course/5/
    │
    ├─ Fill review form
    │  ├─ Rating: 5
    │  └─ Text: "Great course!"
    │
    ├─ Click "Submit Review"
    │
    ├─ authorizedFetch(
    │    POST /api/reviews/,
    │    { course: 5, rating: 5, body: "..." }
    │  )
    │
    └──→ NETWORK REQUEST
              │
              ├─ POST /api/reviews/
              │
              ├─ Headers: {
              │   "Authorization": "Bearer JWT...",
              │   "Content-Type": "application/json"
              │  }
              │
              └──→ SERVER RECEIVES REQUEST
                      │
                      ├─ Extract JWT token
                      │
                      ├─ Verify JWT signature
                      │
                      ├─ Decode: user_id = 3
                      │
                      ├─ Load User object (john)
                      │
                      ├─ Validate request data
                      │  ├─ rating 1-5? ✅
                      │  ├─ text min-length? ✅
                      │  └─ course exists? ✅
                      │
                      ├─ Create Review object
                      │
                      └──→ Execute SQL INSERT
                              │
                              ├─ INSERT INTO reviews_review
                              │   (user_id, course_id, rating, body, created_at)
                              │  VALUES (3, 5, 5, "Great course!", NOW())
                              │
                              └──→ DATABASE CONFIRMS
                                     │
                                     └─ New row created with id=42

SERVER SENDS RESPONSE BACK
    │
    ├─ Status: 201 Created
    │
    ├─ Body: {
    │   "id": 42,
    │   "user": { "id": 3, "username": "john" },
    │   "course": 5,
    │   "rating": 5,
    │   "body": "Great course!",
    │   "created_at": "2026-02-27T10:35:00Z"
    │  }
    │
    └──→ NETWORK RESPONSE
            │
            └──→ FRONTEND RECEIVES
                    │
                    ├─ Status 201? Yes ✅
                    │
                    ├─ Update UI
                    │  ├─ Show "Review posted!"
                    │  ├─ Clear form
                    │  └─ Reload reviews list
                    │
                    └─ User sees review appear ✨
```

---

## 🎓 **TECH STACK BREAKDOWN**

### **Frontend Stack**
```
├─ HTML5          (Semantic markup)
├─ CSS3           (Flexbox, Grid, Animations)
├─ Vanilla JS     (No frameworks/libraries)
├─ LocalStorage   (Token persistence)
├─ Fetch API      (HTTP requests)
└─ Google Fonts   (Typography)
```

### **Backend Stack**
```
├─ Django 6.0     (Web framework)
├─ Django REST    (API framework)
├─ SimpleJWT      (JWT authentication)
├─ PostgreSQL     (Database)
└─ Python 3       (Language)
```

### **Why This Stack?**
```
✅ No dependencies = Lightweight & fast
✅ JWT = Stateless, scalable authentication
✅ PostgreSQL = Reliable, ACID-compliant
✅ REST API = Standard, well-documented
✅ Vanilla JS = Pure, no build step needed
✅ Modern CSS = Zero vendor prefixes needed (in 2026)
```

---

## 🎯 **CORE CONCEPTS STUDENTS SHOULD UNDERSTAND**

### **1. REST API**
- **R**epresentational **S**tate **T**ransfer
- Client requests resources via HTTP methods:
  - GET = Read
  - POST = Create
  - PUT/PATCH = Update
  - DELETE = Delete

### **2. JWT (JSON Web Tokens)**
- Stateless authentication (no server session needed)
- Token = Header.Payload.Signature (encoded)
- Used instead of traditional sessions
- Can be validated by any server with secret key

### **3. Database Relationships**
- **One-to-One**: User ↔ Profile
- **One-to-Many**: Course → Enrollments
- **Foreign Keys**: Links between tables
- **Migrations**: Version control for database

### **4. Request-Response Cycle**
1. Client sends HTTP request with data
2. Server processes request
3. Server queries database if needed
4. Server sends HTTP response with data
5. Client processes response and updates UI

### **5. Authentication vs Authorization**
- **Authentication**: "Are you who you say you are?" (Login)
- **Authorization**: "Are you allowed to do this?" (Permissions)

---

## ✅ **PROJECT COMPLETION CHECKLIST**

- ✅ User registration system
- ✅ User login with JWT tokens
- ✅ Auto token refresh mechanism
- ✅ Course browsing (unauthenticated)
- ✅ Course enrollment (authenticated)
- ✅ Review system (read/write)
- ✅ Protected dashboard
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Premium dark theme with animations
- ✅ Error handling & validation
- ✅ Django integration
- ✅ Static files serving
- ✅ No breaking changes to existing backend

---

## 🎬 **LIVE DEMO FLOW FOR PRESENTATION**

1. **Open landing page** (`http://127.0.0.1:8000/`)
   - Show hero, features, courses grid
   - Highlight "Sign Up" button

2. **Click Sign Up**
   - Fill registration form
   - Show "Account created! Signing in..."
   - Auto-redirects to dashboard

3. **Access protected dashboard** (`/dashboard/`)
   - Show "My Courses" (enrolled courses)
   - Show "My Reviews" (wrote reviews)

4. **Click on a course**
   - Shows course detail page
   - Click "Enroll Now"
   - Show success message

5. **Write a review**
   - Fill review form
   - Submit
   - Show review appears in list

6. **Show browser DevTools**
   - Open Application → Local Storage
   - Show JWT tokens stored: `ocms_tokens`
   - Show token structure in JWT.io

7. **Click Logout**
   - Tokens deleted
   - Redirects to landing page
   - Try accessing dashboard → Redirects to login

8. **Show mobile responsiveness**
   - Resize browser to mobile
   - Show hamburger menu
   - Show how layout adapts

---

## 📝 **SUMMARY IN 30 SECONDS**

**OCMS** is a full-stack learning platform where:
1. Users **register and login** with JWT authentication
2. Users **browse and enroll** in courses via REST API
3. Users **write and read** reviews
4. Users access **protected dashboard** with their courses
5. All built with **HTML/CSS/Vanilla JS** frontend and **Django REST** backend
6. Complete **request-response cycle** with database persistence
7. **Responsive design** for all devices

---

## 🚀 Ready to Present!

This document covers:
✅ Architecture & Flow
✅ User Journey (9 detailed steps)
✅ Database Schema
✅ Authentication System
✅ Frontend & Backend Logic
✅ Request-Response Cycle
✅ Tech Stack Rationale
✅ Core Concepts
✅ Live Demo Guide
