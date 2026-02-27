from django.shortcuts import render
from django.contrib.auth.decorators import login_required

# Create your views here.

def index(request):
    """Serve the landing page."""
    return render(request, 'dashboard/index.html')

def dashboard(request):
    """Protected dashboard page - requires login."""
    return render(request, 'dashboard/dashboard.html')

def course_detail(request, course_id):
    """Course detail page."""
    return render(request, 'dashboard/course-detail.html', {'course_id': course_id})
