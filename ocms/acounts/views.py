# Create your views here.
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from .models import Profile
from .serializers import ProfileSerializer
from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator
from django.contrib.auth.models import User


@api_view(['GET','POST'])
@cache_page(60)
@permission_classes([IsAuthenticated])
def profile_list(request):

    if request.method == 'GET':
        profiles = Profile.objects.all()

        name = request.query_params.get('name')

        if name:
            profiles = profiles.filter(name__icontains=name)

        paginator = PageNumberPagination()
        paginator.page_size = 2
        paginated_profiles = paginator.paginate_queryset(profiles, request)

        serializer = ProfileSerializer(paginated_profiles, many=True)
        return paginator.get_paginated_response(serializer.data)

    if request.method == 'POST':
        serializer = ProfileSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)


@api_view(['GET','PUT','PATCH','DELETE'])
@cache_page(60)
@permission_classes([IsAuthenticated])
def profile_detail(request, id):
    try:
        profile = Profile.objects.get(id=id)
    except Profile.DoesNotExist:
        return Response({'error':'Not found'}, status=404)

    if request.method == 'GET':
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)

    if request.method == 'PUT':
        serializer = ProfileSerializer(profile, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

    if request.method == 'PATCH':
        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

    if request.method == 'DELETE':
        profile.delete()
        return Response({'message':'deleted'}, status=204)


@api_view(['POST'])
@permission_classes([])
def register(request):
    """Register a new user and create a profile."""
    try:
        username = request.data.get('username', '').strip()
        email = request.data.get('email', '').strip()
        password = request.data.get('password', '').strip()
        role = request.data.get('role', 'student').strip()
        phone = request.data.get('phone', '').strip()

        if not username or not email or not password:
            return Response({'error': 'Missing required fields'}, status=400)

        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=400)

        if User.objects.filter(email=email).exists():
            return Response({'error': 'Email already exists'}, status=400)

        user = User.objects.create_user(username=username, email=email, password=password)
        profile = Profile.objects.create(user=user, role=role, phone=phone)

        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'profile': ProfileSerializer(profile).data
        }, status=201)

    except Exception as e:
        return Response({'error': str(e)}, status=400)