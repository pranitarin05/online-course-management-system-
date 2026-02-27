# OCMS - Visual Flow & Architecture Diagrams

---

## 🔄 **Complete User Journey Flow**

```
START: User visits application
│
├─── First Time? (No Account)
│    │
│    ├─→ Lands on Landing Page (/)
│    │   • See hero section
│    │   • Browse featured courses
│    │   • View testimonials
│    │   • See features
│    │
│    ├─→ Clicks "Sign Up"
│    │   │
│    │   ├─→ Registration Modal Opens
│    │   │   │
│    │   │   ├─ Enter Username
│    │   │   ├─ Enter Email
│    │   │   ├─ Enter Password
│    │   │   ├─ Select Role (Student/Instructor)
│    │   │   ├─ Enter Phone (optional)
│    │   │   │
│    │   │   └─→ Click "Sign Up"
│    │   │       │
│    │   │       ├─→ Frontend validates
│    │   │       │   (no empty fields, email format)
│    │   │       │
│    │   │       ├─→ POST /api/register/
│    │   │       │   │
│    │   │       │   ├─→ Backend validates
│    │   │       │   │   (username unique, email unique)
│    │   │       │   │
│    │   │       │   ├─→ Creates User record
│    │   │       │   │
│    │   │       │   ├─→ Creates Profile record
│    │   │       │   │   (role + phone stored)
│    │   │       │   │
│    │   │       │   └─→ Returns success
│    │   │       │
│    │   │       ├─→ Frontend auto-logs in
│    │   │       │   POST /api/token/
│    │   │       │   {username, password}
│    │   │       │
│    │   │       ├─→ Receives JWT tokens:
│    │   │       │   • access_token (5 min)
│    │   │       │   • refresh_token (24 hrs)
│    │   │       │
│    │   │       ├─→ Stores in localStorage
│    │   │       │
│    │   │       ├─→ Shows "Welcome! Signing in..."
│    │   │       │
│    │   │       └─→ Redirects to Dashboard (/dashboard/)
│    │   │
│    │   └─→ Account Created! ✅
│    │
│    └─ Returning User? Click "Login"
│       │
│       ├─→ Login Modal Opens
│       │   │
│       │   ├─ Enter Username
│       │   ├─ Enter Password
│       │   │
│       │   └─→ Click "Login"
│       │       │
│       │       ├─→ POST /api/token/
│       │       │   │
│       │       │   ├─→ Backend validates credentials
│       │       │   │
│       │       │   └─→ Returns JWT tokens
│       │       │
│       │       ├─→ Frontend stores tokens
│       │       │
│       │       ├─→ Updates navbar
│       │       │   (shows Account dropdown + Logout)
│       │       │
│       │       └─→ Authenticated! ✅
│
├─── Authenticated User
│    │
│    ├─→ Option 1: Browse Courses
│    │   │
│    │   ├─→ On Landing Page or Dashboard
│    │   ├─→ GET /courses/ (with JWT header)
│    │   │
│    │   ├─→ Receives course list:
│    │   │   [
│    │   │     {id: 1, title: "...", price: 49.99, rating: 4.5},
│    │   │     {id: 2, title: "...", price: 79.99, rating: 4.2},
│    │   │     ...
│    │   │   ]
│    │   │
│    │   ├─→ Courses displayed in grid
│    │   └─→ Can click any course
│    │
│    ├─→ Option 2: View Course Details
│    │   │
│    │   ├─→ Click "View" on course card
│    │   │   or direct access: /course/1/
│    │   │
│    │   ├─→ Frontend loads:
│    │   │   GET /courses/1/ (course details)
│    │   │
│    │   ├─→ Displays:
│    │   │   • Course title & description
│    │   │   • Instructor name
│    │   │   • Price & category
│    │   │   • Average rating (calculated from reviews)
│    │   │   • All reviews from students
│    │   │   • [Enroll Now] or [Continue Learning] button
│    │   │
│    │   └─→ Can see all reviews without enrolling
│    │
│    ├─→ Option 3: Enroll in Course
│    │   │
│    │   ├─→ On course detail page
│    │   ├─→ Click "Enroll Now" button
│    │   │
│    │   ├─→ POST /enrollments/
│    │   │   {
│    │   │     "course": 1  // course ID
│    │   │   }
│    │   │
│    │   ├─→ Backend:
│    │   │   1. Authenticates user via JWT
│    │   │   2. Checks if already enrolled
│    │   │   3. Creates Enrollment record
│    │   │   4. Sets progress = 0%
│    │   │
│    │   ├─→ Frontend:
│    │   │   1. Button changes to "Continue Learning"
│    │   │   2. Shows "Successfully enrolled!"
│    │   │   3. Course appears in Dashboard
│    │   │
│    │   └─→ Enrollment Complete! ✅
│    │
│    ├─→ Option 4: Write Review
│    │   │
│    │   ├─→ On course detail page
│    │   ├─→ Must be logged in
│    │   │
│    │   ├─→ Click "Write a Review" button
│    │   │   or scroll to review form
│    │   │
│    │   ├─→ Fill review form:
│    │   │   • Select rating (1-5 stars)
│    │   │   • Write comment (text area)
│    │   │
│    │   ├─→ Click "Submit Review"
│    │   │
│    │   ├─→ POST /reviews/
│    │   │   {
│    │   │     "course": 1,
│    │   │     "rating": 5,
│    │   │     "comment": "Amazing course!..."
│    │   │   }
│    │   │
│    │   ├─→ Backend:
│    │   │   1. Validates rating (1-5)
│    │   │   2. Creates Review record
│    │   │   3. Returns success
│    │   │
│    │   ├─→ Frontend:
│    │   │   1. Adds review to reviews list immediately
│    │   │   2. Updates average rating
│    │   │   3. Shows success message
│    │   │
│    │   └─→ Review Published! ✅
│    │
│    ├─→ Option 5: Visit Dashboard
│    │   │
│    │   ├─→ Click "Dashboard" (navbar)
│    │   │   or /dashboard/ direct link
│    │   │
│    │   ├─→ TAB 1: My Courses
│    │   │   │
│    │   │   ├─→ GET /enrollments/
│    │   │   │   (fetches all courses user enrolled in)
│    │   │   │
│    │   │   ├─→ Displays courses with:
│    │   │   │   • Course cover image
│    │   │   │   • Course title
│    │   │   │   • Progress bar (0-100%)
│    │   │   │   • [Continue] button
│    │   │   │
│    │   │   └─→ Shows all enrolled courses
│    │   │
│    │   ├─→ TAB 2: My Reviews
│    │   │   │
│    │   │   ├─→ GET /reviews/
│    │   │   │   (filters for current user's reviews)
│    │   │   │
│    │   │   ├─→ Displays each review:
│    │   │   │   • Course name
│    │   │   │   • Star rating
│    │   │   │   • Review text
│    │   │   │   • [Edit] [Delete] buttons
│    │   │   │
│    │   │   ├─→ Can click [Edit]:
│    │   │   │   • Open review editor
│    │   │   │   • PATCH /reviews/<id>/
│    │   │   │
│    │   │   ├─→ Can click [Delete]:
│    │   │   │   • Confirm deletion
│    │   │   │   • DELETE /reviews/<id>/
│    │   │   │
│    │   │   └─→ Reviews managed! ✅
│    │   │
│    │   └─→ Dashboard fully loaded
│    │
│    └─→ Option 6: Logout
│        │
│        ├─→ Click "Account" dropdown (navbar)
│        ├─→ Click "Logout"
│        │
│        ├─→ Frontend:
│        │   1. Removes tokens from localStorage
│        │   2. Clears user data
│        │   3. Updates navbar
│        │   4. Redirects to Landing Page
│        │
│        └─→ Logged Out! ✅
│
└─── End of user journey
```

---

## 🏗️ **API Request-Response Flow**

### **1. Registration Flow**

```
FRONTEND                                BACKEND (Django)
   │                                        │
   │─ Check form validation ────────────→  │
   │  (empty fields, format)               │
   │                                        │
   │─ POST /api/register/ ─────────────→  │─ Validate data
   │  {                                    │ │
   │    "username": "john_doe",          │ ├─ Check username unique
   │    "email": "john@email.com",       │ │ (query database)
   │    "password": "secure_pass",       │ │
   │    "role": "student",               │ ├─ Check email unique
   │    "phone": "9876543210"            │ │ (query database)
   │  }                                   │ │
   │                                        │ ├─ Hash password
   │  (localStorage stores response)      │ │
   │                                        │ ├─ Create User record
   │                                        │ │ INSERT INTO auth_user...
   │                                        │ │
   │                         ←─ 201 Created─│ ├─ Create Profile record
   │  {                                    │ │ INSERT INTO accounts_profile...
   │    "id": 5,                         │ │
   │    "username": "john_doe",          │ └─ Return user data
   │    "email": "john@email.com",       │
   │    "role": "student",               │
   │    "created": true                  │
   │  }                                   │
   │                                        │
   │─ Auto-login:                        │
   │  POST /api/token/ ────────────────→ │─ Verify credentials
   │  {                                   │ │
   │    "username": "john_doe",         │ │ (compare hashed password)
   │    "password": "secure_pass"       │ │
   │  }                                   │ ├─ Generate access token
   │                                        │ │ (payload + signature)
   │                         ←─ 200 OK ──│ │
   │  {                                   │ ├─ Generate refresh token
   │    "access": "eyJ...",             │ │
   │    "refresh": "eyJ..."             │ ├─ Send both tokens
   │  }                                   │
   │                                        │
   │─ Store tokens in localStorage       │
   │─ Redirect to /dashboard/            │
   │─ Show welcome message               │
   │                                        │
```

### **2. Login Flow**

```
FRONTEND                                BACKEND (Django)
   │                                        │
   │─ User enters credentials ──────────→  │
   │  username & password                 │
   │                                        │
   │─ POST /api/token/ ────────────────→  │─ Lookup user
   │  {                                    │ │ SELECT * FROM auth_user
   │    "username": "john_doe",          │ │ WHERE username='john_doe'
   │    "password": "secure_pass"        │ │
   │  }                                    │ ├─ Verify password
   │                                        │ │ check_password(input, hash)
   │                                        │
   │                         ←─ 200 OK ──│ ├─ Token generation
   │ {                                     │ │ (using djangorestframework_simplejwt)
   │   "access": "eyJhbGciOiJIUzI1NiIs",│ │
   │   "refresh": "eyJhbGciOiJIUzI1NiIs"│ └─ Return tokens
   │ }                                     │
   │                                        │
   │─ Store in localStorage              │
   │─ Set Authorization header           │
   │─ Update navbar                      │
   │                                        │
```

### **3. Course Browsing Flow**

```
FRONTEND                                BACKEND (Django)
   │                                        │
   │─ Page loads (/)                     │
   │  or navigates to /                  │
   │                                        │
   │─ GET /courses/ ───────────────────→ │─ Check pagination
   │  (Header: Authorization: Bearer...)  │ │ page = 1 (default)
   │                                        │ │ per_page = 2
   │                                        │
   │                                        │ ├─ Query courses
   │                                        │ │ SELECT * FROM courses_course
   │                                        │ │ LIMIT 2 OFFSET 0
   │                                        │
   │                        ←─ 200 OK ────│ ├─ Serialize to JSON
   │ {                                     │ │ - get all fields
   │   "count": 12,                      │ │ - get instructor name
   │   "next": "...",                    │ │
   │   "previous": null,                 │ │
   │   "results": [                      │ │
   │     {                               │ │
   │       "id": 1,                      │ │
   │       "title": "Web Dev 101",       │ │
   │       "description": "...",         │ │
   │       "instructor": "Dr. Smith",    │ │
   │       "category": "Web Dev",        │ └─ Return paginated list
   │       "price": 49.99,               │
   │       "rating": 4.5,                │
   │       "total_reviews": 12           │
   │     },                              │
   │     {id: 2, ...}                    │
   │   ]                                 │
   │ }                                     │
   │                                        │
   │─ Display courses in grid            │
   │─ Show pagination buttons            │
   │                                        │
```

### **4. Enrollment Flow**

```
FRONTEND                                BACKEND (Django)
   │                                        │
   │─ User clicks "Enroll Now"          │
   │  on course detail page             │
   │                                        │
   │─ POST /enrollments/ ──────────────→ │─ Authenticate JWT
   │  {                                   │ │ extract & validate token
   │    "course": 1                      │ │
   │  }                                    │ ├─ Get logged-in user
   │                                        │ │ from token payload
   │  (Header: Authorization: Bearer...)  │
   │                                        │ ├─ Check if already enrolled
   │                                        │ │ SELECT * FROM enrollments
   │                                        │ │ WHERE student_id = 5
   │                                        │ │ AND course_id = 1
   │                                        │
   │                                        │ ├─ Create enrollment
   │                                        │ │ INSERT INTO enrollments_enrollment
   │                                        │ │ (student_id, course_id,
   │                                        │ │  enrolled_at, progress)
   │                                        │ │ VALUES (5, 1, NOW(), 0)
   │                                        │
   │                        ←─ 201 Created─│ └─ Return enrollment data
   │ {                                     │
   │   "id": 23,                         │
   │   "student": 5,                     │
   │   "course": 1,                      │
   │   "enrolled_at": "2025-02-27...",  │
   │   "progress": 0                     │
   │ }                                     │
   │                                        │
   │─ Update button to "Continue"        │
   │─ Show "Enrolled successfully!"      │
   │─ Add to My Courses in Dashboard     │
   │                                        │
```

### **5. Review Submission Flow**

```
FRONTEND                                BACKEND (Django)
   │                                        │
   │─ User fills review form:           │
   │  • Selects rating (1-5)            │
   │  • Writes comment                  │
   │                                        │
   │─ POST /reviews/ ──────────────────→ │─ Authenticate
   │  {                                   │ │
   │    "course": 1,                     │ ├─ Validate rating
   │    "rating": 5,                     │ │ (1 <= rating <= 5)
   │    "comment": "Great course!..."    │ │
   │  }                                    │ ├─ Create review
   │                                        │ │ INSERT INTO reviews_review
   │                                        │ │ (student_id, course_id,
   │                                        │ │  rating, comment,
   │                                        │ │  created_at)
   │                                        │ │
   │                        ←─ 201 Created─│ ├─ Calculate new avg rating
   │ {                                     │ │ SELECT AVG(rating)
   │   "id": 47,                         │ │ FROM reviews
   │   "student": 5,                     │ │ WHERE course_id = 1
   │   "student_name": "John Doe",       │ │
   │   "course": 1,                      │ │
   │   "rating": 5,                      │ └─ Return review
   │   "comment": "Great course!...",    │
   │   "created_at": "2025-02-27..."     │
   │ }                                     │
   │                                        │
   │─ Add review to reviews list        │
   │─ Update course rating              │
   │─ Show success message              │
   │─ Add to My Reviews in Dashboard    │
   │                                        │
```

### **6. Token Refresh Flow**

```
FRONTEND                                BACKEND (Django)
   │                                        │
   │  API request made with JWT:        │
   │  GET /courses/                      │
   │  Header: Authorization: Bearer...  │
   │                                        │
   │                        ←─ 401 Unauthorized──│
   │  Message: "Token expired"            │
   │                                        │
   │─ Detect 401 error ─────────────────→ │
   │                                        │
   │─ POST /api/token/refresh/ ────────→ │─ Validate refresh token
   │  {                                   │ │
   │    "refresh": "eyJ..."              │ ├─ Extract user_id
   │  }                                    │ │
   │                                        │ ├─ Generate new access token
   │                        ←─ 200 OK ────│ │
   │ {                                     │ └─ Return new token
   │   "access": "eyJ..." (NEW)          │
   │ }                                     │
   │                                        │
   │─ Store new access token            │
   │─ Retry original request             │
   │  GET /courses/                      │
   │  (with new token)                  │
   │                                        │
   │                        ←─ 200 OK ────│
   │ [courses data]                       │
   │                                        │
```

---

## 🗂️ **Database Schema Diagram**

```
┌─────────────────────────────────────────────────────────────────┐
│                     POSTGRESQL DATABASE                         │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────┐       ┌──────────────────────────┐
│   auth_user          │       │  accounts_profile        │
├──────────────────────┤       ├──────────────────────────┤
│ id        [PRIMARY]  │◄──────│ id        [PRIMARY]      │
│ username  [UNIQUE]   │  1:1  │ user_id   [FOREIGN KEY] │
│ email     [UNIQUE]   │       │ role      [VARCHAR(20)] │
│ password  [HASH]     │       │ phone     [VARCHAR(15)] │
│ first_name           │       └──────────────────────────┘
│ last_name            │
│ is_active            │
│ date_joined          │
└──────────────────────┘
         │
         │ (1 user can create multiple courses)
         │
         ├─────────────────────────────────────────────┐
         │                                             │
         ↓                               ┌─────────────┴──────────────────┐
┌────────────────────────┐                │                              │
│  courses_course        │                │
├────────────────────────┤                │
│ id        [PRIMARY]    │                │
│ title     [VARCHAR]    │                │
│ description [TEXT]     │                │
│ instructor_id [FK]     │────────────────┘
│ category  [VARCHAR]    │
│ price     [INTEGER]    │
│ created_at [TIMESTAMP] │
└─────┬──────────────────┘
      │ (1 course - many enrollments)
      │
      ├──────────────────────────────────────────────┐
      │                                              │
      ↓                                  ┌───────────┴─────────────┐
┌────────────────────────┐                │
│ enrollments_enrollment │                │
├────────────────────────┤                │
│ id        [PRIMARY]    │                │
│ student_id [FK]────────┼────────────────┤
│ course_id  [FK]────────┼────────────────┤
│ enrolled_at [TIMESTAMP]│
│ progress   [INTEGER]   │
└────────────────────────┘
      │ (1 course - many reviews)
      │
      ├──────────────────────────────────────────────┐
      │                                              │
      ↓                                  ┌───────────┴─────────────┐
┌────────────────────────┐                │
│  reviews_review        │                │
├────────────────────────┤                │
│ id        [PRIMARY]    │                │
│ student_id [FK]────────┼────────────────┤
│ course_id  [FK]────────┼────────────────┤
│ rating     [INTEGER]   │  (1-5)
│ comment    [TEXT]      │
│ created_at [TIMESTAMP] │
└────────────────────────┘

KEY RELATIONSHIPS:
┌────────────────────────────────────────────────────────┐
│ user (1) ──→ (N) enrollments  {One user, many courses} │
│ user (1) ──→ (N) reviews      {One user, many reviews} │
│ user (1) ──→ (N) courses      {One instructor, many}   │
│ course (1) ──→ (N) enrollments{One course, many users} │
│ course (1) ──→ (N) reviews    {One course, many reviews}
└────────────────────────────────────────────────────────┘
```

---

## 🔐 **Authentication Token Flow**

```
┌──────────────────────────────────────────────────────────┐
│         JWT (JSON Web Token) Structure                   │
└──────────────────────────────────────────────────────────┘

Token Format: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U

Three Parts (separated by dots):
┌─────────────────┐ ┌─────────────────┐ ┌──────────────┐
│    HEADER       │ │    PAYLOAD      │ │   SIGNATURE  │
├─────────────────┤ ├─────────────────┤ ├──────────────┤
│ Algorithm (HS256)│ │ User Data:      │ │ HMACSHA256(  │
│ Token type (JWT)│ │ • user_id: 5    │ │  header +    │
│                 │ │ • username: ... │ │  payload,    │
│                 │ │ • iat: 1514768  │ │  SECRET_KEY) │
│                 │ │ • exp: 1514772  │ │              │
└─────────────────┘ └─────────────────┘ └──────────────┘
      (Base64)          (Base64)         (To prevent tampering)

Token Lifetime:
┌─────────────────────────────────────┐
│  ACCESS TOKEN                       │
│  • Duration: 5 minutes              │
│  • Used for API requests            │
│  • Short-lived for security         │
│  • Stored in localStorage           │
└─────────────────────────────────────┘
         ↓ (After 5 minutes)
┌─────────────────────────────────────┐
│  TOKEN EXPIRED                      │
│  • Return 401 Unauthorized          │
│  • Frontend detects error           │
│  • Calls refresh endpoint           │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│  REFRESH TOKEN                      │
│  • Duration: 24 hours               │
│  • Used to get new access token     │
│  • Long-lived, stored safely        │
│  • Never sent to API (except refresh│
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│  NEW ACCESS TOKEN ISSUED            │
│  • User continues without logging in│
│  • Seamless experience              │
│  • Token rotated for security       │
└─────────────────────────────────────┘
```

---

## 🎯 **Component Interaction Diagram**

```
┌────────────────────────────────────────────────────────────┐
│                     USER BROWSER                           │
│  ┌──────────────────────────────────────────────────────┐ │
│  │          FRONTEND (HTML+CSS+JavaScript)              │ │
│  │                                                      │ │
│  │  Views:                                             │ │
│  │  • Landing Page (/)                                 │ │
│  │  • Login/Registration Modal                         │ │
│  │  • Dashboard (/dashboard/)                          │ │
│  │  • Course Detail (/course/<id>/)                    │ │
│  │                                                      │ │
│  │  Features:                                          │ │
│  │  • Fetch API for backend communication             │ │
│  │  • localStorage for JWT tokens                      │ │
│  │  • DOM manipulation for UI updates                  │ │
│  │  • Event listeners for interactions                 │ │
│  │                                                      │ │
│  └──────────────────────────────────────────────────────┘ │
│           │                              ↑                │
│           │ HTTP/JSON                    │                │
│           │ (JWT in headers)             │                │
│           ↓                              │                │
│  ┌──────────────────────────────────────────────────────┐ │
│  │     API Calls & LocalStorage Management             │ │
│  └──────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
                         │
           ┌─────────────┴─────────────┐
           │                           │
           ↓                           ↓
┌──────────────────────┐  ┌──────────────────────┐
│   DJANGO REST API    │  │  POSTGRESQL          │
│                      │  │  DATABASE            │
│  Routes/Views:       │  │                      │
│  • /api/token/       │  │  Tables:             │
│  • /api/register/    │  │  • auth_user         │
│  • /courses/         │  │  • accounts_profile  │
│  • /enrollments/     │  │  • courses_course    │
│  • /reviews/         │  │  • enrollments_...   │
│  • /accounts/        │  │  • reviews_review    │
│                      │  │                      │
│  Features:           │  │                      │
│  • JWT Authentication│  │  Relationships:      │
│  • CRUD Operations   │  │  • FK Constraints    │
│  • Data Validation   │  │  • Indexes           │
│  • Pagination        │  │  • Constraints       │
│  • Filtering         │  │                      │
│                      │  │                      │
└──────────────────────┘  └──────────────────────┘
```

---

## 📊 **Data Flow Example: Complete User Journey**

```
STEP 1: User Registration
────────────────────────

User fills form
    ↓
Frontend validates
    ↓
POST /api/register/
    ↓
Backend:
  1. Validates username unique
  2. Validates email unique
  3. Hash password
  4. Create User
  5. Create Profile
    ↓
Return success (201 Created)
    ↓
Frontend auto-logs in
    ↓
POST /api/token/
    ↓
Backend generates JWT
    ↓
Return access + refresh tokens
    ↓
Frontend stores tokens
    ↓
GET /courses/
    ↓
Backend queries database
    ↓
Return course list (paginated)
    ↓
Frontend displays courses


STEP 2: User Enrolls in Course
───────────────────────────────

User clicks "Enroll Now"
    ↓
POST /enrollments/
{course: 1}
    ↓
Backend:
  1. Check JWT valid
  2. Get user from token
  3. Check not already enrolled
  4. Create Enrollment record
    ↓
Return enrollment data (201 Created)
    ↓
Frontend:
  1. Button changes to "Continue"
  2. Show success message
  3. Refresh Dashboard
    ↓
GET /enrollments/
    ↓
Backend queries user's enrollments
    ↓
Return enrollment list
    ↓
Frontend displays in "My Courses"


STEP 3: User Writes Review
──────────────────────────

User submits review form
    ↓
POST /reviews/
{course: 1, rating: 5, comment: "..."}
    ↓
Backend:
  1. Validate JWT
  2. Validate rating (1-5)
  3. Create Review record
  4. Calculate avg rating
    ↓
Return review data (201 Created)
    ↓
Frontend:
  1. Add review to list
  2. Update course rating
  3. Show success
  4. Refresh Dashboard
    ↓
GET /reviews/
    ↓
Backend queries reviews
    ↓
Return reviews
    ↓
Frontend displays in "My Reviews"
```

---

## 🎬 **Summary of Key Flows**

| Flow | Purpose | Status |
|------|---------|--------|
| Registration → Auto-Login | New users can join quickly | ✅ Implemented |
| Token Refresh | Auto-renewal without logout | ✅ Implemented |
| Course Browsing | Public access to course list | ✅ Implemented |
| Enrollment Management | Students track progress | ✅ Implemented |
| Review System | Students provide feedback | ✅ Implemented |
| Protected Routes | Auth-required pages | ✅ Implemented |
| Error Handling | User-friendly messages | ✅ Implemented |

This comprehensive flow documentation explains exactly how every piece of your OCMS system works together!
