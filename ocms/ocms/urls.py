"""
URL configuration for ocms project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

# Import views from all apps
from acounts.views import profile_list, profile_detail, register
from courses.views import course_list, course_detail
from enrollments.views import enrollment_list, enrollment_detail
from reviews.views import review_list, review_detail

# JWT Authentication
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [

    # Admin Panel
    path('admin/', admin.site.urls),

    # Frontend pages (served from dashboard app)
    path('', include('dashboard.urls')),

    # ================= AUTH =================
    path('api/token/', TokenObtainPairView.as_view()),
    path('api/token/refresh/', TokenRefreshView.as_view()),


    # ================= ACCOUNTS =================
    path('api/register/', register),
    path('accounts/', profile_list),
    path('accounts/<int:id>/', profile_detail),


    # ================= COURSES =================
    path('courses/', course_list),
    path('courses/<int:id>/', course_detail),


    # ================= ENROLLMENTS =================
    path('enrollments/', enrollment_list),
    path('enrollments/<int:id>/', enrollment_detail),


    # ================= REVIEWS =================
    path('reviews/', review_list),
    path('reviews/<int:id>/', review_detail),

]